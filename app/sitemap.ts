import type { MetadataRoute } from "next";
import { listArticles } from "@/lib/blog/source";
import { listMaterials } from "@/lib/materials/source";
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
  { path: "/franquia", changeFrequency: "monthly", priority: 0.6 },
  { path: "/franquia/comercial", changeFrequency: "monthly", priority: 0.6 },
  { path: "/franquia/financeira", changeFrequency: "monthly", priority: 0.6 },
  { path: "/materiais", changeFrequency: "weekly", priority: 0.7 },
  { path: "/blog", changeFrequency: "weekly", priority: 0.7 },
];

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const localized: MetadataRoute.Sitemap = pages.flatMap(({ path, changeFrequency, priority }) => {
    const languages = Object.fromEntries(locales.map((l) => [l, url(localizePath(path, l))]));
    return locales.map((locale) => ({
      url: url(localizePath(path, locale)),
      changeFrequency,
      priority,
      alternates: { languages: { ...languages, "x-default": url(localizePath(path, defaultLocale)) } },
    }));
  });

  /**
   * Conteúdo do admin (artigos e materiais): sem tradução, só a URL pt-BR (a /en
   * aponta o canonical para ela); traduzido, as duas URLs com alternates.
   */
  const contentRoutes = (
    path: string,
    translated: boolean,
    extra: Omit<MetadataRoute.Sitemap[number], "url">,
  ): MetadataRoute.Sitemap => {
    if (!translated) return [{ url: url(localizePath(path, defaultLocale)), ...extra }];
    const languages = Object.fromEntries(locales.map((l) => [l, url(localizePath(path, l))]));
    return locales.map((locale) => ({
      url: url(localizePath(path, locale)),
      ...extra,
      alternates: { languages: { ...languages, "x-default": url(localizePath(path, defaultLocale)) } },
    }));
  };

  const blogRoutes: MetadataRoute.Sitemap = (await listArticles()).flatMap((post) =>
    contentRoutes(`/blog/${post.slug}`, Boolean(post.en), {
      lastModified: post.updatedAt ?? post.publishedAt,
      changeFrequency: "monthly",
      priority: 0.5,
    }),
  );

  const materialRoutes: MetadataRoute.Sitemap = (await listMaterials()).flatMap((material) =>
    contentRoutes(`/materiais/${material.slug}`, Boolean(material.en), { changeFrequency: "monthly", priority: 0.6 }),
  );

  return [...localized, ...blogRoutes, ...materialRoutes];
}
