import { legacyMaterials } from "@/content/materials-legacy";
import { buildQuery } from "@/lib/supabase/build-query";
import { getSupabase } from "@/lib/supabase/client";
import { legacyToItem } from "./legacy";
import { publicMaterialColumns, rowToMaterial } from "./rows";
import type { MaterialItem } from "./types";

// Materiais usados no build (catálogo, páginas pré-renderizadas, sitemap). Com o
// Supabase configurado, lê os publicados da tabela materials (se não responder, o
// build para com erro em vez de gerar páginas quebradas); sem ele, usa
// content/materials-legacy.ts.

let cached: Promise<readonly MaterialItem[]> | undefined;

async function load(): Promise<readonly MaterialItem[]> {
  // Mesma ordem do banco: maior "ordem no catálogo" primeiro (o legado está do menor para o maior).
  const local = legacyMaterials.map(legacyToItem).reverse();
  const supabase = getSupabase();
  if (!supabase) return local;
  const rows = await buildQuery("materiais", () =>
    supabase
      .from("materials")
      .select(publicMaterialColumns)
      .eq("status", "published")
      .order("sort_order", { ascending: false })
      .order("published_at", { ascending: false }),
  );
  return rows.map(rowToMaterial);
}

/** Publicados, na ordem do admin. */
export function listMaterials(): Promise<readonly MaterialItem[]> {
  cached ??= load();
  return cached;
}

export async function getMaterialItem(slug: string): Promise<MaterialItem | undefined> {
  return (await listMaterials()).find((material) => material.slug === slug);
}
