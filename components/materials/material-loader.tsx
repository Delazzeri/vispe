"use client";

import { useEffect, useState } from "react";
import { MaterialView } from "@/components/materials/material-view";
import { LocaleLink as Link } from "@/components/ui/locale-link";
import { brand } from "@/content/brand";
import { getMaterialsUi } from "@/content/materials";
import { localizePath } from "@/i18n/href";
import type { Locale } from "@/i18n/routing";
import { localizeMaterial, type LocalizedMaterial } from "@/lib/materials/localize";
import { publicMaterialColumns, rowToMaterial } from "@/lib/materials/rows";
import { getSupabase } from "@/lib/supabase/client";

type LoadState = { status: "loading" } | { status: "missing" } | { status: "ready"; material: LocalizedMaterial };

/** Slug da URL atual: /materiais/<slug>/ ou /en/free-materials/<slug>/. */
function slugFromLocation(): string | undefined {
  const match = window.location.pathname.match(/\/(?:materiais|free-materials)\/([^/]+)\/?$/);
  const slug = match?.[1] ? decodeURIComponent(match[1]) : undefined;
  return slug && slug !== "item" ? slug : undefined;
}

async function loadMaterial(locale: Locale): Promise<LoadState> {
  const slug = slugFromLocation();
  const supabase = getSupabase();
  if (!slug || !supabase) return { status: "missing" };
  const { data } = await supabase
    .from("materials")
    .select(publicMaterialColumns)
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  return data ? { status: "ready", material: localizeMaterial(rowToMaterial(data), locale) } : { status: "missing" };
}

/** Título, descrição e canonical do material (o HTML estático é o da página única). */
function applyHead(material: LocalizedMaterial) {
  document.title = `${material.seoTitle ?? material.title} | ${brand.name}`;
  let description = document.head.querySelector<HTMLMetaElement>('meta[name="description"]');
  if (!description) {
    description = document.createElement("meta");
    description.name = "description";
    document.head.append(description);
  }
  description.content = material.seoDescription ?? material.tagline;
  let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement("link");
    canonical.rel = "canonical";
    document.head.append(canonical);
  }
  canonical.href = new URL(localizePath(`/materiais/${material.slug}`, material.contentLocale), brand.url).toString();
}

/**
 * Material publicado depois do último build: o .htaccess serve esta página para
 * /materiais/<slug>/ quando não existe HTML pré-renderizado, e o material é
 * buscado no Supabase pelo navegador. No próximo build ele vira página estática.
 */
export function MaterialLoader({ locale }: { locale: Locale }) {
  const [state, setState] = useState<LoadState>({ status: "loading" });
  const { page } = getMaterialsUi(locale);

  useEffect(() => {
    let active = true;
    loadMaterial(locale).then((next) => {
      if (!active) return;
      if (next.status === "ready") applyHead(next.material);
      setState(next);
    });
    return () => {
      active = false;
    };
  }, [locale]);

  if (state.status === "ready") return <MaterialView material={state.material} locale={locale} />;

  return (
    <section aria-live="polite" className="mx-auto flex min-h-[60vh] max-w-3xl flex-col justify-center px-6 py-24">
      {state.status === "loading" ? (
        <p className="text-base text-fg-muted">{page.loading}</p>
      ) : (
        <>
          <h1 className="text-4xl font-bold tracking-tight text-ink">{page.notFoundTitle}</h1>
          <p className="mt-4 text-lg text-fg-muted">{page.notFoundText}</p>
          <Link
            href="/materiais"
            className="mt-8 inline-flex self-start rounded-xl bg-ink px-6 py-3.5 text-sm font-semibold text-paper focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark"
          >
            {page.back}
          </Link>
        </>
      )}
    </section>
  );
}
