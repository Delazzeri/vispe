// Envio dos formulários para a planilha do Google (Apps Script publicado como
// Web App; código em integrations/google-sheets/Code.gs). Cada formulário vai
// para uma aba da mesma planilha.
//
// Corpo em text/plain de propósito: é uma "simple request" para o navegador,
// sem a verificação prévia de CORS (OPTIONS) que o Apps Script não responde.

// "lp": formulários das landing pages; cada LP grava numa aba própria (lp-<slug>).
export type SheetName = "diagnostico" | "franquia" | "materiais" | "carreiras" | "lp";

export type FormValues = Record<string, string>;

export type FormFile = { name: string; type: string; base64: string };

/** sent: gravou na planilha · unavailable: sem endpoint configurado ou falha no envio. */
export type SubmitResult = "sent" | "unavailable";

const endpoint = process.env.NEXT_PUBLIC_FORMS_ENDPOINT;

/** Campos de texto do FormData (ignora arquivos e o honeypot); múltiplos valores viram "a; b". */
export function formValues(formData: FormData, omit: readonly string[] = []): FormValues {
  const values: FormValues = {};
  for (const key of new Set(formData.keys())) {
    if (omit.includes(key)) continue;
    const all = formData.getAll(key).filter((v): v is string => typeof v === "string");
    if (all.length) values[key] = all.map((v) => v.trim()).join("; ");
  }
  return values;
}

export async function fileToBase64(file: File): Promise<string> {
  const bytes = new Uint8Array(await file.arrayBuffer());
  let binary = "";
  // Em blocos: String.fromCharCode com milhões de argumentos estoura a pilha.
  for (let i = 0; i < bytes.length; i += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  }
  return btoa(binary);
}

/** extra: campos a mais no corpo (as LPs mandam as colunas da aba: [id, rótulo]). */
export async function submitToSheet(
  sheet: SheetName,
  values: FormValues,
  file?: FormFile,
  extra?: Record<string, unknown>,
): Promise<SubmitResult> {
  if (!endpoint) return "unavailable";
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ ...extra, sheet, values, file, page: window.location.href }),
    });
    if (!response.ok) return "unavailable";
    const result: unknown = await response.json();
    return typeof result === "object" && result !== null && (result as { ok?: unknown }).ok === true
      ? "sent"
      : "unavailable";
  } catch {
    return "unavailable";
  }
}
