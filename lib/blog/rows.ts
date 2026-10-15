import type { ArticleRecord } from "@/lib/supabase/types";
import { asObject, faqList, str } from "@/lib/translation-json";
import type { Article, ArticleFaqItem, ArticleTranslation } from "./types";

// Linha da tabela articles → Article (mesmo formato usado no build e no navegador).

/** Colunas lidas pelo site público (o admin lê tudo). */
export const publicArticleColumns =
  "slug,title,excerpt,content_md,cover_image_url,cover_image_alt,category,author,meta_title,meta_description,published_at,updated_at,tags,faq,en";

export type PublicArticleRow = Pick<
  ArticleRecord,
  | "slug"
  | "title"
  | "excerpt"
  | "content_md"
  | "cover_image_url"
  | "cover_image_alt"
  | "category"
  | "author"
  | "meta_title"
  | "meta_description"
  | "published_at"
  | "updated_at"
  | "tags"
  | "faq"
  | "en"
>;

function faqFromJson(value: ArticleRecord["faq"]): ArticleFaqItem[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const items = value.flatMap((item) =>
    item && typeof item === "object" && !Array.isArray(item) && typeof item.question === "string" && typeof item.answer === "string"
      ? [{ question: item.question, answer: item.answer }]
      : [],
  );
  return items.length ? items : undefined;
}

function translationFromJson(value: ArticleRecord["en"]): ArticleTranslation | undefined {
  const en = asObject(value);
  const title = en && str(en, "title");
  const bodyMd = en && str(en, "bodyMd");
  if (!en || !title || !bodyMd) return undefined;
  return {
    title,
    bodyMd,
    excerpt: str(en, "excerpt") ?? "",
    category: str(en, "category"),
    metaTitle: str(en, "metaTitle"),
    metaDescription: str(en, "metaDescription"),
    coverAlt: str(en, "coverAlt"),
    faq: faqList(en.faq),
  };
}

export function rowToArticle(row: PublicArticleRow): Article {
  return {
    slug: row.slug,
    title: row.title,
    seoTitle: row.meta_title ?? undefined,
    description: row.excerpt,
    seoDescription: row.meta_description ?? undefined,
    category: row.category,
    tags: row.tags ?? [],
    publishedAt: row.published_at ?? row.updated_at,
    updatedAt: row.updated_at,
    // "Vispe Capital" é o padrão da coluna: assina como organização.
    author: row.author && row.author !== "Vispe Capital" ? row.author : undefined,
    cover: row.cover_image_url ? { src: row.cover_image_url, alt: row.cover_image_alt ?? row.title } : undefined,
    bodyMd: row.content_md,
    faq: faqFromJson(row.faq),
    en: translationFromJson(row.en),
  };
}

/** Status visíveis ao público (com published_at já passado; a RLS garante o mesmo). */
export const publicStatuses = ["published", "scheduled"] satisfies ArticleRecord["status"][];
