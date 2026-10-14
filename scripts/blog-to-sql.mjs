// Gera supabase/migrations/0005_seed_articles.sql com os artigos de
// content/blog.ts convertidos para Markdown (mesma conversão usada pelo site
// como reserva). Uso: pnpm blog:seed
// O seed usa "on conflict do nothing": rodar de novo não sobrescreve edições
// feitas no admin.

import { writeFileSync } from "node:fs";
import { blogPosts } from "../content/blog.ts";
import { postToArticle } from "../lib/blog/legacy.ts";

const tag = "$vispe$";
const text = (value) => {
  if (value === undefined || value === null) return "null";
  const s = String(value);
  if (s.includes(tag)) throw new Error(`O texto contém ${tag}: troque a tag de dollar-quoting.`);
  return `${tag}${s}${tag}`;
};

const rows = blogPosts.map((post) => {
  const article = postToArticle(post);
  const tags = `array[${article.tags.map(text).join(", ")}]::text[]`;
  const faq = article.faq ? `${text(JSON.stringify(article.faq))}::jsonb` : "null";
  return `(
  ${text(article.slug)},
  ${text(article.title)},
  ${text(article.description)},
  ${text(article.bodyMd)},
  ${text(article.cover?.src)},
  ${text(article.cover?.alt)},
  ${text(article.category)},
  ${text(article.author ?? "Vispe Capital")},
  ${text(article.seoTitle)},
  ${text(article.description)},
  'published',
  ${text(`${article.publishedAt}T12:00:00-03:00`)}::timestamptz,
  ${tags},
  ${faq}
)`;
});

const sql = `-- Gerado por scripts/blog-to-sql.mjs a partir de content/blog.ts — não editar à mão.
-- Os ${rows.length} artigos que já estavam no site, como publicados.

insert into public.articles
  (slug, title, excerpt, content_md, cover_image_url, cover_image_alt, category, author,
   meta_title, meta_description, status, published_at, tags, faq)
values
${rows.join(",\n")}
on conflict (slug) do nothing;
`;

writeFileSync("supabase/migrations/0005_seed_articles.sql", sql);
console.log(`Seed gerado com ${rows.length} artigos.`);
