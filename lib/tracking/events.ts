// Eventos que o site mede. Cada plataforma (lib/tracking/platforms.ts) traduz
// para os nomes dela; nada de dado pessoal sai daqui para os pixels.

/** lead: formulários de contato/material/LP · registration: LP de evento · application: currículo · contact: WhatsApp. */
export type Conversion = "lead" | "registration" | "application" | "contact";

export type TrackEvent =
  | { type: "page_view" }
  | { type: "view_content"; contentType: "article" | "material"; contentName: string }
  | {
      type: "conversion";
      conversion: Conversion;
      /** Mesmo id no navegador e no envio pelo servidor (Conversions API): a Meta conta uma vez. */
      eventId: string;
      /** De onde veio: aba da planilha ("diagnostico", "lp-workshop"…) ou "whatsapp". */
      source: string;
      contentName?: string;
    };

/** Nome do evento padrão da Meta para cada conversão (usado também pelo Apps Script). */
export const metaEventName: Record<Conversion, string> = {
  lead: "Lead",
  registration: "CompleteRegistration",
  application: "SubmitApplication",
  contact: "Contact",
};

export function newEventId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

/** Artigo ou material aberto, pela URL pública (pt, /en ou o caminho interno do dev). */
export function contentFromPath(pathname: string): Extract<TrackEvent, { type: "view_content" }> | null {
  const path = pathname.replace(/^\/(pt-BR|en-US|en)(?=\/)/, "");
  const article = path.match(/^\/blog\/([a-z0-9-]+)\/?$/);
  if (article && article[1] !== "post") return { type: "view_content", contentType: "article", contentName: article[1] };
  const material = path.match(/^\/(?:materiais|free-materials)\/([a-z0-9-]+)\/?$/);
  if (material && material[1] !== "item") return { type: "view_content", contentType: "material", contentName: material[1] };
  return null;
}
