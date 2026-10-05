import type { Locale } from "@/i18n/routing";
import type { Widen } from "./types";
import { careers as enUS } from "./en-US/careers";
import { careers as ptBR } from "./pt-BR/careers";

// Acesso por idioma ao conteúdo da página "Trabalhe conosco".

export type CareersContent = Widen<typeof ptBR>;

const byLocale: Record<Locale, CareersContent> = { "pt-BR": ptBR, "en-US": enUS };

export function getCareers(locale: Locale): CareersContent {
  return byLocale[locale];
}

/** E-mail do RH (destino das candidaturas e alternativa de envio). */
export const hrEmail = "carolina.soares@vispe.com.br";

/** Limite do currículo em PDF (a Vercel aceita até 4,5 MB por requisição). */
export const resumeMaxBytes = 4 * 1024 * 1024;
