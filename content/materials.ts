import type { Locale } from "@/i18n/routing";
import type { Widen } from "./types";
import { materialsUi as enUS } from "./en-US/materials";
import { materialsUi as ptBR } from "./pt-BR/materials";

// Textos de interface dos materiais gratuitos (os materiais vêm de lib/materials).

export type MaterialsUi = Widen<typeof ptBR>;

const uiByLocale: Record<Locale, MaterialsUi> = { "pt-BR": ptBR, "en-US": enUS };

export function getMaterialsUi(locale: Locale): MaterialsUi {
  return uiByLocale[locale];
}
