"use server";

import { getMaterials } from "@/content/materials";
import { resolveLocale } from "@/i18n/routing";

export type MaterialField = "name" | "email" | "phone" | "company" | "material" | "consent";

export type MaterialState =
  | { status: "idle" }
  | { status: "invalid"; errors: Partial<Record<MaterialField, string>> }
  | { status: "success"; file: string };

function text(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function requestMaterial(_prev: MaterialState, formData: FormData): Promise<MaterialState> {
  const { items, messages } = getMaterials(resolveLocale(text(formData, "locale")));
  const msg = messages.errors;
  const material = items.find((item) => item.slug === text(formData, "material"));

  // Honeypot: robôs "recebem" o link sem gerar lead.
  if (text(formData, "website") && material?.file) return { status: "success", file: material.file };

  const lead = {
    name: text(formData, "name"),
    email: text(formData, "email"),
    phone: text(formData, "phone"),
    company: text(formData, "company"),
  };

  const errors: Partial<Record<MaterialField, string>> = {};
  if (!material?.file) errors.material = msg.material;
  if (lead.name.length < 3) errors.name = msg.required;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email)) errors.email = msg.email;
  if (lead.phone.replace(/\D/g, "").length < 10) errors.phone = msg.phone;
  if (!lead.company) errors.company = msg.required;
  if (formData.get("consent") !== "on") errors.consent = msg.consent;

  if (Object.keys(errors).length > 0 || !material?.file) return { status: "invalid", errors };

  // TODO(integration): salvar o lead (nome, contato e material baixado) no
  // destino a definir. Até lá o download é liberado e o contato não é guardado.
  return { status: "success", file: material.file };
}
