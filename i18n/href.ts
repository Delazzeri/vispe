import { defaultLocale, localePrefixes, routing, type Locale } from "./routing";

type Pathnames = typeof routing.pathnames;

/**
 * Converte um caminho interno (pastas em português: "/sobre", "/blog/x")
 * para a URL pública do idioma: "/about" → com prefixo "/en" no inglês.
 */
export function localizePath(rawPath: string, locale: Locale): string {
  // Aceita com ou sem a barra final; a saída sempre termina em "/" (trailingSlash
  // do export estático), menos arquivos ("/blog/x/og.png").
  const internalPath = rawPath.length > 1 ? rawPath.replace(/\/+$/, "") : rawPath;
  let path = internalPath;
  const exact = routing.pathnames[internalPath as keyof Pathnames];

  if (exact) {
    path = typeof exact === "string" ? exact : exact[locale];
  } else {
    // Rotas dinâmicas ("/blog/[slug]", "/materiais/[slug]"): slug idêntico nos dois idiomas.
    for (const [pattern, target] of Object.entries(routing.pathnames)) {
      if (!pattern.endsWith("/[slug]")) continue;
      const prefix = pattern.slice(0, -"[slug]".length);
      if (!internalPath.startsWith(prefix)) continue;
      const localized = typeof target === "string" ? target : target[locale];
      path = localized.replace("[slug]", internalPath.slice(prefix.length));
      break;
    }
  }

  if (locale !== defaultLocale) {
    const prefix = localePrefixes[locale] ?? `/${locale}`;
    path = path === "/" ? prefix : `${prefix}${path}`;
  }
  return withTrailingSlash(path);
}

function withTrailingSlash(path: string): string {
  const last = path.slice(path.lastIndexOf("/") + 1);
  return path.endsWith("/") || last.includes(".") ? path : `${path}/`;
}

/**
 * Versão para hrefs vindos do conteúdo: aceita âncoras ("/#faq") e deixa
 * intactos links externos, mailto: e âncoras da própria página ("#x").
 */
export function localizeHref(href: string, locale: Locale): string {
  if (!href.startsWith("/")) return href;
  const [path, hash] = href.split("#");
  const localized = localizePath(path || "/", locale);
  return hash === undefined ? localized : `${localized}#${hash}`;
}
