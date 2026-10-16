"use client";

import { useEffect, useMemo, useState } from "react";
import { MaterialCard } from "@/components/ui/material-card";
import type { Locale } from "@/i18n/routing";
import { cn } from "@/lib/cn";
import { localizeMaterial, type LocalizedMaterial } from "@/lib/materials/localize";
import { publicMaterialColumns, rowToMaterial } from "@/lib/materials/rows";
import { getSupabase } from "@/lib/supabase/client";

/** Parâmetro da URL com o formato escolhido (/materiais/?formato=planilha), para compartilhar o filtro. */
const formatParam = "formato";

type FormatOption = { slug: string; label: string; count: number; order: number };

/**
 * Catálogo do /materiais: começa com os materiais do build (HTML pronto para o
 * Google) e, depois do mount, troca pela lista atual do Supabase — assim um
 * material publicado no admin depois do build já aparece. Filtro por formato
 * com os formatos que têm material publicado.
 */
export function MaterialList({
  initial,
  cta,
  emptyLabel,
  filter,
  locale,
}: {
  initial: readonly LocalizedMaterial[];
  cta: string;
  emptyLabel: string;
  filter: { label: string; all: string };
  locale: Locale;
}) {
  const [materials, setMaterials] = useState(initial);
  const [selected, setSelected] = useState<string>();

  useEffect(() => {
    const supabase = getSupabase();
    let active = true;
    // Filtro vindo de um link compartilhado (só no navegador: o HTML do build mostra todos).
    const fromUrl = new URLSearchParams(window.location.search).get(formatParam);
    if (fromUrl) queueMicrotask(() => active && setSelected(fromUrl));
    supabase
      ?.from("materials")
      .select(publicMaterialColumns)
      .eq("status", "published")
      .order("sort_order", { ascending: false })
      .order("published_at", { ascending: false })
      .then(({ data, error }) => {
        if (active && !error && data) setMaterials(data.map((row) => localizeMaterial(rowToMaterial(row), locale)));
      });
    return () => {
      active = false;
    };
  }, [locale]);

  const options = useMemo(() => {
    const bySlug = new Map<string, FormatOption>();
    for (const material of materials) {
      if (!material.format) continue;
      const option = bySlug.get(material.format);
      if (option) option.count += 1;
      else bySlug.set(material.format, { slug: material.format, label: material.type, count: 1, order: material.formatOrder ?? 0 });
    }
    return [...bySlug.values()].sort((a, b) => a.order - b.order || a.label.localeCompare(b.label, locale));
  }, [materials, locale]);

  // Formato do link que não existe mais (ou sem material): mostra todos.
  const active = options.some((option) => option.slug === selected) ? selected : undefined;
  const visible = active ? materials.filter((material) => material.format === active) : materials;

  function choose(slug: string | undefined) {
    setSelected(slug);
    const url = new URL(window.location.href);
    if (slug) url.searchParams.set(formatParam, slug);
    else url.searchParams.delete(formatParam);
    window.history.replaceState(window.history.state, "", url);
  }

  if (materials.length === 0) return <p className="text-center text-base text-fg-muted">{emptyLabel}</p>;

  const chip = (slug: string | undefined, label: string, count: number) => (
    <button
      key={slug ?? "all"}
      type="button"
      aria-pressed={active === slug}
      onClick={() => choose(slug)}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2",
        active === slug ? "border-ink bg-ink text-paper" : "border-border bg-surface text-fg hover:border-fg-muted",
      )}
    >
      {label}
      <span className={cn("text-xs font-medium", active === slug ? "text-paper/70" : "text-fg-muted")}>{count}</span>
    </button>
  );

  return (
    <>
      {options.length > 1 && (
        <div role="group" aria-label={filter.label} className="mb-10 flex flex-wrap justify-center gap-2">
          {chip(undefined, filter.all, materials.length)}
          {options.map((option) => chip(option.slug, option.label, option.count))}
        </div>
      )}
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((material) => (
          <li key={material.slug}>
            <MaterialCard material={material} cta={cta} />
          </li>
        ))}
      </ul>
    </>
  );
}
