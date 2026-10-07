import type { Metadata } from "next";
import type { BlogPost } from "@/content/blog";
import { brand, getSite } from "@/content/site";
import { localizePath } from "@/i18n/href";
import { defaultLocale, locales, type Locale } from "@/i18n/routing";

const ogLocale: Record<Locale, string> = { "pt-BR": "pt_BR", "en-US": "en_US" };

type SeoInput = {
  title: string;
  description: string;
  locale: Locale;
  /** Caminho interno (pastas em português), ex.: "/sobre". */
  path?: string;
  /**
   * Idioma real do conteúdo, quando difere do da rota (blog: só em português).
   * O canonical aponta para essa versão e não há alternates de idioma.
   */
  contentLocale?: Locale;
  /** Sem imagem, usa a imagem padrão do idioma (app/og e app/og/en). */
  image?: { url: string; alt: string };
  type?: "website" | "article";
  article?: { publishedTime: string; modifiedTime?: string; authors?: string[] };
};

export function buildMetadata({
  title,
  description,
  locale,
  path = "/",
  contentLocale,
  image,
  type = "website",
  article,
}: SeoInput): Metadata {
  const urlFor = (l: Locale) => new URL(localizePath(path, l), brand.url).toString();
  const canonical = urlFor(contentLocale ?? locale);
  const languages = contentLocale
    ? undefined
    : {
        ...Object.fromEntries(locales.map((l) => [l, urlFor(l)])),
        "x-default": urlFor(defaultLocale),
      };
  const ogImage = image ?? {
    url: locale === defaultLocale ? "/og" : "/og/en",
    alt: `${brand.name} — ${getSite(locale).tagline}`,
  };
  // Separador "|" no título da aba: "Página | Vispe Capital".
  const fullTitle = `${title} | ${brand.name}`;
  const openGraphBase = {
    title: fullTitle,
    description,
    url: canonical,
    siteName: brand.name,
    locale: ogLocale[locale],
    alternateLocale: locales.filter((l) => l !== locale).map((l) => ogLocale[l]),
    images: [{ url: ogImage.url, width: 1200, height: 630, alt: ogImage.alt }],
  };

  return {
    title: fullTitle,
    description,
    alternates: { canonical, languages },
    openGraph:
      type === "article" && article
        ? { ...openGraphBase, type: "article", ...article }
        : { ...openGraphBase, type: "website" },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [ogImage.url],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large" },
    },
  };
}

export function organizationJsonLd(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: brand.name,
    url: brand.url,
    description: getSite(locale).tagline,
    // Perfis oficiais: ajudam o Google a associar as redes à marca.
    sameAs: Object.values(brand.social).filter((url): url is string => Boolean(url)),
  };
}

export function websiteJsonLd(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: brand.name,
    url: new URL(localizePath("/", locale), brand.url).toString(),
    inLanguage: locale,
  };
}

export function breadcrumbJsonLd(items: readonly { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: new URL(item.path, brand.url).toString(),
    })),
  };
}

export function articleJsonLd(post: BlogPost) {
  const url = new URL(`/blog/${post.slug}`, brand.url).toString();
  const image = post.cover
    ? new URL(post.cover.src, brand.url).toString()
    : new URL(`/blog/${post.slug}/og`, brand.url).toString();

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    image: [image],
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    inLanguage: "pt-BR", // artigos existem só em português
    mainEntityOfPage: url,
    author: post.author
      ? { "@type": "Person", name: post.author }
      : { "@type": "Organization", name: brand.name, url: brand.url },
    publisher: { "@type": "Organization", name: brand.name, url: brand.url },
  };
}
