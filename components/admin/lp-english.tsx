"use client";

import { Languages } from "lucide-react";
import type { LpEnglish, LpTextEntry } from "@/lib/lp/translation";
import { adminInput, adminSecondary } from "./admin-shell";

/**
 * Aba "Inglês" do editor de LP: cada texto em português com o campo em
 * inglês ao lado. A tradução automática cobre o que falta ou mudou; o que foi
 * ajustado à mão fica até o português daquele texto mudar.
 */
export function LpEnglishPanel({
  entries,
  pending,
  english,
  onChange,
  translating,
  error,
  auto,
  onAutoChange,
  onTranslatePending,
  onTranslateAll,
}: {
  entries: LpTextEntry[];
  pending: LpTextEntry[];
  english: LpEnglish;
  onChange: (key: string, value: string) => void;
  translating: boolean;
  error?: string;
  auto: boolean;
  onAutoChange: (auto: boolean) => void;
  onTranslatePending: () => void;
  onTranslateAll: () => void;
}) {
  const pendingKeys = new Set(pending.map((entry) => entry.key));
  const groups = entries.reduce<{ title: string; items: LpTextEntry[] }[]>((acc, entry) => {
    const title = entry.label.split(" › ")[0];
    const group = acc.find((g) => g.title === title && g.items[0].sectionId === entry.sectionId);
    if (group) group.items.push(entry);
    else acc.push({ title, items: [entry] });
    return acc;
  }, []);

  return (
    <div className="mt-6 space-y-4">
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-surface p-4">
        <button type="button" onClick={onTranslatePending} disabled={translating || !pending.length} className={adminSecondary}>
          <Languages className="h-4 w-4" aria-hidden />
          {translating ? "Traduzindo…" : pending.length ? `Traduzir o que falta (${pending.length})` : "Tudo traduzido"}
        </button>
        <button type="button" onClick={onTranslateAll} disabled={translating || !entries.length} className={adminSecondary}>
          Traduzir tudo de novo
        </button>
        <label className="flex items-center gap-2 text-sm text-fg">
          <input type="checkbox" checked={auto} onChange={(e) => onAutoChange(e.target.checked)} className="h-4 w-4 accent-ink" />
          Traduzir automaticamente quando o português mudar
        </label>
        <p className="w-full text-xs text-fg-muted">
          A versão em inglês fica em /en/lp/… Sem tradução, a página em inglês mostra o português com um aviso. Revise os textos antes de publicar.
        </p>
        <div aria-live="polite" className="w-full">
          {error && <p className="text-sm font-medium text-brand-dark">{error}</p>}
        </div>
      </div>

      {groups.map((group) => (
        <fieldset key={`${group.items[0].sectionId}-${group.title}`} className="rounded-2xl border border-border bg-surface p-4">
          <legend className="px-1 text-sm font-semibold text-ink">{group.title}</legend>
          <div className="space-y-4">
            {group.items.map((entry) => {
              const name = entry.label.split(" › ").slice(1).join(" › ") || entry.label;
              const value = english.texts[entry.key] ?? "";
              return (
                <div key={entry.key} className="grid gap-2 md:grid-cols-2 md:gap-4">
                  <div className="text-sm">
                    <span className="font-medium text-fg">{name}</span>
                    <p className="mt-1.5 whitespace-pre-line rounded-xl bg-bg px-3.5 py-2.5 text-fg-muted">{entry.value}</p>
                  </div>
                  <label className="block text-sm font-medium text-fg">
                    <span className="flex items-center gap-2">
                      Inglês
                      {pendingKeys.has(entry.key) && (
                        <span className="rounded-md bg-accent-soft/60 px-1.5 py-0.5 text-xs font-semibold text-fg">
                          {value.trim() ? "português mudou" : "sem tradução"}
                        </span>
                      )}
                    </span>
                    {entry.multiline ? (
                      <textarea rows={3} value={value} onChange={(e) => onChange(entry.key, e.target.value)} className={adminInput} />
                    ) : (
                      <input value={value} onChange={(e) => onChange(entry.key, e.target.value)} className={adminInput} />
                    )}
                  </label>
                </div>
              );
            })}
          </div>
        </fieldset>
      ))}
    </div>
  );
}
