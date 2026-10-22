import { getSite } from "@/content/site";
import { resolveLocale } from "@/i18n/routing";
import { notSureInterest } from "@/lib/lead";
import { formValues, submitToSheet } from "./submit";
import { isEmail, isPhone, text } from "./validate";

// Formulário de diagnóstico (home e /contato) → aba "diagnostico".

export type LeadField = "name" | "email" | "phone" | "company" | "segment" | "revenue" | "interest" | "consent";

export type LeadState =
  | { status: "idle" }
  | { status: "invalid"; errors: Partial<Record<LeadField, string>> }
  | { status: "unavailable" }
  | { status: "success" };

export async function submitLead(formData: FormData): Promise<LeadState> {
  // Honeypot: campo invisível que só robôs preenchem — finge sucesso.
  if (text(formData, "website")) return { status: "success" };

  // Opções e mensagens dependem do idioma em que o form foi enviado.
  const site = getSite(resolveLocale(text(formData, "locale")));
  const { form, messages } = site.contact;
  const msg = messages.errors;

  const errors: Partial<Record<LeadField, string>> = {};
  if (text(formData, "name").length < 3) errors.name = msg.required;
  if (!isEmail(text(formData, "email"))) errors.email = msg.email;
  if (!isPhone(text(formData, "phone"))) errors.phone = msg.phone;
  if (!text(formData, "company")) errors.company = msg.required;
  if (!text(formData, "segment")) errors.segment = msg.required;
  if (!form.revenueOptions.some((option) => option === text(formData, "revenue"))) errors.revenue = msg.revenue;
  // Um ou mais pilares, ou só "ainda não sei".
  const chosen = formData.getAll("interest").filter((value): value is string => typeof value === "string");
  const pillars = getSite("pt-BR").servicePillars.filter((pillar) => chosen.includes(pillar.slug));
  const notSure = chosen.length === 1 && chosen[0] === notSureInterest;
  if (!notSure && (!pillars.length || pillars.length !== chosen.length)) errors.interest = msg.interest;
  if (formData.get("consent") !== "on") errors.consent = msg.consent;

  if (Object.keys(errors).length > 0) return { status: "invalid", errors };

  const values = formValues(formData, ["website"]);
  values.message = (values.message ?? "").slice(0, 2000);
  // Na planilha, os nomes em português: "Crescimento; Risco" e os serviços marcados dos pilares escolhidos.
  values.interest = notSure ? getSite("pt-BR").contact.form.notSure : pillars.map((pillar) => pillar.name).join("; ");
  const offered = new Set(pillars.flatMap((pillar) => pillar.includes));
  values.services = formData
    .getAll("services")
    .filter((value): value is string => typeof value === "string" && offered.has(value))
    .join("; ");
  return (await submitToSheet("diagnostico", values)) === "sent" ? { status: "success" } : { status: "unavailable" };
}
