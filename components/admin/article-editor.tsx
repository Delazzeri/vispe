"use client";

import type { JSONContent } from "@tiptap/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { ArticleView } from "@/components/blog/article-view";
import { getSite } from "@/content/site";
import type { Article } from "@/lib/blog/types";
import { slugify } from "@/lib/slugify";
import { getSupabase } from "@/lib/supabase/client";
import type { ArticleRecord, ArticleStatus, Database, Json } from "@/lib/supabase/types";
import { adminInput, adminPrimary, adminSecondary } from "./admin-shell";
import { statusLabel } from "./article-list";
import { FaqEditor, Field, filledFaq, type FaqDraft } from "./form-parts";
import { RichTextEditor, type RichTextValue } from "./rich-text-editor";
import { generateFaq, SeoAssistant, type SeoPatch } from "./seo-assistant";

type Draft = {
  id?: string;
  title: string;
  slug: string;
  /** Slug digitado à mão: deixa de acompanhar o título. */
  slugTouched: boolean;
  excerpt: string;
  category: string;
  author: string;
  tags: string[];
  coverUrl: string;
  coverAlt: string;
  metaTitle: string;
  metaDescription: string;
  status: ArticleStatus;
  /** datetime-local (horário de Brasília do navegador). */
  publishedAt: string;
  faq: FaqDraft[];
  /** FAQ no fim do artigo (e JSON-LD FAQPage). Desligado, nada é salvo nem publicado. */
  faqEnabled: boolean;
  markdown: string;
  json: JSONContent | null;
};

const emptyDraft: Draft = {
  title: "",
  slug: "",
  slugTouched: false,
  excerpt: "",
  category: "",
  author: "Vispe Capital",
  tags: [],
  coverUrl: "",
  coverAlt: "",
  metaTitle: "",
  metaDescription: "",
  status: "draft",
  publishedAt: "",
  faq: [],
  faqEnabled: false,
  markdown: "",
  json: null,
};

const coverMaxBytes = 3 * 1024 * 1024; // mesmo limite do bucket (0002_storage.sql)
const slugPattern = /^[a-z0-9]+(-[a-z0-9]+)*$/;

const toLocalInput = (iso: string | null) => {
  if (!iso) return "";
  const date = new Date(iso);
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
};

function rowToDraft(row: ArticleRecord): Draft {
  const faq = Array.isArray(row.faq)
    ? row.faq.flatMap((item) =>
        item && typeof item === "object" && !Array.isArray(item)
          ? [{ question: String(item.question ?? ""), answer: String(item.answer ?? "") }]
          : [],
      )
    : [];
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    slugTouched: true,
    excerpt: row.excerpt,
    category: row.category,
    author: row.author,
    tags: row.tags ?? [],
    coverUrl: row.cover_image_url ?? "",
    coverAlt: row.cover_image_alt ?? "",
    metaTitle: row.meta_title ?? "",
    metaDescription: row.meta_description ?? "",
    status: row.status,
    publishedAt: toLocalInput(row.published_at),
    faq,
    faqEnabled: faq.length > 0,
    markdown: row.content_md,
    json: (row.content_json as JSONContent | null) ?? null,
  };
}

function draftToArticle(draft: Draft): Article {
  return {
    slug: draft.slug || "previa",
    title: draft.title || "Título do artigo",
    description: draft.excerpt,
    category: draft.category || "Categoria",
    tags: draft.tags,
    publishedAt: draft.publishedAt ? new Date(draft.publishedAt).toISOString() : new Date().toISOString(),
    author: draft.author && draft.author !== "Vispe Capital" ? draft.author : undefined,
    cover: draft.coverUrl ? { src: draft.coverUrl, alt: draft.coverAlt || draft.title } : undefined,
    bodyMd: draft.markdown,
    faq: draft.faqEnabled ? filledFaq(draft.faq) : undefined,
  };
}

/** Erros de validação antes de salvar (o banco também confere o slug). */
function validate(draft: Draft): string[] {
  const errors: string[] = [];
  if (!draft.title.trim()) errors.push("Preencha o título.");
  if (!slugPattern.test(draft.slug) || draft.slug === "post")
    errors.push("Slug inválido: só minúsculas, números e hífens (e não pode ser \"post\").");
  if (!draft.excerpt.trim()) errors.push("Preencha o resumo (aparece no card e no Google).");
  if (!draft.category.trim()) errors.push("Preencha a categoria.");
  if (!draft.markdown.trim()) errors.push("O conteúdo está vazio.");
  if (draft.coverUrl && !draft.coverAlt.trim()) errors.push("Descreva a capa (texto alternativo).");
  if (draft.status === "scheduled" && (!draft.publishedAt || new Date(draft.publishedAt) <= new Date()))
    errors.push("Agendado precisa de uma data de publicação no futuro.");
  return errors;
}

/** Criar e editar artigos: /admin/editor/ (novo) ou /admin/editor/?id=<uuid>. */
export function ArticleEditor() {
  const id = useSearchParams().get("id");
  const [draft, setDraft] = useState<Draft | null>(id ? null : emptyDraft);
  const [loadError, setLoadError] = useState<string>();
  const [errors, setErrors] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [savedAt, setSavedAt] = useState<Date>();
  const [dirty, setDirty] = useState(false);
  const [preview, setPreview] = useState(false);
  const [generatingFaq, setGeneratingFaq] = useState(false);
  const [faqError, setFaqError] = useState<string>();
  // Muda quando o conteúdo é trocado de fora (assistente de SEO): recria o editor com o novo texto.
  const [editorVersion, setEditorVersion] = useState(0);
  const pillars = getSite("pt-BR").servicePillars;
  const categories = [...new Set(pillars.flatMap((pillar) => pillar.includes))];

  useEffect(() => {
    if (!id) return;
    let active = true;
    getSupabase()
      ?.from("articles")
      .select("*")
      .eq("id", id)
      .maybeSingle()
      .then(({ data, error }) => {
        if (!active) return;
        if (error || !data) setLoadError(error?.message ?? "Artigo não encontrado.");
        else setDraft(rowToDraft(data));
      });
    return () => {
      active = false;
    };
  }, [id]);

  // Aviso ao sair com alterações não salvas.
  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  if (loadError) return <p className="text-sm font-medium text-brand-dark">{loadError}</p>;
  if (!draft) return <p className="text-sm text-fg-muted">Carregando artigo…</p>;

  const update = (patch: Partial<Draft>) => {
    setDirty(true);
    setDraft((current) => {
      if (!current) return current;
      const next = { ...current, ...patch };
      if (patch.title !== undefined && !current.slugTouched) next.slug = slugify(patch.title);
      return next;
    });
  };

  function applySeo(patch: SeoPatch) {
    const { markdown, slug, ...fields } = patch;
    update({
      ...fields,
      ...(slug !== undefined ? { slug, slugTouched: true } : {}),
      // Sem o JSON antigo: o editor reabre a partir do Markdown novo.
      ...(markdown !== undefined ? { markdown, json: null } : {}),
    });
    if (markdown !== undefined) setEditorVersion((version) => version + 1);
  }

  async function fillFaqWithAi() {
    if (!draft) return;
    if (filledFaq(draft.faq).length && !window.confirm("Substituir as perguntas atuais pelas geradas?")) return;
    setGeneratingFaq(true);
    setFaqError(undefined);
    try {
      const faq = await generateFaq({
        title: draft.title,
        excerpt: draft.excerpt,
        markdown: draft.markdown,
        category: draft.category,
        tags: draft.tags,
      });
      update({ faq });
    } catch (problem) {
      setFaqError(problem instanceof Error ? problem.message : String(problem));
    } finally {
      setGeneratingFaq(false);
    }
  }

  async function uploadCover(file: File) {
    const supabase = getSupabase();
    if (!supabase || !draft) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) return setErrors(["A capa precisa ser JPG, PNG ou WebP."]);
    if (file.size > coverMaxBytes) return setErrors(["A capa passa de 3 MB."]);
    setUploading(true);
    const extension = file.type.split("/")[1].replace("jpeg", "jpg");
    const path = `covers/${Date.now()}-${draft.slug || "capa"}.${extension}`;
    const { error } = await supabase.storage.from("article-images").upload(path, file, { cacheControl: "31536000" });
    setUploading(false);
    if (error) return setErrors([`Falha no upload: ${error.message}`]);
    update({ coverUrl: supabase.storage.from("article-images").getPublicUrl(path).data.publicUrl });
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const supabase = getSupabase();
    if (!supabase || !draft) return;
    const problems = validate(draft);
    setErrors(problems);
    if (problems.length) return;

    // Publicado sem data: agora. Rascunho guarda a data escolhida (ou nenhuma).
    const publishedAt =
      draft.publishedAt ? new Date(draft.publishedAt).toISOString() : draft.status === "published" ? new Date().toISOString() : null;
    const faq = draft.faqEnabled ? filledFaq(draft.faq) : [];
    const record: Database["public"]["Tables"]["articles"]["Update"] = {
      title: draft.title.trim(),
      slug: draft.slug,
      excerpt: draft.excerpt.trim(),
      content_md: draft.markdown,
      content_json: draft.json as unknown as Json,
      cover_image_url: draft.coverUrl || null,
      cover_image_alt: draft.coverAlt.trim() || null,
      category: draft.category.trim(),
      author: draft.author.trim() || "Vispe Capital",
      meta_title: draft.metaTitle.trim() || null,
      meta_description: draft.metaDescription.trim() || null,
      status: draft.status,
      published_at: publishedAt,
      tags: draft.tags,
      faq: faq.length ? (faq as unknown as Json) : null,
    };

    setSaving(true);
    const result = draft.id
      ? await supabase.from("articles").update(record).eq("id", draft.id).select("id").single()
      : await supabase
          .from("articles")
          .insert({ ...record, slug: draft.slug, title: draft.title.trim() })
          .select("id")
          .single();
    setSaving(false);

    if (result.error) {
      const duplicate = result.error.code === "23505";
      return setErrors([duplicate ? "Já existe um artigo com esse slug." : `Não foi possível salvar: ${result.error.message}`]);
    }
    setDirty(false);
    setSavedAt(new Date());
    if (!draft.id) {
      setDraft({ ...draft, id: result.data.id, publishedAt: toLocalInput(publishedAt) });
      window.history.replaceState(null, "", `/admin/editor/?id=${result.data.id}`);
    } else {
      setDraft({ ...draft, publishedAt: toLocalInput(publishedAt) });
    }
  }

  return (
    <form onSubmit={save} noValidate>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link href="/admin/" className="text-sm font-medium text-fg-muted hover:text-fg">
            ← Artigos
          </Link>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-ink">{draft.id ? "Editar artigo" : "Novo artigo"}</h1>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {savedAt && !dirty && <span className="text-sm text-fg-muted">Salvo às {savedAt.toLocaleTimeString("pt-BR")}</span>}
          <button type="button" onClick={() => setPreview((v) => !v)} className={adminSecondary} aria-pressed={preview}>
            {preview ? "Voltar a editar" : "Pré-visualizar"}
          </button>
          <button type="submit" disabled={saving || uploading} className={adminPrimary}>
            {saving ? "Salvando…" : "Salvar"}
          </button>
        </div>
      </div>

      {errors.length > 0 && (
        <ul role="alert" className="mt-6 space-y-1 rounded-xl bg-accent-soft/40 px-4 py-3 text-sm font-medium text-fg">
          {errors.map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      )}

      {preview ? (
        <div className="mt-8 rounded-3xl border border-border bg-bg">
          <ArticleView article={draftToArticle(draft)} locale="pt-BR" preview />
        </div>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-12">
          <div className="space-y-5 lg:col-span-8">
            <Field label="Título">
              <input value={draft.title} onChange={(e) => update({ title: e.target.value })} className={adminInput} required />
            </Field>
            <Field label="Slug (endereço)" hint={`/blog/${draft.slug || "…"}/ · gerado do título até você editar.`}>
              <input
                value={draft.slug}
                onChange={(e) => update({ slug: slugify(e.target.value) || e.target.value.toLowerCase(), slugTouched: true })}
                className={adminInput}
                required
              />
            </Field>
            <Field label="Resumo" hint="Uma ou duas frases: aparece no card do blog, abaixo do título e no Google.">
              <textarea value={draft.excerpt} onChange={(e) => update({ excerpt: e.target.value })} rows={3} className={adminInput} />
            </Field>
            <SeoAssistant
              title={draft.title}
              excerpt={draft.excerpt}
              markdown={draft.markdown}
              category={draft.category}
              tags={draft.tags}
              published={Boolean(draft.id) && draft.status !== "draft"}
              current={{ metaTitle: draft.metaTitle, metaDescription: draft.metaDescription, slug: draft.slug }}
              onApply={applySeo}
            />
            <div>
              <p className="text-sm font-medium text-fg">Conteúdo</p>
              <div className="mt-1.5">
                <RichTextEditor
                  key={`${draft.id ?? "novo"}-${editorVersion}`}
                  initialJson={draft.json}
                  initialMarkdown={draft.markdown}
                  onChange={(value: RichTextValue) => update({ markdown: value.markdown, json: value.json })}
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-border bg-surface p-4">
                <input
                  type="checkbox"
                  checked={draft.faqEnabled}
                  onChange={(e) => update({ faqEnabled: e.target.checked })}
                  className="mt-0.5 h-4 w-4 accent-ink"
                />
                <span>
                  <span className="block text-sm font-semibold text-fg">Incluir perguntas frequentes neste artigo</span>
                  <span className="block text-xs text-fg-muted">
                    Aparecem no fim do artigo e no Google (FAQ). Desligado, nada é publicado (as perguntas digitadas ficam só aqui).
                  </span>
                </span>
              </label>
              {draft.faqEnabled && (
                <FaqEditor
                  items={draft.faq}
                  onChange={(faq) => update({ faq })}
                  description="Escreva à mão ou gere a partir do texto do artigo e revise."
                  actions={
                    <>
                      <button type="button" onClick={fillFaqWithAi} disabled={generatingFaq} className={adminPrimary}>
                        {generatingFaq ? "Gerando perguntas…" : "Gerar perguntas com IA"}
                      </button>
                      {faqError && (
                        <span role="alert" className="text-sm font-medium text-brand-dark">
                          {faqError}
                        </span>
                      )}
                    </>
                  }
                />
              )}
            </div>
          </div>

          <aside className="space-y-5 lg:col-span-4">
            <div className="space-y-4 rounded-2xl border border-border bg-surface p-5">
              <Field label="Status">
                <select value={draft.status} onChange={(e) => update({ status: e.target.value as ArticleStatus })} className={adminInput}>
                  {(Object.keys(statusLabel) as ArticleStatus[]).map((status) => (
                    <option key={status} value={status}>
                      {statusLabel[status]}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Data de publicação" hint="Publicado sem data usa agora. Agendado vai ao ar sozinho nesta data.">
                <input type="datetime-local" value={draft.publishedAt} onChange={(e) => update({ publishedAt: e.target.value })} className={adminInput} />
              </Field>
            </div>

            <div className="space-y-4 rounded-2xl border border-border bg-surface p-5">
              <p className="text-sm font-semibold text-fg">Capa</p>
              {draft.coverUrl && (
                // eslint-disable-next-line @next/next/no-img-element -- prévia de imagem do Storage
                <img src={draft.coverUrl} alt="" className="aspect-video w-full rounded-xl object-cover" />
              )}
              <label className={`${adminSecondary} cursor-pointer`}>
                {uploading ? "Enviando…" : draft.coverUrl ? "Trocar imagem" : "Enviar imagem"}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="sr-only"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) uploadCover(file);
                    e.target.value = "";
                  }}
                />
              </label>
              <p className="text-xs text-fg-muted">JPG, PNG ou WebP até 3 MB, na proporção 16:9 (1200×675 ou maior).</p>
              {draft.coverUrl && (
                <>
                  <Field label="Descrição da imagem (alt)">
                    <input value={draft.coverAlt} onChange={(e) => update({ coverAlt: e.target.value })} className={adminInput} />
                  </Field>
                  <button type="button" onClick={() => update({ coverUrl: "", coverAlt: "" })} className={adminSecondary}>
                    Remover capa
                  </button>
                </>
              )}
            </div>

            <div className="space-y-4 rounded-2xl border border-border bg-surface p-5">
              <Field label="Categoria" hint="Texto acima do título no card e no artigo.">
                <input value={draft.category} onChange={(e) => update({ category: e.target.value })} list="admin-categories" className={adminInput} />
                <datalist id="admin-categories">
                  {categories.map((category) => (
                    <option key={category} value={category} />
                  ))}
                </datalist>
              </Field>
              <fieldset>
                <legend className="text-sm font-medium text-fg">Serviços relacionados</legend>
                <p className="mt-0.5 text-xs text-fg-muted">Definem em quais filtros do blog o artigo aparece.</p>
                {pillars.map((pillar) => (
                  <div key={pillar.slug} className="mt-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-fg-muted">{pillar.name}</p>
                    {pillar.includes.map((service) => (
                      <label key={service} className="mt-1.5 flex items-center gap-2 text-sm text-fg">
                        <input
                          type="checkbox"
                          checked={draft.tags.includes(service)}
                          onChange={(e) =>
                            update({ tags: e.target.checked ? [...draft.tags, service] : draft.tags.filter((t) => t !== service) })
                          }
                          className="h-4 w-4 accent-ink"
                        />
                        {service}
                      </label>
                    ))}
                  </div>
                ))}
              </fieldset>
              <Field label="Autor" hint="“Vispe Capital” assina como empresa.">
                <input value={draft.author} onChange={(e) => update({ author: e.target.value })} className={adminInput} />
              </Field>
            </div>

            <div className="space-y-4 rounded-2xl border border-border bg-surface p-5">
              <p className="text-sm font-semibold text-fg">Google (opcional)</p>
              <Field label="Título para o Google" hint={`${draft.metaTitle.length}/60 · vazio usa o título.`}>
                <input value={draft.metaTitle} onChange={(e) => update({ metaTitle: e.target.value })} maxLength={70} className={adminInput} />
              </Field>
              <Field label="Descrição para o Google" hint={`${draft.metaDescription.length}/160 · vazio usa o resumo.`}>
                <textarea
                  value={draft.metaDescription}
                  onChange={(e) => update({ metaDescription: e.target.value })}
                  maxLength={200}
                  rows={3}
                  className={adminInput}
                />
              </Field>
            </div>
          </aside>
        </div>
      )}
    </form>
  );
}
