import { asObject } from "@/lib/translation-json";
import type { Json } from "@/lib/supabase/types";
import { lpFieldKindLabels, lpSectionSpecs, type LpFieldSpec } from "./schema";
import type { LpSection } from "./types";

// Tradução das LPs no admin: as seções viram uma lista plana de textos
// ("beneficios::items.1.title" → "Margem real") para traduzir e editar, e o
// inglês volta para landing_pages.en no formato que lib/lp/localize.ts lê.
// en.source guarda o português de cada tradução: o que mudou desde então é
// traduzido de novo; o resto fica como está (inclusive ajustes feitos à mão).

export type LpTextEntry = {
  /** "<id da seção>::<caminho>" — caminho com índices: items.1.title, cta.label. */
  key: string;
  sectionId: string;
  /** Rótulo para o admin: "Benefícios › Benefício 2 › Título". */
  label: string;
  value: string;
  multiline: boolean;
};

export type LpEnglish = {
  /** Inglês por chave (seções e "page::metaTitle", "page::metaDescription", "page::whatsappMessage"). */
  texts: Record<string, string>;
  /** Português de onde saiu cada tradução. */
  source: Record<string, string>;
};

export const emptyLpEnglish: LpEnglish = { texts: {}, source: {} };

/** Textos da página fora das seções (vão para en.metaTitle etc.). */
const pageFields = [
  ["metaTitle", "Configurações › Título para o Google"],
  ["metaDescription", "Configurações › Descrição para o Google"],
  ["whatsappMessage", "Configurações › Mensagem do WhatsApp"],
] as const;
export type LpPageTexts = Record<(typeof pageFields)[number][0], string>;

export function pageTexts(page: LpPageTexts): LpTextEntry[] {
  return pageFields.flatMap(([field, label]) => {
    const value = page[field];
    return value.trim() ? [{ key: `page::${field}`, sectionId: "page", label, value, multiline: field === "metaDescription" }] : [];
  });
}

function walk(fields: LpFieldSpec[], data: Record<string, unknown>, sectionId: string, path: string[], label: string[], out: LpTextEntry[]) {
  const add = (segments: string[], value: unknown, names: string[], multiline = false) => {
    if (typeof value !== "string" || !value.trim()) return;
    out.push({ key: `${sectionId}::${segments.join(".")}`, sectionId, label: names.join(" › "), value, multiline });
  };
  for (const field of fields) {
    const value = data[field.key];
    const segments = [...path, field.key];
    const names = [...label, field.label];
    switch (field.kind) {
      case "text":
        add(segments, value, names, field.multiline);
        break;
      case "image": {
        const image = asObject((value ?? null) as Json);
        if (image) add([...segments, "alt"], image.alt, [...names, "descrição"]);
        break;
      }
      case "cta": {
        const cta = asObject((value ?? null) as Json);
        if (cta) add([...segments, "label"], cta.label, names);
        break;
      }
      case "strings":
        if (Array.isArray(value)) value.forEach((item, index) => add([...segments, String(index)], item, [...label, `${field.itemLabel} ${index + 1}`]));
        break;
      case "list":
        if (Array.isArray(value)) {
          value.forEach((item, index) =>
            walk(field.fields, (item ?? {}) as Record<string, unknown>, sectionId, [...segments, String(index)], [...label, `${field.itemLabel} ${index + 1}`], out),
          );
        }
        break;
      case "formFields":
        if (Array.isArray(value)) {
          value.forEach((item, index) => {
            const formField = (item ?? {}) as { kind?: string; label?: unknown; options?: unknown };
            const name = `Campo ${index + 1} (${lpFieldKindLabels[formField.kind ?? ""] ?? "campo"})`;
            add([...segments, String(index), "label"], formField.label, [...label, name]);
            if (Array.isArray(formField.options)) {
              formField.options.forEach((option, i) => add([...segments, String(index), "options", String(i)], option, [...label, name, `opção ${i + 1}`]));
            }
          });
        }
        break;
      case "plain":
      case "choice":
        break;
    }
  }
}

/** Todos os textos traduzíveis das seções, na ordem da página. */
export function lpTexts(sections: LpSection[]): LpTextEntry[] {
  const out: LpTextEntry[] = [];
  for (const section of sections) {
    const spec = lpSectionSpecs[section.type];
    walk(spec.fields, section.data as Record<string, unknown>, section.id, [], [spec.label], out);
  }
  return out;
}

function getPath(root: unknown, segments: string[]): unknown {
  let current = root;
  for (const segment of segments) {
    if (current === null || typeof current !== "object") return undefined;
    current = (current as Record<string, unknown>)[segment];
  }
  return current;
}

function setPath(root: Record<string, unknown>, segments: string[], value: string) {
  let current: Record<string, unknown> | unknown[] = root;
  segments.forEach((segment, index) => {
    const last = index === segments.length - 1;
    const container = current as Record<string, unknown>;
    if (last) {
      container[segment] = value;
      return;
    }
    if (container[segment] === undefined || container[segment] === null) container[segment] = /^\d+$/.test(segments[index + 1]) ? [] : {};
    current = container[segment] as Record<string, unknown>;
  });
}

const splitKey = (key: string) => {
  const [sectionId, path] = key.split("::");
  return { sectionId, segments: path.split(".") };
};

/** landing_pages.en → rascunho do admin (só as chaves que existem no português atual). */
export function englishFromJson(value: Json | null, sections: LpSection[]): LpEnglish {
  const en = asObject(value);
  if (!en) return emptyLpEnglish;
  const stored = asObject(en.sections ?? null) ?? {};
  const storedSource = asObject(en.source ?? null) ?? {};
  const texts: Record<string, string> = {};
  const source: Record<string, string> = {};
  for (const entry of lpTexts(sections)) {
    const { sectionId, segments } = splitKey(entry.key);
    const translated = getPath(stored[sectionId], segments);
    if (typeof translated === "string" && translated.trim()) {
      texts[entry.key] = translated;
      const from = storedSource[entry.key];
      if (typeof from === "string") source[entry.key] = from;
    }
  }
  for (const [field] of pageFields) {
    const translated = en[field];
    if (typeof translated !== "string" || !translated.trim()) continue;
    const key = `page::${field}`;
    texts[key] = translated;
    const from = storedSource[key];
    if (typeof from === "string") source[key] = from;
  }
  return { texts, source };
}

/** Rascunho do admin → landing_pages.en (null se não há nada em inglês). */
export function englishToJson(english: LpEnglish, sections: LpSection[]): Json | null {
  const current = new Set(lpTexts(sections).map((entry) => entry.key));
  const byIndex: Record<string, Record<string, unknown>> = {};
  const source: Record<string, string> = {};
  const out: Record<string, Json> = {};
  for (const [key, value] of Object.entries(english.texts)) {
    if (!value.trim()) continue;
    if (key.startsWith("page::")) {
      out[key.slice(6)] = value.trim();
      if (english.source[key] !== undefined) source[key] = english.source[key];
      continue;
    }
    if (!current.has(key)) continue;
    const { sectionId, segments } = splitKey(key);
    setPath((byIndex[sectionId] ??= {}), segments, value.trim());
    if (english.source[key] !== undefined) source[key] = english.source[key];
  }
  if (Object.keys(byIndex).length) out.sections = byIndex as Json;
  if (Object.keys(source).length) out.source = source;
  return Object.keys(out).length ? out : null;
}

/** Chaves sem tradução ou cujo português mudou desde a última tradução. */
export function pendingTexts(entries: LpTextEntry[], english: LpEnglish): LpTextEntry[] {
  return entries.filter((entry) => !english.texts[entry.key]?.trim() || english.source[entry.key] !== entry.value);
}
