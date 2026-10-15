"use client";

import type { JSONContent } from "@tiptap/react";
import { useState } from "react";
import type { Json } from "@/lib/supabase/types";
import { asObject, faqList, str } from "@/lib/translation-json";
import { adminInput, adminPrimary, adminSecondary } from "./admin-shell";
import { FaqEditor, Field, filledFaq, type FaqDraft } from "./form-parts";
import { RichTextEditor } from "./rich-text-editor";
import { translateToEnglish } from "./seo-assistant";

// Aba "Inglês" dos editores (artigos e materiais): versão do conteúdo para o site
// em /en, preenchida com "Traduzir com IA" e revisada à mão. Salva na coluna
// "en" (jsonb) da tabela; sem título e texto em inglês, nada é salvo e a /en
// mostra o português com aviso.

export type EnglishDraft = {
  /** Campos curtos, pelas mesmas chaves do JSON salvo (title, excerpt, metaTitle…). */
  fields: Record<string, string>;
  markdown: string;
  json: JSONContent | null;
  faq: FaqDraft[];
};

export const emptyEnglish: EnglishDraft = { fields: {}, markdown: "", json: null, faq: [] };

export type EnglishFieldDef = { key: string; label: string; hint?: string; multiline?: boolean; maxLength?: number };

/** Chaves do texto longo no JSON salvo (artigo: bodyMd/bodyJson; material: descriptionMd/descriptionJson). */
export type EnglishBodyKeys = { md: string; json: string };

export function englishFromJson(value: Json | null, defs: readonly EnglishFieldDef[], body: EnglishBodyKeys): EnglishDraft {
  const en = asObject(value);
  if (!en) return emptyEnglish;
  const fields: Record<string, string> = {};
  for (const { key } of defs) fields[key] = str(en, key) ?? "";
  const json = asObject(en[body.json]);
  return {
    fields,
    markdown: str(en, body.md) ?? "",
    json: (json as JSONContent | undefined) ?? null,
    faq: faqList(en.faq) ?? [],
  };
}

/** Tradução existe quando há título e texto (o mínimo para a página em inglês). */
export const hasEnglish = (en: EnglishDraft) => Boolean(en.fields.title?.trim() && en.markdown.trim());

export function englishToJson(en: EnglishDraft, body: EnglishBodyKeys, includeFaq: boolean): Json | null {
  if (!hasEnglish(en)) return null;
  const out: Record<string, Json> = {};
  for (const [key, value] of Object.entries(en.fields)) if (value.trim()) out[key] = value.trim();
  out[body.md] = en.markdown;
  if (en.json) out[body.json] = en.json as unknown as Json;
  const faq = includeFaq ? filledFaq(en.faq) : [];
  if (faq.length) out.faq = faq;
  return out;
}

type EnglishPanelProps = {
  value: EnglishDraft;
  onChange: (next: EnglishDraft) => void;
  defs: readonly EnglishFieldDef[];
  body: EnglishBodyKeys;
  bodyLabel: string;
  showFaq: boolean;
  /** Conteúdo em português, enviado para a tradução. */
  source: () => { fields: Record<string, string>; markdown: string; faq: FaqDraft[] };
};

export function EnglishPanel({ value, onChange, defs, body, bodyLabel, showFaq, source }: EnglishPanelProps) {
  const [translating, setTranslating] = useState(false);
  const [error, setError] = useState<string>();
  // Recria o editor de texto quando a tradução troca o conteúdo de fora.
  const [version, setVersion] = useState(0);
  const translated = hasEnglish(value);

  async function translate() {
    if (translated && !window.confirm("Substituir a tradução atual pela nova?")) return;
    const pt = source();
    setTranslating(true);
    setError(undefined);
    try {
      const result = await translateToEnglish({
        ...pt.fields,
        [body.md]: pt.markdown,
        ...(showFaq ? { faq: filledFaq(pt.faq) } : {}),
      });
      const fields: Record<string, string> = {};
      for (const { key } of defs) fields[key] = typeof result[key] === "string" ? String(result[key]) : "";
      const faq = Array.isArray(result.faq)
        ? result.faq.flatMap((item) => {
            const entry = item as { question?: unknown; answer?: unknown };
            return typeof entry.question === "string" && typeof entry.answer === "string"
              ? [{ question: entry.question, answer: entry.answer }]
              : [];
          })
        : value.faq;
      onChange({ fields, markdown: typeof result[body.md] === "string" ? String(result[body.md]) : "", json: null, faq });
      setVersion((v) => v + 1);
    } catch (problem) {
      setError(problem instanceof Error ? problem.message : String(problem));
    } finally {
      setTranslating(false);
    }
  }

  const setField = (key: string, text: string) => onChange({ ...value, fields: { ...value.fields, [key]: text } });

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-border bg-surface p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-fg">Versão em inglês (site em /en)</p>
            <p className={`mt-0.5 text-xs ${translated ? "text-fg-muted" : "font-medium text-brand-dark"}`}>
              {translated
                ? "Com tradução: a página em inglês mostra este conteúdo."
                : "Sem tradução: a página em inglês mostra o português com o aviso “disponível só em português”."}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={translate} disabled={translating} className={adminPrimary}>
              {translating ? "Traduzindo…" : translated ? "Traduzir de novo" : "Traduzir com IA"}
            </button>
            {translated && (
              <button
                type="button"
                onClick={() => {
                  if (!window.confirm("Remover a tradução? A página em inglês volta a mostrar o português.")) return;
                  onChange(emptyEnglish);
                  setVersion((v) => v + 1);
                }}
                className={adminSecondary}
              >
                Remover tradução
              </button>
            )}
          </div>
        </div>
        <p className="mt-3 text-xs text-fg-muted">
          A IA traduz a partir da aba Português (salve o português antes, se mudou). Revise antes de salvar: termos técnicos e
          nomes podem precisar de ajuste.
        </p>
        {error && (
          <p role="alert" className="mt-3 text-sm font-medium text-brand-dark">
            {error}
          </p>
        )}
      </div>

      {defs.map((def) => (
        <Field key={def.key} label={def.label} hint={def.hint}>
          {def.multiline ? (
            <textarea
              value={value.fields[def.key] ?? ""}
              onChange={(e) => setField(def.key, e.target.value)}
              rows={3}
              maxLength={def.maxLength}
              className={adminInput}
            />
          ) : (
            <input
              value={value.fields[def.key] ?? ""}
              onChange={(e) => setField(def.key, e.target.value)}
              maxLength={def.maxLength}
              className={adminInput}
            />
          )}
        </Field>
      ))}

      <div>
        <p className="text-sm font-medium text-fg">{bodyLabel}</p>
        <div className="mt-1.5">
          <RichTextEditor
            key={`en-${version}`}
            initialJson={value.json}
            initialMarkdown={value.markdown}
            onChange={(next) => onChange({ ...value, markdown: next.markdown, json: next.json })}
          />
        </div>
      </div>

      {showFaq && (
        <FaqEditor
          items={value.faq}
          onChange={(faq) => onChange({ ...value, faq })}
          description="Perguntas frequentes em inglês (a IA traduz as da aba Português)."
        />
      )}
    </div>
  );
}
