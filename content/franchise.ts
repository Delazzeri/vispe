import type { Locale } from "@/i18n/routing";
import type { Widen } from "./types";
import { franchise as enUS } from "./en-US/franchise";
import { franchise as ptBR } from "./pt-BR/franchise";

// Acesso por idioma ao conteúdo da página "Seja um franqueado".

export type FranchiseContent = Widen<typeof ptBR>;

const byLocale: Record<Locale, FranchiseContent> = { "pt-BR": ptBR, "en-US": enUS };

export function getFranchise(locale: Locale): FranchiseContent {
  return byLocale[locale];
}
