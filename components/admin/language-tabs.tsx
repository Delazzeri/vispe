"use client";

import { cn } from "@/lib/cn";

export type EditorLanguage = "pt" | "en";

/** Abas Português / Inglês dos editores do admin (a lateral do editor não muda). */
export function LanguageTabs({
  value,
  onChange,
  englishReady,
}: {
  value: EditorLanguage;
  onChange: (language: EditorLanguage) => void;
  /** Tradução preenchida (título + texto): mostra o selo "pronto". */
  englishReady: boolean;
}) {
  const tab = (language: EditorLanguage, label: string, badge?: string) => (
    <button
      type="button"
      role="tab"
      aria-selected={value === language}
      onClick={() => onChange(language)}
      className={cn(
        "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark",
        value === language ? "bg-ink text-paper" : "text-fg-muted hover:bg-surface hover:text-fg",
      )}
    >
      {label}
      {badge && (
        <span
          className={cn(
            "rounded-md px-1.5 py-0.5 text-xs font-semibold",
            value === language ? "bg-paper/20 text-paper" : "bg-accent-soft/60 text-fg",
          )}
        >
          {badge}
        </span>
      )}
    </button>
  );

  return (
    <div role="tablist" aria-label="Idioma do conteúdo" className="mt-8 inline-flex gap-1 rounded-xl border border-border bg-bg p-1">
      {tab("pt", "Português")}
      {tab("en", "Inglês", englishReady ? "traduzido" : "sem tradução")}
    </div>
  );
}
