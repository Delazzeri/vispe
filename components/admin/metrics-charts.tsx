"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { formatBucket, formatCount, rowLabel, type ListName, type MetricRow, type MetricUnit, type SeriesPoint } from "@/lib/analytics/metrics";

// Gráficos do painel de métricas, em SVG próprio (sem biblioteca): uma linha de
// visitas no tempo e listas em barra. Uma cor só (dourado escuro), marcas finas,
// grade discreta; o número fica sempre em texto, nunca só na cor.

const HEIGHT = 240;
const PAD = { top: 16, right: 16, bottom: 28, left: 44 };

/** Marcas do eixo em passos "redondos" (1, 2, 2,5, 5 × 10ⁿ), no máximo 5 intervalos, com o teto logo acima do maior valor. */
function scale(max: number): number[] {
  if (max <= 0) return [0, 1, 2, 3, 4];
  const power = Math.max(1, 10 ** Math.floor(Math.log10(max / 5)));
  // Contagens são inteiras: passo nunca fracionado.
  const step = [1, 2, 2.5, 5, 10].map((m) => m * power).find((s) => Number.isInteger(s) && Math.ceil(max / s) <= 5) ?? 10 * power;
  const count = Math.max(1, Math.ceil(max / step));
  return Array.from({ length: count + 1 }, (_, i) => i * step);
}

function useWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return [ref, width] as const;
}

type VisitsChartProps = { points: SeriesPoint[]; unit: MetricUnit; timeZone: string };

/** Visitas por hora/dia/mês; passar o mouse (ou as setas do teclado) mostra visitas e visualizações. */
export function VisitsChart({ points, unit, timeZone }: VisitsChartProps) {
  const [ref, width] = useWidth<HTMLDivElement>();
  const [active, setActive] = useState<number | null>(null);

  const ticks = scale(Math.max(0, ...points.map((p) => p.visits)));
  const top = ticks[ticks.length - 1] || 1;
  const innerW = Math.max(0, width - PAD.left - PAD.right);
  const innerH = HEIGHT - PAD.top - PAD.bottom;
  const x = (i: number) => PAD.left + (points.length > 1 ? (i / (points.length - 1)) * innerW : innerW / 2);
  const y = (value: number) => PAD.top + innerH - (value / top) * innerH;

  const line = points.map((p, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(p.visits).toFixed(1)}`).join("");
  const area = points.length ? `${line}L${x(points.length - 1).toFixed(1)},${y(0)}L${x(0).toFixed(1)},${y(0)}Z` : "";

  // Rótulos do eixo x: no máximo ~6, sem encostar.
  const labelEvery = Math.max(1, Math.ceil(points.length / Math.max(2, Math.floor(innerW / 90))));

  function pick(event: PointerEvent<SVGSVGElement>) {
    const box = event.currentTarget.getBoundingClientRect();
    const position = event.clientX - box.left - PAD.left;
    const index = points.length > 1 ? Math.round((position / innerW) * (points.length - 1)) : 0;
    setActive(Math.min(points.length - 1, Math.max(0, index)));
  }

  function keys(event: KeyboardEvent<SVGSVGElement>) {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const step = event.key === "ArrowRight" ? 1 : -1;
    setActive((current) => Math.min(points.length - 1, Math.max(0, (current ?? (step > 0 ? -1 : points.length)) + step)));
  }

  const point = active === null ? null : points[active];
  const lastIndex = points.length - 1;

  return (
    <div ref={ref} className="relative">
      {width > 0 && (
        <svg
          width={width}
          height={HEIGHT}
          role="img"
          aria-label="Visitas no período. Use as setas para ver cada ponto; a tabela abaixo tem todos os valores."
          tabIndex={0}
          className="block touch-none rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark"
          onPointerMove={pick}
          onPointerDown={pick}
          onPointerLeave={() => setActive(null)}
          onKeyDown={keys}
          onBlur={() => setActive(null)}
        >
          {ticks.map((tick) => (
            <g key={tick}>
              <line x1={PAD.left} x2={width - PAD.right} y1={y(tick)} y2={y(tick)} stroke="var(--color-border)" strokeWidth={1} />
              <text x={PAD.left - 8} y={y(tick)} dy="0.32em" textAnchor="end" className="fill-fg-muted text-xs tabular-nums">
                {formatCount(tick)}
              </text>
            </g>
          ))}
          {points.map((p, i) =>
            i % labelEvery === 0 ? (
              <text key={p.key} x={x(i)} y={HEIGHT - 8} textAnchor="middle" className="fill-fg-muted text-xs">
                {formatBucket(p, unit, timeZone)}
              </text>
            ) : null,
          )}
          <path d={area} fill="var(--color-brand-dark)" fillOpacity={0.1} />
          <path d={line} fill="none" stroke="var(--color-brand-dark)" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
          {/* Último ponto marcado e com o valor (rótulo seletivo). */}
          {lastIndex >= 0 && active === null && (
            <>
              <circle cx={x(lastIndex)} cy={y(points[lastIndex].visits)} r={4} fill="var(--color-brand-dark)" stroke="var(--color-surface)" strokeWidth={2} />
              <text x={x(lastIndex) - 8} y={y(points[lastIndex].visits) - 10} textAnchor="end" className="fill-fg text-xs font-semibold tabular-nums">
                {formatCount(points[lastIndex].visits)}
              </text>
            </>
          )}
          {point && active !== null && (
            <>
              <line x1={x(active)} x2={x(active)} y1={PAD.top} y2={y(0)} stroke="var(--color-fg-muted)" strokeWidth={1} />
              <circle cx={x(active)} cy={y(point.visits)} r={5} fill="var(--color-brand-dark)" stroke="var(--color-surface)" strokeWidth={2} />
            </>
          )}
        </svg>
      )}
      {point && active !== null && (
        <div
          role="status"
          className="pointer-events-none absolute top-2 z-10 min-w-40 rounded-xl border border-border bg-surface px-3 py-2 text-xs shadow-[0_8px_24px_-12px_rgba(38,38,38,0.35)]"
          style={x(active) > width / 2 ? { right: width - x(active) + 12 } : { left: x(active) + 12 }}
        >
          <p className="font-semibold text-fg">{formatBucket(point, unit, timeZone, true)}</p>
          <p className="mt-1 flex items-center justify-between gap-4 text-fg-muted">
            <span className="flex items-center gap-1.5">
              <span aria-hidden className="h-0.5 w-3 rounded-full bg-brand-dark" />
              Visitas
            </span>
            <span className="font-semibold tabular-nums text-fg">{formatCount(point.visits)}</span>
          </p>
          <p className="mt-0.5 flex items-center justify-between gap-4 text-fg-muted">
            <span className="pl-4.5">Visualizações</span>
            <span className="tabular-nums text-fg">{formatCount(point.pageviews)}</span>
          </p>
        </div>
      )}
    </div>
  );
}

type BarListProps = { list: ListName; rows: MetricRow[]; empty?: string };

/** Ranking em barras finas: nome à esquerda, número à direita, barra proporcional ao maior. */
export function BarList({ list, rows, empty = "Sem dados no período." }: BarListProps) {
  if (!rows.length) return <p className="py-6 text-sm text-fg-muted">{empty}</p>;
  const max = Math.max(...rows.map((row) => row.value));
  return (
    <ol className="space-y-3">
      {rows.map((row) => {
        const label = rowLabel(list, row.label);
        return (
          <li key={`${row.label}-${row.value}`} title={`${label}: ${formatCount(row.value)}`}>
            <div className="flex items-baseline justify-between gap-3 text-sm">
              <span className="min-w-0 truncate text-fg">{label}</span>
              <span className="shrink-0 font-semibold tabular-nums text-fg">{formatCount(row.value)}</span>
            </div>
            <div aria-hidden className="mt-1 h-1.5 rounded-r bg-brand-dark" style={{ width: `${Math.max(2, (row.value / max) * 100)}%` }} />
          </li>
        );
      })}
    </ol>
  );
}
