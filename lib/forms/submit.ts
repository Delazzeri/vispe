// Envio dos formulários para a planilha do Google (Apps Script publicado como
// Web App; código em integrations/google-sheets/Code.gs). Cada formulário vai
// para uma aba da mesma planilha.
//
// Corpo em text/plain de propósito: é uma "simple request" para o navegador,
// sem a verificação prévia de CORS (OPTIONS) que o Apps Script não responde.
//
// Envio que deu certo vira conversão (lib/tracking): Pixel/LinkedIn/Google no
// navegador e, com consentimento de marketing, Conversions API da Meta pelo Apps Script.

import type { Conversion } from "@/lib/tracking/events";
import { prepareConversion, track } from "@/lib/tracking/track";

// "lp": formulários das landing pages; todas gravam na aba "LP's", com o nome da LP.
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

/** Conversão de cada formulário (as LPs de evento trocam para "registration"). */
const conversionBySheet: Record<SheetName, Conversion> = {
  diagnostico: "lead",
  franquia: "lead",
  materiais: "lead",
  carreiras: "application",
  lp: "lead",
};

export type ConversionOptions = {
  conversion?: Conversion;
  /** Nome do evento nas plataformas (slug da LP, do material…). */
  contentName?: string;
  /** Aba de origem nos relatórios (padrão: o nome do formulário). */
  source?: string;
  /** Contato para a Conversions API; padrão: os campos name/email/phone do formulário. */
  user?: { email?: string; phone?: string; name?: string };
};

/** extra: campos a mais no corpo (as LPs mandam as colunas da aba: [id, rótulo]). */
export async function submitToSheet(
  sheet: SheetName,
  values: FormValues,
  file?: FormFile,
  extra?: Record<string, unknown>,
  options: ConversionOptions = {},
): Promise<SubmitResult> {
  if (!endpoint) return "unavailable";
  const conversion = options.conversion ?? conversionBySheet[sheet];
  const contentName = options.contentName ?? (values.material || undefined);
  const { eventId, server } = prepareConversion(conversion, contentName, {
    email: options.user?.email ?? values.email,
    phone: options.user?.phone ?? values.phone,
    name: options.user?.name ?? values.name,
  });
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ ...extra, sheet, values, file, page: window.location.href, tracking: server }),
    });
    if (!response.ok) return "unavailable";
    const result: unknown = await response.json();
    const sent = typeof result === "object" && result !== null && (result as { ok?: unknown }).ok === true;
    if (sent) track({ type: "conversion", conversion, eventId, source: options.source ?? sheet, contentName });
    return sent ? "sent" : "unavailable";
  } catch {
    return "unavailable";
  }
}
