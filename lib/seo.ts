import type { Metadata } from "next";
import { site } from "@/content/site";

type SeoInput = {
  title: string;
  description: string;
  path?: string;
  image?: { url: string; alt: string };
};

export function buildMetadata({ title, description, path = "/", image }: SeoInput): Metadata {
  const canonical = new URL(path, site.url).toString();
  const ogImage = image ?? {
    url: "/media/og-default-1200x630.webp",
    alt: `${site.name} — ${site.tagline}`,
  };

  return {
    title: `${title} — ${site.name}`,
    description,
    alternates: { canonical },
    openGraph: {
      title: `${title} — ${site.name}`,
      description,
      url: canonical,
      siteName: site.name,
      locale: "pt_BR",
      type: "website",
      images: [{ url: ogImage.url, width: 1200, height: 630, alt: ogImage.alt }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} — ${site.name}`,
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
