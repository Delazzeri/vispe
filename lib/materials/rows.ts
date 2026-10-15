import { markdownToText } from "@/lib/blog/markdown";
import type { MaterialRecord } from "@/lib/supabase/types";
import type { MaterialFaqItem, MaterialItem } from "./types";

// Linha da tabela materials → MaterialItem (mesmo formato no build e no navegador).

/**
 * Colunas que o público pode ler. O caminho do arquivo (file_path) fica de fora:
 * o anônimo nem tem permissão nessa coluna (0006_materials.sql); o link de
 * download só sai por e-mail, gerado pela Edge Function material-link.
 */
export const publicMaterialColumns =
  "slug,type,title,tagline,headline,description_md,cover_image_url,cover_image_alt,image_url,faq,meta_title,meta_description,sort_order,published_at";

export type PublicMaterialRow = Pick<
  MaterialRecord,
  | "slug"
  | "type"
  | "title"
  | "tagline"
  | "headline"
  | "description_md"
  | "cover_image_url"
  | "cover_image_alt"
  | "image_url"
  | "faq"
  | "meta_title"
  | "meta_description"
  | "sort_order"
  | "published_at"
>;

function faqFromJson(value: MaterialRecord["faq"]): MaterialFaqItem[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const items = value.flatMap((item) =>
    item && typeof item === "object" && !Array.isArray(item) && typeof item.question === "string" && typeof item.answer === "string"
      ? [{ question: item.question, answer: item.answer }]
      : [],
  );
  return items.length ? items : undefined;
}

/** Capa local (seed) com a largura no nome: dimensões da arte 842×595. */
const localCover = (src: string) => (/-842\.webp$/.test(src) ? { width: 842, height: 595 } : {});

export function rowToMaterial(row: PublicMaterialRow): MaterialItem {
  return {
    slug: row.slug,
    type: row.type,
    title: row.title,
    tagline: row.tagline,
    headline: row.headline ?? undefined,
    descriptionMd: row.description_md,
    cover: row.cover_image_url
      ? { src: row.cover_image_url, alt: row.cover_image_alt ?? "", ...localCover(row.cover_image_url) }
      : undefined,
    image: row.image_url ? { src: row.image_url, alt: `${row.type}: ${row.title}` } : undefined,
    faq: faqFromJson(row.faq),
    seoTitle: row.meta_title ?? undefined,
    seoDescription: row.meta_description ?? undefined,
  };
}

/** Descrição para o Google: a do admin ou o começo da descrição do material. */
export function materialDescription(material: MaterialItem): string {
  if (material.seoDescription) return material.seoDescription;
  const text = markdownToText(material.descriptionMd);
  return (text.length > 160 ? `${text.slice(0, 157).trimEnd()}…` : text) || `${material.title}: ${material.tagline}`;
}
