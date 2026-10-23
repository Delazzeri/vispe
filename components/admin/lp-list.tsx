"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { lpTemplateInfo } from "@/lib/lp/templates";
import { lpTemplates, type LpTemplate } from "@/lib/lp/types";
import { getSupabase } from "@/lib/supabase/client";
import type { LandingPageRecord, LandingPageStatus } from "@/lib/supabase/types";
import { adminInput, adminPrimary, adminSecondary } from "./admin-shell";
import { LanguageStatus } from "./language-tabs";

// has_en: só se existe tradução (en->sections), sem baixar o conteúdo inteiro.
type Row = Pick<LandingPageRecord, "id" | "slug" | "name" | "template" | "status" | "noindex" | "updated_at"> & {
  has_en: unknown;
};

export const lpStatusLabel: Record<LandingPageStatus, string> = { draft: "Rascunho", published: "Publicada" };

const templateLabel = (template: string) => lpTemplateInfo[template as LpTemplate]?.label ?? template;

async function fetchRows(): Promise<{ rows: Row[]; error?: string }> {
  const supabase = getSupabase();
  if (!supabase) return { rows: [], error: "Supabase não configurado." };
  const { data, error } = await supabase
    .from("landing_pages")
    .select("id,slug,name,template,status,noindex,updated_at,has_en:en->sections")
    .order("updated_at", { ascending: false });
  return { rows: data ?? [], error: error?.message };
}

/** Landing pages de todos os status, com busca, criação a partir dos modelos e ações. */
export function LpList() {
  const [rows, setRows] = useState<Row[]>();
  const [error, setError] = useState<string>();
  const [query, setQuery] = useState("");
  const [choosing, setChoosing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let active = true;
    fetchRows().then((result) => {
      if (!active) return;
      setRows(result.rows);
      setError(result.error);
    });
    return () => {
      active = false;
    };
  }, []);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (rows ?? []).filter((row) => !q || row.name.toLowerCase().includes(q) || row.slug.includes(q));
  }, [rows, query]);

  async function remove(row: Row) {
    if (!window.confirm(`Excluir a LP "${row.name}"? Não dá para desfazer e o endereço /lp/${row.slug}/ sai do ar.`)) return;
    const supabase = getSupabase();
    if (!supabase) return;
    const { error: deleteError } = await supabase.from("landing_pages").delete().eq("id", row.id);
    if (deleteError) return setError(deleteError.message);
    setRows((current) => current?.filter((r) => r.id !== row.id));
  }

  /** Cópia em rascunho, com slug livre (sufixo -copia, -copia-2…). */
  async function duplicate(row: Row) {
    const supabase = getSupabase();
    if (!supabase) return;
    const { data: full, error: readError } = await supabase.from("landing_pages").select("*").eq("id", row.id).single();
    if (readError || !full) return setError(readError?.message ?? "Não foi possível ler a LP.");
    const taken = new Set((rows ?? []).map((r) => r.slug));
    let slug = `${row.slug}-copia`.slice(0, 70);
    for (let n = 2; taken.has(slug); n++) slug = `${row.slug}-copia-${n}`.slice(0, 70);
    const { data: created, error: insertError } = await supabase
      .from("landing_pages")
      .insert({
        slug,
        name: `${row.name} (cópia)`,
        template: full.template,
        sections: full.sections,
        meta_title: full.meta_title,
        meta_description: full.meta_description,
        og_image_url: full.og_image_url,
        noindex: full.noindex,
        whatsapp_message: full.whatsapp_message,
        en: full.en,
        status: "draft",
      })
      .select("id")
      .single();
    if (insertError || !created) return setError(insertError?.message ?? "Não foi possível duplicar.");
    router.push(`/admin/landing-pages/editor/?id=${created.id}`);
  }

  return (
    <section aria-labelledby="admin-lps">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 id="admin-lps" className="text-3xl font-bold tracking-tight text-ink">
            Landing pages
          </h1>
          <p className="mt-1 text-sm text-fg-muted">
            Publicadas abrem na hora em /lp/&lt;endereço&gt;/; no próximo build viram página estática, com prévia certa no WhatsApp.
          </p>
        </div>
        <button type="button" onClick={() => setChoosing((open) => !open)} aria-expanded={choosing} className={adminPrimary}>
          Nova landing page
        </button>
      </div>

      {choosing && (
        <div className="mt-6 rounded-3xl border border-border bg-surface p-6">
          <h2 className="text-base font-semibold text-ink">Escolha o modelo</h2>
          <p className="mt-1 text-sm text-fg-muted">O modelo é só o ponto de partida: dá para tirar, acrescentar e reordenar seções.</p>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {lpTemplates.map((template) => (
              <li key={template}>
                <Link
                  href={`/admin/landing-pages/editor/?modelo=${template}`}
                  className="block h-full rounded-2xl border border-border p-4 transition-colors hover:border-fg/30 hover:bg-bg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark"
                >
                  <span className="block text-sm font-semibold text-ink">{lpTemplateInfo[template].label}</span>
                  <span className="mt-1 block text-sm text-fg-muted">{lpTemplateInfo[template].description}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      <label className="mt-8 block max-w-sm text-sm font-medium text-fg">
        Buscar
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Nome ou endereço"
          className={adminInput}
        />
      </label>

      {error && (
        <p role="alert" className="mt-6 text-sm font-medium text-brand-dark">
          {error}
        </p>
      )}

      {!rows ? (
        <p className="mt-8 text-sm text-fg-muted">Carregando…</p>
      ) : visible.length === 0 ? (
        <p className="mt-8 text-sm text-fg-muted">Nenhuma landing page ainda.</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-3xl border border-border bg-surface">
          <table className="w-full min-w-2xl text-left text-sm">
            <thead>
              <tr className="border-b border-border text-fg-muted">
                <th scope="col" className="px-5 py-3 font-semibold">Landing page</th>
                <th scope="col" className="px-5 py-3 font-semibold">Status</th>
                <th scope="col" className="px-5 py-3 font-semibold">Idiomas</th>
                <th scope="col" className="px-5 py-3 font-semibold">
                  <span className="sr-only">Ações</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {visible.map((row) => (
                <tr key={row.id}>
                  <th scope="row" className="px-5 py-4 font-semibold text-ink">
                    {row.name}
                    <span className="mt-0.5 block text-xs font-normal text-fg-muted">
                      {templateLabel(row.template)} · /lp/{row.slug}/{row.noindex ? " · fora do Google" : ""}
                    </span>
                  </th>
                  <td className="px-5 py-4">
                    <span
                      className={`rounded-md px-2 py-1 text-xs font-semibold ${
                        row.status === "published" ? "bg-ink text-paper" : "bg-bg text-fg-muted"
                      }`}
                    >
                      {lpStatusLabel[row.status]}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <LanguageStatus pt en={Boolean(row.has_en && typeof row.has_en === "object" && Object.keys(row.has_en).length)} />
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/landing-pages/editor/?id=${row.id}`} className={adminSecondary}>
                        Editar
                      </Link>
                      {row.status === "published" && (
                        <a href={`/lp/${row.slug}/`} target="_blank" rel="noopener" className={adminSecondary}>
                          Ver
                        </a>
                      )}
                      <button type="button" onClick={() => duplicate(row)} className={adminSecondary}>
                        Duplicar
                      </button>
                      <button type="button" onClick={() => remove(row)} className={adminSecondary}>
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
