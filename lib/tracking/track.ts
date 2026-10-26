// Ponto único de medição: track() manda o evento para as plataformas já
// carregadas (com consentimento). Antes da escolha no banner, nada é enviado.

import { readConsent, type Consent, type ConsentCategory } from "@/lib/consent";
import { contentFromPath, metaEventName, newEventId, type Conversion, type TrackEvent } from "./events";
import { loadGoogle, platforms, type Platform } from "./platforms";

const active = new Set<Platform>();
let granted: Record<ConsentCategory, boolean> = { analytics: false, marketing: false };

export function track(event: TrackEvent) {
  for (const platform of active) platform.track(event);
}

/**
 * Aplica a escolha do banner: carrega o que foi liberado e manda para as
 * plataformas novas o artigo/material da página atual (a página vista inicial
 * cada uma registra ao carregar). Retirou um consentimento já usado: recarrega
 * a página, o único jeito de descarregar os scripts.
 */
export function applyConsent(consent: Consent) {
  const revoked = (Object.keys(granted) as ConsentCategory[]).some((category) => granted[category] && !consent[category]);
  if (revoked && active.size > 0) {
    window.location.reload();
    return;
  }
  granted = { analytics: consent.analytics, marketing: consent.marketing };

  const content = contentFromPath(window.location.pathname);
  for (const platform of platforms) {
    if (!platform.enabled || active.has(platform)) continue;
    if (platform.name === "google") {
      // Google: Ads com marketing, GA4 com análise (loadGoogle confere os ids).
      if (!consent.marketing && !consent.analytics) continue;
    } else if (!consent[platform.category]) continue;
    platform.load();
    active.add(platform);
    if (content) platform.track(content);
  }
  if (consent.marketing || consent.analytics) loadGoogle(granted);
}

/** Dados extras do envio de formulário para a Conversions API (só com consentimento de marketing). */
export type ServerTracking = {
  eventId: string;
  eventName: string;
  contentName?: string;
  fbp?: string;
  fbc?: string;
  userAgent: string;
  /** Vão em texto para o Apps Script (que já recebe o formulário) e só saem de lá criptografados. */
  user: { email?: string; phone?: string; name?: string };
};

function cookie(name: string): string | undefined {
  return document.cookie
    .split("; ")
    .find((part) => part.startsWith(`${name}=`))
    ?.slice(name.length + 1);
}

/**
 * Prepara a conversão de um formulário: o id do evento (o mesmo no Pixel e na
 * Conversions API) e, com consentimento de marketing, os dados do envio pelo servidor.
 */
export function prepareConversion(
  conversion: Conversion,
  contentName: string | undefined,
  user: ServerTracking["user"],
): { eventId: string; server?: ServerTracking } {
  const eventId = newEventId();
  // Só leads e inscrições vão para a Conversions API (currículo não é público de anúncio).
  if (!readConsent()?.marketing || (conversion !== "lead" && conversion !== "registration")) return { eventId };
  // _fbc: o Pixel grava depois de um clique em anúncio (?fbclid=); sem ele, monta a partir da URL.
  const fbclid = new URLSearchParams(window.location.search).get("fbclid");
  return {
    eventId,
    server: {
      eventId,
      eventName: metaEventName[conversion],
      contentName,
      fbp: cookie("_fbp"),
      fbc: cookie("_fbc") ?? (fbclid ? `fb.1.${Date.now()}.${fbclid}` : undefined),
      userAgent: navigator.userAgent,
      user,
    },
  };
}
