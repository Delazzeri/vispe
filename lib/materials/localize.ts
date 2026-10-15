import type { Locale } from "@/i18n/routing";
import type { MaterialItem } from "./types";

/** Material no idioma da página + em qual idioma o conteúdo de fato está. */
export type LocalizedMaterial = MaterialItem & { contentLocale: Locale };

/** Em /en, usa a tradução salva no admin; sem ela, devolve o português (com aviso na página). */
export function localizeMaterial(material: MaterialItem, locale: Locale): LocalizedMaterial {
  const en = material.en;
  if (locale !== "en-US" || !en) return { ...material, contentLocale: "pt-BR" };
  return {
    ...material,
    type: en.type ?? material.type,
    title: en.title,
    tagline: en.tagline || material.tagline,
    headline: en.headline,
    descriptionMd: en.descriptionMd,
    seoTitle: en.metaTitle,
    seoDescription: en.metaDescription,
    faq: en.faq,
    cover: material.cover ? { ...material.cover, alt: en.coverAlt ?? material.cover.alt } : undefined,
    contentLocale: "en-US",
  };
}
