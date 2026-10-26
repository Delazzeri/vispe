// Meta Pixel, LinkedIn Insight Tag e Google (Ads + GA4): carregamento e tradução
// dos eventos. Quem decide quando carregar é components/tracking/trackers.tsx,
// pelo consentimento do banner (lib/consent.ts).

import type { ConsentCategory } from "@/lib/consent";
import { trackingConfig } from "./config";
import { metaEventName, type TrackEvent } from "./events";

type Queue = { (...args: unknown[]): void };

type Fbq = Queue & {
  callMethod?: (...args: unknown[]) => void;
  queue: unknown[][];
  push: Fbq;
  loaded: boolean;
  version: string;
  disablePushState?: boolean;
};

type Lintrk = ((action: string, data?: Record<string, unknown>) => void) & { q?: unknown[][] };

declare global {
  interface Window {
    fbq?: Fbq;
    _fbq?: Fbq;
    lintrk?: Lintrk;
    _linkedin_partner_id?: string;
    _linkedin_data_partner_ids?: string[];
    dataLayer?: unknown[];
    gtag?: Queue;
  }
}

export type Platform = {
  name: "meta" | "linkedin" | "google";
  /** Categoria do banner que libera a plataforma. */
  category: ConsentCategory;
  enabled: boolean;
  /** Injeta o script (a página vista inicial sai daqui). */
  load(): void;
  track(event: TrackEvent): void;
};

function injectScript(src: string) {
  const script = document.createElement("script");
  script.src = src;
  script.async = true;
  document.head.append(script);
}

const { meta, linkedin, google } = trackingConfig;

const metaPlatform: Platform = {
  name: "meta",
  category: "marketing",
  enabled: Boolean(meta.pixelId),
  load() {
    if (!meta.pixelId || window.fbq) return;
    // Fila do snippet oficial: guarda as chamadas até o fbevents.js chegar.
    const fbq = ((...args: unknown[]) => {
      if (fbq.callMethod) fbq.callMethod(...args);
      else fbq.queue.push(args);
    }) as Fbq;
    fbq.queue = [];
    fbq.push = fbq;
    fbq.loaded = true;
    fbq.version = "2.0";
    // Páginas vistas da navegação interna saem do trackers.tsx (sem contar duas vezes).
    fbq.disablePushState = true;
    window.fbq = fbq;
    window._fbq = fbq;
    injectScript("https://connect.facebook.net/en_US/fbevents.js");
    fbq("init", meta.pixelId);
    fbq("track", "PageView");
  },
  track(event) {
    const fbq = window.fbq;
    if (!fbq) return;
    if (event.type === "page_view") fbq("track", "PageView");
    else if (event.type === "view_content") {
      fbq("track", "ViewContent", { content_type: event.contentType, content_name: event.contentName });
    } else {
      fbq(
        "track",
        metaEventName[event.conversion],
        { content_name: event.contentName ?? event.source, content_category: event.source },
        { eventID: event.eventId },
      );
    }
  },
};

const linkedinPlatform: Platform = {
  name: "linkedin",
  category: "marketing",
  enabled: Boolean(linkedin.partnerId),
  load() {
    if (!linkedin.partnerId || window.lintrk) return;
    window._linkedin_partner_id = linkedin.partnerId;
    window._linkedin_data_partner_ids = [...(window._linkedin_data_partner_ids ?? []), linkedin.partnerId];
    const queue: unknown[][] = [];
    const lintrk: Lintrk = (action, data) => {
      queue.push([action, data]);
    };
    lintrk.q = queue;
    window.lintrk = lintrk;
    // O script registra sozinho a página em que carregou.
    injectScript("https://snap.licdn.com/li.lms-analytics/insight.min.js");
  },
  track(event) {
    const lintrk = window.lintrk;
    if (!lintrk) return;
    // A Insight Tag só registra a primeira página; as da navegação interna vão aqui.
    if (event.type === "page_view") lintrk("track");
    else if (event.type === "conversion") {
      const id = linkedin.conversions[event.conversion as keyof typeof linkedin.conversions];
      if (id) lintrk("track", { conversion_id: Number(id) });
    }
  },
};

/** Categorias liberadas na última carga do Google (para atualizar o Consent Mode). */
let googleGranted: Record<ConsentCategory, boolean> | null = null;

function gtagConsent(granted: Record<ConsentCategory, boolean>) {
  const value = (on: boolean) => (on ? "granted" : "denied");
  return {
    ad_storage: value(granted.marketing),
    ad_user_data: value(granted.marketing),
    ad_personalization: value(granted.marketing),
    analytics_storage: value(granted.analytics),
  };
}

/**
 * Google Ads (marketing) e GA4 (análise) dividem o gtag.js. Chamado de novo
 * quando a pessoa libera mais uma categoria: atualiza o Consent Mode e configura
 * o id que faltava.
 */
export function loadGoogle(granted: Record<ConsentCategory, boolean>) {
  const ads = granted.marketing ? google.adsId : undefined;
  const ga4 = granted.analytics ? google.ga4Id : undefined;
  if (!ads && !ga4) return;
  if (!window.gtag) {
    window.dataLayer = window.dataLayer ?? [];
    // O gtag.js só entende o objeto `arguments` (não um array) na fila.
    window.gtag = function gtag() {
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer?.push(arguments);
    };
    window.gtag("consent", "default", gtagConsent(granted));
    window.gtag("js", new Date());
    injectScript(`https://www.googletagmanager.com/gtag/js?id=${ads ?? ga4}`);
  } else {
    window.gtag("consent", "update", gtagConsent(granted));
  }
  if (ads && !googleGranted?.marketing) window.gtag("config", ads);
  if (ga4 && !googleGranted?.analytics) window.gtag("config", ga4);
  googleGranted = { marketing: Boolean(ads) || Boolean(googleGranted?.marketing), analytics: Boolean(ga4) || Boolean(googleGranted?.analytics) };
}

const googlePlatform: Platform = {
  name: "google",
  // O Ads é o que pede marketing; o GA4 entra por loadGoogle quando há análise.
  category: "marketing",
  enabled: Boolean(google.adsId || google.ga4Id),
  load() {
    // Carregado por loadGoogle (precisa das duas categorias).
  },
  track(event) {
    const gtag = window.gtag;
    if (!gtag || !googleGranted) return;
    const { adsId, adsLabels, ga4Id } = google;
    const ads = googleGranted.marketing ? adsId : undefined;
    const ga4 = googleGranted.analytics ? ga4Id : undefined;
    // GA4 já conta a navegação interna sozinho (medição otimizada); o Ads, não.
    if (event.type === "page_view" && ads) gtag("event", "page_view", { send_to: ads });
    if (event.type !== "conversion") return;
    const label = adsLabels[event.conversion as keyof typeof adsLabels];
    if (ads && label) gtag("event", "conversion", { send_to: `${ads}/${label}`, transaction_id: event.eventId });
    if (ga4) {
      const name = event.conversion === "contact" ? "whatsapp_click" : event.conversion === "application" ? "submit_application" : "generate_lead";
      gtag("event", name, { send_to: ga4, form: event.source, content_name: event.contentName });
    }
  },
};

export const platforms: Platform[] = [metaPlatform, linkedinPlatform, googlePlatform];
