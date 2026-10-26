// IDs das plataformas de anúncio, lidos no build (.env.local; ver .env.example e
// docs/marketing-tracking.md). Sem o ID, a plataforma não carrega.
// process.env.NEXT_PUBLIC_* escrito por extenso: é assim que o Next inclui no bundle.

import { brand } from "@/content/brand";
import type { Conversion } from "./events";

const env = (value: string | undefined) => value?.trim() || undefined;

type ConversionIds = Partial<Record<Conversion, string>>;

/** Domínio de produção com e sem www (o Umami só conta visitas neles). */
const siteHost = new URL(brand.url).hostname.replace(/^www\./, "");

export const trackingConfig = {
  umami: {
    /** Umami Cloud → Settings → Websites → o site → Edit → Website ID. Sem consentimento: é anônimo e sem cookies. */
    websiteId: env(process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID),
    domains: env(process.env.NEXT_PUBLIC_UMAMI_DOMAINS) ?? `${siteHost},www.${siteHost}`,
  },
  meta: {
    pixelId: env(process.env.NEXT_PUBLIC_META_PIXEL_ID),
    /** Meta tag de verificação do domínio (alternativa ao registro DNS). */
    domainVerification: env(process.env.NEXT_PUBLIC_META_DOMAIN_VERIFICATION),
  },
  linkedin: {
    partnerId: env(process.env.NEXT_PUBLIC_LINKEDIN_PARTNER_ID),
    /** IDs das conversões do Campaign Manager (tipo "evento específico"). */
    conversions: {
      lead: env(process.env.NEXT_PUBLIC_LINKEDIN_CONVERSION_LEAD),
      registration: env(process.env.NEXT_PUBLIC_LINKEDIN_CONVERSION_REGISTRATION),
      contact: env(process.env.NEXT_PUBLIC_LINKEDIN_CONVERSION_CONTACT),
    } satisfies ConversionIds,
  },
  google: {
    /** Google Ads (AW-…): remarketing e conversões. */
    adsId: env(process.env.NEXT_PUBLIC_GOOGLE_ADS_ID),
    /** Rótulo de cada conversão do Google Ads (o trecho depois da barra em AW-…/rótulo). */
    adsLabels: {
      lead: env(process.env.NEXT_PUBLIC_GOOGLE_ADS_LABEL_LEAD),
      registration: env(process.env.NEXT_PUBLIC_GOOGLE_ADS_LABEL_REGISTRATION),
      contact: env(process.env.NEXT_PUBLIC_GOOGLE_ADS_LABEL_CONTACT),
    } satisfies ConversionIds,
    /** Google Analytics 4 (G-…): só com o consentimento de análise. */
    ga4Id: env(process.env.NEXT_PUBLIC_GA4_ID),
  },
};
