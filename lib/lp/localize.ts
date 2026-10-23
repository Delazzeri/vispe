import type { Locale } from "@/i18n/routing";
import { asObject } from "@/lib/translation-json";
import type { Json } from "@/lib/supabase/types";
import { lpSectionSpecs, type LpFieldSpec } from "./schema";
import type { LandingPage, LocalizedLandingPage, LpSection } from "./types";

// Versão em inglês da LP: landing_pages.en guarda só os textos, por id de seção,
// no mesmo formato de `data` (fotos, links e estrutura vêm sempre do português).
// Texto vazio no inglês mantém o português daquele campo.

type Value = Json | undefined;

function mergeFields(fields: LpFieldSpec[], base: Record<string, unknown>, override: Value): Record<string, unknown> {
  const source = asObject(override ?? null);
  if (!source) return base;
  const out: Record<string, unknown> = { ...base };
  for (const field of fields) {
    const raw = source[field.key];
    const current = base[field.key];
    switch (field.kind) {
      case "text":
        if (typeof raw === "string" && raw.trim()) out[field.key] = raw;
        break;
      case "image": {
        const alt = asObject(raw ?? null)?.alt;
        if (current && typeof alt === "string" && alt.trim()) out[field.key] = { ...(current as object), alt };
        break;
      }
      case "cta": {
        const label = asObject(raw ?? null)?.label;
        if (typeof label === "string" && label.trim()) out[field.key] = { ...(current as object), label };
        break;
      }
      case "strings":
        if (Array.isArray(raw) && Array.isArray(current)) {
          out[field.key] = current.map((item, index) => {
            const translated = raw[index];
            return typeof translated === "string" && translated.trim() ? translated : item;
          });
        }
        break;
      case "list":
        if (Array.isArray(raw) && Array.isArray(current)) {
          out[field.key] = current.map((item, index) => mergeFields(field.fields, item as Record<string, unknown>, raw[index]));
        }
        break;
      case "formFields":
        if (Array.isArray(raw) && Array.isArray(current)) {
          out[field.key] = current.map((item, index) => {
            const translated = asObject(raw[index] ?? null);
            if (!translated) return item;
            const label = typeof translated.label === "string" && translated.label.trim() ? translated.label : item.label;
            // Opção sem tradução (ou lista mais curta) mantém o português daquela posição.
            const translatedOptions = Array.isArray(translated.options) ? translated.options : [];
            const options = item.options.map((option: string, i: number) => {
              const value = translatedOptions[i];
              return typeof value === "string" && value.trim() ? value : option;
            });
            return { ...item, label, options };
          });
        }
        break;
      case "plain":
      case "choice":
        break;
    }
  }
  return out;
}

function localizeSection(section: LpSection, override: Value): LpSection {
  const data = mergeFields(lpSectionSpecs[section.type].fields, section.data as Record<string, unknown>, override);
  return { ...section, data } as LpSection;
}

/** LP no idioma da página; sem tradução, o português com contentLocale pt-BR. */
export function localizeLandingPage(page: LandingPage, locale: Locale): LocalizedLandingPage {
  if (locale !== "en-US" || !page.en) return { ...page, contentLocale: "pt-BR" };
  const { en } = page;
  return {
    ...page,
    metaTitle: en.metaTitle ?? page.metaTitle,
    metaDescription: en.metaDescription ?? page.metaDescription,
    whatsappMessage: en.whatsappMessage ?? page.whatsappMessage,
    sections: page.sections.map((section) => localizeSection(section, en.sections[section.id])),
    contentLocale: "en-US",
  };
}
