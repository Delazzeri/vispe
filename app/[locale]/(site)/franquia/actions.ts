"use server";

import { getFranchise, isFranchiseModel } from "@/content/franchise";
import { resolveLocale } from "@/i18n/routing";

export type FranchiseField = "name" | "email" | "phone" | "city" | "background" | "capital" | "model" | "consent";

export type FranchiseState =
  | { status: "idle" }
  | { status: "invalid"; errors: Partial<Record<FranchiseField, string>> }
  | { status: "unavailable" }
  | { status: "success" };

function text(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function submitFranchise(_prev: FranchiseState, formData: FormData): Promise<FranchiseState> {
  // Honeypot: campo invisível que só robôs preenchem — finge sucesso.
  if (text(formData, "website")) return { status: "success" };

  const { form, messages } = getFranchise(resolveLocale(text(formData, "locale")));
  const msg = messages.errors;

  const lead = {
    name: text(formData, "name"),
    email: text(formData, "email"),
    phone: text(formData, "phone"),
    city: text(formData, "city"),
    background: text(formData, "background"),
    capital: text(formData, "capital"),
    model: text(formData, "model"),
    message: text(formData, "message").slice(0, 2000),
  };

  const errors: Partial<Record<FranchiseField, string>> = {};
  if (lead.name.length < 3) errors.name = msg.required;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email)) errors.email = msg.email;
  if (lead.phone.replace(/\D/g, "").length < 10) errors.phone = msg.phone;
  if (!lead.city) errors.city = msg.required;
  if (!lead.background) errors.background = msg.required;
  if (!form.capitalOptions.some((option) => option === lead.capital)) errors.capital = msg.capital;
  if (!isFranchiseModel(lead.model)) errors.model = msg.model;
  if (formData.get("consent") !== "on") errors.consent = msg.consent;

  if (Object.keys(errors).length > 0) return { status: "invalid", errors };

  // TODO(integration): entregar o interesse ao time de expansão (mesmo destino
  // a definir do formulário de diagnóstico). Até lá, mostra "unavailable".
  return { status: "unavailable" };
}
