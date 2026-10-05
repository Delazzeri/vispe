import { useLocale } from "next-intl";
import { resolveLocale, type Locale } from "@/i18n/routing";
import type { Widen } from "./types";
import { site as enUS } from "./en-US/site";
import { site as ptBR } from "./pt-BR/site";

export { brand } from "./brand";

/** Formato do conteúdo do site; a versão em inglês segue o português. */
export type SiteContent = Widen<typeof ptBR>;

const sites: Record<Locale, SiteContent> = { "pt-BR": ptBR, "en-US": enUS };

/** Para páginas, metadata e funções async (recebem o locale da rota). */
export function getSite(locale: Locale): SiteContent {
  return sites[locale];
}

/** Para componentes (servidor não-async ou cliente): usa o idioma atual. */
export function useSite(): SiteContent {
  return sites[resolveLocale(useLocale())];
}
