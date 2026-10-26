"use client";

import { ArrowDownRight, ArrowUpRight, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  change,
  fetchSiteAnalytics,
  fillSeries,
  formatBucket,
  formatCount,
  formatDuration,
  metricRanges,
  type ListName,
  type MetricRange,
  type SiteAnalytics,
} from "@/lib/analytics/metrics";
import { cn } from "@/lib/cn";
import { adminSecondary } from "./admin-shell";
import { BarList, VisitsChart } from "./metrics-charts";

type Load = { status: "loading" } | { status: "error"; message: string } | { status: "ready"; data: SiteAnalytics };

const percent = new Intl.NumberFormat("pt-BR", { style: "percent", maximumFractionDigits: 1 });
const signed = new Intl.NumberFormat("pt-BR", { style: "percent", maximumFractionDigits: 0, signDisplay: "exceptZero" });

/** Painel /admin/metricas/: visitas anônimas do Umami (via Edge Function site-analytics). */
export function MetricsDashboard() {
  const [range, setRange] = useState<MetricRange>("30d");
  const [load, setLoad] = useState<Load>({ status: "loading" });

  const refresh = useCallback((next: MetricRange) => {
    setLoad({ status: "loading" });
    fetchSiteAnalytics(next).then(
      (data) => setLoad({ status: "ready", data }),
      (problem: unknown) => setLoad({ status: "error", message: problem instanceof Error ? problem.message : "Erro ao carregar as métricas." }),
    );
  }, []);

  useEffect(() => {
    let current = true;
    fetchSiteAnalytics(range).then(
      (data) => current && setLoad({ status: "ready", data }),
      (problem: unknown) =>
        current && setLoad({ status: "error", message: problem instanceof Error ? problem.message : "Erro ao carregar as métricas." }),
    );
    return () => {
      current = false;
    };
  }, [range]);

  const chooseRange = (next: MetricRange) => {
    if (next === range) return;
    setLoad({ status: "loading" });
    setRange(next);
  };

  const data = load.status === "ready" ? load.data : null;
  const previousLabel = metricRanges.find((item) => item.id === range)?.previous ?? "";

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-ink">Métricas do site</h1>
          <p className="mt-1 text-sm text-fg-muted">
            Visitas contadas pelo Umami, de forma anônima e sem cookies, em todos os visitantes.
            {data && ` Atualizado às ${new Date(data.generatedAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}.`}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div role="group" aria-label="Período" className="flex rounded-xl border border-border bg-surface p-1">
            {metricRanges.map((item) => (
              <button
                key={item.id}
                type="button"
                aria-pressed={range === item.id}
                onClick={() => chooseRange(item.id)}
                className={cn(
                  "whitespace-nowrap rounded-lg px-2.5 py-1.5 text-sm font-medium sm:px-3 text-fg-muted transition-colors hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark",
                  range === item.id && "bg-ink text-paper hover:text-paper",
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
          <button type="button" onClick={() => refresh(range)} className={adminSecondary} aria-label="Atualizar" title="Atualizar">
            <RefreshCw aria-hidden className={cn("h-4 w-4", load.status === "loading" && "animate-spin")} />
          </button>
        </div>
      </div>

      {load.status === "error" && (
        <div role="alert" className="mt-8 rounded-2xl border border-border bg-surface p-6 text-sm">
          <p className="font-semibold text-fg">Não foi possível carregar as métricas.</p>
          <p className="mt-1 text-fg-muted">{load.message}</p>
        </div>
      )}

      {load.status === "loading" && <p className="mt-8 text-sm text-fg-muted">Carregando métricas…</p>}

      {data && <Report data={data} previousLabel={previousLabel} />}
    </div>
  );
}

function Report({ data, previousLabel }: { data: SiteAnalytics; previousLabel: string }) {
  const points = useMemo(() => fillSeries(data), [data]);
  const { totals, previous } = data;
  const rate = (t: typeof totals) => (t.visits ? t.bounces / t.visits : 0);
  const avgTime = (t: typeof totals) => (t.visits ? t.totaltime / t.visits : 0);
  const conversions = data.lists.events.reduce((sum, row) => sum + row.value, 0);

  return (
    <>
      <section aria-label="Resumo do período" className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        <Stat label="Visitantes" value={formatCount(totals.visitors)} delta={change(totals.visitors, previous.visitors)} previousLabel={previousLabel} />
        <Stat label="Visitas" value={formatCount(totals.visits)} delta={change(totals.visits, previous.visits)} previousLabel={previousLabel} />
        <Stat
          label="Páginas vistas"
          value={formatCount(totals.pageviews)}
          delta={change(totals.pageviews, previous.pageviews)}
          previousLabel={previousLabel}
        />
        <Stat
          label="Saíram sem navegar"
          hint="Visitas com uma página só (taxa de rejeição)"
          value={percent.format(rate(totals))}
          delta={change(rate(totals), rate(previous))}
          upIsGood={false}
          previousLabel={previousLabel}
        />
        <Stat
          label="Tempo por visita"
          value={formatDuration(avgTime(totals))}
          delta={change(avgTime(totals), avgTime(previous))}
          previousLabel={previousLabel}
        />
        <Stat label="Online agora" hint="Visitantes nos últimos 5 minutos" value={formatCount(data.active)} />
      </section>

      <Card title="Visitas no período" className="mt-3">
        <VisitsChart points={points} unit={data.unit} timeZone={data.timezone} />
        <details className="mt-3 text-sm">
          <summary className="cursor-pointer rounded-sm text-fg-muted hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark">
            Ver em tabela
          </summary>
          <div className="mt-3 max-h-72 overflow-auto">
            <table className="w-full text-left">
              <thead className="text-fg-muted">
                <tr>
                  <th className="py-1 font-medium">Período</th>
                  <th className="py-1 text-right font-medium">Visitas</th>
                  <th className="py-1 text-right font-medium">Páginas vistas</th>
                </tr>
              </thead>
              <tbody className="tabular-nums">
                {points.map((point) => (
                  <tr key={point.key} className="border-t border-border">
                    <td className="py-1">{formatBucket(point, data.unit, data.timezone, true)}</td>
                    <td className="py-1 text-right">{formatCount(point.visits)}</td>
                    <td className="py-1 text-right">{formatCount(point.pageviews)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      </Card>

      <h2 className="mt-10 text-lg font-bold text-ink">Conversões</h2>
      <p className="mt-1 text-sm text-fg-muted">
        {formatCount(conversions)} no período: envios de formulário e cliques no WhatsApp, contados sem nenhum dado pessoal.
      </p>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <ListCard title="Por tipo" list="events" data={data} empty="Nenhuma conversão no período." />
        <ListCard title="Por formulário ou página" list="conversionSources" data={data} empty="Nenhuma conversão no período." />
      </div>

      <h2 className="mt-10 text-lg font-bold text-ink">Conteúdo</h2>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <ListCard title="Páginas mais vistas" list="pages" data={data} />
        <ListCard title="Por onde entraram" hint="Primeira página da visita" list="entries" data={data} />
      </div>

      <h2 className="mt-10 text-lg font-bold text-ink">De onde vieram</h2>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <ListCard title="Canais" list="channels" data={data} />
        <ListCard title="Sites de origem" list="referrers" data={data} empty="Sem visitas vindas de outros sites." />
      </div>
      <div className="mt-3 grid gap-3 md:grid-cols-3">
        <ListCard title="Campanhas (utm_campaign)" list="utmCampaign" data={data} empty="Sem links com UTM no período." />
        <ListCard title="Origem (utm_source)" list="utmSource" data={data} empty="Sem links com UTM no período." />
        <ListCard title="Mídia (utm_medium)" list="utmMedium" data={data} empty="Sem links com UTM no período." />
      </div>

      <h2 className="mt-10 text-lg font-bold text-ink">Localização</h2>
      <p className="mt-1 text-sm text-fg-muted">Aproximada, a partir da rede de quem visita. Visitantes únicos.</p>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <ListCard title="Países" list="countries" data={data} />
        <ListCard title="Estados e regiões" list="regions" data={data} />
        <ListCard title="Cidades" list="cities" data={data} />
      </div>

      <h2 className="mt-10 text-lg font-bold text-ink">Aparelhos</h2>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <ListCard title="Tipo de aparelho" list="devices" data={data} />
        <ListCard title="Navegador" list="browsers" data={data} />
        <ListCard title="Sistema" list="os" data={data} />
      </div>
    </>
  );
}

type StatProps = { label: string; hint?: string; value: string; delta?: number | null; upIsGood?: boolean; previousLabel?: string };

function Stat({ label, hint, value, delta, upIsGood = true, previousLabel }: StatProps) {
  const hasDelta = typeof delta === "number" && Number.isFinite(delta) && Math.abs(delta) >= 0.005;
  const up = hasDelta && delta > 0;
  const good = up === upIsGood;
  return (
    <div className="rounded-2xl border border-border bg-surface p-4" title={[hint, hasDelta ? previousLabel : undefined].filter(Boolean).join(". ") || undefined}>
      <p className="text-xs font-medium text-fg-muted">{label}</p>
      <p className="mt-2 text-2xl font-semibold tracking-tight text-fg">{value}</p>
      {hasDelta ? (
        <p className="mt-1 flex items-center gap-1 text-xs text-fg-muted">
          {up ? <ArrowUpRight aria-hidden className="h-3.5 w-3.5" /> : <ArrowDownRight aria-hidden className="h-3.5 w-3.5" />}
          <span className={cn("font-semibold", good ? "text-fg" : "text-brand-dark")}>{signed.format(delta)}</span>
          <span className="sr-only">{good ? "(melhor)" : "(pior)"}</span>
          <span>vs. período anterior</span>
        </p>
      ) : (
        delta !== undefined && <p className="mt-1 text-xs text-fg-muted">Sem comparação</p>
      )}
    </div>
  );
}

function Card({ title, hint, className, children }: { title: string; hint?: string; className?: string; children: ReactNode }) {
  return (
    <section className={cn("rounded-2xl border border-border bg-surface p-5", className)}>
      <h3 className="text-sm font-semibold text-fg">{title}</h3>
      {hint && <p className="text-xs text-fg-muted">{hint}</p>}
      <div className="mt-4">{children}</div>
    </section>
  );
}

function ListCard({ title, hint, list, data, empty }: { title: string; hint?: string; list: ListName; data: SiteAnalytics; empty?: string }) {
  return (
    <Card title={title} hint={hint}>
      <BarList list={list} rows={data.lists[list] ?? []} empty={empty} />
    </Card>
  );
}
