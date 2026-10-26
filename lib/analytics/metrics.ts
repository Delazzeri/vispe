// Métricas do site para o painel /admin/metricas/: tipos da resposta da Edge
// Function site-analytics (supabase/functions/site-analytics) e os nomes em
// português dos valores que vêm do Umami.

import { FunctionsHttpError } from "@supabase/supabase-js";
import { getSupabase } from "@/lib/supabase/client";

/**
 * Link de compartilhamento do painel do Umami (Websites → o site → Edit → Share URL).
 * Mostrado no lugar do painel próprio enquanto a API não está disponível (plano gratuito).
 */
export const umamiShareUrl = process.env.NEXT_PUBLIC_UMAMI_SHARE_URL?.trim() || undefined;

export const metricRanges = [
  { id: "24h", label: "24 horas", previous: "Em relação às 24 horas anteriores" },
  { id: "7d", label: "7 dias", previous: "Em relação aos 7 dias anteriores" },
  { id: "30d", label: "30 dias", previous: "Em relação aos 30 dias anteriores" },
  { id: "90d", label: "90 dias", previous: "Em relação aos 90 dias anteriores" },
  { id: "12m", label: "12 meses", previous: "Em relação aos 12 meses anteriores" },
] as const;

export type MetricRange = (typeof metricRanges)[number]["id"];
export type MetricUnit = "hour" | "day" | "month";
export type MetricRow = { label: string; value: number };
export type MetricTotals = { pageviews: number; visitors: number; visits: number; bounces: number; totaltime: number };

export type ListName =
  | "pages"
  | "entries"
  | "referrers"
  | "channels"
  | "countries"
  | "regions"
  | "cities"
  | "devices"
  | "browsers"
  | "os"
  | "utmSource"
  | "utmMedium"
  | "utmCampaign"
  | "events"
  | "conversionSources";

export type SiteAnalytics = {
  range: MetricRange;
  unit: MetricUnit;
  startAt: number;
  endAt: number;
  timezone: string;
  totals: MetricTotals;
  previous: MetricTotals;
  active: number;
  series: { x: string; pageviews: number; visits: number }[];
  lists: Record<ListName, MetricRow[]>;
  generatedAt: string;
};

/** Chama a Edge Function site-analytics e traduz os erros para mensagens do admin. */
export async function fetchSiteAnalytics(range: MetricRange): Promise<SiteAnalytics> {
  const supabase = getSupabase();
  if (!supabase) throw new Error("Supabase não configurado.");
  const { data, error } = await supabase.functions.invoke<SiteAnalytics>("site-analytics", { body: { range } });
  if (error) {
    if (error instanceof FunctionsHttpError) {
      const status = error.context.status;
      if (status === 404) throw new Error("A função site-analytics ainda não foi publicada no Supabase (ver supabase/README.md).");
      const body: unknown = await error.context.json().catch(() => null);
      const message = body && typeof body === "object" && "error" in body ? String(body.error) : undefined;
      throw new Error(message ?? `As métricas responderam com erro ${status}.`);
    }
    throw new Error("Sem conexão com as métricas. Tente de novo em instantes.");
  }
  if (!data) throw new Error("As métricas não vieram.");
  return data;
}

// ── Série no tempo ────────────────────────────────────────────────────────────

/** Chave do intervalo no fuso do painel: "2026-10-26 14" (hora), "2026-10-26" (dia), "2026-10" (mês). */
function bucketKey(date: Date, unit: MetricUnit, timeZone: string): string {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-CA", { timeZone, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", hourCycle: "h23" })
      .formatToParts(date)
      .map((part) => [part.type, part.value]),
  );
  const day = `${parts.year}-${parts.month}-${parts.day}`;
  return unit === "month" ? day.slice(0, 7) : unit === "day" ? day : `${day} ${parts.hour}`;
}

const keyLength: Record<MetricUnit, number> = { hour: 13, day: 10, month: 7 };

/** O Umami manda "2026-10-26 14:00:00" (já no fuso pedido) ou ISO com fuso; os dois viram a mesma chave. */
function keyFromApi(x: string, unit: MetricUnit, timeZone: string): string {
  if (/(Z|[+-]\d{2}:?\d{2})$/.test(x)) return bucketKey(new Date(x), unit, timeZone);
  return x.replace("T", " ").slice(0, keyLength[unit]);
}

export type SeriesPoint = { key: string; date: Date; visits: number; pageviews: number };

/** Um ponto por hora/dia/mês do período, com zero onde o Umami não mandou nada. */
export function fillSeries(data: SiteAnalytics): SeriesPoint[] {
  const byKey = new Map(data.series.map((point) => [keyFromApi(point.x, data.unit, data.timezone), point]));
  const result: SeriesPoint[] = [];
  const seen = new Set<string>();
  for (let t = data.startAt; t < data.endAt; t += 60 * 60 * 1000) {
    const date = new Date(t);
    const key = bucketKey(date, data.unit, data.timezone);
    if (seen.has(key)) continue;
    seen.add(key);
    const point = byKey.get(key);
    result.push({ key, date, visits: point?.visits ?? 0, pageviews: point?.pageviews ?? 0 });
  }
  return result;
}

export function formatBucket(point: SeriesPoint, unit: MetricUnit, timeZone: string, long = false): string {
  if (unit === "hour") {
    const hour = new Intl.DateTimeFormat("pt-BR", { timeZone, hour: "2-digit", hourCycle: "h23" }).format(point.date);
    if (!long) return `${hour}h`;
    return `${new Intl.DateTimeFormat("pt-BR", { timeZone, day: "2-digit", month: "2-digit" }).format(point.date)}, ${hour}h`;
  }
  if (unit === "month") {
    return new Intl.DateTimeFormat("pt-BR", { timeZone, month: long ? "long" : "short", year: long ? "numeric" : "2-digit" })
      .format(point.date)
      .replace(".", "");
  }
  return new Intl.DateTimeFormat("pt-BR", { timeZone, day: "2-digit", month: long ? "long" : "2-digit", ...(long && { weekday: "short" }) }).format(point.date);
}

// ── Números ───────────────────────────────────────────────────────────────────

const compact = new Intl.NumberFormat("pt-BR", { notation: "compact", maximumFractionDigits: 1 });
const whole = new Intl.NumberFormat("pt-BR");

export const formatCount = (value: number) => (value >= 10_000 ? compact.format(value) : whole.format(value));

export function formatDuration(seconds: number): string {
  const total = Math.round(seconds);
  if (total < 60) return `${total} s`;
  const minutes = Math.floor(total / 60);
  const rest = total % 60;
  return rest ? `${minutes} min ${rest} s` : `${minutes} min`;
}

/** Variação em relação ao período anterior; null quando não há base para comparar. */
export function change(current: number, previous: number): number | null {
  if (!previous) return null;
  return (current - previous) / previous;
}

// ── Nomes em português ────────────────────────────────────────────────────────

const countryNames = new Intl.DisplayNames(["pt-BR"], { type: "region" });

function country(code: string): string {
  try {
    return countryNames.of(code.toUpperCase()) ?? code;
  } catch {
    return code;
  }
}

const browserNames: Record<string, string> = {
  chrome: "Chrome",
  crios: "Chrome (iPhone)",
  "edge-chromium": "Edge",
  edge: "Edge",
  "edge-ios": "Edge (iPhone)",
  firefox: "Firefox",
  fxios: "Firefox (iPhone)",
  safari: "Safari",
  ios: "Safari (iPhone)",
  "ios-webview": "App no iPhone",
  "chromium-webview": "App no Android",
  samsung: "Samsung Internet",
  opera: "Opera",
  facebook: "App do Facebook",
  instagram: "App do Instagram",
  android: "Navegador do Android",
};

const capitalize = (value: string) => (value ? value[0].toUpperCase() + value.slice(1) : value);

const deviceNames: Record<string, string> = { desktop: "Computador", laptop: "Notebook", mobile: "Celular", tablet: "Tablet" };

const channelNames: Record<string, string> = {
  direct: "Direto (digitou ou favorito)",
  organicSearch: "Busca orgânica",
  paidSearch: "Busca paga",
  organicSocial: "Redes sociais",
  paidSocial: "Redes sociais (anúncio)",
  organicVideo: "Vídeo",
  paidVideo: "Vídeo (anúncio)",
  organicShopping: "Shopping",
  paidShopping: "Shopping (anúncio)",
  paidAds: "Anúncios",
  referral: "Outros sites",
  email: "E-mail",
  sms: "SMS",
  affiliate: "Afiliados",
};

/** Eventos de conversão enviados por lib/tracking/umami.ts (nomes de lib/tracking/events.ts). */
const eventNames: Record<string, string> = {
  lead: "Leads (formulários)",
  registration: "Inscrições em eventos",
  application: "Candidaturas (currículo)",
  contact: "Cliques no WhatsApp",
};

/** Origem da conversão: aba da planilha (lib/forms) ou "whatsapp". */
const sourceNames: Record<string, string> = {
  diagnostico: "Formulário de diagnóstico",
  franquia: "Formulário de franquia",
  materiais: "Pedidos de material",
  carreiras: "Trabalhe conosco",
  whatsapp: "WhatsApp",
};

export function rowLabel(list: ListName, label: string): string {
  switch (list) {
    case "countries":
      return label ? country(label) : "Desconhecido";
    case "regions": {
      const [code, region] = label.split("-");
      if (!region) return label || "Desconhecido";
      // Estados do Brasil pela sigla (RS, SP); fora do Brasil o código não diz muito, então vai o país junto.
      return code === "BR" ? `${region} · Brasil` : `${country(code)} (${region})`;
    }
    case "cities":
      return label || "Desconhecida";
    case "devices":
      return deviceNames[label] ?? capitalize(label);
    case "browsers":
      return browserNames[label] ?? capitalize(label);
    case "channels":
      return channelNames[label] ?? label;
    case "events":
      return eventNames[label] ?? label;
    case "conversionSources":
      return sourceNames[label] ?? (label.startsWith("lp-") ? `Landing page: ${label.slice(3)}` : label);
    case "pages":
    case "entries":
      return label === "/" ? "/ (home)" : label;
    case "referrers":
      return label || "(sem origem)";
    default:
      return label || "(não informado)";
  }
}
