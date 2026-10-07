"use server";

import { getSite } from "@/content/site";
import { resolveLocale } from "@/i18n/routing";
import { notSureInterest } from "@/lib/lead";

export type LeadField = "name" | "email" | "phone" | "company" | "segment" | "revenue" | "interest" | "consent";

export type LeadState =
  | { status: "idle" }
  | { status: "invalid"; errors: Partial<Record<LeadField, string>> }
  | { status: "unavailable" }
  | { status: "success" };

function text(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function submitLead(_prev: LeadState, formData: FormData): Promise<LeadState> {
  // Honeypot: campo invisível que só robôs preenchem — finge sucesso.
  if (text(formData, "website")) return { status: "success" };

  // Opções e mensagens dependem do idioma em que o form foi enviado.
  const site = getSite(resolveLocale(text(formData, "locale")));
  const { form, messages } = site.contact;
  const msg = messages.errors;

  const lead = {
    name: text(formData, "name"),
    email: text(formData, "email"),
    phone: text(formData, "phone"),
    company: text(formData, "company"),
    segment: text(formData, "segment"),
    revenue: text(formData, "revenue"),
    interest: text(formData, "interest"),
    message: text(formData, "message").slice(0, 2000),
  };

  const errors: Partial<Record<LeadField, string>> = {};
  if (lead.name.length < 3) errors.name = msg.required;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email)) errors.email = msg.email;
  if (lead.phone.replace(/\D/g, "").length < 10) errors.phone = msg.phone;
  if (!lead.company) errors.company = msg.required;
  if (!lead.segment) errors.segment = msg.required;
  if (!form.revenueOptions.some((option) => option === lead.revenue)) errors.revenue = msg.revenue;
  const interests = [...site.servicePillars.map((pillar) => pillar.slug), notSureInterest];
  if (!interests.includes(lead.interest)) errors.interest = msg.interest;
  if (formData.get("consent") !== "on") errors.consent = msg.consent;

  if (Object.keys(errors).length > 0) return { status: "invalid", errors };

  // TODO(integration): entregar o lead (e-mail para o comercial via Resend,
  // tabela no Supabase ou CRM). Destino ainda não definido; até lá o
  // visitante vê a mensagem "unavailable" com as redes da Vispe.
  return { status: "unavailable" };
}
