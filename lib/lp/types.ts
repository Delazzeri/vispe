import type { Locale } from "@/i18n/routing";
import type { Json } from "@/lib/supabase/types";

// Landing pages do admin (tabela landing_pages, 0010). Cada LP é uma lista de
// seções prontas; o conteúdo de cada uma segue o esquema de lib/lp/schema.ts e
// o visual vem de components/lp/.

export type LpImage = { src: string; alt: string };
/** Botão: href vazio (ou "#formulario") rola até o formulário da LP; link externo abre em nova aba. */
export type LpCta = { label: string; href: string };
export type LpTitledText = { title: string; text: string };

/**
 * Variação do topo: "default" (título e botão), "form" (formulário da LP dentro
 * do hero, ao lado do título) e "confirmation" (página de obrigado).
 */
export const lpHeroVariants = ["default", "form", "confirmation"] as const;
export type LpHeroVariant = (typeof lpHeroVariants)[number];

export type LpHero = {
  variant: LpHeroVariant;
  eyebrow: string;
  title: string;
  subtitle: string;
  /** Data/horário do evento; vazio não aparece. */
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
/** Contagem regressiva até `target` ("2026-11-20T19:00", horário de Brasília). */
export type LpCountdown = { title: string; text: string; target: string; expiredText: string; cta: LpCta };
/** Oferta (vendas/upsell): o botão leva ao formulário; "Não, obrigado" vai para outra página. */
export type LpOffer = {
  title: string;
  name: string;
  description: string;
  includes: string[];
  oldPrice: string;
  price: string;
  terms: string;
  guarantee: string;
  cta: LpCta;
  decline: LpCta;
};
export type LpComparison = {
  title: string;
  subtitle: string;
  currentLabel: string;
  upgradeLabel: string;
  rows: { feature: string; current: string; upgrade: string }[];
  cta: LpCta;
};
export type LpProblem = { title: string; problems: string[]; solutionTitle: string; solution: string; cta: LpCta };
export type LpGallery = { title: string; subtitle: string; items: { photo?: LpImage; caption: string }[] };
/** Convite para seguir a Vispe (redes do site) + um botão opcional (ex.: grupo do WhatsApp). */
export type LpFollow = { title: string; text: string; cta: LpCta };

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
/** Depois do envio: mensagem na própria página, ir para a página de obrigado ou para o grupo do WhatsApp. */
export const lpAfterSubmit = ["message", "redirect", "whatsapp"] as const;
export type LpAfterSubmit = (typeof lpAfterSubmit)[number];
export type LpForm = {
  title: string;
  subtitle: string;
  submitLabel: string;
  successMessage: string;
  /** Texto do aceite (LGPD); vazio usa o padrão do site. */
  consent: string;
  fields: LpFormField[];
  afterSubmit: LpAfterSubmit;
  /** Endereço de outra LP (ex.: "obrigado-workshop") ou link completo. */
  redirectTo: string;
  /** Link de convite do grupo do WhatsApp (https://chat.whatsapp.com/…). */
  whatsappGroup: string;
};

export type LpSectionMap = {
  hero: LpHero;
  stats: LpStats;
  benefits: LpBenefits;
  audience: LpAudience;
  steps: LpSteps;
  problem: LpProblem;
  agenda: LpAgenda;
  speakers: LpSpeakers;
  testimonials: LpTestimonials;
  gallery: LpGallery;
  video: LpVideo;
  countdown: LpCountdown;
  offer: LpOffer;
  comparison: LpComparison;
  faq: LpFaq;
  form: LpForm;
  follow: LpFollow;
  cta: LpCtaBlock;
};
export type LpSectionType = keyof LpSectionMap;
export type LpSection = { [T in LpSectionType]: { id: string; type: T; data: LpSectionMap[T] } }[LpSectionType];

export const lpTemplates = ["captura", "vendas", "prelancamento", "evento", "obrigado", "upsell"] as const;
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

/** Âncora do formulário da LP (CTAs com href vazio ou "#formulario"). */
export const lpFormAnchor = "formulario";
