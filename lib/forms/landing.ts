import { getLpUi } from "@/content/lp-ui";
import { getMaterialsUi } from "@/content/materials";
import type { Locale } from "@/i18n/routing";
import type { LpFormField } from "@/lib/lp/types";
import { submitToSheet, type FormValues } from "./submit";
import { isEmail, isPhone, text } from "./validate";

// Formulário das landing pages → aba "LP's" da planilha, a mesma para todas as LPs,
// com o nome e o endereço da LP em colunas (o Apps Script cria as colunas pelos
// campos que cada LP manda). Validado aqui e de novo lá.

export type LandingFormState =
  | { status: "idle" }
  | { status: "invalid"; errors: Record<string, string> }
  | { status: "unavailable" }
  | { status: "success" };

/** Opções de um campo de escolha: as do admin ou, vazias, as padrão do site. */
export function fieldOptions(field: LpFormField, locale: Locale): string[] {
  if (field.options.length) return field.options;
  const { form } = getMaterialsUi(locale);
  if (field.kind === "revenue") return [...form.revenueOptions];
  if (field.kind === "role") return [...form.roleOptions];
  if (field.kind === "segment") return [...form.segmentOptions];
  return [];
}

const utmKeys = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;

export async function submitLandingForm(
  formData: FormData,
  page: {
    slug: string;
    name: string;
    /** Modelo da LP: "evento" conta como inscrição; os demais, como lead. */
    template: string;
    locale: Locale;
    fields: LpFormField[];
    /** Colunas da aba: [id, rótulo em português] (a planilha fica igual nos dois idiomas). */
    columns: [string, string][];
  },
): Promise<LandingFormState> {
  // Honeypot: campo invisível que só robôs preenchem — finge sucesso.
  if (text(formData, "website")) return { status: "success" };

  const { errors: msg } = getLpUi(page.locale).form;
  const errors: Record<string, string> = {};
  const values: FormValues = {};
  for (const field of page.fields) {
    const value = text(formData, field.id).slice(0, 2000);
    values[field.id] = value;
    if (!value) {
      if (field.required) errors[field.id] = field.kind === "select" ? msg.option : msg.required;
      continue;
    }
    if (field.kind === "email" && !isEmail(value)) errors[field.id] = msg.email;
    else if (field.kind === "phone" && !isPhone(value)) errors[field.id] = msg.phone;
    else {
      const options = fieldOptions(field, page.locale);
      if (options.length && !options.includes(value)) errors[field.id] = msg.option;
    }
  }
  if (formData.get("consent") !== "on") errors.consent = msg.consent;
  if (Object.keys(errors).length > 0) return { status: "invalid", errors };

  // Origem do anúncio (a URL completa também vai na coluna "Página").
  const query = new URLSearchParams(window.location.search);
  for (const key of utmKeys) values[key] = (query.get(key) ?? "").slice(0, 200);
  values.consent = "on";
  values.locale = page.locale;

  const byKind = (kind: LpFormField["kind"]) => {
    const field = page.fields.find((item) => item.kind === kind);
    return field ? values[field.id] || undefined : undefined;
  };
  const sent = await submitToSheet(
    "lp",
    values,
    undefined,
    { lp: { slug: page.slug, name: page.name }, columns: page.columns },
    {
      conversion: page.template === "evento" ? "registration" : "lead",
      contentName: page.slug,
      source: `lp-${page.slug}`,
      user: { email: byKind("email"), phone: byKind("phone"), name: byKind("name") },
    },
  );
  return sent === "sent" ? { status: "success" } : { status: "unavailable" };
}
