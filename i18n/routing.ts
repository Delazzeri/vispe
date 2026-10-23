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
    "/franquia": { "pt-BR": "/franquia", "en-US": "/franchise" },
    "/franquia/comercial": { "pt-BR": "/franquia/comercial", "en-US": "/franchise/commercial" },
    "/franquia/financeira": { "pt-BR": "/franquia/financeira", "en-US": "/franchise/financial" },
    "/materiais": { "pt-BR": "/materiais", "en-US": "/free-materials" },
    // Página única dos materiais publicados depois do último build (lê o slug da URL).
    "/materiais/item": { "pt-BR": "/materiais/item", "en-US": "/free-materials/item" },
    "/materiais/[slug]": { "pt-BR": "/materiais/[slug]", "en-US": "/free-materials/[slug]" },
    "/blog": "/blog",
    // Página única dos posts publicados depois do último build (lê o slug da URL).
    "/blog/post": "/blog/post",
    "/blog/[slug]": "/blog/[slug]",
    // Landing pages do admin (app/[locale]/(lp)): mesmo caminho nos dois idiomas, sem página de índice.
    "/lp": "/lp",
    // Página única das LPs publicadas depois do último build (lê o slug da URL).
    "/lp/pagina": "/lp/pagina",
    "/lp/[slug]": "/lp/[slug]",
  },
});

/**
 * Cookie gravado pelo seletor de idioma: com ele, o .htaccess não manda mais o
 * visitante para /en pelo idioma do navegador (a escolha manual vence).
 */
export const localeCookie = "vispe_lang";

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** Valida o segmento [locale] da rota (o layout já barra valores inválidos). */
export function resolveLocale(value: string): Locale {
  return isLocale(value) ? value : defaultLocale;
}
