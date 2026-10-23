import { buildQuery } from "@/lib/supabase/build-query";
import { getSupabase } from "@/lib/supabase/client";
import { publicLandingPageColumns, rowToLandingPage } from "./rows";
import type { LandingPage } from "./types";

// LPs publicadas, lidas no build (páginas pré-renderizadas e sitemap). Como no
// blog e nos materiais, se o Supabase não responder o build para com erro. As
// publicadas depois do build abrem pela página única /lp/pagina/.

let cached: Promise<readonly LandingPage[]> | undefined;

async function load(): Promise<readonly LandingPage[]> {
  const supabase = getSupabase();
  if (!supabase) return [];
  const rows = await buildQuery("landing pages", () =>
    supabase
      .from("landing_pages")
      .select(publicLandingPageColumns)
      .eq("status", "published")
      .order("published_at", { ascending: false }),
  );
  return rows.map(rowToLandingPage);
}

export function listLandingPages(): Promise<readonly LandingPage[]> {
  cached ??= load();
  return cached;
}

export async function getLandingPage(slug: string): Promise<LandingPage | undefined> {
  return (await listLandingPages()).find((page) => page.slug === slug);
}
