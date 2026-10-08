"use server";

import { getMaterial, getMaterialsUi } from "@/content/materials";
import { resolveLocale } from "@/i18n/routing";

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

function text(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function requestMaterial(_prev: MaterialState, formData: FormData): Promise<MaterialState> {
  // Honeypot: campo invisível que só robôs preenchem — finge sucesso.
  if (text(formData, "website")) return { status: "success" };

  const { form, messages } = getMaterialsUi(resolveLocale(text(formData, "locale")));
  const msg = messages.errors;

  const lead = {
    material: text(formData, "material"),
    name: text(formData, "name"),
    phone: text(formData, "phone"),
    email: text(formData, "email"),
    company: text(formData, "company"),
    segment: text(formData, "segment"),
    revenue: text(formData, "revenue"),
    role: text(formData, "role"),
    pain: text(formData, "pain"),
    whatsappOptIn: formData.get("whatsapp") === "on",
  };

  const oneOf = (options: readonly string[], value: string) => options.includes(value);
  const errors: Partial<Record<MaterialField, string>> = {};
  if (!getMaterial(lead.material)) errors.material = msg.material;
  if (lead.name.length < 3) errors.name = msg.required;
  if (lead.phone.replace(/\D/g, "").length < 10) errors.phone = msg.phone;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email)) errors.email = msg.email;
  if (!lead.company) errors.company = msg.required;
  if (!oneOf(form.segmentOptions, lead.segment)) errors.segment = msg.option;
  if (!oneOf(form.revenueOptions, lead.revenue)) errors.revenue = msg.option;
  if (!oneOf(form.roleOptions, lead.role)) errors.role = msg.option;
  if (!oneOf(form.painOptions, lead.pain)) errors.pain = msg.option;
  if (formData.get("consent") !== "on") errors.consent = msg.consent;

  if (Object.keys(errors).length > 0) return { status: "invalid", errors };

  // TODO(integration): salvar o lead e enviar o material por e-mail (como faz
  // o site atual). Destino a definir; até lá, mostra "unavailable".
  return { status: "unavailable" };
}
