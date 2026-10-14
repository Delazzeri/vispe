import { getCareers, resumeMaxBytes } from "@/content/careers";
import { resolveLocale } from "@/i18n/routing";
import { fileToBase64, formValues, submitToSheet } from "./submit";
import { isEmail, isPhone, text } from "./validate";

// Candidatura (/trabalhe-conosco) → aba "carreiras"; o PDF vai para uma pasta
// do Drive e o link entra na planilha (ver integrations/google-sheets/Code.gs).

export type ApplicationField =
  | "name"
  | "email"
  | "phone"
  | "city"
  | "linkedin"
  | "area"
  | "roles"
  | "resume"
  | "consent";

export type ApplicationState =
  | { status: "idle" }
  | { status: "invalid"; errors: Partial<Record<ApplicationField, string>> }
  | { status: "unavailable" }
  | { status: "success" };

/** Confere a assinatura do arquivo (%PDF-), não só a extensão/MIME do navegador. */
async function isPdf(file: File) {
  const head = new Uint8Array(await file.slice(0, 5).arrayBuffer());
  return String.fromCharCode(...head) === "%PDF-";
}

export async function submitApplication(formData: FormData): Promise<ApplicationState> {
  // Honeypot: campo invisível que só robôs preenchem — finge sucesso.
  if (text(formData, "company")) return { status: "success" };

  // Áreas, cargos e mensagens dependem do idioma em que o form foi enviado.
  const careers = getCareers(resolveLocale(text(formData, "locale")));
  const msg = careers.messages.errors;

  const linkedin = text(formData, "linkedin");
  const area = text(formData, "area");
  const resume = formData.get("resume");

  const errors: Partial<Record<ApplicationField, string>> = {};
  if (text(formData, "name").length < 3) errors.name = msg.required;
  if (!isEmail(text(formData, "email"))) errors.email = msg.email;
  if (!isPhone(text(formData, "phone"))) errors.phone = msg.phone;
  if (!text(formData, "city")) errors.city = msg.required;
  if (linkedin && !/^https?:\/\/([a-z]{2,3}\.)?linkedin\.com\/in\//i.test(linkedin)) {
    errors.linkedin = msg.linkedin;
  }
  const areaDef = careers.form.areas.find((a) => a.name === area);
  if (!areaDef) {
    errors.area = msg.area;
  } else if (areaDef.roles.length === 0) {
    // "Outras": cargo informado em texto livre.
    if (!text(formData, "roleOther")) errors.roles = msg.roleOther;
  } else {
    const allowed = [...areaDef.roles, careers.form.internship];
    const roles = formData.getAll("roles").filter((r): r is string => typeof r === "string");
    if (roles.length === 0 || roles.some((r) => !allowed.includes(r))) errors.roles = msg.roles;
  }
  if (formData.get("consent") !== "on") errors.consent = msg.consent;

  if (!(resume instanceof File) || resume.size === 0) {
    errors.resume = msg.resumeMissing;
  } else if (resume.size > resumeMaxBytes) {
    errors.resume = msg.resumeSize;
  } else if (!(await isPdf(resume))) {
    errors.resume = msg.resumeType;
  }

  if (Object.keys(errors).length > 0 || !(resume instanceof File)) return { status: "invalid", errors };

  const values = formValues(formData, ["company", "resume"]);
  values.message = (values.message ?? "").slice(0, 2000);
  const file = { name: resume.name, type: "application/pdf", base64: await fileToBase64(resume) };
  return (await submitToSheet("carreiras", values, file)) === "sent" ? { status: "success" } : { status: "unavailable" };
}
