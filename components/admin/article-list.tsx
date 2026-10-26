"use client";

import Link from "next/link";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { getSupabase } from "@/lib/supabase/client";
import type { ArticleRecord, ArticleStatus } from "@/lib/supabase/types";
import { adminInput, adminPrimary } from "./admin-shell";
import { useAdminFeedback } from "./feedback";
import { IconAction, IconActions } from "./icon-action";
import { LanguageStatus } from "./language-tabs";

// en_title: só o título da tradução (en->>title), sem baixar o texto em inglês inteiro.
type Row = Pick<ArticleRecord, "id" | "slug" | "title" | "status" | "published_at" | "updated_at"> & {
  en_title: string | null;
};

export const statusLabel: Record<ArticleStatus, string> = {
  draft: "Rascunho",
  scheduled: "Agendado",
  published: "Publicado",
};

const statusClass: Record<ArticleStatus, string> = {
  draft: "bg-bg text-fg-muted",
  scheduled: "bg-accent-soft/60 text-fg",
  published: "bg-ink text-paper",
};

const dateTime = new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" });

async function fetchRows(): Promise<{ rows: Row[]; error?: string }> {
  const supabase = getSupabase();
  if (!supabase) return { rows: [], error: "Supabase não configurado." };
  const { data, error } = await supabase
    .from("articles")
    .select("id,slug,title,status,published_at,updated_at,en_title:en->>title")
    .order("updated_at", { ascending: false });
  return { rows: data ?? [], error: error?.message };
}

/** Artigos de todos os status, com busca e ações (editar, ver no site, excluir). */
export function ArticleList() {
  const [rows, setRows] = useState<Row[]>();
  const [error, setError] = useState<string>();
  const [query, setQuery] = useState("");
  const { confirm, notify } = useAdminFeedback();

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
    const ok = await confirm({
      title: "Excluir artigo?",
      description: (
        <>
          <strong className="font-semibold text-fg">{row.title}</strong> sai do blog e do admin. Não dá para desfazer.
        </>
      ),
    });
    if (!ok) return;
    const { error: deleteError } = await getSupabase()!.from("articles").delete().eq("id", row.id);
    if (deleteError) return notify(`Não foi possível excluir: ${deleteError.message}`, "error");
    setRows((current) => current?.filter((r) => r.id !== row.id));
    notify(`Artigo "${row.title}" excluído.`);
  }

  return (
    <section aria-labelledby="admin-articles">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 id="admin-articles" className="text-3xl font-bold tracking-tight text-ink">
            Artigos
          </h1>
          <p className="mt-1 text-sm text-fg-muted">
            Publicados aparecem no site na hora; viram página estática no próximo build.
          </p>
        </div>
        <Link href="/admin/editor/" className={adminPrimary}>
          Novo artigo
        </Link>
      </div>

      <label className="mt-8 block max-w-sm text-sm font-medium text-fg">
        Buscar
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
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
        <p className="mt-8 text-sm text-fg-muted">Nenhum artigo.</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-3xl border border-border bg-surface">
          <table className="w-full min-w-2xl text-left text-sm">
            <thead>
              <tr className="border-b border-border text-fg-muted">
                <th scope="col" className="px-5 py-3 font-semibold">Título</th>
                <th scope="col" className="px-5 py-3 font-semibold">Status</th>
                <th scope="col" className="px-5 py-3 font-semibold">Idiomas</th>
                <th scope="col" className="px-5 py-3 font-semibold">Publicação</th>
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
                    <span className="mt-0.5 block text-xs font-normal text-fg-muted">/blog/{row.slug}/</span>
                  </th>
                  <td className="px-5 py-4">
                    <span className={`rounded-md px-2 py-1 text-xs font-semibold ${statusClass[row.status]}`}>
                      {statusLabel[row.status]}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <LanguageStatus pt={Boolean(row.title.trim())} en={Boolean(row.en_title)} />
                  </td>
                  <td className="px-5 py-4 text-fg-muted">
                    {row.published_at ? dateTime.format(new Date(row.published_at)) : "—"}
                  </td>
                  <td className="px-5 py-4">
                    <IconActions>
                      <IconAction label="Editar" icon={Pencil} href={`/admin/editor/?id=${row.id}`} />
                      {row.status !== "draft" && <IconAction label="Ver no site" icon={Eye} href={`/blog/${row.slug}/`} external />}
                      <IconAction label="Excluir" icon={Trash2} tone="danger" onClick={() => remove(row)} />
                    </IconActions>
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
