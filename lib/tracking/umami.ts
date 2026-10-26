// Umami: estatísticas de visita anônimas e sem cookies (páginas, origem,
// país/cidade aproximados, aparelho). Por não identificar ninguém, carrega para
// todos, sem depender do banner. Os números aparecem em /admin/metricas/.
// A página vista (inclusive na navegação interna) o script conta sozinho;
// daqui saem só as conversões, sem nenhum dado do formulário.

import type { TrackEvent } from "./events";

type Umami = { track: (event: string, data?: Record<string, string>) => void };

declare global {
  interface Window {
    umami?: Umami;
  }
}

export function trackUmami(event: TrackEvent) {
  if (event.type !== "conversion") return;
  window.umami?.track(event.conversion, {
    source: event.source,
    ...(event.contentName && { content: event.contentName }),
  });
}
