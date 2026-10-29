"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { auditActionLabel, auditChangedLabels, auditEntities, isAuditEntity, type AuditEntity } from "@/lib/audit/labels";
import { getSupabase } from "@/lib/supabase/client";
import type { AuditAction, AuditLogRecord } from "@/lib/supabase/types";
import { adminInput, adminSecondary } from "./admin-shell";

const pageSize = 50;
const when = new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" });

const actionBadge: Record<AuditAction, string> = {
  insert: "border border-border text-fg",
  update: "bg-bg text-fg",
  delete: "bg-ink text-paper",
};

type Filters = { entity: AuditEntity | ""; action: AuditAction | "" };

async function fetchPage(filters: Filters, before?: number): Promise<{ rows: AuditLogRecord[]; error?: string }> {
  const supabase = getSupabase();
  if (!supabase) return { rows: [], error: "Supabase não configurado." };
  let query = supabase.from("admin_audit_log").select("*").order("id", { ascending: false }).limit(pageSize);
  if (filters.entity) query = query.eq("entity", filters.entity);
  if (filters.action) query = query.eq("action", filters.action);
  if (before) query = query.lt("id", before);
  const { data, error } = await query;
  return { rows: data ?? [], error: error?.message };
}

/** Registro de atividades do admin: só leitura, mais recentes primeiro. */
export function AuditLog() {
  const [filters, setFilters] = useState<Filters>({ entity: "", action: "" });
  const [rows, setRows] = useState<AuditLogRecord[]>();
  const [more, setMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  useEffect(() => {
    let active = true;
    fetchPage(filters).then((result) => {
      if (!active) return;
      setRows(result.rows);
      setMore(result.rows.length === pageSize);
      setError(result.error);
    });
    return () => {
      active = false;
    };
  }, [filters]);

  async function loadMore() {
    const last = rows?.at(-1);
    if (!last) return;
    setLoading(true);
    const result = await fetchPage(filters, last.id);
    setLoading(false);
    setRows((current) => [...(current ?? []), ...result.rows]);
    setMore(result.rows.length === pageSize);
    setError(result.error);
  }

  function filter(next: Partial<Filters>) {
    setRows(undefined);
    setFilters((current) => ({ ...current, ...next }));
  }

  return (
    <section aria-labelledby="admin-audit">
      <h1 id="admin-audit" className="text-3xl font-bold tracking-tight text-ink">
        Registro de atividades
      </h1>
      <p className="mt-1 max-w-2xl text-sm text-fg-muted">
        Tudo o que é criado, editado ou excluído no admin, gravado automaticamente pelo banco. Ninguém consegue alterar ou apagar este
        registro pelo admin.
      </p>

      <div className="mt-6 flex flex-wrap gap-4">
        <label className="text-sm font-medium text-fg">
          Item
          <select value={filters.entity} onChange={(e) => filter({ entity: isAuditEntity(e.target.value) ? e.target.value : "" })} className={adminInput}>
            <option value="">Todos</option>
            {Object.entries(auditEntities).map(([key, entity]) => (
              <option key={key} value={key}>
                {entity.label}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm font-medium text-fg">
          Ação
          <select value={filters.action} onChange={(e) => filter({ action: e.target.value as AuditAction | "" })} className={adminInput}>
            <option value="">Todas</option>
            {Object.entries(auditActionLabel).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {error && (
        <p role="alert" className="mt-6 text-sm font-medium text-brand-dark">
          {error}
        </p>
      )}

      {!rows ? (
        <p className="mt-8 text-sm text-fg-muted">Carregando…</p>
      ) : rows.length === 0 ? (
        <p className="mt-8 text-sm text-fg-muted">Nenhuma atividade registrada{filters.entity || filters.action ? " com esses filtros" : " ainda"}.</p>
      ) : (
        <>
          <div className="mt-8 overflow-x-auto rounded-3xl border border-border bg-surface">
            <table className="w-full min-w-3xl text-left text-sm">
              <thead>
                <tr className="border-b border-border text-fg-muted">
                  <th scope="col" className="px-5 py-3 font-semibold">Quando</th>
                  <th scope="col" className="px-5 py-3 font-semibold">Quem</th>
                  <th scope="col" className="px-5 py-3 font-semibold">Ação</th>
                  <th scope="col" className="px-5 py-3 font-semibold">Item</th>
                  <th scope="col" className="px-5 py-3 font-semibold">Detalhes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rows.map((row) => (
                  <AuditRow key={row.id} row={row} />
                ))}
              </tbody>
            </table>
          </div>
          {more && (
            <button type="button" onClick={loadMore} disabled={loading} className={`${adminSecondary} mt-6`}>
              {loading ? "Carregando…" : "Carregar mais"}
            </button>
          )}
        </>
      )}
    </section>
  );
}

function AuditRow({ row }: { row: AuditLogRecord }) {
  const entity = isAuditEntity(row.entity) ? auditEntities[row.entity] : undefined;
  const label = row.record_label || "(sem nome)";
  const editor = entity?.editor && row.action !== "delete" ? `${entity.editor}${row.record_id}` : undefined;
  return (
    <tr className="align-top">
      <td className="px-5 py-4 whitespace-nowrap tabular-nums text-fg-muted">{when.format(new Date(row.at))}</td>
      <td className="px-5 py-4">{row.actor_email ?? <span className="text-fg-muted">Banco de dados / sistema</span>}</td>
      <td className="px-5 py-4">
        <span className={`rounded-md px-2 py-1 text-xs font-semibold whitespace-nowrap ${actionBadge[row.action]}`}>{auditActionLabel[row.action]}</span>
      </td>
      <td className="px-5 py-4">
        <span className="block text-xs text-fg-muted">{entity?.label ?? row.entity}</span>
        {editor ? (
          <Link href={editor} className="font-semibold text-ink underline-offset-2 hover:underline">
            {label}
          </Link>
        ) : (
          <span className="font-semibold text-ink">{label}</span>
        )}
      </td>
      <td className="px-5 py-4 text-fg-muted">
        {row.action === "update" && row.changed_fields.length > 0 && <>Mudou: {auditChangedLabels(row.changed_fields).join(", ")}</>}
        {row.action === "delete" && row.before !== null && (
          <details>
            <summary className="cursor-pointer rounded-sm text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark">
              Ver dados apagados
            </summary>
            <pre className="mt-2 max-h-64 max-w-md overflow-auto rounded-xl bg-bg p-3 text-xs whitespace-pre-wrap text-fg">
              {JSON.stringify(row.before, null, 2)}
            </pre>
          </details>
        )}
      </td>
    </tr>
  );
}
