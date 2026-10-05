"use server";

import { getCareers, resumeMaxBytes } from "@/content/careers";
import { resolveLocale } from "@/i18n/routing";

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

function text(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

/** Confere a assinatura do arquivo (%PDF-), não só a extensão/MIME do navegador. */
async function isPdf(file: File) {
  const head = new Uint8Array(await file.slice(0, 5).arrayBuffer());
  return String.fromCharCode(...head) === "%PDF-";
}

export async function submitApplication(
  _prev: ApplicationState,
  formData: FormData,
): Promise<ApplicationState> {
  // Honeypot: campo invisível que só robôs preenchem — finge sucesso.
  if (text(formData, "company")) return { status: "success" };

  // Áreas, cargos e mensagens dependem do idioma em que o form foi enviado.
  const careers = getCareers(resolveLocale(text(formData, "locale")));
  const msg = careers.messages.errors;

  const name = text(formData, "name");
  const email = text(formData, "email");
  const phone = text(formData, "phone");
  const city = text(formData, "city");
  const linkedin = text(formData, "linkedin");
  const area = text(formData, "area");
  const resume = formData.get("resume");

  const errors: Partial<Record<ApplicationField, string>> = {};
  if (name.length < 3) errors.name = msg.required;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = msg.email;
  if (phone.replace(/\D/g, "").length < 10) errors.phone = msg.phone;
  if (!city) errors.city = msg.required;
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

  if (Object.keys(errors).length > 0) return { status: "invalid", errors };

  // TODO(integration): enviar para o RH por e-mail (Resend, com o PDF anexado)
  // e rodar a verificação/pontuação de ATS (lib/ats.ts) — aguardando aprovação
  // das dependências `resend` e `unpdf` e da chave RESEND_API_KEY. Até lá, o
  // candidato recebe o e-mail do RH como alternativa, sem perder a candidatura.
  return { status: "unavailable" };
}
