"use client";

import Link from "next/link";
import { Pause, Pencil, Play, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { popupState, popupStateLabel, popupWhen, popupWhere } from "@/lib/popups/admin";
import { getSupabase } from "@/lib/supabase/client";
import type { PopupRecord } from "@/lib/supabase/types";
import { adminPrimary } from "./admin-shell";
import { useAdminFeedback } from "./feedback";
import { IconAction, IconActions } from "./icon-action";

type Row = Pick<
  PopupRecord,
  "id" | "name" | "active" | "starts_at" | "ends_at" | "priority" | "locale" | "page_rule" | "page_paths" | "devices" | "trigger_type" | "trigger_value" | "image_url" | "updated_at"
>;
type Totals = Record<string, { views: number; clicks: number }>;

const number = new Intl.NumberFormat("pt-BR");
const percent = new Intl.NumberFormat("pt-BR", { style: "percent", maximumFractionDigits: 1 });

async function fetchRows(): Promise<{ rows: Row[]; totals: Totals; error?: string }> {
  const supabase = getSupabase();
  if (!supabase) return { rows: [], totals: {}, error: "Supabase não configurado." };
  const [popups, stats] = await Promise.all([
    supabase
      .from("popups")
      .select("id,name,active,starts_at,ends_at,priority,locale,page_rule,page_paths,devices,trigger_type,trigger_value,image_url,updated_at")
      .order("active", { ascending: false })
      .order("priority", { ascending: false })
      .order("updated_at", { ascending: false }),
    supabase.from("popup_daily_stats").select("popup_id,views,clicks"),
  ]);
  const totals: Totals = {};
  for (const stat of stats.data ?? []) {
    const total = (totals[stat.popup_id] ??= { views: 0, clicks: 0 });
    total.views += stat.views;
    total.clicks += stat.clicks;
  }
  return { rows: popups.data ?? [], totals, error: popups.error?.message ?? stats.error?.message };
}

/** Pop-ups de todos os estados, com resultados (exibições e cliques) e ações. */
export function PopupList() {
  const [rows, setRows] = useState<Row[]>();
  const [totals, setTotals] = useState<Totals>({});
  const [error, setError] = useState<string>();
  const [now, setNow] = useState(0);
  const { confirm, notify } = useAdminFeedback();

  useEffect(() => {
    let active = true;
    fetchRows().then((result) => {
      if (!active) return;
      setNow(Date.now());
      setRows(result.rows);
      setTotals(result.totals);
      setError(result.error);
    });
    return () => {
      active = false;
    };
  }, []);

  async function toggle(row: Row) {
    const supabase = getSupabase();
    if (!supabase) return;
    const { error: updateError } = await supabase.from("popups").update({ active: !row.active }).eq("id", row.id);
    if (updateError) return notify(`Não foi possível ${row.active ? "pausar" : "ligar"}: ${updateError.message}`, "error");
    setRows((current) => current?.map((r) => (r.id === row.id ? { ...r, active: !row.active } : r)));
    notify(row.active ? `"${row.name}" pausado: não aparece mais no site.` : `"${row.name}" ligado.`);
  }

  async function remove(row: Row) {
    const ok = await confirm({
      title: "Excluir pop-up?",
      description: (
        <>
          <strong className="font-semibold text-fg">{row.name}</strong> sai do site e os resultados dele (exibições e cliques) também
          são apagados. Não dá para desfazer. Para só tirar do ar, use Pausar.
        </>
      ),
    });
    if (!ok) return;
    const supabase = getSupabase();
    if (!supabase) return;
    const { error: deleteError } = await supabase.from("popups").delete().eq("id", row.id);
    if (deleteError) return notify(`Não foi possível excluir: ${deleteError.message}`, "error");
    const path = row.image_url?.split("/popup-images/")[1];
    if (path) await supabase.storage.from("popup-images").remove([decodeURIComponent(path)]);
    setRows((current) => current?.filter((r) => r.id !== row.id));
    notify(`Pop-up "${row.name}" excluído.`);
  }

  return (
    <section aria-labelledby="admin-popups">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 id="admin-popups" className="text-3xl font-bold tracking-tight text-ink">
            Pop-ups
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-fg-muted">
            Mudanças valem na hora, sem novo build. No máximo um pop-up por página; quando mais de um vale para a mesma página, aparece o
            de maior prioridade.
          </p>
        </div>
        <Link href="/admin/popups/editor/" className={adminPrimary}>
          Novo pop-up
        </Link>
      </div>

      {error && (
        <p role="alert" className="mt-6 text-sm font-medium text-brand-dark">
          {error}
        </p>
      )}

      {!rows ? (
        <p className="mt-8 text-sm text-fg-muted">Carregando…</p>
      ) : rows.length === 0 ? (
        <p className="mt-8 text-sm text-fg-muted">Nenhum pop-up ainda.</p>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-3xl border border-border bg-surface">
          <table className="w-full min-w-3xl text-left text-sm">
            <thead>
              <tr className="border-b border-border text-fg-muted">
                <th scope="col" className="px-5 py-3 font-semibold">Pop-up</th>
                <th scope="col" className="px-5 py-3 font-semibold">Situação</th>
                <th scope="col" className="px-5 py-3 text-right font-semibold">Exibições</th>
                <th scope="col" className="px-5 py-3 text-right font-semibold">Cliques</th>
                <th scope="col" className="px-5 py-3 font-semibold">
                  <span className="sr-only">Ações</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((row) => {
                const state = popupState(row, now);
                const total = totals[row.id] ?? { views: 0, clicks: 0 };
                return (
                  <tr key={row.id}>
                    <th scope="row" className="px-5 py-4 font-semibold text-ink">
                      {row.name}
                      <span className="mt-0.5 block text-xs font-normal text-fg-muted">
                        {popupWhere(row)} · {popupWhen(row)}
                      </span>
                    </th>
                    <td className="px-5 py-4">
                      <span className={`rounded-md px-2 py-1 text-xs font-semibold ${state === "active" ? "bg-ink text-paper" : "bg-bg text-fg-muted"}`}>
                        {popupStateLabel[state]}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right tabular-nums">{number.format(total.views)}</td>
                    <td className="px-5 py-4 text-right tabular-nums">
                      {number.format(total.clicks)}
                      {total.views > 0 && <span className="block text-xs text-fg-muted">{percent.format(total.clicks / total.views)}</span>}
                    </td>
                    <td className="px-5 py-4">
                      <IconActions>
                        <IconAction label="Editar" icon={Pencil} href={`/admin/popups/editor/?id=${row.id}`} />
                        {state !== "ended" && (
                          <IconAction label={row.active ? "Pausar" : "Ligar"} icon={row.active ? Pause : Play} onClick={() => toggle(row)} />
                        )}
                        <IconAction label="Excluir" icon={Trash2} tone="danger" onClick={() => remove(row)} />
                      </IconActions>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
