import { legacyMaterials } from "@/content/materials-legacy";
import { getSupabase } from "@/lib/supabase/client";
import { legacyToItem } from "./legacy";
import { publicMaterialColumns, rowToMaterial } from "./rows";
import type { MaterialItem } from "./types";

// Materiais usados no build (catálogo, páginas pré-renderizadas, sitemap). Com o
// Supabase configurado, lê os publicados da tabela materials; sem ele (ou se não
// responder), usa content/materials-legacy.ts para o site continuar no ar.

let cached: Promise<readonly MaterialItem[]> | undefined;

async function load(): Promise<readonly MaterialItem[]> {
  // Mesma ordem do banco: maior "ordem no catálogo" primeiro (o legado está do menor para o maior).
  const local = legacyMaterials.map(legacyToItem).reverse();
  const supabase = getSupabase();
  if (!supabase) return local;
  try {
    const { data, error } = await supabase
      .from("materials")
      .select(publicMaterialColumns)
      .eq("status", "published")
      .order("sort_order", { ascending: false })
      .order("published_at", { ascending: false });
    if (error) throw error;
    return data.map(rowToMaterial);
  } catch (error) {
    const message =
      error && typeof error === "object" && "message" in error ? String(error.message) : String(error);
    console.warn(`[materiais] Supabase indisponível no build (${message.split("\n")[0]}); usando content/materials-legacy.ts.`);
    return local;
  }
}

/** Publicados, na ordem do admin. */
export function listMaterials(): Promise<readonly MaterialItem[]> {
  cached ??= load();
  return cached;
}

export async function getMaterialItem(slug: string): Promise<MaterialItem | undefined> {
  return (await listMaterials()).find((material) => material.slug === slug);
}
