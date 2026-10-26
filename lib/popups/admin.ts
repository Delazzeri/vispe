// Textos e resumos dos pop-ups para o admin (lista e editor).

import type { PopupRecord } from "@/lib/supabase/types";

export type PopupState = "active" | "paused" | "scheduled" | "ended";

export const popupStateLabel: Record<PopupState, string> = {
  active: "No ar",
  paused: "Pausado",
  scheduled: "Agendado",
  ended: "Encerrado",
};

export function popupState(popup: Pick<PopupRecord, "active" | "starts_at" | "ends_at">, now = Date.now()): PopupState {
  if (popup.ends_at && Date.parse(popup.ends_at) <= now) return "ended";
  if (!popup.active) return "paused";
  if (popup.starts_at && Date.parse(popup.starts_at) > now) return "scheduled";
  return "active";
}

const localeLabel: Record<PopupRecord["locale"], string> = { "pt-BR": "Português", "en-US": "Inglês", all: "Os dois idiomas" };
const devicesLabel: Record<PopupRecord["devices"], string> = { all: "", desktop: "só computador", mobile: "só celular" };

/** "Português · todas as páginas · só celular" */
export function popupWhere(popup: Pick<PopupRecord, "locale" | "page_rule" | "page_paths" | "devices">): string {
  const pages =
    popup.page_rule === "all"
      ? "todas as páginas"
      : `${popup.page_rule === "include" ? "só em" : "menos em"} ${popup.page_paths.slice(0, 3).join(", ")}${popup.page_paths.length > 3 ? "…" : ""}`;
  return [localeLabel[popup.locale], pages, devicesLabel[popup.devices]].filter(Boolean).join(" · ");
}

export function popupWhen(popup: Pick<PopupRecord, "trigger_type" | "trigger_value">): string {
  if (popup.trigger_type === "delay") return popup.trigger_value ? `após ${popup.trigger_value} s` : "ao abrir a página";
  if (popup.trigger_type === "scroll") return `ao rolar ${popup.trigger_value}% da página`;
  return "ao tentar sair";
}

/** Páginas prontas para escolher no editor (caminhos públicos de i18n/routing.ts). */
export const pageShortcuts: { label: string; pt: string; en: string }[] = [
  { label: "Home", pt: "/", en: "/en" },
  { label: "Sobre", pt: "/sobre", en: "/en/about" },
  { label: "Contato", pt: "/contato", en: "/en/contact" },
  { label: "Blog (todos)", pt: "/blog/*", en: "/en/blog/*" },
  { label: "Materiais (todos)", pt: "/materiais/*", en: "/en/free-materials/*" },
  { label: "Landing pages (todas)", pt: "/lp/*", en: "/en/lp/*" },
  { label: "Franquia (todas)", pt: "/franquia/*", en: "/en/franchise/*" },
  { label: "Trabalhe conosco", pt: "/trabalhe-conosco", en: "/en/careers" },
];
