// Regras dos pop-ups do admin (tabela popups, 0012): em quais páginas, idioma e
// aparelho cada um aparece, quantas vezes para a mesma pessoa e qual vence quando
// mais de um vale para a página. Funções puras, usadas pelo site
// (components/popups/popup-manager.tsx) e pelo admin.

import type { PopupRecord } from "@/lib/supabase/types";

/** O que o site precisa de cada pop-up (sem datas de criação etc.). */
export type Popup = Pick<
  PopupRecord,
  | "id"
  | "name"
  | "starts_at"
  | "ends_at"
  | "priority"
  | "layout"
  | "image_url"
  | "image_alt"
  | "image_width"
  | "image_height"
  | "title"
  | "body"
  | "cta_label"
  | "cta_url"
  | "cta_new_tab"
  | "locale"
  | "page_rule"
  | "page_paths"
  | "devices"
  | "trigger_type"
  | "trigger_value"
  | "max_views"
  | "cooldown_hours"
  | "hide_after_click"
  | "updated_at"
>;

export const popupColumns =
  "id,name,starts_at,ends_at,priority,layout,image_url,image_alt,image_width,image_height,title,body,cta_label,cta_url,cta_new_tab,locale,page_rule,page_paths,devices,trigger_type,trigger_value,max_views,cooldown_hours,hide_after_click,updated_at";

/**
 * Caminho público da página, como o visitante vê: sem barra no fim, com /en para
 * o inglês. Aceita também o caminho interno do dev (/pt-BR/…, /en-US/…).
 */
export function publicPath(pathname: string): string {
  let path = pathname.replace(/^\/pt-BR(?=\/|$)/, "").replace(/^\/en-US(?=\/|$)/, "/en");
  path = path.replace(/\/+$/, "");
  return path || "/";
}

/** "/blog/*" vale para /blog e tudo abaixo; "/contato" só para ela. */
export function pathMatches(pattern: string, path: string): boolean {
  const trimmed = pattern.trim();
  if (!trimmed) return false;
  if (trimmed.endsWith("*")) {
    const base = publicPath(trimmed.slice(0, -1));
    return base === "/" ? true : path === base || path.startsWith(`${base}/`);
  }
  return publicPath(trimmed) === path;
}

export function pageAllowed(popup: Pick<Popup, "page_rule" | "page_paths">, path: string): boolean {
  if (popup.page_rule === "all") return true;
  const hit = popup.page_paths.some((pattern) => pathMatches(pattern, path));
  return popup.page_rule === "include" ? hit : !hit;
}

export function inPeriod(popup: Pick<Popup, "starts_at" | "ends_at">, now: number): boolean {
  if (popup.starts_at && Date.parse(popup.starts_at) > now) return false;
  if (popup.ends_at && Date.parse(popup.ends_at) <= now) return false;
  return true;
}

/** O que o navegador guarda de cada pop-up (por id): vezes exibido, última vez e se clicou. */
export type PopupHistory = Record<string, { views: number; last: number; clicked?: boolean }>;

export function frequencyAllows(
  popup: Pick<Popup, "id" | "max_views" | "cooldown_hours" | "hide_after_click">,
  history: PopupHistory,
  now: number,
): boolean {
  const seen = history[popup.id];
  if (!seen) return true;
  if (popup.hide_after_click && seen.clicked) return false;
  if (popup.max_views !== null && seen.views >= popup.max_views) return false;
  return now - seen.last >= popup.cooldown_hours * 60 * 60 * 1000;
}

export type PopupContext = { path: string; locale: string; desktop: boolean; now: number; history: PopupHistory };

/** O pop-up desta página (maior prioridade; empate: o editado por último), ou null. */
export function pickPopup<T extends Popup>(popups: readonly T[], context: PopupContext): T | null {
  const eligible = popups.filter(
    (popup) =>
      inPeriod(popup, context.now) &&
      (popup.locale === "all" || popup.locale === context.locale) &&
      (popup.devices === "all" || (popup.devices === "desktop") === context.desktop) &&
      pageAllowed(popup, context.path) &&
      frequencyAllows(popup, context.history, context.now),
  );
  eligible.sort((a, b) => b.priority - a.priority || Date.parse(b.updated_at) - Date.parse(a.updated_at));
  return eligible[0] ?? null;
}
