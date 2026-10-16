import { blogPosts } from "@/content/blog";
import { buildQuery } from "@/lib/supabase/build-query";
import { getSupabase } from "@/lib/supabase/client";
import { postToArticle } from "./legacy";
import { publicArticleColumns, publicStatuses, rowToArticle } from "./rows";
import type { Article } from "./types";

// Artigos usados no build (páginas pré-renderizadas, home, footer, sitemap, OG).
// Com Supabase configurado, lê os publicados da tabela articles (se não responder,
// o build para com erro em vez de gerar páginas quebradas); sem ele, usa os
// artigos de content/blog.ts.

let cached: Promise<readonly Article[]> | undefined;

async function load(): Promise<readonly Article[]> {
  const local = blogPosts.map(postToArticle);
  const supabase = getSupabase();
  if (!supabase) return local;
  const rows = await buildQuery("blog", () =>
    supabase
      .from("articles")
      .select(publicArticleColumns)
      .in("status", publicStatuses)
      .lte("published_at", new Date().toISOString())
      .order("published_at", { ascending: false }),
  );
  return rows.map(rowToArticle);
}

/** Publicados, do mais recente para o mais antigo. */
export function listArticles(): Promise<readonly Article[]> {
  cached ??= load();
  return cached;
}

export async function getArticle(slug: string): Promise<Article | undefined> {
  return (await listArticles()).find((article) => article.slug === slug);
}
