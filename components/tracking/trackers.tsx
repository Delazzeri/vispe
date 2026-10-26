"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { consentChangeEvent, readConsent, type Consent } from "@/lib/consent";
import { contentFromPath, newEventId } from "@/lib/tracking/events";
import { applyConsent, track } from "@/lib/tracking/track";

/** Depois que a página terminou de carregar e o navegador está livre (não pesa no LCP). */
function whenIdle(callback: () => void): () => void {
  let idle: number | undefined;
  let timer: ReturnType<typeof setTimeout> | undefined;
  const schedule = () => {
    if ("requestIdleCallback" in window) idle = window.requestIdleCallback(callback, { timeout: 3000 });
    else timer = setTimeout(callback, 1500);
  };
  if (document.readyState === "complete") schedule();
  else window.addEventListener("load", schedule, { once: true });
  return () => {
    window.removeEventListener("load", schedule);
    if (idle !== undefined) window.cancelIdleCallback(idle);
    clearTimeout(timer);
  };
}

/**
 * Pixels de anúncio (Meta, LinkedIn, Google) do site e das LPs: carregam só
 * depois da escolha no banner de cookies e conforme ela; contam as páginas da
 * navegação interna e os cliques nos links do WhatsApp. Não renderiza nada.
 */
export function Trackers() {
  const pathname = usePathname();
  const firstPath = useRef(true);

  useEffect(() => {
    const saved = readConsent();
    const cancelIdle = saved ? whenIdle(() => applyConsent(saved)) : undefined;
    const onConsent = (event: Event) => applyConsent((event as CustomEvent<Consent>).detail);

    // Qualquer link do WhatsApp (botão flutuante, rodapé, LPs) conta como contato.
    const onClick = (event: MouseEvent) => {
      const link = event.target instanceof Element ? event.target.closest("a[href]") : null;
      if (!link) return;
      const href = link.getAttribute("href") ?? "";
      if (!/^https:\/\/(wa\.me|api\.whatsapp\.com)\//.test(href)) return;
      track({ type: "conversion", conversion: "contact", eventId: newEventId(), source: "whatsapp", contentName: window.location.pathname });
    };

    window.addEventListener(consentChangeEvent, onConsent);
    document.addEventListener("click", onClick, { capture: true });
    return () => {
      cancelIdle?.();
      window.removeEventListener(consentChangeEvent, onConsent);
      document.removeEventListener("click", onClick, { capture: true });
    };
  }, []);

  // Navegação interna (next/link): a página inicial cada plataforma conta ao carregar.
  useEffect(() => {
    if (firstPath.current) {
      firstPath.current = false;
      return;
    }
    track({ type: "page_view" });
    const content = contentFromPath(window.location.pathname);
    if (content) track(content);
  }, [pathname]);

  return null;
}
