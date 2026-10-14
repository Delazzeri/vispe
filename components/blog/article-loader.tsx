"use client";

import { useEffect, useState } from "react";
import { ArticleView } from "@/components/blog/article-view";
import { LocaleLink as Link } from "@/components/ui/locale-link";
import { getSite } from "@/content/site";
import { localizePath } from "@/i18n/href";
import type { Locale } from "@/i18n/routing";
import { publicArticleColumns, publicStatuses, rowToArticle } from "@/lib/blog/rows";
import type { Article } from "@/lib/blog/types";
import { brand } from "@/content/brand";
import { getSupabase } from "@/lib/supabase/client";

type LoadState = { status: "loading" } | { status: "missing" } | { status: "ready"; article: Article };

/** Slug da URL atual: /blog/<slug>/ ou /en/blog/<slug>/. */
function slugFromLocation(): string | undefined {
  const match = window.location.pathname.match(/\/blog\/([^/]+)\/?$/);
  const slug = match?.[1] ? decodeURIComponent(match[1]) : undefined;
  return slug && slug !== "post" ? slug : undefined;
}

function setMeta(selector: string, attr: "name" | "property", key: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attr, key);
    document.head.append(element);
  }
  element.content = content;
}

/** Título, descrição e canonical do post (o HTML estático é o da página única). */
function applyHead(article: Article) {
  const title = `${article.seoTitle ?? article.title} | ${brand.name}`;
  const description = article.seoDescription ?? article.description;
  document.title = title;
  setMeta('meta[name="description"]', "name", "description", description);
  setMeta('meta[property="og:title"]', "property", "og:title", title);
  setMeta('meta[property="og:description"]', "property", "og:description", description);
  let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement("link");
    canonical.rel = "canonical";
    document.head.append(canonical);
  }
  canonical.href = new URL(localizePath(`/blog/${article.slug}`, "pt-BR"), brand.url).toString();
}

async function loadArticle(): Promise<LoadState> {
  const slug = slugFromLocation();
  const supabase = getSupabase();
  if (!slug || !supabase) return { status: "missing" };
  const { data } = await supabase
    .from("articles")
    .select(publicArticleColumns)
    .eq("slug", slug)
    .in("status", publicStatuses)
    .lte("published_at", new Date().toISOString())
    .maybeSingle();
  return data ? { status: "ready", article: rowToArticle(data) } : { status: "missing" };
}

/**
 * Post publicado depois do último build: o .htaccess serve esta página para
 * /blog/<slug>/ quando não existe HTML pré-renderizado, e o artigo é buscado no
 * Supabase pelo navegador. No próximo build ele vira página estática.
 */
export function ArticleLoader({ locale }: { locale: Locale }) {
  const [state, setState] = useState<LoadState>({ status: "loading" });
  const { ui } = getSite(locale);

  useEffect(() => {
    let active = true;
    loadArticle().then((next) => {
      if (!active) return;
      if (next.status === "ready") applyHead(next.article);
      setState(next);
    });
    return () => {
      active = false;
    };
  }, []);

  if (state.status === "ready") return <ArticleView article={state.article} locale={locale} />;

  return (
    <section aria-live="polite" className="mx-auto flex min-h-[60vh] max-w-3xl flex-col justify-center px-6 py-24">
      {state.status === "loading" ? (
        <p className="text-base text-fg-muted">{ui.blogLoading}</p>
      ) : (
        <>
          <h1 className="text-4xl font-bold tracking-tight text-ink">{ui.blogNotFoundTitle}</h1>
          <p className="mt-4 text-lg text-fg-muted">{ui.blogNotFoundText}</p>
          <Link
            href="/blog"
            className="mt-8 inline-flex self-start rounded-xl bg-ink px-6 py-3.5 text-sm font-semibold text-paper focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark"
          >
            {ui.backToBlog}
          </Link>
        </>
      )}
    </section>
  );
}
