import type { Locale } from "@/i18n/routing";
import type { Article } from "./types";

/** Artigo no idioma da página + em qual idioma o conteúdo de fato está. */
export type LocalizedArticle = Article & { contentLocale: Locale };

/**
 * Em /en, usa a tradução salva no admin; sem ela, devolve o português (a página
 * mostra o aviso "disponível só em português" e o canonical aponta para o pt).
 */
export function localizeArticle(article: Article, locale: Locale): LocalizedArticle {
  const en = article.en;
  if (locale !== "en-US" || !en) return { ...article, contentLocale: "pt-BR" };
  return {
    ...article,
    title: en.title,
    description: en.excerpt || article.description,
    category: en.category ?? article.category,
    seoTitle: en.metaTitle,
    seoDescription: en.metaDescription,
    bodyMd: en.bodyMd,
    faq: en.faq,
    cover: article.cover ? { ...article.cover, alt: en.coverAlt ?? article.cover.alt } : undefined,
    contentLocale: "en-US",
  };
}
