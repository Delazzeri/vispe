import type { MetadataRoute } from "next";
import { blogPosts } from "@/content/blog";
import { brand } from "@/content/brand";
import { localizePath } from "@/i18n/href";
import { defaultLocale, locales } from "@/i18n/routing";

type Frequency = NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;

const url = (path: string) => new URL(path, brand.url).toString();

// Páginas que existem nos dois idiomas (caminho interno → URL de cada idioma).
// TODO: incluir /produtos/<slug> quando as landing pages existirem.
const pages: { path: string; changeFrequency: Frequency; priority: number }[] = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/sobre", changeFrequency: "monthly", priority: 0.6 },
  { path: "/contato", changeFrequency: "monthly", priority: 0.6 },
  { path: "/trabalhe-conosco", changeFrequency: "monthly", priority: 0.5 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const localized: MetadataRoute.Sitemap = pages.flatMap(({ path, changeFrequency, priority }) => {
    const languages = Object.fromEntries(locales.map((l) => [l, url(localizePath(path, l))]));
    return locales.map((locale) => ({
      url: url(localizePath(path, locale)),
      changeFrequency,
      priority,
      alternates: { languages: { ...languages, "x-default": url(localizePath(path, defaultLocale)) } },
    }));
  });

  // Artigos existem só em português: entra apenas a URL canônica pt-BR.
  const blogRoutes: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: url(`/blog/${post.slug}`),
    lastModified: post.publishedAt,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [...localized, ...blogRoutes];
}
