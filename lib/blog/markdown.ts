import DOMPurify from "isomorphic-dompurify";
import { Marked, type Tokens } from "marked";
import { localizeHref } from "@/i18n/href";
import type { Locale } from "@/i18n/routing";
import type { Article } from "./types";

// Markdown → HTML sanitizado, igual no build (página pré-renderizada), no
// navegador (post publicado depois do build) e na prévia do admin.
// Links internos ("/#servicos", "/blog/x") seguem o idioma da página; externos
// abrem em nova aba.

function escapeAttr(value: string) {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}

function parser(locale: Locale) {
  return new Marked({
    gfm: true,
    renderer: {
      link(this: { parser: { parseInline: (tokens: Tokens.Link["tokens"]) => string } }, token: Tokens.Link) {
        const label = this.parser.parseInline(token.tokens);
        const external = /^https?:\/\//.test(token.href);
        const href = external ? token.href : localizeHref(token.href, locale);
        const target = external ? ' target="_blank" rel="noopener"' : "";
        return `<a href="${escapeAttr(href)}"${target}>${label}</a>`;
      },
    },
  });
}

const sanitizeOptions = { ADD_ATTR: ["target"] };

export function renderMarkdown(markdown: string, locale: Locale): string {
  return DOMPurify.sanitize(parser(locale).parse(markdown, { async: false }), sanitizeOptions);
}

/** Uma linha só (respostas do FAQ): sem <p> em volta. */
export function renderInlineMarkdown(markdown: string, locale: Locale): string {
  return DOMPurify.sanitize(parser(locale).parseInline(markdown, { async: false }), sanitizeOptions);
}

/** Remove a marcação (JSON-LD, contagem de palavras). */
export function markdownToText(markdown: string): string {
  return markdown
    .replace(/\[([^\]]+)\]\([^)\s]+\)/g, "$1")
    .replace(/[*_`>#]/g, "")
    .replace(/^\s*(\d+\.|-)\s+/gm, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function readingMinutes(article: Pick<Article, "bodyMd" | "faq">): number {
  const text = [article.bodyMd, ...(article.faq ?? []).flatMap((item) => [item.question, item.answer])].join(" ");
  return Math.max(1, Math.round(markdownToText(text).split(" ").length / 200));
}

/** Data no formato do idioma da interface (o artigo em si é sempre pt-BR). */
export function formatArticleDate(isoDate: string, locale: string = "pt-BR"): string {
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(isoDate));
}
