import { blogPosts } from "@/content/blog";
import { getSupabase } from "@/lib/supabase/client";
import { postToArticle } from "./legacy";
import { publicArticleColumns, publicStatuses, rowToArticle } from "./rows";
import type { Article } from "./types";

// Artigos usados no build (páginas pré-renderizadas, home, footer, sitemap, OG).
// Com Supabase configurado, lê os publicados da tabela articles; sem ele (ou se
// o Supabase não responder), usa os artigos de content/blog.ts para o site
// continuar funcionando — com um aviso no log do build.

let cached: Promise<readonly Article[]> | undefined;

async function load(): Promise<readonly Article[]> {
  const local = blogPosts.map(postToArticle);
  const supabase = getSupabase();
  if (!supabase) return local;
  try {
    const { data, error } = await supabase
      .from("articles")
      .select(publicArticleColumns)
      .in("status", publicStatuses)
      .lte("published_at", new Date().toISOString())
      .order("published_at", { ascending: false });
    if (error) throw error;
    return data.map(rowToArticle);
  } catch (error) {
    const message =
      error && typeof error === "object" && "message" in error ? String(error.message) : String(error);
    console.warn(`[blog] Supabase indisponível no build (${message.split("\n")[0]}); usando content/blog.ts.`);
    return local;
  }
}

/** Publicados, do mais recente para o mais antigo. */
export function listArticles(): Promise<readonly Article[]> {
  cached ??= load();
  return cached;
}

export async function getArticle(slug: string): Promise<Article | undefined> {
  return (await listArticles()).find((article) => article.slug === slug);
}
