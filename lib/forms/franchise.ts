import { getFranchise, isFranchiseModel } from "@/content/franchise";
import { resolveLocale } from "@/i18n/routing";
import { formValues, submitToSheet } from "./submit";
import { isEmail, isPhone, text } from "./validate";

// Cadastro de franqueado (/franquia/comercial e /franquia/financeira) → aba "franquia".

export type FranchiseField = "name" | "email" | "phone" | "city" | "background" | "capital" | "model" | "consent";

export type FranchiseState =
  | { status: "idle" }
  | { status: "invalid"; errors: Partial<Record<FranchiseField, string>> }
  | { status: "unavailable" }
  | { status: "success" };

export async function submitFranchise(formData: FormData): Promise<FranchiseState> {
  // Honeypot: campo invisível que só robôs preenchem — finge sucesso.
  if (text(formData, "website")) return { status: "success" };

  const { form, messages } = getFranchise(resolveLocale(text(formData, "locale")));
  const msg = messages.errors;

  const errors: Partial<Record<FranchiseField, string>> = {};
  if (text(formData, "name").length < 3) errors.name = msg.required;
  if (!isEmail(text(formData, "email"))) errors.email = msg.email;
  if (!isPhone(text(formData, "phone"))) errors.phone = msg.phone;
  if (!text(formData, "city")) errors.city = msg.required;
  if (!text(formData, "background")) errors.background = msg.required;
  if (!form.capitalOptions.some((option) => option === text(formData, "capital"))) errors.capital = msg.capital;
  if (!isFranchiseModel(text(formData, "model"))) errors.model = msg.model;
  if (formData.get("consent") !== "on") errors.consent = msg.consent;

  if (Object.keys(errors).length > 0) return { status: "invalid", errors };

  const values = formValues(formData, ["website"]);
  values.message = (values.message ?? "").slice(0, 2000);
  return (await submitToSheet("franquia", values)) === "sent" ? { status: "success" } : { status: "unavailable" };
}
