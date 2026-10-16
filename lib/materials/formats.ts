import { getSupabase } from "@/lib/supabase/client";
import type { MaterialFormatRecord } from "@/lib/supabase/types";

// Formatos dos materiais (tabela material_formats, 0009), cadastrados no admin.

export type MaterialFormat = Pick<MaterialFormatRecord, "slug" | "name" | "name_en" | "sort_order">;

/** Formatos na ordem do cadastro (seletor do editor e tela de formatos do admin). */
export async function fetchMaterialFormats(): Promise<{ formats: MaterialFormat[]; error?: string }> {
  const supabase = getSupabase();
  if (!supabase) return { formats: [], error: "Supabase não configurado." };
  const { data, error } = await supabase
    .from("material_formats")
    .select("slug,name,name_en,sort_order")
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });
  return { formats: data ?? [], error: error?.message };
}
