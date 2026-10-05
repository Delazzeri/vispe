import { defaultLocale, localePrefixes, routing, type Locale } from "./routing";

type Pathnames = typeof routing.pathnames;

/**
 * Converte um caminho interno (pastas em português: "/sobre", "/blog/x")
 * para a URL pública do idioma: "/about" → com prefixo "/en" no inglês.
 */
export function localizePath(internalPath: string, locale: Locale): string {
  let path = internalPath;
  const exact = routing.pathnames[internalPath as keyof Pathnames];

  if (exact) {
    path = typeof exact === "string" ? exact : exact[locale];
  } else if (internalPath.startsWith("/blog/")) {
    path = internalPath; // slug idêntico nos dois idiomas
  }

  if (locale === defaultLocale) return path;
  const prefix = localePrefixes[locale] ?? `/${locale}`;
  return path === "/" ? prefix : `${prefix}${path}`;
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
