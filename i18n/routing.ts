import { defineRouting } from "next-intl/routing";

export const locales = ["pt-BR", "en-US"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "pt-BR";

/** Prefixo de URL por idioma (o padrão, pt-BR, fica sem prefixo). */
export const localePrefixes: Partial<Record<Locale, string>> = { "en-US": "/en" };

/**
 * Português na raiz (sem prefixo) e inglês em /en, com caminhos traduzidos.
 * As chaves de `pathnames` são as pastas reais em app/[locale]/(site).
 * Sem detecção automática: o idioma vem só da URL (e do seletor de bandeira).
 */
export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: { mode: "as-needed", prefixes: localePrefixes },
  localeDetection: false,
  localeCookie: false,
  pathnames: {
    "/": "/",
    "/sobre": { "pt-BR": "/sobre", "en-US": "/about" },
    "/contato": { "pt-BR": "/contato", "en-US": "/contact" },
    "/trabalhe-conosco": { "pt-BR": "/trabalhe-conosco", "en-US": "/careers" },
    "/blog/[slug]": "/blog/[slug]",
  },
});

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** Valida o segmento [locale] da rota (o layout já barra valores inválidos). */
export function resolveLocale(value: string): Locale {
  return isLocale(value) ? value : defaultLocale;
}
