import type { Metadata } from "next";
import type { BlogPost } from "@/content/blog";
import { site } from "@/content/site";

type SeoInput = {
  title: string;
  description: string;
  path?: string;
  /** Sem imagem, usa a imagem padrão gerada em app/og/route.tsx. */
  image?: { url: string; alt: string };
  type?: "website" | "article";
  article?: { publishedTime: string; modifiedTime?: string; authors?: string[] };
};

export function buildMetadata({
  title,
  description,
  path = "/",
  image,
  type = "website",
  article,
}: SeoInput): Metadata {
  const canonical = new URL(path, site.url).toString();
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
    locale: "pt_BR",
    images: [{ url: ogImage.url, width: 1200, height: 630, alt: ogImage.alt }],
  };

  return {
    title: fullTitle,
    description,
    alternates: { canonical },
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

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: site.url,
    inLanguage: site.locale,
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
