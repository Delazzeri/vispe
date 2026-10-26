import type { Locale } from "@/i18n/routing";
import type { Widen } from "./types";
import { privacy as enUS } from "./en-US/privacy";
import { privacy as ptBR } from "./pt-BR/privacy";

// Texto da Política de Privacidade (/privacidade e /en/privacy).

export type PrivacyContent = Widen<typeof ptBR>;

const byLocale: Record<Locale, PrivacyContent> = { "pt-BR": ptBR, "en-US": enUS };

export function getPrivacy(locale: Locale): PrivacyContent {
  return byLocale[locale];
}
