"use client";

import type { JSONContent } from "@tiptap/react";
import { useCallback, useEffect, useRef, useState } from "react";
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

/** Conteúdo em português que vira inglês (campos curtos, texto longo e FAQ). */
export type EnglishSource = { fields: Record<string, string>; markdown: string; faq: FaqDraft[] };

/** Espera depois da última mudança no português antes de traduzir sozinho. */
const AUTO_DELAY_MS = 3000;

const sameFaq = (a: readonly FaqDraft[], b: readonly FaqDraft[]) => JSON.stringify(a) === JSON.stringify(b);

function faqFromResult(value: unknown): FaqDraft[] | undefined {
  if (!Array.isArray(value)) return undefined;
  return value.flatMap((item) => {
    const entry = item as { question?: unknown; answer?: unknown };
    return typeof entry.question === "string" && typeof entry.answer === "string"
      ? [{ question: entry.question, answer: entry.answer }]
      : [];
  });
}

export type EnglishTranslator = {
  translating: boolean;
  error?: string;
  auto: boolean;
  setAuto: (auto: boolean) => void;
  /** Traduz tudo de novo (botão), substituindo o inglês atual. */
  translateAll: () => Promise<void>;
  /** Muda quando a tradução troca o texto longo: recria o editor de texto em inglês. */
  version: number;
  /** Remove a tradução (a /en volta a mostrar o português). */
  clear: () => void;
};

/**
 * Tradução para o inglês dos editores. Fica no editor (não na aba Inglês) para
 * rodar com qualquer aba aberta: com o automático ligado, alguns segundos depois
 * da última mudança no português, traduz só o que mudou e mantém os ajustes
 * feitos à mão no inglês. Sem tradução ainda, traduz tudo.
 */
export function useEnglishTranslation({
  source,
  en,
  setEn,
  body,
}: {
  /** null enquanto o conteúdo carrega. */
  source: EnglishSource | null;
  en: EnglishDraft | undefined;
  setEn: (update: (current: EnglishDraft) => EnglishDraft) => void;
  body: EnglishBodyKeys;
}): EnglishTranslator {
  const [translating, setTranslating] = useState(false);
  const [error, setError] = useState<string>();
  const [auto, setAuto] = useState(true);
  const [version, setVersion] = useState(0);
  // Português na última tradução (ou ao abrir): base para saber o que mudou.
  const baseline = useRef<EnglishSource | null>(null);
  const latest = useRef({ source, en, setEn });
  const running = useRef(0);

  useEffect(() => {
    latest.current = { source, en, setEn };
  });

  const run = useCallback(
    async (snapshot: EnglishSource, full: boolean) => {
      const current = latest.current.en ?? emptyEnglish;
      const previous = full || !hasEnglish(current) ? null : baseline.current;
      // Campos que mudaram desde a última tradução (tudo, se ainda não há tradução).
      const request: Record<string, unknown> = {};
      const cleared: string[] = [];
      for (const [key, value] of Object.entries(snapshot.fields)) {
        if (previous && previous.fields[key] === value) continue;
        if (value.trim()) request[key] = value;
        else cleared.push(key);
      }
      const markdownChanged = !previous || previous.markdown !== snapshot.markdown;
      if (markdownChanged && snapshot.markdown.trim()) request[body.md] = snapshot.markdown;
      const faqChanged = !previous || !sameFaq(previous.faq, snapshot.faq);
      if (faqChanged && snapshot.faq.length) request.faq = snapshot.faq;

      const titleChanged = "title" in request;
      const id = ++running.current;
      setError(undefined);
      let result: Record<string, unknown> = {};
      if (Object.keys(request).length) {
        if (!request.title && !snapshot.fields.title?.trim()) return; // sem título não há o que traduzir ainda
        // O título vai sempre junto como contexto (a função exige).
        if (!request.title) request.title = snapshot.fields.title;
        setTranslating(true);
        try {
          result = await translateToEnglish(request);
        } catch (problem) {
          if (id === running.current) setError(problem instanceof Error ? problem.message : String(problem));
          return;
        } finally {
          if (id === running.current) setTranslating(false);
        }
        if (!Object.keys(result).length) {
          if (id === running.current) setError("A IA não devolveu a tradução. Tente “Traduzir de novo”.");
          return;
        }
      } else if (!cleared.length && !(markdownChanged || faqChanged)) {
        return;
      }

      baseline.current = snapshot;
      const translatedFaq = faqFromResult(result.faq);
      const markdown = typeof result[body.md] === "string" ? String(result[body.md]) : undefined;
      latest.current.setEn((en) => {
        const fields = { ...en.fields };
        for (const key of Object.keys(snapshot.fields)) {
          if (typeof result[key] === "string" && (key !== "title" || titleChanged)) fields[key] = String(result[key]);
        }
        // Título só enviado como contexto: mantém o inglês atual, se houver.
        if (!titleChanged && !en.fields.title && typeof result.title === "string") fields.title = String(result.title);
        for (const key of cleared) fields[key] = "";
        return {
          fields,
          markdown: markdown ?? (markdownChanged && !snapshot.markdown.trim() ? "" : en.markdown),
          json: markdown !== undefined || (markdownChanged && !snapshot.markdown.trim()) ? null : en.json,
          faq: translatedFaq ?? (faqChanged && !snapshot.faq.length ? [] : en.faq),
        };
      });
      if (markdown !== undefined || markdownChanged) setVersion((v) => v + 1);
    },
    [body.md],
  );

  // Automático: depois de uma pausa nas mudanças do português.
  const sourceKey = source ? JSON.stringify(source) : "";
  useEffect(() => {
    if (!source) return;
    if (!baseline.current) {
      baseline.current = source; // ao abrir: o inglês salvo vale para este português
      return;
    }
    if (!auto || JSON.stringify(baseline.current) === sourceKey) return;
    const timer = setTimeout(() => run(source, false), AUTO_DELAY_MS);
    return () => clearTimeout(timer);
    // sourceKey resume o conteúdo de source.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sourceKey, auto, run]);

  const translateAll = useCallback(async () => {
    if (latest.current.source) await run(latest.current.source, true);
  }, [run]);

  const clear = useCallback(() => {
    latest.current.setEn(() => emptyEnglish);
    setVersion((v) => v + 1);
  }, []);

  return { translating, error, auto, setAuto, translateAll, version, clear };
}

type EnglishPanelProps = {
  value: EnglishDraft;
  onChange: (next: EnglishDraft) => void;
  defs: readonly EnglishFieldDef[];
  bodyLabel: string;
  showFaq: boolean;
  translator: EnglishTranslator;
};

export function EnglishPanel({ value, onChange, defs, bodyLabel, showFaq, translator }: EnglishPanelProps) {
  const { translating, error, auto, setAuto, translateAll, version, clear } = translator;
  const translated = hasEnglish(value);

  const setField = (key: string, text: string) => onChange({ ...value, fields: { ...value.fields, [key]: text } });

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-border bg-surface p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-fg">Versão em inglês (site em /en)</p>
            <p className={`mt-0.5 text-xs ${translated ? "text-fg-muted" : "font-medium text-brand-dark"}`}>
              {translating
                ? "Traduzindo o que mudou no português…"
                : translated
                  ? "Com tradução: a página em inglês mostra este conteúdo."
                  : "Sem tradução: a página em inglês mostra o português com o aviso “disponível só em português”."}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                if (translated && !window.confirm("Traduzir tudo de novo? Os ajustes feitos à mão no inglês serão substituídos.")) return;
                void translateAll();
              }}
              disabled={translating}
              className={adminPrimary}
            >
              {translating ? "Traduzindo…" : translated ? "Traduzir tudo de novo" : "Traduzir com IA"}
            </button>
            {translated && (
              <button
                type="button"
                onClick={() => {
                  if (window.confirm("Remover a tradução? A página em inglês volta a mostrar o português.")) clear();
                }}
                className={adminSecondary}
              >
                Remover tradução
              </button>
            )}
          </div>
        </div>
        <label className="mt-4 flex cursor-pointer items-start gap-3">
          <input type="checkbox" checked={auto} onChange={(e) => setAuto(e.target.checked)} className="mt-0.5 h-4 w-4 accent-ink" />
          <span className="text-xs text-fg-muted">
            <span className="block text-sm font-medium text-fg">Traduzir automaticamente</span>
            Ao mudar algo na aba Português (à mão ou pela IA), o inglês é atualizado sozinho em alguns segundos, só no que
            mudou. Ajustes feitos aqui são mantidos até o campo em português mudar de novo. Revise antes de salvar.
          </span>
        </label>
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
          description="Perguntas frequentes em inglês (traduzidas das da aba Português)."
        />
      )}
    </div>
  );
}
