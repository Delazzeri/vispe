import { asObject, str } from "@/lib/translation-json";
import type { LandingPageRecord } from "@/lib/supabase/types";
import { normalizeSections } from "./normalize";
import type { LandingPage, LpTranslation } from "./types";

// Linha de landing_pages → LandingPage (mesmo formato no build e no navegador).

export const publicLandingPageColumns =
  "slug,template,name,sections,meta_title,meta_description,og_image_url,noindex,whatsapp_message,en,published_at,updated_at";

export type PublicLandingPageRow = Pick<
  LandingPageRecord,
  | "slug"
  | "template"
  | "name"
  | "sections"
  | "meta_title"
  | "meta_description"
  | "og_image_url"
  | "noindex"
  | "whatsapp_message"
  | "en"
  | "published_at"
  | "updated_at"
>;

function translationFromJson(value: LandingPageRecord["en"]): LpTranslation | undefined {
  const en = asObject(value);
  const sections = en && asObject(en.sections ?? null);
  if (!en || !sections || Object.keys(sections).length === 0) return undefined;
  return {
    metaTitle: str(en, "metaTitle"),
    metaDescription: str(en, "metaDescription"),
    whatsappMessage: str(en, "whatsappMessage"),
    sections: Object.fromEntries(Object.entries(sections).map(([id, data]) => [id, data ?? null])),
  };
}

export function rowToLandingPage(row: PublicLandingPageRow): LandingPage {
  return {
    slug: row.slug,
    template: row.template,
    name: row.name,
    sections: normalizeSections(row.sections),
    metaTitle: row.meta_title || undefined,
    metaDescription: row.meta_description || undefined,
    ogImage: row.og_image_url || undefined,
    noindex: row.noindex,
    whatsappMessage: row.whatsapp_message || undefined,
    en: translationFromJson(row.en),
    publishedAt: row.published_at || undefined,
    updatedAt: row.updated_at || undefined,
  };
}

/** Descrição para o Google: a do SEO ou o subtítulo do hero. */
export function landingPageDescription(page: LandingPage): string {
  if (page.metaDescription) return page.metaDescription;
  const hero = page.sections.find((section) => section.type === "hero");
  return hero?.type === "hero" ? hero.data.subtitle : "";
}

/** Título: o do SEO ou o título do hero (por último, o nome interno). */
export function landingPageTitle(page: LandingPage): string {
  if (page.metaTitle) return page.metaTitle;
  const hero = page.sections.find((section) => section.type === "hero");
  return (hero?.type === "hero" && hero.data.title) || page.name;
}
