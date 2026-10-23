"use client";

import { useEffect, useState } from "react";
import { brand } from "@/content/brand";
import { getLpUi } from "@/content/lp-ui";
import { localizePath } from "@/i18n/href";
import type { Locale } from "@/i18n/routing";
import { localizeLandingPage } from "@/lib/lp/localize";
import { landingPageDescription, landingPageTitle, publicLandingPageColumns, rowToLandingPage } from "@/lib/lp/rows";
import type { LandingPage } from "@/lib/lp/types";
import { getSupabase } from "@/lib/supabase/client";
import { LpPage } from "./lp-page";

type LoadState = { status: "loading" } | { status: "missing" } | { status: "ready"; page: LandingPage };

/** Slug da URL atual: /lp/<slug>/ ou /en/lp/<slug>/. */
function slugFromLocation(): string | undefined {
  const match = window.location.pathname.match(/\/lp\/([^/]+)\/?$/);
  const slug = match?.[1] ? decodeURIComponent(match[1]) : undefined;
  return slug && slug !== "pagina" ? slug : undefined;
}

async function loadPage(): Promise<LoadState> {
  const slug = slugFromLocation();
  const supabase = getSupabase();
  if (!slug || !supabase) return { status: "missing" };
  const { data } = await supabase
    .from("landing_pages")
    .select(publicLandingPageColumns)
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  return data ? { status: "ready", page: rowToLandingPage(data) } : { status: "missing" };
}

function setMeta(name: string, content: string) {
  let meta = document.head.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
  if (!meta) {
    meta = document.createElement("meta");
    meta.name = name;
    document.head.append(meta);
  }
  meta.content = content;
}

/** Título, descrição, canonical e robots da LP (o HTML estático é o da página única). */
function applyHead(source: LandingPage, locale: Locale) {
  const page = localizeLandingPage(source, locale);
  document.title = `${landingPageTitle(page)} | ${brand.name}`;
  setMeta("description", landingPageDescription(page));
  if (page.noindex) setMeta("robots", "noindex, nofollow");
  let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement("link");
    canonical.rel = "canonical";
    document.head.append(canonical);
  }
  canonical.href = new URL(localizePath(`/lp/${page.slug}`, page.contentLocale), brand.url).toString();
}

/**
 * LP publicada depois do último build: o .htaccess serve esta página para
 * /lp/<slug>/ quando não existe HTML pré-renderizado, e a LP é buscada no
 * Supabase pelo navegador. No próximo build ela vira página estática.
 */
export function LpLoader({ locale }: { locale: Locale }) {
  const [state, setState] = useState<LoadState>({ status: "loading" });
  const ui = getLpUi(locale);

  useEffect(() => {
    let active = true;
    loadPage().then((result) => {
      if (!active) return;
      if (result.status === "ready") applyHead(result.page, locale);
      setState(result);
    });
    return () => {
      active = false;
    };
  }, [locale]);

  if (state.status === "ready") {
    return <LpPage page={localizeLandingPage(state.page, locale)} source={state.page} locale={locale} />;
  }

  return (
    <section aria-labelledby="lp-status-heading" className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center px-6 text-center">
      {state.status === "loading" ? (
        <p role="status" className="text-base text-fg-muted">
          {ui.loading}
        </p>
      ) : (
        <>
          <h1 id="lp-status-heading" className="text-3xl font-bold tracking-tight text-ink">
            {ui.notFoundTitle}
          </h1>
          <p className="mt-3 text-base text-fg-muted">{ui.notFoundText}</p>
          <a
            href={localizePath("/", locale)}
            className="mt-6 inline-flex items-center rounded-xl bg-ink px-6 py-3 text-sm font-semibold text-paper focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark"
          >
            {ui.notFoundCta}
          </a>
        </>
      )}
    </section>
  );
}
