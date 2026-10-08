import type { Locale } from "@/i18n/routing";
import type { Widen } from "./types";
import { franchise as enUS } from "./en-US/franchise";
import { franchise as ptBR, franchiseModels } from "./pt-BR/franchise";

// Acesso por idioma ao conteúdo das páginas de franquia.

export type FranchiseContent = Widen<typeof ptBR>;
export type FranchiseModel = (typeof franchiseModels)[number];
export { franchiseModels };

const byLocale: Record<Locale, FranchiseContent> = { "pt-BR": ptBR, "en-US": enUS };

export function getFranchise(locale: Locale): FranchiseContent {
  return byLocale[locale];
}

export function isFranchiseModel(value: string): value is FranchiseModel {
  return (franchiseModels as readonly string[]).includes(value);
}

/** Caminho interno da página de cada modelo (traduzido em i18n/routing.ts). */
export const franchiseModelPath = (model: FranchiseModel) => `/franquia/${model}` as const;
