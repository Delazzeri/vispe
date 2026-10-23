import { asObject } from "@/lib/translation-json";
import type { Json } from "@/lib/supabase/types";
import { lpSectionSpecs, type LpFieldSpec } from "./schema";
import { lpFieldKinds, type LpFieldKind, type LpFormField, type LpSection, type LpSectionType } from "./types";

// Leitura defensiva das seções (landing_pages.sections é jsonb livre): cada
// campo é conferido pelo esquema e ganha um valor padrão, então os componentes
// recebem sempre o formato de lib/lp/types.ts.

type Value = Json | undefined;

const asString = (value: Value) => (typeof value === "string" ? value : "");

function normalizeFormFields(value: Value): LpFormField[] {
  if (!Array.isArray(value)) return [];
  const used = new Set<string>();
  return value.flatMap((raw, index) => {
    const item = asObject(raw);
    if (!item) return [];
    const kind = asString(item.kind) as LpFieldKind;
    if (!lpFieldKinds.includes(kind)) return [];
    // Id estável e único: vira o nome da coluna na planilha.
    let id = asString(item.id).replace(/[^a-z0-9_]/gi, "") || `${kind}${index + 1}`;
    while (used.has(id)) id = `${id}_`;
    used.add(id);
    return [
      {
        id,
        kind,
        label: asString(item.label),
        required: item.required === true,
        options: Array.isArray(item.options) ? item.options.map(asString).filter(Boolean) : [],
      },
    ];
  });
}

/** Normaliza um objeto pelos campos do esquema (usado também nos itens de listas). */
export function normalizeFields(fields: LpFieldSpec[], value: Value): Record<string, unknown> {
  const source = asObject(value ?? null) ?? {};
  const out: Record<string, unknown> = {};
  for (const field of fields) {
    const raw = source[field.key];
    switch (field.kind) {
      case "text":
      case "plain":
        out[field.key] = asString(raw);
        break;
      case "image": {
        const image = asObject(raw ?? null);
        const src = image ? asString(image.src) : "";
        if (src) out[field.key] = { src, alt: asString(image?.alt) };
        break;
      }
      case "cta": {
        const cta = asObject(raw ?? null);
        out[field.key] = { label: cta ? asString(cta.label) : "", href: cta ? asString(cta.href) : "" };
        break;
      }
      case "strings":
        out[field.key] = Array.isArray(raw) ? raw.map(asString).filter(Boolean).slice(0, field.max) : [];
        break;
      case "list":
        out[field.key] = Array.isArray(raw) ? raw.slice(0, field.max).map((item) => normalizeFields(field.fields, item)) : [];
        break;
      case "formFields":
        out[field.key] = normalizeFormFields(raw);
        break;
      case "choice": {
        // Valor fora da lista (ou vazio) vira o primeiro, que é o padrão.
        const value = asString(raw);
        out[field.key] = field.options.some(([option]) => option === value) ? value : field.options[0][0];
        break;
      }
    }
  }
  return out;
}

export function normalizeSections(value: Json | null): LpSection[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((raw, index) => {
    const item = asObject(raw);
    const type = item ? asString(item.type) : "";
    if (!item || !(type in lpSectionSpecs)) return [];
    const id = asString(item.id) || `s${index + 1}`;
    const data = normalizeFields(lpSectionSpecs[type as LpSectionType].fields, item.data);
    // O formato de `data` vem do esquema acima, que espelha lib/lp/types.ts.
    return [{ id, type, data } as LpSection];
  });
}

/** Aceita o link inteiro do YouTube ou só o id. */
export function youtubeId(value: string): string | undefined {
  const trimmed = value.trim();
  if (/^[\w-]{11}$/.test(trimmed)) return trimmed;
  const match = trimmed.match(/(?:youtu\.be\/|v=|embed\/|shorts\/|live\/)([\w-]{11})/);
  return match?.[1];
}
