"use client";

import { FunctionsHttpError } from "@supabase/supabase-js";
import { useState } from "react";
import { renderMarkdown } from "@/lib/blog/markdown";
import { getSupabase } from "@/lib/supabase/client";
import { cn } from "@/lib/cn";
import { adminPrimary, adminSecondary } from "./admin-shell";

/** Resposta da Edge Function supabase/functions/seo-assistant. */
export type SeoSuggestion = {
  focusKeyword: string;
  metaTitle: string;
  metaDescription: string;
  excerpt: string;
  slug: string;
  contentMarkdown: string;
  notes: string[];
};

export type SeoPatch = Partial<{ metaTitle: string; metaDescription: string; excerpt: string; slug: string; markdown: string }>;

type SeoAssistantProps = {
  title: string;
  excerpt: string;
  markdown: string;
  category: string;
  tags: readonly string[];
  /** Artigo (padrão) ou página de material gratuito: muda as instruções da IA e os textos. */
  kind?: AssistantKind;
  /** Já publicado: trocar o slug muda o endereço (o link antigo quebra). */
  published: boolean;
  current: { metaTitle: string; metaDescription: string; slug: string };
  onApply: (patch: SeoPatch) => void;
};

export type AssistantKind = "article" | "material";

/** Dados do artigo ou material enviados ao assistente (Edge Function seo-assistant). */
export type ArticleInput = {
  title: string;
  excerpt: string;
  markdown: string;
  /** Categoria do artigo ou formato do material. */
  category: string;
  tags: readonly string[];
  kind?: AssistantKind;
};

/** Corpo do pedido à função para as sugestões de SEO e o FAQ (artigo ou material). */
const articleBody = (input: ArticleInput, task?: "faq") => ({
  task,
  kind: input.kind ?? "article",
  title: input.title,
  excerpt: input.excerpt,
  content: input.markdown,
  category: input.category,
  tags: input.tags,
});

/** Chama a Edge Function seo-assistant e traduz os erros para mensagens do admin. */
async function invokeAssistant<T>(body: Record<string, unknown>): Promise<T> {
  const supabase = getSupabase();
  if (!supabase) throw new Error("Supabase não configurado.");
  const { data, error } = await supabase.functions.invoke<T>("seo-assistant", {
    body,
  });
  if (error) {
    if (error instanceof FunctionsHttpError) {
      const status = error.context.status;
      if (status === 404) throw new Error("O assistente ainda não foi publicado no Supabase (ver supabase/README.md).");
      const body: unknown = await error.context.json().catch(() => null);
      const message = body && typeof body === "object" && "error" in body ? String(body.error) : undefined;
      throw new Error(message ?? `O assistente respondeu com erro ${status}.`);
    }
    throw new Error("Sem conexão com o assistente. Tente de novo em instantes.");
  }
  if (!data) throw new Error("O assistente não devolveu sugestões.");
  return data;
}

const requestSuggestion = (input: ArticleInput) => invokeAssistant<SeoSuggestion>(articleBody(input));

/** Perguntas frequentes geradas a partir do conteúdo do artigo ou do material (Gemini, tarefa "faq"). */
export async function generateFaq(input: ArticleInput): Promise<{ question: string; answer: string }[]> {
  const { faq } = await invokeAssistant<{ faq: { question: string; answer: string }[] }>(articleBody(input, "faq"));
  if (!faq.length) throw new Error("O assistente não conseguiu gerar perguntas para este texto.");
  return faq;
}

/** Tradução para o inglês (tarefa "translate"): devolve os mesmos campos enviados, traduzidos. */
export function translateToEnglish(fields: Record<string, unknown>): Promise<Record<string, unknown>> {
  return invokeAssistant<Record<string, unknown>>({ task: "translate", fields });
}

function Row({
  label,
  hint,
  value,
  currentValue,
  onApply,
  warning,
}: {
  label: string;
  hint?: string;
  value: string;
  currentValue: string;
  onApply: () => void;
  warning?: string;
}) {
  const same = value === currentValue;
  return (
    <div className="rounded-xl border border-border p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-semibold text-fg">
          {label} {hint && <span className="font-normal text-fg-muted">· {hint}</span>}
        </p>
        <button type="button" onClick={onApply} disabled={same} className={adminSecondary}>
          {same ? "Aplicado" : "Aplicar"}
        </button>
      </div>
      <p className="mt-2 text-sm text-fg">{value}</p>
      {currentValue && !same && <p className="mt-1 text-xs text-fg-muted">Atual: {currentValue}</p>}
      {warning && !same && <p className="mt-2 text-xs font-medium text-brand-dark">{warning}</p>}
    </div>
  );
}

/**
 * Botão "Otimizar SEO com IA" do editor: manda título e conteúdo para a Edge
 * Function (Gemini) e mostra as sugestões; nada muda no artigo até clicar em
 * Aplicar. A diagramação pode ser desfeita.
 */
export function SeoAssistant(props: SeoAssistantProps) {
  const { title, excerpt, markdown, category, tags, kind = "article", published, current, onApply } = props;
  const noun = kind === "material" ? "material" : "artigo";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [suggestion, setSuggestion] = useState<SeoSuggestion>();
  const [showLayout, setShowLayout] = useState(false);
  const [previousMarkdown, setPreviousMarkdown] = useState<string>();

  async function generate() {
    setLoading(true);
    setError(undefined);
    try {
      setSuggestion(await requestSuggestion({ title, excerpt, markdown, category, tags, kind }));
      setShowLayout(false);
      setPreviousMarkdown(undefined);
    } catch (problem) {
      setError(problem instanceof Error ? problem.message : String(problem));
    } finally {
      setLoading(false);
    }
  }

  const applyLayout = () => {
    if (!suggestion) return;
    setPreviousMarkdown(markdown);
    onApply({ markdown: suggestion.contentMarkdown });
  };

  const applyAll = () => {
    if (!suggestion) return;
    setPreviousMarkdown(markdown);
    onApply({
      metaTitle: suggestion.metaTitle,
      metaDescription: suggestion.metaDescription,
      excerpt: suggestion.excerpt,
      // Publicado: não troca o endereço sem o autor decidir (botão do próprio campo).
      ...(published ? {} : { slug: suggestion.slug }),
      markdown: suggestion.contentMarkdown,
    });
  };

  return (
    <section aria-labelledby="seo-assistant-title" className="rounded-2xl border border-border bg-surface p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 id="seo-assistant-title" className="text-sm font-semibold text-fg">
            Assistente de SEO (Gemini)
          </h2>
          <p className="mt-0.5 text-xs text-fg-muted">
            Sugere título e descrição para o Google, resumo, slug e uma diagramação do texto. Nada muda até você aplicar.
          </p>
        </div>
        <button type="button" onClick={generate} disabled={loading} className={adminPrimary}>
          {loading ? `Analisando o ${noun}…` : suggestion ? "Gerar de novo" : "Otimizar SEO com IA"}
        </button>
      </div>

      {error && (
        <p role="alert" className="mt-4 rounded-xl bg-accent-soft/40 px-4 py-3 text-sm font-medium text-fg">
          {error}
        </p>
      )}

      {suggestion && (
        <div className="mt-5 space-y-3" aria-live="polite">
          <p className="text-sm text-fg-muted">
            Palavra-chave principal: <strong className="text-fg">{suggestion.focusKeyword}</strong>
          </p>
          <Row
            label="Título para o Google"
            hint={`${suggestion.metaTitle.length}/60`}
            value={suggestion.metaTitle}
            currentValue={current.metaTitle}
            onApply={() => onApply({ metaTitle: suggestion.metaTitle })}
          />
          <Row
            label="Descrição para o Google"
            hint={`${suggestion.metaDescription.length}/155`}
            value={suggestion.metaDescription}
            currentValue={current.metaDescription}
            onApply={() => onApply({ metaDescription: suggestion.metaDescription })}
          />
          <Row label="Resumo" value={suggestion.excerpt} currentValue={excerpt} onApply={() => onApply({ excerpt: suggestion.excerpt })} />
          <Row
            label="Slug"
            value={suggestion.slug}
            currentValue={current.slug}
            onApply={() => onApply({ slug: suggestion.slug })}
            warning={published ? `Este ${noun} já está publicado: trocar o slug muda o endereço e o link antigo deixa de funcionar.` : undefined}
          />

          <div className="rounded-xl border border-border p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-semibold text-fg">Diagramação do conteúdo</p>
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={() => setShowLayout((v) => !v)} className={adminSecondary} aria-expanded={showLayout}>
                  {showLayout ? "Ocultar" : "Ver sugestão"}
                </button>
                {previousMarkdown !== undefined ? (
                  <button
                    type="button"
                    onClick={() => {
                      onApply({ markdown: previousMarkdown });
                      setPreviousMarkdown(undefined);
                    }}
                    className={adminSecondary}
                  >
                    Desfazer diagramação
                  </button>
                ) : (
                  <button type="button" onClick={applyLayout} className={adminSecondary}>
                    Aplicar ao conteúdo
                  </button>
                )}
              </div>
            </div>
            {showLayout && (
              <div
                className={cn("article-body mt-4 max-h-[480px] overflow-y-auto rounded-xl bg-bg p-5")}
                dangerouslySetInnerHTML={{ __html: renderMarkdown(suggestion.contentMarkdown, "pt-BR") }}
              />
            )}
          </div>

          {suggestion.notes.length > 0 && (
            <ul className="list-disc space-y-1 pl-5 text-sm text-fg-muted">
              {suggestion.notes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          )}

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button type="button" onClick={applyAll} className={adminPrimary}>
              Aplicar tudo
            </button>
            <p className="text-xs text-fg-muted">Revise antes de salvar: a IA pode errar. {published && `O slug de ${noun} publicado só muda pelo botão do campo.`}</p>
          </div>
        </div>
      )}
    </section>
  );
}
