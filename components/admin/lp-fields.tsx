"use client";

import { useId, useState } from "react";
import { ArrowDown, ArrowUp, ImagePlus, Trash2 } from "lucide-react";
import { normalizeFields } from "@/lib/lp/normalize";
import { lpFieldKindLabels, type LpFieldSpec } from "@/lib/lp/schema";
import { lpFieldKinds, type LpCta, type LpFieldKind, type LpFormField, type LpImage } from "@/lib/lp/types";
import { slugify } from "@/lib/slugify";
import { adminInput, adminSecondary } from "./admin-shell";
import { Field } from "./form-parts";

// Campos do editor de LP gerados pelo esquema (lib/lp/schema.ts): cada tipo de
// seção ganha o formulário certo sem código próprio.

type Data = Record<string, unknown>;
export type ImageUploader = (file: File) => Promise<LpImage | undefined>;

const iconButton =
  "inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-surface text-fg-muted hover:bg-bg hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark disabled:opacity-40";

/** Move o item `index` uma posição para cima (-1) ou para baixo (+1). */
export function move<T>(items: readonly T[], index: number, delta: -1 | 1): T[] {
  const target = index + delta;
  if (target < 0 || target >= items.length) return [...items];
  const next = [...items];
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}

export function ItemControls({
  index,
  count,
  onMove,
  onRemove,
  label,
}: {
  index: number;
  count: number;
  onMove: (delta: -1 | 1) => void;
  onRemove: () => void;
  label: string;
}) {
  return (
    <div className="flex gap-1.5">
      <button type="button" onClick={() => onMove(-1)} disabled={index === 0} aria-label={`Subir ${label}`} className={iconButton}>
        <ArrowUp className="h-4 w-4" aria-hidden />
      </button>
      <button type="button" onClick={() => onMove(1)} disabled={index === count - 1} aria-label={`Descer ${label}`} className={iconButton}>
        <ArrowDown className="h-4 w-4" aria-hidden />
      </button>
      <button type="button" onClick={onRemove} aria-label={`Remover ${label}`} className={iconButton}>
        <Trash2 className="h-4 w-4" aria-hidden />
      </button>
    </div>
  );
}

export function ImageField({ label, value, onChange, upload }: { label: string; value?: LpImage; onChange: (image?: LpImage) => void; upload: ImageUploader }) {
  const inputId = useId();
  const [busy, setBusy] = useState(false);

  async function pick(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    const image = await upload(file);
    setBusy(false);
    if (image) onChange({ src: image.src, alt: value?.alt ?? "" });
  }

  return (
    <div className="text-sm font-medium text-fg">
      {label}
      <div className="mt-1.5 flex flex-wrap items-start gap-4 rounded-xl border border-border bg-surface p-3">
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element -- prévia do admin (URL do Storage)
          <img src={value.src} alt="" className="h-20 w-28 rounded-lg object-cover" />
        ) : (
          <span className="flex h-20 w-28 items-center justify-center rounded-lg bg-bg text-xs font-normal text-fg-muted">Sem imagem</span>
        )}
        <div className="min-w-48 flex-1 space-y-2">
          <div className="flex flex-wrap gap-2">
            <label htmlFor={inputId} className={`${adminSecondary} cursor-pointer`}>
              <ImagePlus className="h-4 w-4" aria-hidden />
              {busy ? "Enviando…" : value ? "Trocar" : "Enviar imagem"}
            </label>
            <input
              id={inputId}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="sr-only"
              onChange={(e) => {
                pick(e.target.files?.[0]);
                e.target.value = "";
              }}
            />
            {value && (
              <button type="button" onClick={() => onChange(undefined)} className={adminSecondary}>
                Remover
              </button>
            )}
          </div>
          {value && (
            <Field label="Descrição da imagem (acessibilidade e Google)">
              <input value={value.alt} onChange={(e) => onChange({ ...value, alt: e.target.value })} className={adminInput} />
            </Field>
          )}
        </div>
      </div>
    </div>
  );
}

function CtaField({ label, value, onChange }: { label: string; value: LpCta; onChange: (cta: LpCta) => void }) {
  return (
    <fieldset className="rounded-xl border border-border p-3">
      <legend className="px-1 text-sm font-medium text-fg">{label}</legend>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Texto do botão" hint="Vazio: o botão não aparece.">
          <input value={value.label} onChange={(e) => onChange({ ...value, label: e.target.value })} className={adminInput} />
        </Field>
        <Field label="Destino" hint="Vazio: rola até o formulário. Ou /contato, ou https://…">
          <input value={value.href} onChange={(e) => onChange({ ...value, href: e.target.value })} className={adminInput} />
        </Field>
      </div>
    </fieldset>
  );
}

const optionKinds: LpFieldKind[] = ["select", "revenue", "role", "segment"];

/** Campos do formulário da LP: tipo, rótulo, obrigatório e opções. */
function FormFieldsEditor({ value, onChange }: { value: LpFormField[]; onChange: (fields: LpFormField[]) => void }) {
  const edit = (index: number, patch: Partial<LpFormField>) => onChange(value.map((field, i) => (i === index ? { ...field, ...patch } : field)));

  function add() {
    const taken = new Set(value.map((field) => field.id));
    let id = "pergunta";
    for (let n = 2; taken.has(id); n++) id = `pergunta${n}`;
    onChange([...value, { id, kind: "text", label: "", required: false, options: [] }]);
  }

  return (
    <fieldset className="rounded-xl border border-border p-3">
      <legend className="px-1 text-sm font-medium text-fg">Campos do formulário</legend>
      <p className="text-xs text-fg-muted">Cada campo vira uma coluna na aba desta LP na planilha. O aceite da LGPD entra sempre.</p>
      <div className="mt-3 space-y-3">
        {value.map((field, index) => (
          <div key={field.id} className="rounded-xl border border-border bg-bg/50 p-3">
            <div className="flex flex-wrap items-end gap-3">
              <Field label="Tipo">
                <select
                  value={field.kind}
                  onChange={(e) => edit(index, { kind: e.target.value as LpFieldKind })}
                  className={adminInput}
                >
                  {lpFieldKinds.map((kind) => (
                    <option key={kind} value={kind}>
                      {lpFieldKindLabels[kind]}
                    </option>
                  ))}
                </select>
              </Field>
              <div className="min-w-48 flex-1">
                <Field label="Rótulo (pergunta)">
                  <input
                    value={field.label}
                    onChange={(e) => {
                      // Campo novo ainda sem rótulo: o id (coluna da planilha) acompanha o primeiro rótulo.
                      const patch: Partial<LpFormField> = { label: e.target.value };
                      if (/^pergunta\d*$/.test(field.id) && !field.label) {
                        const base = slugify(e.target.value, 30).replace(/-/g, "_");
                        if (base && !value.some((other, i) => i !== index && other.id === base)) patch.id = base;
                      }
                      edit(index, patch);
                    }}
                    className={adminInput}
                  />
                </Field>
              </div>
              <label className="flex items-center gap-2 pb-2.5 text-sm text-fg">
                <input type="checkbox" checked={field.required} onChange={(e) => edit(index, { required: e.target.checked })} className="h-4 w-4 accent-ink" />
                Obrigatório
              </label>
              <ItemControls
                index={index}
                count={value.length}
                label={`campo ${field.label || index + 1}`}
                onMove={(delta) => onChange(move(value, index, delta))}
                onRemove={() => onChange(value.filter((_, i) => i !== index))}
              />
            </div>
            {optionKinds.includes(field.kind) && (
              <div className="mt-3">
                <Field
                  label="Opções (uma por linha)"
                  hint={field.kind === "select" ? "Obrigatório para múltipla escolha." : "Vazio: usa as opções padrão do site."}
                >
                  <textarea
                    rows={3}
                    value={field.options.join("\n")}
                    onChange={(e) => edit(index, { options: e.target.value.split("\n") })}
                    onBlur={(e) => edit(index, { options: e.target.value.split("\n").map((o) => o.trim()).filter(Boolean) })}
                    className={adminInput}
                  />
                </Field>
              </div>
            )}
          </div>
        ))}
      </div>
      <button type="button" onClick={add} className={`${adminSecondary} mt-3`}>
        Adicionar campo
      </button>
    </fieldset>
  );
}

/** Editor de um objeto pelos campos do esquema (seção inteira ou item de lista). */
export function LpFieldsEditor({
  fields,
  value,
  onChange,
  upload,
}: {
  fields: LpFieldSpec[];
  value: Data;
  onChange: (value: Data) => void;
  upload: ImageUploader;
}) {
  const set = (key: string, next: unknown) => onChange({ ...value, [key]: next });

  return (
    <div className="space-y-4">
      {fields.map((field) => {
        const current = value[field.key];
        switch (field.kind) {
          case "text":
          case "plain":
            return (
              <Field key={field.key} label={field.label} hint={field.hint}>
                {field.kind === "text" && field.multiline ? (
                  <textarea rows={3} value={String(current ?? "")} onChange={(e) => set(field.key, e.target.value)} className={adminInput} />
                ) : (
                  <input value={String(current ?? "")} onChange={(e) => set(field.key, e.target.value)} className={adminInput} />
                )}
              </Field>
            );
          case "image":
            return (
              <ImageField key={field.key} label={field.label} value={current as LpImage | undefined} onChange={(image) => set(field.key, image)} upload={upload} />
            );
          case "cta":
            return <CtaField key={field.key} label={field.label} value={(current as LpCta) ?? { label: "", href: "" }} onChange={(cta) => set(field.key, cta)} />;
          case "strings": {
            const items = (current as string[]) ?? [];
            return (
              <fieldset key={field.key} className="rounded-xl border border-border p-3">
                <legend className="px-1 text-sm font-medium text-fg">{field.label}</legend>
                <div className="space-y-2">
                  {items.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        aria-label={`${field.itemLabel} ${index + 1}`}
                        value={item}
                        onChange={(e) => set(field.key, items.map((v, i) => (i === index ? e.target.value : v)))}
                        className={`${adminInput} mt-0`}
                      />
                      <ItemControls
                        index={index}
                        count={items.length}
                        label={`${field.itemLabel.toLowerCase()} ${index + 1}`}
                        onMove={(delta) => set(field.key, move(items, index, delta))}
                        onRemove={() => set(field.key, items.filter((_, i) => i !== index))}
                      />
                    </div>
                  ))}
                </div>
                {items.length < field.max && (
                  <button type="button" onClick={() => set(field.key, [...items, ""])} className={`${adminSecondary} mt-3`}>
                    Adicionar {field.itemLabel.toLowerCase()}
                  </button>
                )}
              </fieldset>
            );
          }
          case "list": {
            const items = (current as Data[]) ?? [];
            return (
              <fieldset key={field.key} className="rounded-xl border border-border p-3">
                <legend className="px-1 text-sm font-medium text-fg">{field.label}</legend>
                <div className="space-y-3">
                  {items.map((item, index) => (
                    <div key={index} className="rounded-xl border border-border bg-bg/50 p-3">
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <span className="text-sm font-semibold text-fg">
                          {field.itemLabel} {index + 1}
                        </span>
                        <ItemControls
                          index={index}
                          count={items.length}
                          label={`${field.itemLabel.toLowerCase()} ${index + 1}`}
                          onMove={(delta) => set(field.key, move(items, index, delta))}
                          onRemove={() => set(field.key, items.filter((_, i) => i !== index))}
                        />
                      </div>
                      <LpFieldsEditor
                        fields={field.fields}
                        value={item}
                        onChange={(next) => set(field.key, items.map((v, i) => (i === index ? next : v)))}
                        upload={upload}
                      />
                    </div>
                  ))}
                </div>
                {items.length < field.max && (
                  <button
                    type="button"
                    onClick={() => set(field.key, [...items, normalizeFields(field.fields, null)])}
                    className={`${adminSecondary} mt-3`}
                  >
                    Adicionar {field.itemLabel.toLowerCase()}
                  </button>
                )}
              </fieldset>
            );
          }
          case "choice":
            return (
              <Field key={field.key} label={field.label} hint={field.hint}>
                <select value={String(current ?? field.options[0][0])} onChange={(e) => set(field.key, e.target.value)} className={adminInput}>
                  {field.options.map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </Field>
            );
          case "formFields":
            return <FormFieldsEditor key={field.key} value={(current as LpFormField[]) ?? []} onChange={(next) => set(field.key, next)} />;
        }
      })}
    </div>
  );
}
