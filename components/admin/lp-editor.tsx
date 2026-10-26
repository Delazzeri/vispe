"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { optimizeImage } from "@/lib/admin/optimize-image";
import { cn } from "@/lib/cn";
import { normalizeFields, normalizeSections } from "@/lib/lp/normalize";
import { lpSectionSpecs, lpSectionTypes } from "@/lib/lp/schema";
import { translationFromJson } from "@/lib/lp/rows";
import { lpTemplateInfo, templateSections } from "@/lib/lp/templates";
import { englishFromJson, englishToJson, lpTexts, pageTexts, pendingTexts, type LpEnglish, type LpTextEntry } from "@/lib/lp/translation";
import { lpTemplates, type LandingPage, type LpImage, type LpSection, type LpSectionType, type LpTemplate } from "@/lib/lp/types";
import { isWhatsappGroupLink } from "@/lib/lp/whatsapp";
import { slugify } from "@/lib/slugify";
import { getSupabase } from "@/lib/supabase/client";
import { useAdminFeedback } from "./feedback";
import type { Json, LandingPageStatus } from "@/lib/supabase/types";
import { adminInput, adminPrimary, adminSecondary } from "./admin-shell";
import { Field } from "./form-parts";
import { ImageField, ItemControls, LpFieldsEditor, move } from "./lp-fields";
import { lpStatusLabel } from "./lp-list";
import { LpEnglishPanel } from "./lp-english";
import { LpPreview } from "./lp-preview";
import { translateTexts } from "./seo-assistant";

// Editor de landing page: configurações (nome, endereço, SEO, WhatsApp, status)
// e a lista de seções, com os campos gerados pelo esquema (lib/lp/schema.ts).

type Draft = {
  id?: string;
  slug: string;
  slugTouched: boolean;
  name: string;
  template: string;
  sections: LpSection[];
  metaTitle: string;
  metaDescription: string;
  ogImage?: LpImage;
  noindex: boolean;
  whatsappMessage: string;
  status: LandingPageStatus;
  publishedAt: string | null;
  /** Versão em inglês (aba "Inglês"), salva em landing_pages.en. */
  english: LpEnglish;
};

type Tab = "content" | "settings" | "english" | "preview";

/** Pausa nas mudanças do português antes da tradução automática. */
const AUTO_TRANSLATE_MS = 3000;
/** Textos por pedido de tradução (a função limita o tamanho). */
const TRANSLATE_CHUNK = 120;

/** Seções que só podem aparecer uma vez (um h1 e uma âncora #formulario por página). */
const singleSections: LpSectionType[] = ["hero", "form"];

const bucket = "lp-images";

function newSectionId(type: LpSectionType, sections: LpSection[]): string {
  const taken = new Set(sections.map((section) => section.id));
  if (!taken.has(type)) return type;
  let id = `${type}-${Math.random().toString(36).slice(2, 6)}`;
  while (taken.has(id)) id = `${type}-${Math.random().toString(36).slice(2, 6)}`;
  return id;
}

function newSection(type: LpSectionType, sections: LpSection[]): LpSection {
  const data = normalizeFields(lpSectionSpecs[type].fields, null);
  if (type === "form") {
    Object.assign(data, {
      title: "Fale com a Vispe",
      submitLabel: "Enviar",
      fields: [
        { id: "nome", kind: "name", label: "Nome", required: true, options: [] },
        { id: "email", kind: "email", label: "E-mail", required: true, options: [] },
        { id: "whatsapp", kind: "phone", label: "WhatsApp", required: true, options: [] },
      ],
    });
  }
  return { id: newSectionId(type, sections), type, data } as LpSection;
}

/** Primeiro texto da seção, para o cabeçalho do card. */
function sectionSummary(section: LpSection): string {
  const data = section.data as Record<string, unknown>;
  return String(data.title ?? data.eyebrow ?? "").trim();
}

function draftToPage(draft: Draft): LandingPage {
  return {
    slug: draft.slug || "pre-visualizacao",
    template: draft.template,
    name: draft.name,
    sections: draft.sections,
    noindex: draft.noindex,
    whatsappMessage: draft.whatsappMessage || undefined,
    en: translationFromJson(englishToJson(draft.english, draft.sections)),
  };
}

function validate(draft: Draft): string[] {
  const errors: string[] = [];
  if (!draft.name.trim()) errors.push("Dê um nome interno para a LP.");
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(draft.slug)) errors.push("O endereço só aceita letras minúsculas, números e hífens.");
  if (draft.slug === "pagina") errors.push('O endereço "pagina" é reservado. Escolha outro.');
  for (const type of singleSections) {
    if (draft.sections.filter((section) => section.type === type).length > 1) {
      errors.push(`A seção "${lpSectionSpecs[type].label}" só pode aparecer uma vez.`);
    }
  }
  const form = draft.sections.find((section) => section.type === "form");
  if (form?.type === "form") {
    if (!form.data.fields.length) errors.push("O formulário precisa de pelo menos um campo.");
    if (form.data.fields.some((field) => !field.label.trim())) errors.push("Todo campo do formulário precisa de um rótulo.");
    if (form.data.fields.some((field) => field.kind === "select" && field.options.length < 2)) {
      errors.push("Campos de múltipla escolha precisam de pelo menos duas opções.");
    }
    if (form.data.afterSubmit === "redirect" && !form.data.redirectTo.trim()) {
      errors.push("Informe a página de obrigado do formulário (endereço de outra LP ou link).");
    }
    if (form.data.afterSubmit === "whatsapp" && !isWhatsappGroupLink(form.data.whatsappGroup)) {
      errors.push("Informe o link de convite do grupo do WhatsApp (começa com https://chat.whatsapp.com/).");
    }
  }
  if (draft.status === "published") {
    const hero = draft.sections.find((section) => section.type === "hero");
    if (!hero || hero.type !== "hero" || !hero.data.title.trim()) errors.push("Para publicar, a LP precisa de um hero com título.");
    if (hero?.type === "hero" && hero.data.image && !hero.data.image.alt.trim()) errors.push("Descreva a foto do hero (texto alternativo).");
  }
  return errors;
}

export function LpEditor() {
  const { confirm } = useAdminFeedback();
  const params = useSearchParams();
  const router = useRouter();
  const id = params.get("id");
  const modelo = params.get("modelo");
  const [draft, setDraft] = useState<Draft>();
  const [loadError, setLoadError] = useState<string>();
  const [errors, setErrors] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState<string>();
  const [dirty, setDirty] = useState(false);
  const [tab, setTab] = useState<Tab>("content");
  const [open, setOpen] = useState<string>();
  const [adding, setAdding] = useState<LpSectionType>("benefits");
  // Id já carregado no editor: depois de salvar uma LP nova, a URL ganha ?id= sem recarregar.
  const loadedId = useRef<string | null>(null);
  const [translating, setTranslating] = useState(false);
  const [translateError, setTranslateError] = useState<string>();
  const [autoTranslate, setAutoTranslate] = useState(true);
  const [previewLocale, setPreviewLocale] = useState<"pt-BR" | "en-US">("pt-BR");

  useEffect(() => {
    if (id && loadedId.current === id) return;
    let active = true;
    async function load() {
      if (!id) {
        const template: LpTemplate = lpTemplates.includes(modelo as LpTemplate) ? (modelo as LpTemplate) : "captura";
        const info = lpTemplateInfo[template];
        return {
          // Endereço inicial pelo nome do modelo; acompanha o nome até ser editado à mão.
          slug: slugify(info.label, 60),
          slugTouched: false,
          name: info.label,
          template,
          sections: templateSections(template),
          metaTitle: "",
          metaDescription: "",
          noindex: info.noindex,
          whatsappMessage: info.whatsappMessage,
          status: "draft",
          publishedAt: null,
          // Mensagem do WhatsApp em inglês já vem do modelo.
          english: {
            texts: { "page::whatsappMessage": info.whatsappMessageEn },
            source: { "page::whatsappMessage": info.whatsappMessage },
          },
        } satisfies Draft;
      }
      const supabase = getSupabase();
      if (!supabase) throw new Error("Supabase não configurado.");
      const { data, error } = await supabase.from("landing_pages").select("*").eq("id", id).maybeSingle();
      if (error) throw error;
      if (!data) throw new Error("Landing page não encontrada.");
      const sections = normalizeSections(data.sections);
      return {
        id: data.id,
        slug: data.slug,
        slugTouched: true,
        name: data.name,
        template: data.template,
        sections,
        metaTitle: data.meta_title ?? "",
        metaDescription: data.meta_description ?? "",
        ogImage: data.og_image_url ? { src: data.og_image_url, alt: "" } : undefined,
        noindex: data.noindex,
        whatsappMessage: data.whatsapp_message ?? "",
        status: data.status,
        publishedAt: data.published_at,
        english: englishFromJson(data.en, sections),
      } satisfies Draft;
    }
    load()
      .then((next) => active && setDraft(next))
      .catch((problem: unknown) => active && setLoadError(problem instanceof Error ? problem.message : String(problem)));
    return () => {
      active = false;
    };
  }, [id, modelo]);

  // Aviso ao sair com alterações não salvas.
  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  function update(patch: Partial<Draft>) {
    setDirty(true);
    setSaved(undefined);
    setDraft((current) => {
      if (!current) return current;
      const next = { ...current, ...patch };
      // Endereço acompanha o nome até ser editado à mão.
      if (patch.name !== undefined && patch.slug === undefined && !current.slugTouched) next.slug = slugify(patch.name, 60);
      return next;
    });
  }

  const setSections = (sections: LpSection[]) => update({ sections });

  async function upload(file: File): Promise<LpImage | undefined> {
    const supabase = getSupabase();
    if (!supabase || !draft) return undefined;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setErrors(["A imagem precisa ser JPG, PNG ou WebP."]);
      return undefined;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrors(["A imagem passa de 5 MB."]);
      return undefined;
    }
    // WebP até 1600px: foto do hero é o LCP da LP.
    const image = await optimizeImage(file);
    const path = `${draft.slug || "rascunho"}/${crypto.randomUUID().slice(0, 8)}.${image.extension}`;
    const { error } = await supabase.storage.from(bucket).upload(path, image.blob, { cacheControl: "31536000", contentType: image.contentType });
    if (error) {
      setErrors([`Falha no upload: ${error.message}`]);
      return undefined;
    }
    return { src: supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl, alt: "" };
  }

  async function save() {
    if (!draft) return;
    const problems = validate(draft);
    setErrors(problems);
    if (problems.length) return;
    const supabase = getSupabase();
    if (!supabase) return;
    setSaving(true);
    const publishing = draft.status === "published";
    const payload = {
      slug: draft.slug,
      name: draft.name.trim(),
      template: draft.template,
      sections: draft.sections as unknown as Json,
      meta_title: draft.metaTitle.trim() || null,
      meta_description: draft.metaDescription.trim() || null,
      og_image_url: draft.ogImage?.src ?? null,
      noindex: draft.noindex,
      whatsapp_message: draft.whatsappMessage.trim() || null,
      en: englishToJson(draft.english, draft.sections),
      status: draft.status,
      published_at: publishing ? (draft.publishedAt ?? new Date().toISOString()) : draft.publishedAt,
    };
    const result = draft.id
      ? await supabase.from("landing_pages").update(payload).eq("id", draft.id).select("id,published_at").single()
      : await supabase.from("landing_pages").insert(payload).select("id,published_at").single();
    setSaving(false);
    if (result.error) {
      const message = result.error.message.includes("landing_pages_slug_key")
        ? "Já existe uma LP com este endereço. Escolha outro."
        : result.error.message;
      return setErrors([message]);
    }
    setDirty(false);
    setDraft((current) => current && { ...current, id: result.data.id, publishedAt: result.data.published_at });
    setSaved(publishing ? "Salvo e publicado." : "Rascunho salvo.");
    if (!draft.id) {
      loadedId.current = result.data.id;
      router.replace(`/admin/landing-pages/editor/?id=${result.data.id}`);
    }
  }

  // Textos em português que têm versão em inglês (seções + SEO e WhatsApp).
  const entries = useMemo<LpTextEntry[]>(
    () =>
      draft
        ? [
            ...lpTexts(draft.sections),
            ...pageTexts({ metaTitle: draft.metaTitle, metaDescription: draft.metaDescription, whatsappMessage: draft.whatsappMessage }),
          ]
        : [],
    [draft],
  );
  const pending = useMemo(() => (draft ? pendingTexts(entries, draft.english) : []), [entries, draft]);

  const translate = useCallback(async (list: LpTextEntry[]) => {
    if (!list.length) return;
    setTranslating(true);
    setTranslateError(undefined);
    try {
      for (let start = 0; start < list.length; start += TRANSLATE_CHUNK) {
        const chunk = list.slice(start, start + TRANSLATE_CHUNK);
        const result = await translateTexts(Object.fromEntries(chunk.map((entry) => [entry.key, entry.value])));
        setDirty(true);
        setDraft((current) => {
          if (!current) return current;
          const texts = { ...current.english.texts };
          const source = { ...current.english.source };
          // source = o português traduzido (se ele mudar de novo, a chave volta a ficar pendente).
          for (const entry of chunk) {
            if (typeof result[entry.key] === "string" && result[entry.key].trim()) {
              texts[entry.key] = result[entry.key];
              source[entry.key] = entry.value;
            }
          }
          return { ...current, english: { texts, source } };
        });
      }
    } catch (problem) {
      setTranslateError(problem instanceof Error ? problem.message : String(problem));
    } finally {
      setTranslating(false);
    }
  }, []);

  // Automático: depois de uma pausa nas mudanças, traduz só o que falta ou mudou.
  const pendingKey = pending.map((entry) => `${entry.key}=${entry.value}`).join("\n");
  useEffect(() => {
    if (!autoTranslate || !pendingKey || translating) return;
    const timer = setTimeout(() => translate(pending), AUTO_TRANSLATE_MS);
    return () => clearTimeout(timer);
    // pendingKey resume `pending`; uma falha não repete sozinha (só quando o português mudar de novo).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingKey, autoTranslate]);

  /** Edição à mão: vale para o português atual daquele texto. */
  function editEnglish(key: string, value: string) {
    const from = entries.find((entry) => entry.key === key)?.value;
    setDirty(true);
    setSaved(undefined);
    setDraft((current) => {
      if (!current) return current;
      const source = { ...current.english.source };
      if (from !== undefined) source[key] = from;
      return { ...current, english: { texts: { ...current.english.texts, [key]: value }, source } };
    });
  }

  if (loadError) {
    return (
      <p role="alert" className="text-sm font-medium text-brand-dark">
        {loadError} <Link href="/admin/landing-pages/" className="underline">Voltar para a lista</Link>
      </p>
    );
  }
  if (!draft) return <p className="text-sm text-fg-muted">Carregando…</p>;

  const counts = (type: LpSectionType) => draft.sections.filter((section) => section.type === type).length;
  const addable = lpSectionTypes.filter((type) => !singleSections.includes(type) || counts(type) === 0);
  const tabs: { id: Tab; label: string }[] = [
    { id: "content", label: "Seções" },
    { id: "settings", label: "Configurações" },
    { id: "english", label: pending.length ? `Inglês (${pending.length})` : "Inglês" },
    { id: "preview", label: "Pré-visualização" },
  ];

  return (
    // Sem <form> em volta: a prévia tem o formulário da LP (form dentro de form é HTML inválido).
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link href="/admin/landing-pages/" className="text-sm text-fg-muted hover:text-fg">
            ← Landing pages
          </Link>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-ink">{draft.name || "Nova landing page"}</h1>
          <p className="mt-1 text-sm text-fg-muted">
            {lpTemplateInfo[draft.template as LpTemplate]?.label ?? draft.template} · /lp/{draft.slug || "…"}/ · {lpStatusLabel[draft.status]}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {draft.id && draft.status === "published" && !dirty && (
            <a href={`/lp/${draft.slug}/`} target="_blank" rel="noopener" className={adminSecondary}>
              Ver página
            </a>
          )}
          <select
            aria-label="Status"
            value={draft.status}
            onChange={(e) => update({ status: e.target.value as LandingPageStatus })}
            className={cn(adminInput, "mt-0 w-auto")}
          >
            <option value="draft">Rascunho</option>
            <option value="published">Publicada</option>
          </select>
          <button type="button" onClick={save} disabled={saving} className={adminPrimary}>
            {saving ? "Salvando…" : "Salvar"}
          </button>
        </div>
      </div>

      <div aria-live="polite" className="mt-4">
        {errors.length > 0 && (
          <ul role="alert" className="space-y-1 rounded-2xl bg-accent-soft/40 px-5 py-4 text-sm font-medium text-fg">
            {errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        )}
        {saved && <p className="rounded-2xl bg-surface px-5 py-3 text-sm font-medium text-fg">{saved}</p>}
      </div>

      <div role="tablist" aria-label="Partes do editor" className="mt-6 flex gap-1 border-b border-border">
        {tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={tab === item.id}
            onClick={() => setTab(item.id)}
            className={`-mb-px rounded-t-xl border px-4 py-2.5 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark ${
              tab === item.id ? "border-border border-b-bg bg-bg text-ink" : "border-transparent text-fg-muted hover:text-fg"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {tab === "content" && (
        <div className="mt-6 space-y-3">
          {draft.sections.map((section, index) => {
            const spec = lpSectionSpecs[section.type];
            const expanded = open === section.id;
            const summary = sectionSummary(section);
            return (
              <div key={section.id} className="rounded-2xl border border-border bg-surface">
                <div className="flex items-center gap-3 px-4 py-3">
                  <button
                    type="button"
                    onClick={() => setOpen(expanded ? undefined : section.id)}
                    aria-expanded={expanded}
                    className="flex min-w-0 flex-1 items-center gap-3 rounded-lg text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark"
                  >
                    <ChevronDown className={`h-4 w-4 shrink-0 text-fg-muted transition-transform ${expanded ? "rotate-180" : ""}`} aria-hidden />
                    <span className="shrink-0 text-sm font-semibold text-ink">{spec.label}</span>
                    {summary && <span className="truncate text-sm text-fg-muted">{summary}</span>}
                  </button>
                  <ItemControls
                    index={index}
                    count={draft.sections.length}
                    label={`seção ${spec.label}`}
                    onMove={(delta) => setSections(move(draft.sections, index, delta))}
                    onRemove={async () => {
                      const ok = await confirm({
                        title: "Remover seção?",
                        description: `A seção “${spec.label}” e o conteúdo dela saem da página. Vale depois de salvar.`,
                        confirmLabel: "Remover seção",
                      });
                      if (ok) setSections(draft.sections.filter((s) => s.id !== section.id));
                    }}
                  />
                </div>
                {expanded && (
                  <div className="border-t border-border px-4 py-5">
                    <p className="mb-4 text-xs text-fg-muted">{spec.description}</p>
                    <LpFieldsEditor
                      fields={spec.fields}
                      value={section.data as Record<string, unknown>}
                      onChange={(data) => setSections(draft.sections.map((s) => (s.id === section.id ? ({ ...s, data } as LpSection) : s)))}
                      upload={upload}
                    />
                  </div>
                )}
              </div>
            );
          })}

          <div className="flex flex-wrap items-end gap-3 rounded-2xl border border-dashed border-border p-4">
            <Field label="Adicionar seção">
              <select value={addable.includes(adding) ? adding : addable[0]} onChange={(e) => setAdding(e.target.value as LpSectionType)} className={adminInput}>
                {addable.map((type) => (
                  <option key={type} value={type}>
                    {lpSectionSpecs[type].label}
                  </option>
                ))}
              </select>
            </Field>
            <button
              type="button"
              onClick={() => {
                const type = addable.includes(adding) ? adding : addable[0];
                const section = newSection(type, draft.sections);
                setSections([...draft.sections, section]);
                setOpen(section.id);
              }}
              className={adminSecondary}
            >
              Adicionar
            </button>
            <p className="w-full text-xs text-fg-muted">
              Dica: LPs curtas convertem mais. Hero, uma seção que sustente a decisão, o formulário e, se precisar, um FAQ curto.
            </p>
          </div>
        </div>
      )}

      {tab === "settings" && (
        <div className="mt-6 grid gap-5 rounded-2xl border border-border bg-surface p-5 md:grid-cols-2">
          <Field label="Nome interno" hint="Aparece na lista do admin e no nome da aba da planilha.">
            <input value={draft.name} onChange={(e) => update({ name: e.target.value })} className={adminInput} />
          </Field>
          <Field label="Endereço" hint={`/lp/${draft.slug || "…"}/ — mudar depois de divulgar quebra os links já compartilhados.`}>
            <input
              value={draft.slug}
              onChange={(e) => update({ slug: slugify(e.target.value, 60) || e.target.value.toLowerCase(), slugTouched: true })}
              className={adminInput}
            />
          </Field>
          <Field label="Título para o Google" hint={`${draft.metaTitle.length}/50 · vazio usa o título do hero.`}>
            <input value={draft.metaTitle} maxLength={70} onChange={(e) => update({ metaTitle: e.target.value })} className={adminInput} />
          </Field>
          <Field label="Descrição para o Google" hint={`${draft.metaDescription.length}/160 · vazio usa o subtítulo do hero.`}>
            <textarea rows={3} value={draft.metaDescription} maxLength={200} onChange={(e) => update({ metaDescription: e.target.value })} className={adminInput} />
          </Field>
          <div className="md:col-span-2">
            <Field label="Mensagem do WhatsApp" hint="Texto que já vem escrito quando a pessoa toca no botão do WhatsApp desta LP.">
              <input value={draft.whatsappMessage} onChange={(e) => update({ whatsappMessage: e.target.value })} className={adminInput} />
            </Field>
          </div>
          <div className="md:col-span-2">
            <ImageField label="Imagem de compartilhamento (WhatsApp, LinkedIn) — 1200×630, opcional" value={draft.ogImage} onChange={(ogImage) => update({ ogImage })} upload={upload} />
          </div>
          <label className="flex items-start gap-3 text-sm text-fg md:col-span-2">
            <input type="checkbox" checked={draft.noindex} onChange={(e) => update({ noindex: e.target.checked })} className="mt-0.5 h-4 w-4 accent-ink" />
            <span>
              <span className="font-medium">Não indexar no Google</span>
              <span className="block text-xs text-fg-muted">Para páginas só de anúncio: ficam fora do Google e do sitemap, mas abrem normalmente pelo link.</span>
            </span>
          </label>
        </div>
      )}

      {tab === "english" && (
        <LpEnglishPanel
          entries={entries}
          pending={pending}
          english={draft.english}
          onChange={editEnglish}
          translating={translating}
          error={translateError}
          auto={autoTranslate}
          onAutoChange={setAutoTranslate}
          onTranslatePending={() => translate(pending)}
          onTranslateAll={() => translate(entries)}
        />
      )}

      {tab === "preview" && (
        <div className="mt-6">
          <div className="mb-3 flex flex-wrap items-center gap-3">
            <div role="group" aria-label="Idioma da prévia" className="flex gap-1">
              {(["pt-BR", "en-US"] as const).map((locale) => (
                <button
                  key={locale}
                  type="button"
                  aria-pressed={previewLocale === locale}
                  onClick={() => setPreviewLocale(locale)}
                  className={cn(adminSecondary, previewLocale === locale && "border-ink bg-ink text-paper hover:bg-fg")}
                >
                  {locale === "pt-BR" ? "Português" : "Inglês"}
                </button>
              ))}
            </div>
            <p className="text-xs text-fg-muted">Prévia com o conteúdo atual (ainda não salvo inclusive). O formulário não envia nada daqui.</p>
          </div>
          <LpPreview page={draftToPage(draft)} locale={previewLocale} />
        </div>
      )}
    </div>
  );
}
