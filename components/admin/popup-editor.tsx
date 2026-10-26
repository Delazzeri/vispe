"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { PopupCard } from "@/components/popups/popup-card";
import { optimizeImage } from "@/lib/admin/optimize-image";
import { cn } from "@/lib/cn";
import { pageShortcuts, popupState, popupStateLabel } from "@/lib/popups/admin";
import { getSupabase } from "@/lib/supabase/client";
import type { PopupDevices, PopupLayout, PopupLocale, PopupPageRule, PopupRecord, PopupTrigger } from "@/lib/supabase/types";
import { adminInput, adminPrimary, adminSecondary } from "./admin-shell";
import { Field } from "./form-parts";

const bucket = "popup-images";

/** Estado do formulário: números e datas como texto (o que os inputs editam). */
type Draft = {
  id?: string;
  name: string;
  active: boolean;
  starts: string;
  ends: string;
  priority: string;
  layout: PopupLayout;
  imageUrl: string | null;
  imageAlt: string;
  imageWidth: number | null;
  imageHeight: number | null;
  title: string;
  body: string;
  ctaLabel: string;
  ctaUrl: string;
  ctaNewTab: boolean;
  locale: PopupLocale;
  pageRule: PopupPageRule;
  paths: string;
  devices: PopupDevices;
  trigger: PopupTrigger;
  triggerValue: string;
  maxViews: string;
  cooldownHours: string;
  hideAfterClick: boolean;
};

type Stats = { views: number; clicks: number; closes: number; days: { day: string; views: number; clicks: number }[] };

const emptyDraft: Draft = {
  name: "",
  active: false,
  starts: "",
  ends: "",
  priority: "0",
  layout: "modal",
  imageUrl: null,
  imageAlt: "",
  imageWidth: null,
  imageHeight: null,
  title: "",
  body: "",
  ctaLabel: "",
  ctaUrl: "",
  ctaNewTab: false,
  locale: "pt-BR",
  pageRule: "all",
  paths: "",
  devices: "all",
  trigger: "delay",
  triggerValue: "5",
  maxViews: "3",
  cooldownHours: "24",
  hideAfterClick: true,
};

/** ISO → "2026-10-26T14:30" no fuso do navegador (o que o datetime-local mostra). */
function toLocalInput(iso: string | null): string {
  if (!iso) return "";
  const date = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

const fromLocalInput = (value: string) => (value ? new Date(value).toISOString() : null);

const splitPaths = (value: string) =>
  value
    .split(/\n|,/)
    .map((path) => path.trim())
    .filter(Boolean);

function fromRecord(record: PopupRecord): Draft {
  return {
    id: record.id,
    name: record.name,
    active: record.active,
    starts: toLocalInput(record.starts_at),
    ends: toLocalInput(record.ends_at),
    priority: String(record.priority),
    layout: record.layout,
    imageUrl: record.image_url,
    imageAlt: record.image_alt,
    imageWidth: record.image_width,
    imageHeight: record.image_height,
    title: record.title,
    body: record.body,
    ctaLabel: record.cta_label,
    ctaUrl: record.cta_url,
    ctaNewTab: record.cta_new_tab,
    locale: record.locale,
    pageRule: record.page_rule,
    paths: record.page_paths.join("\n"),
    devices: record.devices,
    trigger: record.trigger_type,
    triggerValue: String(record.trigger_value),
    maxViews: record.max_views === null ? "" : String(record.max_views),
    cooldownHours: String(record.cooldown_hours),
    hideAfterClick: record.hide_after_click,
  };
}

function toRecord(draft: Draft) {
  return {
    name: draft.name.trim(),
    active: draft.active,
    starts_at: fromLocalInput(draft.starts),
    ends_at: fromLocalInput(draft.ends),
    priority: Number(draft.priority) || 0,
    layout: draft.layout,
    image_url: draft.imageUrl,
    image_alt: draft.imageAlt.trim(),
    image_width: draft.imageWidth,
    image_height: draft.imageHeight,
    title: draft.title.trim(),
    body: draft.body.trim(),
    cta_label: draft.ctaLabel.trim(),
    cta_url: draft.ctaUrl.trim(),
    cta_new_tab: draft.ctaNewTab,
    locale: draft.locale,
    page_rule: draft.pageRule,
    page_paths: draft.pageRule === "all" ? [] : splitPaths(draft.paths),
    devices: draft.devices,
    trigger_type: draft.trigger,
    trigger_value: draft.trigger === "exit" ? 0 : Number(draft.triggerValue) || 0,
    max_views: draft.maxViews.trim() ? Number(draft.maxViews) : null,
    cooldown_hours: Number(draft.cooldownHours) || 0,
    hide_after_click: draft.hideAfterClick,
  };
}

const isWhole = (value: string, min: number, max: number) => /^\d+$/.test(value.trim()) && Number(value) >= min && Number(value) <= max;

function validate(draft: Draft): string[] {
  const errors: string[] = [];
  if (!draft.name.trim()) errors.push("Dê um nome interno ao pop-up.");
  if (!draft.imageUrl && !draft.title.trim() && !draft.body.trim()) errors.push("Coloque uma imagem, um título ou um texto.");
  if (draft.imageUrl && !draft.imageAlt.trim()) errors.push("Descreva a imagem (texto alternativo), para quem usa leitor de tela.");
  if (draft.ctaLabel.trim() && !draft.ctaUrl.trim()) errors.push("O botão precisa do link do pop-up (o botão leva para ele).");
  if (draft.ctaUrl.trim() && !/^(https?:\/\/|\/|mailto:|tel:)/.test(draft.ctaUrl.trim()))
    errors.push("O link deve começar com / (página do site), https:// , mailto: ou tel:.");
  if (draft.pageRule !== "all") {
    const paths = splitPaths(draft.paths);
    if (!paths.length) errors.push("Liste ao menos uma página (ou escolha “Todas as páginas”).");
    const bad = paths.filter((path) => !path.startsWith("/"));
    if (bad.length) errors.push(`As páginas devem começar com /: ${bad.join(", ")}`);
  }
  if (draft.trigger === "delay" && !isWhole(draft.triggerValue, 0, 600)) errors.push("Tempo de espera: de 0 a 600 segundos.");
  if (draft.trigger === "scroll" && !isWhole(draft.triggerValue, 1, 100)) errors.push("Rolagem: de 1% a 100% da página.");
  if (draft.maxViews.trim() && !isWhole(draft.maxViews, 1, 1000)) errors.push("Máximo de exibições: um número a partir de 1 (ou vazio para sem limite).");
  if (!isWhole(draft.cooldownHours, 0, 8760)) errors.push("Intervalo entre exibições: de 0 a 8760 horas.");
  if (!/^-?\d+$/.test(draft.priority.trim())) errors.push("Prioridade: um número inteiro.");
  if (draft.starts && draft.ends && new Date(draft.starts) >= new Date(draft.ends)) errors.push("O fim do período tem que ser depois do início.");
  return errors;
}

const number = new Intl.NumberFormat("pt-BR");
const percent = new Intl.NumberFormat("pt-BR", { style: "percent", maximumFractionDigits: 1 });

export function PopupEditor() {
  const params = useSearchParams();
  const router = useRouter();
  const id = params.get("id");
  const [draft, setDraft] = useState<Draft>();
  const [loadError, setLoadError] = useState<string>();
  const [errors, setErrors] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saved, setSaved] = useState<string>();
  const [stats, setStats] = useState<Stats>();
  const [now, setNow] = useState(0);
  // Imagem que está salva no banco: trocada ou removida, o arquivo antigo sai do Storage depois de salvar.
  const savedImage = useRef<string | null>(null);
  const loadedId = useRef<string | null>(null);

  useEffect(() => {
    if (id && loadedId.current === id) return;
    let active = true;
    async function load(): Promise<Draft | string> {
      if (!id) return { ...emptyDraft };
      const supabase = getSupabase();
      if (!supabase) return "Supabase não configurado.";
      const { data, error } = await supabase.from("popups").select("*").eq("id", id).maybeSingle();
      if (error) return error.message;
      if (!data) return "Pop-up não encontrado.";
      const { data: days } = await supabase.from("popup_daily_stats").select("day,views,clicks,closes").eq("popup_id", id).order("day", { ascending: false });
      if (active) {
        const list = days ?? [];
        setStats({
          views: list.reduce((sum, d) => sum + d.views, 0),
          clicks: list.reduce((sum, d) => sum + d.clicks, 0),
          closes: list.reduce((sum, d) => sum + d.closes, 0),
          days: list.slice(0, 14),
        });
      }
      return fromRecord(data);
    }
    load().then((result) => {
      if (!active) return;
      setNow(Date.now());
      if (typeof result === "string") return setLoadError(result);
      loadedId.current = result.id ?? null;
      savedImage.current = result.imageUrl;
      setDraft(result);
    });
    return () => {
      active = false;
    };
  }, [id]);

  const update = (patch: Partial<Draft>) => {
    setSaved(undefined);
    setDraft((current) => (current ? { ...current, ...patch } : current));
  };

  async function upload(file: File | undefined) {
    if (!file || !draft) return;
    const supabase = getSupabase();
    if (!supabase) return;
    setUploading(true);
    try {
      // WebP até 1200px (o pop-up ocupa no máximo ~450px de largura; 2x para telas densas).
      const image = await optimizeImage(file, 1200);
      const bitmap = await createImageBitmap(image.blob);
      const size = { width: bitmap.width, height: bitmap.height };
      bitmap.close();
      const path = `${draft.id ?? "novo"}/${crypto.randomUUID().slice(0, 8)}.${image.extension}`;
      const { error } = await supabase.storage.from(bucket).upload(path, image.blob, { cacheControl: "31536000", contentType: image.contentType });
      if (error) return setErrors([`Falha no upload: ${error.message}`]);
      update({ imageUrl: supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl, imageWidth: size.width, imageHeight: size.height });
    } finally {
      setUploading(false);
    }
  }

  async function save() {
    if (!draft) return;
    const problems = validate(draft);
    setErrors(problems);
    setSaved(undefined);
    if (problems.length) return;
    const supabase = getSupabase();
    if (!supabase) return;
    setSaving(true);
    const record = toRecord(draft);
    const result = draft.id
      ? await supabase.from("popups").update(record).eq("id", draft.id).select("id").single()
      : await supabase.from("popups").insert(record).select("id").single();
    setSaving(false);
    if (result.error || !result.data) return setErrors([result.error?.message ?? "Não foi possível salvar."]);
    const previous = savedImage.current;
    if (previous && previous !== draft.imageUrl) {
      const path = previous.split(`/${bucket}/`)[1];
      if (path) await supabase.storage.from(bucket).remove([decodeURIComponent(path)]);
    }
    savedImage.current = draft.imageUrl;
    setNow(Date.now());
    setSaved(draft.active ? "Salvo. As mudanças já valem no site (quem está com o site aberto vê em até 5 minutos)." : "Salvo (pausado: não aparece no site).");
    if (!draft.id) {
      loadedId.current = result.data.id;
      setDraft({ ...draft, id: result.data.id });
      router.replace(`/admin/popups/editor/?id=${result.data.id}`);
    }
  }

  if (loadError) return <p className="text-sm font-medium text-brand-dark">{loadError}</p>;
  if (!draft) return <p className="text-sm text-fg-muted">Carregando…</p>;

  const state = popupState({ active: draft.active, starts_at: fromLocalInput(draft.starts), ends_at: fromLocalInput(draft.ends) }, now);
  const previewContent = {
    layout: draft.layout,
    image_url: draft.imageUrl,
    image_alt: draft.imageAlt,
    image_width: draft.imageWidth,
    image_height: draft.imageHeight,
    title: draft.title,
    body: draft.body,
    cta_label: draft.ctaLabel,
    cta_url: draft.ctaUrl,
    cta_new_tab: draft.ctaNewTab,
  };
  const addPath = (path: string) => {
    const current = splitPaths(draft.paths);
    if (!current.includes(path)) update({ paths: [...current, path].join("\n") });
  };

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link href="/admin/popups/" className="text-sm text-fg-muted hover:text-fg">
            ← Pop-ups
          </Link>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-ink">{draft.name || "Novo pop-up"}</h1>
          <p className="mt-1 text-sm text-fg-muted">{popupStateLabel[state]}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 text-sm font-medium text-fg">
            <input type="checkbox" checked={draft.active} onChange={(e) => update({ active: e.target.checked })} className="h-4 w-4 accent-ink" />
            Ligado
          </label>
          <button type="button" onClick={save} disabled={saving || uploading} className={adminPrimary}>
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

      <div className="mt-6 grid gap-6 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-7">
          <Group title="Conteúdo">
            <Field label="Nome interno" hint="Só aparece aqui no admin.">
              <input value={draft.name} onChange={(e) => update({ name: e.target.value })} className={adminInput} placeholder="Ex.: Workshop de caixa — novembro" />
            </Field>
            <Choice
              label="Formato"
              value={draft.layout}
              onChange={(layout) => update({ layout })}
              options={[
                { value: "modal", label: "Centro da tela", hint: "Escurece o fundo; chama mais atenção." },
                { value: "corner", label: "Canto da tela", hint: "Card no canto inferior; não interrompe a leitura." },
              ]}
            />
            <div>
              <p className="text-sm font-medium text-fg">Imagem (opcional)</p>
              <p className="text-xs text-fg-muted">JPG, PNG ou WebP até 5 MB; vira WebP de até 1200 px.</p>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <label className={cn(adminSecondary, "cursor-pointer")}>
                  {uploading ? "Enviando…" : draft.imageUrl ? "Trocar imagem" : "Enviar imagem"}
                  <input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" disabled={uploading} onChange={(e) => upload(e.target.files?.[0])} />
                </label>
                {draft.imageUrl && (
                  <button type="button" onClick={() => update({ imageUrl: null, imageWidth: null, imageHeight: null })} className={adminSecondary}>
                    Remover imagem
                  </button>
                )}
              </div>
              {draft.imageUrl && (
                <div className="mt-3">
                  <Field label="Descrição da imagem" hint="Texto alternativo: o que a imagem mostra ou diz.">
                    <input value={draft.imageAlt} onChange={(e) => update({ imageAlt: e.target.value })} className={adminInput} />
                  </Field>
                </div>
              )}
            </div>
            <Field label="Título (opcional)">
              <input value={draft.title} onChange={(e) => update({ title: e.target.value })} className={adminInput} />
            </Field>
            <Field label="Texto (opcional)">
              <textarea value={draft.body} rows={3} onChange={(e) => update({ body: e.target.value })} className={adminInput} />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Link (opcional)" hint="Clicar em qualquer parte do pop-up leva para cá. Página do site (/lp/workshop) ou endereço completo.">
                <input value={draft.ctaUrl} onChange={(e) => update({ ctaUrl: e.target.value })} className={adminInput} placeholder="/lp/…" />
              </Field>
              <Field label="Texto do botão (opcional)" hint="Vazio: sem botão; o pop-up continua clicável pelo link.">
                <input value={draft.ctaLabel} onChange={(e) => update({ ctaLabel: e.target.value })} className={adminInput} placeholder="Ex.: Quero participar" />
              </Field>
            </div>
            <label className="flex items-center gap-2 text-sm text-fg">
              <input type="checkbox" checked={draft.ctaNewTab} onChange={(e) => update({ ctaNewTab: e.target.checked })} className="h-4 w-4 accent-ink" />
              Abrir o link em nova aba
            </label>
          </Group>

          <Group title="Onde aparece">
            <Choice
              label="Idioma do site"
              value={draft.locale}
              onChange={(locale) => update({ locale })}
              options={[
                { value: "pt-BR", label: "Português" },
                { value: "en-US", label: "Inglês (/en)" },
                { value: "all", label: "Os dois" },
              ]}
            />
            <Choice
              label="Páginas"
              value={draft.pageRule}
              onChange={(pageRule) => update({ pageRule })}
              options={[
                { value: "all", label: "Todas as páginas" },
                { value: "include", label: "Só nestas" },
                { value: "exclude", label: "Todas, menos estas" },
              ]}
            />
            {draft.pageRule !== "all" && (
              <div>
                <Field label="Endereços" hint="Um por linha, como aparece no navegador depois do domínio. Termine com * para incluir as páginas de dentro: /blog/* vale para o blog e todos os artigos.">
                  <textarea value={draft.paths} rows={4} onChange={(e) => update({ paths: e.target.value })} className={cn(adminInput, "font-mono")} placeholder={"/\n/blog/*"} />
                </Field>
                <div className="mt-2 flex flex-wrap gap-2">
                  {pageShortcuts.flatMap((page) =>
                    (draft.locale === "en-US" ? [page.en] : draft.locale === "all" ? [page.pt, page.en] : [page.pt]).map((path) => (
                      <button key={path} type="button" onClick={() => addPath(path)} className="rounded-full border border-border px-3 py-1 text-xs text-fg-muted hover:border-fg/30 hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark">
                        + {page.label}
                        {draft.locale === "all" && path.startsWith("/en") ? " (en)" : ""}
                      </button>
                    )),
                  )}
                </div>
              </div>
            )}
            <Choice
              label="Aparelhos"
              value={draft.devices}
              onChange={(devices) => update({ devices })}
              options={[
                { value: "all", label: "Todos" },
                { value: "desktop", label: "Só computador" },
                { value: "mobile", label: "Só celular" },
              ]}
            />
          </Group>

          <Group title="Quando aparece">
            <Choice
              label="Gatilho"
              value={draft.trigger}
              onChange={(trigger) => update({ trigger, triggerValue: trigger === "scroll" ? "50" : trigger === "delay" ? "5" : draft.triggerValue })}
              options={[
                { value: "delay", label: "Depois de um tempo" },
                { value: "scroll", label: "Ao rolar a página" },
                { value: "exit", label: "Ao tentar sair", hint: "Quando o mouse vai para fora da janela. No celular, aparece ao rolar metade da página." },
              ]}
            />
            {draft.trigger !== "exit" && (
              <Field label={draft.trigger === "delay" ? "Segundos depois de abrir a página" : "Porcentagem da página rolada"}>
                <input inputMode="numeric" value={draft.triggerValue} onChange={(e) => update({ triggerValue: e.target.value })} className={cn(adminInput, "max-w-32")} />
              </Field>
            )}
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Começa em (opcional)">
                <input type="datetime-local" value={draft.starts} onChange={(e) => update({ starts: e.target.value })} className={adminInput} />
              </Field>
              <Field label="Termina em (opcional)">
                <input type="datetime-local" value={draft.ends} onChange={(e) => update({ ends: e.target.value })} className={adminInput} />
              </Field>
            </div>
            <Field label="Prioridade" hint="Se mais de um pop-up vale para a mesma página, aparece o de número maior.">
              <input inputMode="numeric" value={draft.priority} onChange={(e) => update({ priority: e.target.value })} className={cn(adminInput, "max-w-32")} />
            </Field>
          </Group>

          <Group title="Quantas vezes (por visitante)">
            <p className="text-xs text-fg-muted">Contado no navegador de cada pessoa, sem identificá-la. Quem limpa os dados do navegador pode ver de novo.</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Máximo de exibições" hint="Vazio: sem limite.">
                <input inputMode="numeric" value={draft.maxViews} onChange={(e) => update({ maxViews: e.target.value })} className={adminInput} />
              </Field>
              <Field label="Intervalo mínimo (horas)" hint="0: pode aparecer a cada página visitada.">
                <input inputMode="numeric" value={draft.cooldownHours} onChange={(e) => update({ cooldownHours: e.target.value })} className={adminInput} />
              </Field>
            </div>
            <label className="flex items-center gap-2 text-sm text-fg">
              <input type="checkbox" checked={draft.hideAfterClick} onChange={(e) => update({ hideAfterClick: e.target.checked })} className="h-4 w-4 accent-ink" />
              Não mostrar mais para quem clicou no botão
            </label>
          </Group>
        </div>

        <aside className="space-y-6 lg:col-span-5">
          <div className="lg:sticky lg:top-6">
            <p className="text-sm font-semibold text-fg">Prévia</p>
            <div
              className={cn(
                "relative mt-2 flex min-h-96 overflow-hidden rounded-3xl border border-border bg-bg p-4",
                draft.layout === "modal" ? "items-center justify-center" : "items-end justify-start",
              )}
            >
              {draft.layout === "modal" && <div aria-hidden className="absolute inset-0 bg-ink/50" />}
              <div className="relative w-full max-w-md">
                {draft.imageUrl || draft.title || draft.body ? (
                  <PopupCard popup={previewContent} headingId="popup-preview" closeLabel="Fechar" preview />
                ) : (
                  <p className="rounded-2xl bg-surface p-6 text-center text-sm text-fg-muted">Coloque uma imagem, um título ou um texto para ver a prévia.</p>
                )}
              </div>
            </div>

            {stats && (
              <div className="mt-6 rounded-2xl border border-border bg-surface p-5">
                <p className="text-sm font-semibold text-fg">Resultados</p>
                <dl className="mt-3 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
                  <Stat label="Exibições" value={number.format(stats.views)} />
                  <Stat label="Cliques" value={number.format(stats.clicks)} />
                  <Stat label="Taxa de clique" value={stats.views ? percent.format(stats.clicks / stats.views) : "—"} />
                  <Stat label="Fechados" value={number.format(stats.closes)} />
                </dl>
                {stats.days.length > 0 && (
                  <details className="mt-4 text-sm">
                    <summary className="cursor-pointer rounded-sm text-fg-muted hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark">
                      Por dia (últimos 14 com exibição)
                    </summary>
                    <table className="mt-2 w-full text-left">
                      <thead className="text-fg-muted">
                        <tr>
                          <th className="py-1 font-medium">Dia</th>
                          <th className="py-1 text-right font-medium">Exibições</th>
                          <th className="py-1 text-right font-medium">Cliques</th>
                        </tr>
                      </thead>
                      <tbody className="tabular-nums">
                        {stats.days.map((day) => (
                          <tr key={day.day} className="border-t border-border">
                            <td className="py-1">{day.day.split("-").reverse().join("/")}</td>
                            <td className="py-1 text-right">{number.format(day.views)}</td>
                            <td className="py-1 text-right">{number.format(day.clicks)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </details>
                )}
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset className="space-y-4 rounded-2xl border border-border bg-surface p-5">
      <legend className="px-1 text-sm font-semibold text-fg">{title}</legend>
      {children}
    </fieldset>
  );
}

function Choice<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: T;
  onChange: (value: T) => void;
  options: { value: T; label: string; hint?: string }[];
}) {
  const hint = options.find((option) => option.value === value)?.hint;
  return (
    <div role="radiogroup" aria-label={label}>
      <p className="text-sm font-medium text-fg">{label}</p>
      <div className="mt-1.5 flex flex-wrap gap-2">
        {options.map((option) => (
          <label
            key={option.value}
            className={cn(
              "cursor-pointer rounded-xl border px-3 py-2 text-sm transition-colors has-focus-visible:ring-2 has-focus-visible:ring-brand-dark",
              value === option.value ? "border-ink bg-ink text-paper" : "border-border text-fg hover:bg-bg",
            )}
          >
            <input type="radio" name={label} value={option.value} checked={value === option.value} onChange={() => onChange(option.value)} className="sr-only" />
            {option.label}
          </label>
        ))}
      </div>
      {hint && <p className="mt-1 text-xs text-fg-muted">{hint}</p>}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-fg-muted">{label}</dt>
      <dd className="mt-0.5 text-lg font-semibold text-fg">{value}</dd>
    </div>
  );
}
