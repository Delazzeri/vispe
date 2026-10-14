"use client";

import { useEffect, useState } from "react";
import { BlogCard } from "@/components/ui/blog-card";
import { publicArticleColumns, publicStatuses, rowToArticle } from "@/lib/blog/rows";
import type { Article } from "@/lib/blog/types";
import { getSupabase } from "@/lib/supabase/client";

/**
 * Lista do /blog: começa com os artigos do build (HTML pronto para o Google) e,
 * depois do mount, troca pela lista atual do Supabase — assim um post publicado
 * depois do build já aparece.
 */
export function BlogList({ initial, emptyLabel }: { initial: readonly Article[]; emptyLabel: string }) {
  const [articles, setArticles] = useState(initial);

  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) return;
    let active = true;
    supabase
      .from("articles")
      .select(publicArticleColumns)
      .in("status", publicStatuses)
      .lte("published_at", new Date().toISOString())
      .order("published_at", { ascending: false })
      .then(({ data, error }) => {
        if (active && !error && data) setArticles(data.map(rowToArticle));
      });
    return () => {
      active = false;
    };
  }, []);

  if (articles.length === 0) return <p className="text-center text-base text-fg-muted">{emptyLabel}</p>;

  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {articles.map((article) => (
        <li key={article.slug}>
          <BlogCard post={article} />
        </li>
      ))}
    </ul>
  );
}
