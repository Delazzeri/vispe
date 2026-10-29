// Pop-ups no navegador: busca os ativos (com um cache curto na sessão), guarda o
// histórico de cada visitante (só no aparelho dele) e manda os totais de
// exibição/clique/fechamento para o banco (função track_popup, sem dado pessoal).

import { getSupabase } from "@/lib/supabase/client";
import { popupColumns, type Popup, type PopupHistory } from "./rules";

const historyKey = "vispe_popups";
// v2: o cache antigo podia guardar pop-ups pausados (visto por quem estava logado no admin).
const cacheKey = "vispe_popups_cache_v2";
const CACHE_MS = 5 * 60 * 1000;

/**
 * Ativos e no período. A RLS só entrega esses ao público, mas quem está logado
 * no admin (staff) recebe todos, por isso o filtro de active também aqui; o
 * período é conferido em pickPopup. Erro ou sem Supabase: nenhum pop-up.
 */
export async function loadPopups(): Promise<Popup[]> {
  try {
    const cached = JSON.parse(sessionStorage.getItem(cacheKey) ?? "null") as { at: number; popups: Popup[] } | null;
    if (cached && Date.now() - cached.at < CACHE_MS && Array.isArray(cached.popups)) return cached.popups;
  } catch {
    // sessionStorage indisponível: segue sem cache.
  }
  const supabase = getSupabase();
  if (!supabase) return [];
  const { data, error } = await supabase.from("popups").select(popupColumns).eq("active", true);
  if (error || !data) return [];
  try {
    sessionStorage.setItem(cacheKey, JSON.stringify({ at: Date.now(), popups: data }));
  } catch {
    // idem
  }
  return data;
}

export function readHistory(): PopupHistory {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(historyKey) ?? "{}");
    return value && typeof value === "object" ? (value as PopupHistory) : {};
  } catch {
    return {};
  }
}

function writeHistory(history: PopupHistory) {
  try {
    localStorage.setItem(historyKey, JSON.stringify(history));
  } catch {
    // Sem armazenamento (aba anônima bloqueada etc.): o pop-up pode voltar a aparecer.
  }
}

export function rememberView(id: string) {
  const history = readHistory();
  const seen = history[id];
  history[id] = { ...seen, views: (seen?.views ?? 0) + 1, last: Date.now() };
  writeHistory(history);
}

export function rememberClick(id: string) {
  const history = readHistory();
  history[id] = { views: history[id]?.views ?? 1, last: history[id]?.last ?? Date.now(), clicked: true };
  writeHistory(history);
}

/**
 * Soma +1 no total do dia. fetch com keepalive (e não o supabase-js) para o
 * clique ser contado mesmo quando o botão leva para outra página.
 */
export function trackPopup(id: string, event: "view" | "click" | "close") {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return;
  fetch(`${url.replace(/\/$/, "")}/rest/v1/rpc/track_popup`, {
    method: "POST",
    keepalive: true,
    // Chave publicável (sb_publishable_…) só no apikey: ela não é um JWT para o Authorization.
    headers: { "Content-Type": "application/json", apikey: key },
    body: JSON.stringify({ p_popup: id, p_event: event }),
  }).catch(() => {});
}
