"use client";

import type { JSONContent } from "@tiptap/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { renderMarkdown } from "@/lib/blog/markdown";
import { fetchMaterialFormats, type MaterialFormat } from "@/lib/materials/formats";
import { slugify } from "@/lib/slugify";
import { getSupabase } from "@/lib/supabase/client";
import { optimizeImage } from "@/lib/admin/optimize-image";
import type { Database, Json, MaterialRecord, MaterialStatus } from "@/lib/supabase/types";
import { adminInput, adminPrimary, adminSecondary } from "./admin-shell";
import { useAdminFeedback } from "./feedback";
import {
  emptyEnglish,
  EnglishPanel,
  useEnglishTranslation,
  englishFromJson,
  englishToJson,
  hasEnglish,
  type EnglishDraft,
  type EnglishFieldDef,
} from "./english-panel";
import { FaqEditor, Field, filledFaq, type FaqDraft } from "./form-parts";
import { LanguageTabs, type EditorLanguage } from "./language-tabs";
import { materialStatusLabel } from "./material-list";
import { RichTextEditor, type RichTextValue } from "./rich-text-editor";
import { generateFaq, SeoAssistant, type SeoPatch } from "./seo-assistant";

type Draft = {
  id?: string;
  title: string;
  slug: string;
  slugTouched: boolean;
  /** Slug do formato (material_formats). */
  format: string;
  tagline: string;
  headline: string;
  coverUrl: string;
  coverAlt: string;
  imageUrl: string;
  filePath: string;
  fileName: string;
  fileSize: number | null;
  metaTitle: string;
  metaDescription: string;
  status: MaterialStatus;
  sortOrder: number;
  publishedAt: string | null;
  faq: FaqDraft[];
  markdown: string;
  json: JSONContent | null;
  /** Versão em inglês (coluna en). */
  en: EnglishDraft;
};

const emptyDraft: Draft = {
  title: "",
  slug: "",
  slugTouched: false,
  format: "",
  tagline: "",
  headline: "",
  coverUrl: "",
  coverAlt: "",
  imageUrl: "",
  filePath: "",
  fileName: "",
  fileSize: null,
  metaTitle: "",
  metaDescription: "",
  status: "draft",
  sortOrder: 100,
  publishedAt: null,
  faq: [],
  markdown: "",
  json: null,
  en: emptyEnglish,
};

const imageTypes = ["image/jpeg", "image/png", "image/webp"];
const imageMaxBytes = 5 * 1024 * 1024; // limites dos buckets (0006_materials.sql)
const fileMaxBytes = 50 * 1024 * 1024;
const fileTypes = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/zip",
  "text/csv",
];

const formatSize = (bytes: number) =>
  bytes < 1024 * 1024 ? `${Math.round(bytes / 1024)} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`;

const englishDefs: readonly EnglishFieldDef[] = [
  { key: "title", label: "Title", hint: "Card do catálogo e e-mail de envio em inglês." },
  { key: "tagline", label: "Summary", multiline: true },
  { key: "headline", label: "Page title (opcional)" },
  { key: "metaTitle", label: "Google title (opcional)", maxLength: 70 },
  { key: "metaDescription", label: "Google description (opcional)", multiline: true, maxLength: 200 },
  { key: "coverAlt", label: "Cover alt text (opcional)" },
];
const englishBody = { md: "descriptionMd", json: "descriptionJson" } as const;

function rowToDraft(row: MaterialRecord): Draft {
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
    format: row.format ?? "",
    tagline: row.tagline,
    headline: row.headline ?? "",
    coverUrl: row.cover_image_url ?? "",
    coverAlt: row.cover_image_alt ?? "",
    imageUrl: row.image_url ?? "",
    filePath: row.file_path ?? "",
    fileName: row.file_name ?? "",
    fileSize: row.file_size,
    metaTitle: row.meta_title ?? "",
    metaDescription: row.meta_description ?? "",
    status: row.status,
    sortOrder: row.sort_order,
    publishedAt: row.published_at,
    faq,
    markdown: row.description_md,
    json: (row.description_json as JSONContent | null) ?? null,
    en: englishFromJson(row.en, englishDefs, englishBody),
  };
}

function validate(draft: Draft, formats: readonly MaterialFormat[]): string[] {
  const errors: string[] = [];
  if (!draft.title.trim()) errors.push("Preencha o título.");
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(draft.slug) || draft.slug === "item")
    errors.push('Slug inválido: só minúsculas, números e hífens (e não pode ser "item").');
  if (!formats.some((format) => format.slug === draft.format)) errors.push("Escolha o formato do material.");
  if (!draft.tagline.trim()) errors.push("Preencha o resumo (aparece no card e no topo da página).");
  if (draft.status === "published" && !draft.coverUrl) errors.push("Envie a capa antes de publicar (ela aparece no catálogo).");
  if (draft.coverUrl && !draft.coverAlt.trim()) errors.push("Descreva a capa (texto alternativo).");
  const enStarted = Boolean(draft.en.fields.title?.trim() || draft.en.markdown.trim());
  if (enStarted && !hasEnglish(draft.en)) errors.push("Inglês: preencha título e descrição, ou remova a tradução.");
  return errors;
}

/** Criar e editar materiais: /admin/materiais/editor/ (novo) ou ?id=<uuid>. */
export function MaterialEditor() {
  const { confirm } = useAdminFeedback();
  const id = useSearchParams().get("id");
  const [draft, setDraft] = useState<Draft | null>(id ? null : emptyDraft);
  const [loadError, setLoadError] = useState<string>();
  const [errors, setErrors] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<string>();
  const [savedAt, setSavedAt] = useState<Date>();
  const [dirty, setDirty] = useState(false);
  const [preview, setPreview] = useState(false);
  const [language, setLanguage] = useState<EditorLanguage>("pt");
  // Arquivos trocados/removidos: apagados do Storage depois de salvar.
  const [orphans, setOrphans] = useState<string[]>([]);
  const [formats, setFormats] = useState<MaterialFormat[]>([]);
  // Troca a chave do editor de texto quando a descrição muda por fora (diagramação da IA).
  const [editorVersion, setEditorVersion] = useState(0);
  const [generatingFaq, setGeneratingFaq] = useState(false);
  const [faqError, setFaqError] = useState<string>();
  const [formatsError, setFormatsError] = useState<string>();

  // Inglês: tradução automática do que muda na aba Português (ver useEnglishTranslation).
  const translator = useEnglishTranslation({
    source: draft
      ? {
          fields: { title: draft.title, tagline: draft.tagline, headline: draft.headline, metaTitle: draft.metaTitle, metaDescription: draft.metaDescription, coverAlt: draft.coverAlt },
          markdown: draft.markdown,
          faq: filledFaq(draft.faq),
        }
      : null,
    en: draft?.en,
    setEn: (change) => {
      setDirty(true);
      setDraft((current) => (current ? { ...current, en: change(current.en) } : current));
    },
    body: englishBody,
  });

  useEffect(() => {
    let active = true;
    fetchMaterialFormats().then((result) => {
      if (!active) return;
      setFormats(result.formats);
      setFormatsError(result.error);
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!id) return;
    let active = true;
    getSupabase()
      ?.from("materials")
      .select("*")
      .eq("id", id)
      .maybeSingle()
      .then(({ data, error }) => {
        if (!active) return;
        if (error || !data) setLoadError(error?.message ?? "Material não encontrado.");
        else setDraft(rowToDraft(data));
      });
    return () => {
      active = false;
    };
  }, [id]);

  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  if (loadError) return <p className="text-sm font-medium text-brand-dark">{loadError}</p>;
  if (!draft) return <p className="text-sm text-fg-muted">Carregando material…</p>;

  const currentFormat = formats.find((format) => format.slug === draft.format);
  const formatLabel = (language === "en" ? currentFormat?.name_en || currentFormat?.name : currentFormat?.name) ?? "";

  const update = (patch: Partial<Draft>) => {
    setDirty(true);
    setDraft((current) => {
      if (!current) return current;
      const next = { ...current, ...patch };
      // Slug acompanha o título até ser editado (ou vir junto no patch, como na sugestão da IA).
      if (patch.title !== undefined && patch.slug === undefined && !current.slugTouched) next.slug = slugify(patch.title, 60);
      return next;
    });
  };

  function applySeo(patch: SeoPatch) {
    const { markdown, slug, excerpt, ...fields } = patch;
    update({
      ...fields,
      ...(excerpt !== undefined ? { tagline: excerpt } : {}),
      ...(slug !== undefined ? { slug, slugTouched: true } : {}),
      // Sem o JSON antigo: o editor reabre a partir do Markdown novo.
      ...(markdown !== undefined ? { markdown, json: null } : {}),
    });
    if (markdown !== undefined) setEditorVersion((version) => version + 1);
  }

  async function fillFaqWithAi() {
    if (!draft) return;
    if (
      filledFaq(draft.faq).length &&
      !(await confirm({
        title: "Substituir as perguntas?",
        description: "As perguntas frequentes atuais serão trocadas pelas geradas pela IA.",
        confirmLabel: "Substituir",
        tone: "default",
      }))
    )
      return;
    setGeneratingFaq(true);
    setFaqError(undefined);
    try {
      const faq = await generateFaq({
        kind: "material",
        title: draft.title,
        excerpt: draft.tagline,
        markdown: draft.markdown,
        category: currentFormat?.name ?? "",
        tags: [],
        filePath: draft.filePath || undefined,
      });
      update({ faq });
    } catch (problem) {
      setFaqError(problem instanceof Error ? problem.message : String(problem));
    } finally {
      setGeneratingFaq(false);
    }
  }

  async function uploadImage(file: File, field: "coverUrl" | "imageUrl") {
    const supabase = getSupabase();
    if (!supabase || !draft) return;
    if (!imageTypes.includes(file.type)) return setErrors(["A imagem precisa ser JPG, PNG ou WebP."]);
    if (file.size > imageMaxBytes) return setErrors(["A imagem passa de 5 MB."]);
    setUploading(field);
    // WebP até 1600px: a capa aparece no catálogo e no topo da página do material.
    const image = await optimizeImage(file);
    const path = `${field === "coverUrl" ? "covers" : "images"}/${draft.slug || "material"}-${crypto.randomUUID().slice(0, 8)}.${image.extension}`;
    const { error } = await supabase.storage
      .from("material-images")
      .upload(path, image.blob, { cacheControl: "31536000", contentType: image.contentType });
    setUploading(undefined);
    if (error) return setErrors([`Falha no upload: ${error.message}`]);
    update({ [field]: supabase.storage.from("material-images").getPublicUrl(path).data.publicUrl });
  }

  async function uploadFile(file: File) {
    const supabase = getSupabase();
    if (!supabase || !draft) return;
    if (!fileTypes.includes(file.type)) return setErrors(["Formato não aceito: use PDF, XLSX, XLS, DOCX, PPTX, ZIP ou CSV."]);
    if (file.size > fileMaxBytes) return setErrors(["O arquivo passa de 50 MB."]);
    setUploading("file");
    const dot = file.name.lastIndexOf(".");
    const base = slugify(dot > 0 ? file.name.slice(0, dot) : file.name, 60) || "material";
    const extension = dot > 0 ? file.name.slice(dot + 1).toLowerCase() : "pdf";
    // Pasta aleatória: o caminho não é adivinhável (o bucket é privado de qualquer forma).
    const path = `${crypto.randomUUID()}/${base}.${extension}`;
    const { error } = await supabase.storage.from("material-files").upload(path, file, { contentType: file.type });
    setUploading(undefined);
    if (error) return setErrors([`Falha no upload: ${error.message}`]);
    if (draft.filePath) setOrphans((list) => [...list, draft.filePath]);
    update({ filePath: path, fileName: `${base}.${extension}`, fileSize: file.size });
  }

  /** Link de 60 s para conferir o arquivo (só staff tem leitura no bucket). */
  async function testDownload() {
    const supabase = getSupabase();
    if (!supabase || !draft?.filePath) return;
    const { data, error } = await supabase.storage.from("material-files").createSignedUrl(draft.filePath, 60, { download: draft.fileName || true });
    if (error) return setErrors([`Não foi possível gerar o link: ${error.message}`]);
    window.open(data.signedUrl, "_blank", "noopener");
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const supabase = getSupabase();
    if (!supabase || !draft) return;
    const problems = validate(draft, formats);
    setErrors(problems);
    if (problems.length) return;

    const publishedAt = draft.status === "published" ? (draft.publishedAt ?? new Date().toISOString()) : draft.publishedAt;
    const faq = filledFaq(draft.faq);
    const record: Database["public"]["Tables"]["materials"]["Update"] = {
      title: draft.title.trim(),
      slug: draft.slug,
      format: draft.format,
      // Espelho do nome em português (o site lê o nome pela tabela de formatos).
      type: formats.find((format) => format.slug === draft.format)?.name ?? "",
      tagline: draft.tagline.trim(),
      headline: draft.headline.trim() || null,
      description_md: draft.markdown,
      description_json: draft.json as unknown as Json,
      cover_image_url: draft.coverUrl || null,
      cover_image_alt: draft.coverAlt.trim() || null,
      image_url: draft.imageUrl || null,
      file_path: draft.filePath || null,
      file_name: draft.fileName || null,
      file_size: draft.fileSize,
      meta_title: draft.metaTitle.trim() || null,
      meta_description: draft.metaDescription.trim() || null,
      faq: faq.length ? (faq as unknown as Json) : null,
      status: draft.status,
      sort_order: draft.sortOrder,
      published_at: publishedAt,
      en: englishToJson(draft.en, englishBody, true),
    };

    setSaving(true);
    const result = draft.id
      ? await supabase.from("materials").update(record).eq("id", draft.id).select("id").single()
      : await supabase
          .from("materials")
          .insert({ ...record, slug: draft.slug, title: draft.title.trim() })
          .select("id")
          .single();
    setSaving(false);

    if (result.error) {
      const duplicate = result.error.code === "23505";
      return setErrors([duplicate ? "Já existe um material com esse slug." : `Não foi possível salvar: ${result.error.message}`]);
    }
    if (orphans.length) {
      await supabase.storage.from("material-files").remove(orphans);
      setOrphans([]);
    }
    setDirty(false);
    setSavedAt(new Date());
    setDraft({ ...draft, id: result.data.id, publishedAt });
    if (!draft.id) window.history.replaceState(null, "", `/admin/materiais/editor/?id=${result.data.id}`);
  }

  const imagePicker = (field: "coverUrl" | "imageUrl", label: string) => (
    <label className={`${adminSecondary} cursor-pointer`}>
      {uploading === field ? "Enviando…" : label}
      <input
        type="file"
        accept={imageTypes.join(",")}
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) uploadImage(file, field);
          e.target.value = "";
        }}
      />
    </label>
  );

  return (
    <form onSubmit={save} noValidate>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link href="/admin/materiais/" className="text-sm font-medium text-fg-muted hover:text-fg">
            ← Materiais
          </Link>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-ink">{draft.id ? "Editar material" : "Novo material"}</h1>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {savedAt && !dirty && <span className="text-sm text-fg-muted">Salvo às {savedAt.toLocaleTimeString("pt-BR")}</span>}
          <button type="button" onClick={() => setPreview((v) => !v)} className={adminSecondary} aria-pressed={preview}>
            {preview ? "Voltar a editar" : "Pré-visualizar"}
          </button>
          <button type="submit" disabled={saving || Boolean(uploading)} className={adminPrimary}>
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

      <LanguageTabs value={language} onChange={setLanguage} englishReady={hasEnglish(draft.en)} translating={translator.translating} />

      {preview ? (
        <article lang={language === "en" ? "en-US" : "pt-BR"} className="mx-auto mt-8 max-w-3xl rounded-3xl border border-border bg-bg p-8 md:p-12">
          <p className="text-sm font-semibold text-fg-muted">{formatLabel}</p>
          <h2 className="mt-3 text-balance text-4xl font-bold tracking-tight text-ink">
            {language === "en" && hasEnglish(draft.en)
              ? draft.en.fields.headline || draft.en.fields.title
              : draft.headline || draft.title || "Título do material"}
          </h2>
          <p className="mt-6 text-lg leading-8 text-fg-muted">
            {language === "en" && hasEnglish(draft.en) ? draft.en.fields.tagline : draft.tagline}
          </p>
          {(draft.imageUrl || draft.coverUrl) && (
            // eslint-disable-next-line @next/next/no-img-element -- prévia de imagem do Storage
            <img src={draft.imageUrl || draft.coverUrl} alt="" className="mt-10 w-full rounded-3xl" />
          )}
          <div className="article-body mt-10" dangerouslySetInnerHTML={{
              __html:
                language === "en" && hasEnglish(draft.en)
                  ? renderMarkdown(draft.en.markdown, "en-US")
                  : renderMarkdown(draft.markdown, "pt-BR"),
            }}
          />
        </article>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-12">
          <div className="space-y-5 lg:col-span-8">
            {language === "en" ? (
              <EnglishPanel
                value={draft.en}
                onChange={(en) => update({ en })}
                defs={englishDefs}
                bodyLabel="Description"
                showFaq
                translator={translator}
              />
            ) : (
            <>
            <Field label="Título" hint="Aparece no card do catálogo e no e-mail de envio.">
              <input value={draft.title} onChange={(e) => update({ title: e.target.value })} className={adminInput} />
            </Field>
            <Field label="Slug (endereço)" hint={`/materiais/${draft.slug || "…"}/ · gerado do título até você editar.`}>
              <input
                value={draft.slug}
                onChange={(e) => update({ slug: slugify(e.target.value, 60) || e.target.value.toLowerCase(), slugTouched: true })}
                className={adminInput}
              />
            </Field>
            <Field label="Resumo" hint="Uma frase: aparece no card do catálogo e logo abaixo do título da página.">
              <textarea value={draft.tagline} onChange={(e) => update({ tagline: e.target.value })} rows={2} className={adminInput} />
            </Field>
            <Field label="Título da página (opcional)" hint="Um título mais completo para o topo da página; vazio usa o título.">
              <input value={draft.headline} onChange={(e) => update({ headline: e.target.value })} className={adminInput} />
            </Field>
            <SeoAssistant
              kind="material"
              title={draft.title}
              excerpt={draft.tagline}
              markdown={draft.markdown}
              category={currentFormat?.name ?? ""}
              tags={[]}
              filePath={draft.filePath || undefined}
              headline={draft.headline}
              published={Boolean(draft.id) && draft.status === "published"}
              current={{ metaTitle: draft.metaTitle, metaDescription: draft.metaDescription, slug: draft.slug }}
              onApply={applySeo}
            />
            <div>
              <p className="text-sm font-medium text-fg">Descrição</p>
              <p className="text-xs text-fg-muted">O que a pessoa vai encontrar, como usar… Use subtítulos e listas.</p>
              <div className="mt-1.5">
                <RichTextEditor
                  key={`${draft.id ?? "novo"}-${editorVersion}`}
                  initialJson={draft.json}
                  initialMarkdown={draft.markdown}
                  onChange={(value: RichTextValue) => update({ markdown: value.markdown, json: value.json })}
                />
              </div>
            </div>
            <FaqEditor
              items={draft.faq}
              onChange={(faq) => update({ faq })}
              description="Aparecem na seção “Dúvidas” da página e no Google (FAQ). Escreva à mão ou gere a partir do arquivo do material e revise."
              actions={
                <>
                  <button type="button" onClick={fillFaqWithAi} disabled={generatingFaq || !draft.filePath} className={adminPrimary}>
                    {generatingFaq ? "Lendo o arquivo…" : "Gerar perguntas com IA"}
                  </button>
                  {faqError && (
                    <span role="alert" className="text-sm font-medium text-brand-dark">
                      {faqError}
                    </span>
                  )}
                </>
              }
            />
            </>
            )}
          </div>

          <aside className="space-y-5 lg:col-span-4">
            <div className="space-y-4 rounded-2xl border border-border bg-surface p-5">
              <Field label="Status">
                <select value={draft.status} onChange={(e) => update({ status: e.target.value as MaterialStatus })} className={adminInput}>
                  {(Object.keys(materialStatusLabel) as MaterialStatus[]).map((status) => (
                    <option key={status} value={status}>
                      {materialStatusLabel[status]}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Formato" hint="Vira o filtro do catálogo no site.">
                <select value={draft.format} onChange={(e) => update({ format: e.target.value })} className={adminInput}>
                  <option value="" disabled>
                    Escolha…
                  </option>
                  {formats.map((format) => (
                    <option key={format.slug} value={format.slug}>
                      {format.name}
                    </option>
                  ))}
                </select>
                {formatsError ? (
                  <span className="mt-1 block text-xs font-medium text-brand-dark">
                    Não deu para carregar os formatos ({formatsError}). A migration 0009 já rodou?
                  </span>
                ) : (
                  <Link href="/admin/materiais/formatos/" className="mt-1 inline-block text-xs font-medium text-brand-dark underline-offset-2 hover:underline">
                    Gerenciar formatos
                  </Link>
                )}
              </Field>
              <Field label="Ordem no catálogo" hint="Maior aparece primeiro.">
                <input
                  type="number"
                  value={draft.sortOrder}
                  onChange={(e) => update({ sortOrder: Number(e.target.value) || 0 })}
                  className={adminInput}
                />
              </Field>
            </div>

            <div className="space-y-4 rounded-2xl border border-border bg-surface p-5">
              <p className="text-sm font-semibold text-fg">Arquivo do material</p>
              {draft.filePath ? (
                <p className="text-sm text-fg">
                  {draft.fileName}
                  {draft.fileSize ? <span className="text-fg-muted"> · {formatSize(draft.fileSize)}</span> : null}
                </p>
              ) : (
                <p className="text-sm font-medium text-brand-dark">
                  Sem arquivo: quem pedir fica registrado na planilha, mas não recebe o e-mail automático.
                </p>
              )}
              <div className="flex flex-wrap gap-2">
                <label className={`${adminSecondary} cursor-pointer`}>
                  {uploading === "file" ? "Enviando…" : draft.filePath ? "Trocar arquivo" : "Enviar arquivo"}
                  <input
                    type="file"
                    accept={fileTypes.join(",")}
                    className="sr-only"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) uploadFile(file);
                      e.target.value = "";
                    }}
                  />
                </label>
                {draft.filePath && (
                  <>
                    <button type="button" onClick={testDownload} className={adminSecondary}>
                      Testar download
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setOrphans((list) => [...list, draft.filePath]);
                        update({ filePath: "", fileName: "", fileSize: null });
                      }}
                      className={adminSecondary}
                    >
                      Remover
                    </button>
                  </>
                )}
              </div>
              <p className="text-xs text-fg-muted">
                PDF, planilha, documento ou ZIP até 50 MB. Fica privado: cada pessoa recebe por e-mail um link que expira.
              </p>
            </div>

            <div className="space-y-4 rounded-2xl border border-border bg-surface p-5">
              <p className="text-sm font-semibold text-fg">Capa (catálogo)</p>
              {draft.coverUrl && (
                // eslint-disable-next-line @next/next/no-img-element -- prévia de imagem do Storage
                <img src={draft.coverUrl} alt="" className="aspect-[842/595] w-full rounded-xl object-cover" />
              )}
              {imagePicker("coverUrl", draft.coverUrl ? "Trocar capa" : "Enviar capa")}
              <p className="text-xs text-fg-muted">JPG, PNG ou WebP até 5 MB, na proporção 842×595 (paisagem, como as atuais).</p>
              {draft.coverUrl && (
                <Field label="Descrição da capa (alt)">
                  <input value={draft.coverAlt} onChange={(e) => update({ coverAlt: e.target.value })} className={adminInput} />
                </Field>
              )}
            </div>

            <div className="space-y-4 rounded-2xl border border-border bg-surface p-5">
              <p className="text-sm font-semibold text-fg">Imagem de destaque (opcional)</p>
              {draft.imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element -- prévia de imagem do Storage
                <img src={draft.imageUrl} alt="" className="aspect-square w-full rounded-xl bg-bg object-contain" />
              )}
              <div className="flex flex-wrap gap-2">
                {imagePicker("imageUrl", draft.imageUrl ? "Trocar imagem" : "Enviar imagem")}
                {draft.imageUrl && (
                  <button type="button" onClick={() => update({ imageUrl: "" })} className={adminSecondary}>
                    Remover
                  </button>
                )}
              </div>
              <p className="text-xs text-fg-muted">Mockup do material (fundo transparente), quadrado. Sem ela, a página usa a capa.</p>
            </div>

            <div className="space-y-4 rounded-2xl border border-border bg-surface p-5">
              <p className="text-sm font-semibold text-fg">Google (opcional)</p>
              <Field label="Título para o Google" hint={`${draft.metaTitle.length}/60 · vazio usa o título.`}>
                <input value={draft.metaTitle} onChange={(e) => update({ metaTitle: e.target.value })} maxLength={70} className={adminInput} />
              </Field>
              <Field label="Descrição para o Google" hint={`${draft.metaDescription.length}/160 · vazio usa o começo da descrição.`}>
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
