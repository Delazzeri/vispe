import type { BlogBlock, BlogPost } from "@/content/blog";
import type { Article } from "./types";

// Converte os artigos estruturados de content/blog.ts para o formato Markdown
// do Supabase. Usado como reserva no build (sem Supabase) e pelo
// scripts/blog-to-sql.mjs, que gera o seed dos artigos.
// Só imports de tipo: o script roda este arquivo direto no Node.

function blockToMarkdown(block: BlogBlock): string {
  if (typeof block === "string") return block;
  if (block.kind === "highlight") return `> ${block.text}`;
  return block.items
    .map((item, i) => {
      const bullet = block.ordered ? `${i + 1}.` : "-";
      return `${bullet} ${item.label ? `**${item.label}** ` : ""}${item.text}`;
    })
    .join("\n");
}

export function postToMarkdown(post: BlogPost): string {
  return post.sections
    .map((section) => {
      const blocks = section.paragraphs.map(blockToMarkdown);
      if (!section.heading) return blocks.join("\n\n");
      const hashes = section.level === 3 ? "###" : "##";
      return [`${hashes} ${section.heading}`, ...blocks].join("\n\n");
    })
    .join("\n\n");
}

export function postToArticle(post: BlogPost): Article {
  return {
    slug: post.slug,
    title: post.title,
    seoTitle: post.seoTitle,
    description: post.description,
    category: post.category,
    tags: post.tags,
    publishedAt: post.publishedAt,
    updatedAt: post.updatedAt,
    author: post.author,
    cover: post.cover,
    bodyMd: postToMarkdown(post),
    faq: post.faq?.items,
  };
}
