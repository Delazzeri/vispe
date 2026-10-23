import type { Locale } from "@/i18n/routing";
import type { Json } from "@/lib/supabase/types";

// Landing pages do admin (tabela landing_pages, 0010). Cada LP é uma lista de
// seções prontas; o conteúdo de cada uma segue o esquema de lib/lp/schema.ts e
// o visual vem de components/lp/.

export type LpImage = { src: string; alt: string };
/** Botão: href "#formulario" rola até o formulário da LP; link externo abre em nova aba. */
export type LpCta = { label: string; href: string };
export type LpTitledText = { title: string; text: string };

export type LpHero = {
  eyebrow: string;
  title: string;
  subtitle: string;
  /** Data/horário do evento (workshop, superaula); vazio não aparece. */
  date: string;
  image?: LpImage;
  cta: LpCta;
  bullets: string[];
};
export type LpStats = { title: string; items: { value: string; label: string }[] };
// `cta`: botão opcional abaixo da seção (sem texto, não aparece); por padrão rola até o formulário.
export type LpBenefits = { title: string; subtitle: string; items: LpTitledText[]; cta: LpCta };
export type LpAudience = { title: string; subtitle: string; items: string[]; cta: LpCta };
export type LpSteps = { title: string; subtitle: string; items: LpTitledText[]; cta: LpCta };
export type LpAgenda = {
  title: string;
  date: string;
  time: string;
  place: string;
  items: { time: string; title: string; text: string }[];
  cta: LpCta;
};
export type LpSpeakers = { title: string; items: { name: string; role: string; bio: string; photo?: LpImage }[]; cta: LpCta };
export type LpTestimonials = { title: string; items: { name: string; company: string; text: string; photo?: LpImage }[] };
export type LpVideo = { title: string; text: string; youtubeId: string; poster?: LpImage };
export type LpFaq = { title: string; items: { question: string; answer: string }[] };
export type LpCtaBlock = { title: string; text: string; cta: LpCta };

export const lpFieldKinds = ["name", "email", "phone", "company", "role", "revenue", "segment", "message", "text", "select"] as const;
export type LpFieldKind = (typeof lpFieldKinds)[number];
export type LpFormField = {
  /** Chave da coluna na planilha (estável: renomear o rótulo não muda a coluna). */
  id: string;
  kind: LpFieldKind;
  label: string;
  required: boolean;
  /** Opções de "select" (e de "revenue"/"role", quando preenchidas). */
  options: string[];
};
export type LpForm = {
  title: string;
  subtitle: string;
  submitLabel: string;
  successMessage: string;
  /** Texto do aceite (LGPD); vazio usa o padrão do site. */
  consent: string;
  fields: LpFormField[];
};

export type LpSectionMap = {
  hero: LpHero;
  stats: LpStats;
  benefits: LpBenefits;
  audience: LpAudience;
  steps: LpSteps;
  agenda: LpAgenda;
  speakers: LpSpeakers;
  testimonials: LpTestimonials;
  video: LpVideo;
  faq: LpFaq;
  form: LpForm;
  cta: LpCtaBlock;
};
export type LpSectionType = keyof LpSectionMap;
export type LpSection = { [T in LpSectionType]: { id: string; type: T; data: LpSectionMap[T] } }[LpSectionType];

export const lpTemplates = ["diagnostico", "workshop", "ma", "superaula"] as const;
export type LpTemplate = (typeof lpTemplates)[number];

/** Textos em inglês: só o que é texto, por id de seção (fotos e links vêm do português). */
export type LpTranslation = {
  metaTitle?: string;
  metaDescription?: string;
  whatsappMessage?: string;
  sections: Record<string, Json>;
};

export type LandingPage = {
  slug: string;
  template: string;
  name: string;
  sections: LpSection[];
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: string;
  noindex: boolean;
  /** Mensagem do botão de WhatsApp (vazia: a do site). */
  whatsappMessage?: string;
  en?: LpTranslation;
  publishedAt?: string;
  updatedAt?: string;
};

export type LocalizedLandingPage = LandingPage & {
  /** Idioma real dos textos (sem tradução, a /en mostra o português). */
  contentLocale: Locale;
};

/** Âncora do formulário da LP (CTAs com href "#formulario"). */
export const lpFormAnchor = "formulario";
