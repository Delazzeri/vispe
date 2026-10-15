"use client";

import type { ReactNode } from "react";
import { adminInput, adminSecondary } from "./admin-shell";

// Peças comuns dos editores do admin (artigos e materiais).

export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block text-sm font-medium text-fg">
      {label}
      {children}
      {hint && <span className="mt-1 block text-xs font-normal text-fg-muted">{hint}</span>}
    </label>
  );
}

export type FaqDraft = { question: string; answer: string };

/** Lista editável de perguntas frequentes (viram a seção "Dúvidas" e o JSON-LD FAQPage). */
export function FaqEditor({
  items,
  onChange,
  description,
}: {
  items: readonly FaqDraft[];
  onChange: (items: FaqDraft[]) => void;
  description: string;
}) {
  const edit = (index: number, patch: Partial<FaqDraft>) =>
    onChange(items.map((item, i) => (i === index ? { ...item, ...patch } : item)));

  return (
    <fieldset className="rounded-2xl border border-border bg-surface p-5">
      <legend className="px-1 text-sm font-semibold text-fg">Perguntas frequentes (opcional)</legend>
      <p className="text-xs text-fg-muted">{description}</p>
      <div className="mt-4 space-y-4">
        {items.map((item, i) => (
          <div key={i} className="rounded-xl border border-border p-4">
            <Field label={`Pergunta ${i + 1}`}>
              <input value={item.question} onChange={(e) => edit(i, { question: e.target.value })} className={adminInput} />
            </Field>
            <div className="mt-3">
              <Field label="Resposta">
                <textarea value={item.answer} rows={3} onChange={(e) => edit(i, { answer: e.target.value })} className={adminInput} />
              </Field>
            </div>
            <button type="button" onClick={() => onChange(items.filter((_, j) => j !== i))} className={`${adminSecondary} mt-3`}>
              Remover pergunta
            </button>
          </div>
        ))}
      </div>
      <button type="button" onClick={() => onChange([...items, { question: "", answer: "" }])} className={`${adminSecondary} mt-4`}>
        Adicionar pergunta
      </button>
    </fieldset>
  );
}

/** Perguntas preenchidas (as duas partes), prontas para salvar. */
export const filledFaq = (items: readonly FaqDraft[]) => items.filter((item) => item.question.trim() && item.answer.trim());
