import type { Metadata } from "next";
import type { BlogPost } from "@/content/blog";
import { site } from "@/content/site";
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
  /** Sem imagem, usa a imagem padrão gerada em app/og/route.tsx. */
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
  const urlFor = (l: Locale) => new URL(localizePath(path, l), site.url).toString();
  const canonical = urlFor(contentLocale ?? locale);
  const languages = contentLocale
    ? undefined
    : {
        ...Object.fromEntries(locales.map((l) => [l, urlFor(l)])),
        "x-default": urlFor(defaultLocale),
      };
  const ogImage = image ?? {
    url: "/og",
    alt: `${site.name} — ${site.tagline}`,
  };
  const fullTitle = `${title} — ${site.name}`;
  const openGraphBase = {
    title: fullTitle,
    description,
    url: canonical,
    siteName: site.name,
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

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    url: site.url,
    description: site.tagline,
  };
}

export function websiteJsonLd(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: new URL(localizePath("/", locale), site.url).toString(),
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
      item: new URL(item.path, site.url).toString(),
    })),
  };
}

export function articleJsonLd(post: BlogPost) {
  const url = new URL(`/blog/${post.slug}`, site.url).toString();
  const image = post.cover
    ? new URL(post.cover.src, site.url).toString()
    : new URL(`/blog/${post.slug}/og`, site.url).toString();

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    image: [image],
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    inLanguage: site.locale,
    mainEntityOfPage: url,
    author: post.author
      ? { "@type": "Person", name: post.author }
      : { "@type": "Organization", name: site.name, url: site.url },
    publisher: { "@type": "Organization", name: site.name, url: site.url },
  };
}
