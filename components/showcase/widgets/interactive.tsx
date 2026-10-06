"use client";

import { Check } from "lucide-react";
import { useState } from "react";
import type { WidgetTone } from "@/content/fin-wall";
import { cn } from "@/lib/cn";

// Versões interativas de widgets do Fin 24/7, usadas só nos cards de Soluções.
// O estado é apenas visual: ao recarregar, tudo volta ao padrão.

const toneText: Record<WidgetTone, string> = {
  default: "text-paper",
  brand: "text-brand",
  accent: "text-accent",
  muted: "text-paper/50",
};

type ChecklistRow = { label: string; value?: string; tone?: WidgetTone; marker?: "open" | "done" | "dot" };

/** Lista com checkboxes de verdade: clicar (ou Espaço no teclado) marca o item. */
export function Checklist({ rows }: { rows: readonly ChecklistRow[] }) {
  const [checked, setChecked] = useState(() => rows.map((row) => row.marker === "done"));

  return (
    <ul className="space-y-0.5">
      {rows.map((row, i) => {
        const isChecked = checked[i];
        return (
          <li key={row.label}>
            <label className="-mx-1 flex cursor-pointer items-center gap-1.5 rounded-md px-1 text-xs leading-4 transition-colors hover:bg-paper/10 has-focus-visible:ring-1 has-focus-visible:ring-brand">
              <input
                type="checkbox"
                className="sr-only"
                checked={isChecked}
                onChange={() => setChecked((prev) => prev.map((value, j) => (j === i ? !value : value)))}
              />
              <span
                aria-hidden
                className={cn(
                  "flex h-3 w-3 shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-200",
                  isChecked ? "border-brand bg-brand" : row.tone === "accent" ? "border-accent" : "border-brand",
                )}
              >
                <Check
                  className={cn(
                    "h-2 w-2 text-brand-fg transition-transform duration-200",
                    isChecked ? "scale-100" : "scale-0",
                  )}
                  strokeWidth={4}
                />
              </span>
              <span
                className={cn(
                  "min-w-0 flex-1 truncate font-medium transition-colors duration-200",
                  isChecked && "text-paper/50 line-through",
                )}
              >
                {row.label}
              </span>
              {row.value && (
                <span
                  className={cn(
                    "text-2xs font-semibold tabular-nums transition-colors duration-200",
                    isChecked ? "text-paper/30" : toneText[row.tone ?? "muted"],
                  )}
                >
                  {row.value}
                </span>
              )}
            </label>
          </li>
        );
      })}
    </ul>
  );
}

type Bar = { label: string; value: number; display?: string };

/**
 * Barras que destacam a categoria sob o mouse (ou foco/toque) e mostram o
 * valor. Os valores ficam sempre no texto acessível; só a opacidade muda.
 */
export function Bars({ bars }: { bars: readonly Bar[] }) {
  const [active, setActive] = useState<number | null>(null);

  return (
    <ul className="flex flex-col gap-0.5" onMouseLeave={() => setActive(null)}>
      {bars.map((bar, i) => {
        const dimmed = active !== null && active !== i;
        return (
          <li key={bar.label}>
            <button
              type="button"
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onBlur={() => setActive(null)}
              // No toque, mouseenter e click chegam juntos: o click só seleciona,
              // e tocar fora (blur) limpa.
              onClick={() => setActive(i)}
              className="-mx-1 flex w-full cursor-pointer items-center gap-2 rounded-md px-1 text-left focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand"
            >
              <span className={cn("w-12 shrink-0 text-2xs transition-colors", dimmed ? "text-paper/40" : "text-paper/70")}>
                {bar.label}
              </span>
              <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-paper/10">
                <span
                  className={cn("block h-full rounded-full bg-brand transition-opacity", dimmed && "opacity-30")}
                  style={{ width: `${bar.value}%` }}
                />
              </span>
              {bar.display && (
                <span
                  className={cn(
                    "w-11 shrink-0 text-right text-2xs font-semibold text-brand tabular-nums transition-opacity",
                    active === i ? "opacity-100" : "opacity-0",
                  )}
                >
                  {bar.display}
                </span>
              )}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
