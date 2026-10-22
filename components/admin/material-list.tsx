"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getSupabase } from "@/lib/supabase/client";
import type { MaterialRecord, MaterialStatus } from "@/lib/supabase/types";
import { adminInput, adminPrimary, adminSecondary } from "./admin-shell";
import { CoverOptimizer } from "./cover-optimizer";
import { LanguageStatus } from "./language-tabs";

// en_title: só o título da tradução (en->>title), sem baixar o texto em inglês inteiro.
type Row = Pick<MaterialRecord, "id" | "slug" | "title" | "type" | "status" | "sort_order" | "file_name" | "updated_at"> & {
  en_title: string | null;
};

export const materialStatusLabel: Record<MaterialStatus, string> = { draft: "Rascunho", published: "Publicado" };

async function fetchRows(): Promise<{ rows: Row[]; error?: string }> {
  const supabase = getSupabase();
  if (!supabase) return { rows: [], error: "Supabase não configurado." };
  const { data, error } = await supabase
    .from("materials")
    .select("id,slug,title,type,status,sort_order,file_name,updated_at,en_title:en->>title")
    .order("sort_order", { ascending: false })
    .order("updated_at", { ascending: false });
  return { rows: data ?? [], error: error?.message };
}

/** Materiais gratuitos de todos os status, com busca e ações. */
export function MaterialList() {
  const [rows, setRows] = useState<Row[]>();
  const [error, setError] = useState<string>();
  const [query, setQuery] = useState("");

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
    return (rows ?? []).filter((row) => !q || row.title.toLowerCase().includes(q) || row.slug.includes(q));
  }, [rows, query]);

  async function remove(row: Row) {
    if (!window.confirm(`Excluir "${row.title}"? Não dá para desfazer. O arquivo enviado também sai do ar.`)) return;
    const supabase = getSupabase();
    if (!supabase) return;
    const { data: full } = await supabase.from("materials").select("file_path").eq("id", row.id).maybeSingle();
    const { error: deleteError } = await supabase.from("materials").delete().eq("id", row.id);
    if (deleteError) return setError(deleteError.message);
    if (full?.file_path) await supabase.storage.from("material-files").remove([full.file_path]);
    setRows((current) => current?.filter((r) => r.id !== row.id));
  }

  return (
    <section aria-labelledby="admin-materials">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 id="admin-materials" className="text-3xl font-bold tracking-tight text-ink">
            Materiais gratuitos
          </h1>
          <p className="mt-1 text-sm text-fg-muted">
            Publicados aparecem no site na hora; quem preenche o formulário recebe por e-mail um link que expira.
          </p>
        </div>
        <div className="flex items-start gap-2">
          <CoverOptimizer />
          <Link href="/admin/materiais/formatos/" className={adminSecondary}>
            Formatos
          </Link>
          <Link href="/admin/materiais/editor/" className={adminPrimary}>
            Novo material
          </Link>
        </div>
      </div>

      <label className="mt-8 block max-w-sm text-sm font-medium text-fg">
        Buscar
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Título ou slug"
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
        <p className="mt-8 text-sm text-fg-muted">Nenhum material.</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-3xl border border-border bg-surface">
          <table className="w-full min-w-2xl text-left text-sm">
            <thead>
              <tr className="border-b border-border text-fg-muted">
                <th scope="col" className="px-5 py-3 font-semibold">Material</th>
                <th scope="col" className="px-5 py-3 font-semibold">Status</th>
                <th scope="col" className="px-5 py-3 font-semibold">Idiomas</th>
                <th scope="col" className="px-5 py-3 font-semibold">Arquivo</th>
                <th scope="col" className="px-5 py-3 font-semibold">
                  <span className="sr-only">Ações</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {visible.map((row) => (
                <tr key={row.id}>
                  <th scope="row" className="px-5 py-4 font-semibold text-ink">
                    {row.title}
                    <span className="mt-0.5 block text-xs font-normal text-fg-muted">
                      {row.type} · /materiais/{row.slug}/ · ordem {row.sort_order}
                    </span>
                  </th>
                  <td className="px-5 py-4">
                    <span
                      className={`rounded-md px-2 py-1 text-xs font-semibold ${
                        row.status === "published" ? "bg-ink text-paper" : "bg-bg text-fg-muted"
                      }`}
                    >
                      {materialStatusLabel[row.status]}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <LanguageStatus pt={Boolean(row.title.trim())} en={Boolean(row.en_title)} />
                  </td>
                  <td className="px-5 py-4 text-fg-muted">
                    {row.file_name ?? <span className="font-medium text-brand-dark">Sem arquivo</span>}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/materiais/editor/?id=${row.id}`} className={adminSecondary}>
                        Editar
                      </Link>
                      {row.status === "published" && (
                        <a href={`/materiais/${row.slug}/`} target="_blank" rel="noopener" className={adminSecondary}>
                          Ver
                        </a>
                      )}
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
