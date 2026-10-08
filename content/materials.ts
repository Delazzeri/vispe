import type { Locale } from "@/i18n/routing";
import type { Widen } from "./types";
import { materials as enUS } from "./en-US/materials";
import { materials as ptBR } from "./pt-BR/materials";

// Acesso por idioma ao conteúdo da página "Materiais gratuitos".

export type MaterialsContent = Widen<typeof ptBR>;
export type Material = MaterialsContent["items"][number];

const byLocale: Record<Locale, MaterialsContent> = { "pt-BR": ptBR, "en-US": enUS };

export function getMaterials(locale: Locale): MaterialsContent {
  return byLocale[locale];
}
