import { getMaterialsUi } from "@/content/materials";
import { resolveLocale } from "@/i18n/routing";
import { formValues, submitToSheet } from "./submit";
import { isEmail, isPhone, text } from "./validate";

// Captura das LPs de materiais gratuitos (/materiais/<slug>) → aba "materiais".

export type MaterialField =
  | "name"
  | "phone"
  | "email"
  | "company"
  | "segment"
  | "revenue"
  | "role"
  | "pain"
  | "material"
  | "consent";

export type MaterialState =
  | { status: "idle" }
  | { status: "invalid"; errors: Partial<Record<MaterialField, string>> }
  | { status: "unavailable" }
  | { status: "success" };

export async function requestMaterial(formData: FormData): Promise<MaterialState> {
  // Honeypot: campo invisível que só robôs preenchem — finge sucesso.
  if (text(formData, "website")) return { status: "success" };

  const { form, messages } = getMaterialsUi(resolveLocale(text(formData, "locale")));
  const msg = messages.errors;
  const oneOf = (options: readonly string[], key: string) => options.includes(text(formData, key));

  const errors: Partial<Record<MaterialField, string>> = {};
  // A existência do material é conferida no Apps Script (busca no Supabase ao enviar o link).
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(text(formData, "material"))) errors.material = msg.material;
  if (text(formData, "name").length < 3) errors.name = msg.required;
  if (!isPhone(text(formData, "phone"))) errors.phone = msg.phone;
  if (!isEmail(text(formData, "email"))) errors.email = msg.email;
  if (!text(formData, "company")) errors.company = msg.required;
  if (!oneOf(form.segmentOptions, "segment")) errors.segment = msg.option;
  if (!oneOf(form.revenueOptions, "revenue")) errors.revenue = msg.option;
  if (!oneOf(form.roleOptions, "role")) errors.role = msg.option;
  if (!oneOf(form.painOptions, "pain")) errors.pain = msg.option;
  if (formData.get("consent") !== "on") errors.consent = msg.consent;

  if (Object.keys(errors).length > 0) return { status: "invalid", errors };

  const values = formValues(formData, ["website"]);
  values.whatsapp = formData.get("whatsapp") === "on" ? "sim" : "não";
  return (await submitToSheet("materiais", values)) === "sent" ? { status: "success" } : { status: "unavailable" };
}
