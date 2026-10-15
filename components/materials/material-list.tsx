"use client";

import { useEffect, useState } from "react";
import { MaterialCard } from "@/components/ui/material-card";
import type { Locale } from "@/i18n/routing";
import { localizeMaterial, type LocalizedMaterial } from "@/lib/materials/localize";
import { publicMaterialColumns, rowToMaterial } from "@/lib/materials/rows";
import { getSupabase } from "@/lib/supabase/client";

/**
 * Catálogo do /materiais: começa com os materiais do build (HTML pronto para o
 * Google) e, depois do mount, troca pela lista atual do Supabase — assim um
 * material publicado no admin depois do build já aparece.
 */
export function MaterialList({
  initial,
  cta,
  emptyLabel,
  locale,
}: {
  initial: readonly LocalizedMaterial[];
  cta: string;
  emptyLabel: string;
  locale: Locale;
}) {
  const [materials, setMaterials] = useState(initial);

  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) return;
    let active = true;
    supabase
      .from("materials")
      .select(publicMaterialColumns)
      .eq("status", "published")
      .order("sort_order", { ascending: true })
      .order("published_at", { ascending: false })
      .then(({ data, error }) => {
        if (active && !error && data) setMaterials(data.map((row) => localizeMaterial(rowToMaterial(row), locale)));
      });
    return () => {
      active = false;
    };
  }, [locale]);

  if (materials.length === 0) return <p className="text-center text-base text-fg-muted">{emptyLabel}</p>;

  return (
    <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {materials.map((material) => (
        <li key={material.slug}>
          <MaterialCard material={material} cta={cta} />
        </li>
      ))}
    </ul>
  );
}
