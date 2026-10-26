// Supabase Edge Function "site-analytics" (Deno): números do site para o painel
// /admin/metricas/, lidos da API do Umami Cloud. Roda no servidor do Supabase
// para a chave do Umami nunca ir para o site (que é estático); só atende quem
// está logado no admin E é staff (mesma regra da RLS).
//
// Pedido: POST { range: "24h" | "7d" | "30d" | "90d" | "12m" }.
// Resposta: totais do período e do anterior, visitantes agora, série no tempo e
// rankings (páginas, origens, países, estados, cidades, aparelhos, UTM, conversões).
// Guarda cada período por 5 minutos (a API do Umami aceita 50 chamadas a cada 15 s
// e cada consulta do painel faz 18).
//
// Publicar (painel do Supabase, sem CLI): Edge Functions → Deploy a new function
// → Via Editor → nome "site-analytics" → cole este arquivo → Deploy (deixe ligado
// o Verify JWT). Segredos (Edge Functions → Secrets): UMAMI_API_KEY e
// UMAMI_WEBSITE_ID (obrigatórios) e, opcional, UMAMI_API_URL (padrão: Umami Cloud).
// Ver supabase/README.md.

import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

const TIMEZONE = "America/Sao_Paulo";
const CACHE_MS = 5 * 60 * 1000;
const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;

type Range = "24h" | "7d" | "30d" | "90d" | "12m";
type Unit = "hour" | "day" | "month";

const ranges: Record<Range, { ms: number; unit: Unit }> = {
  "24h": { ms: DAY, unit: "hour" },
  "7d": { ms: 7 * DAY, unit: "day" },
  "30d": { ms: 30 * DAY, unit: "day" },
  "90d": { ms: 90 * DAY, unit: "day" },
  "12m": { ms: 365 * DAY, unit: "month" },
};

/** Rankings do painel: nome na resposta → dimensão do Umami e quantas linhas. */
const lists = {
  pages: { type: "path", limit: 10 },
  entries: { type: "entry", limit: 10 },
  referrers: { type: "referrer", limit: 10 },
  channels: { type: "channel", limit: 10 },
  countries: { type: "country", limit: 10 },
  regions: { type: "region", limit: 10 },
  cities: { type: "city", limit: 10 },
  devices: { type: "device", limit: 6 },
  browsers: { type: "browser", limit: 6 },
  os: { type: "os", limit: 6 },
  utmSource: { type: "utmSource", limit: 8 },
  utmMedium: { type: "utmMedium", limit: 8 },
  utmCampaign: { type: "utmCampaign", limit: 8 },
  events: { type: "event", limit: 10 },
} as const;

type Row = { label: string; value: number };
type Totals = { pageviews: number; visitors: number; visits: number; bounces: number; totaltime: number };

type Analytics = {
  range: Range;
  unit: Unit;
  startAt: number;
  endAt: number;
  timezone: string;
  totals: Totals;
  previous: Totals;
  active: number;
  series: { x: string; pageviews: number; visits: number }[];
  lists: Record<keyof typeof lists | "conversionSources", Row[]>;
  generatedAt: string;
};

class UmamiError extends Error {}

/** Número de um campo da API (aceita também o formato antigo { value, prev }). */
function num(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (value && typeof value === "object" && "value" in value) return num((value as { value: unknown }).value);
  return 0;
}

function totals(source: unknown): Totals {
  const data = (source && typeof source === "object" ? source : {}) as Record<string, unknown>;
  return {
    pageviews: num(data.pageviews),
    visitors: num(data.visitors),
    visits: num(data.visits),
    bounces: num(data.bounces),
    totaltime: num(data.totaltime),
  };
}

/** Anterior do formato antigo, em que cada campo vinha como { value, prev }. */
function legacyPrevious(source: Record<string, unknown>): Totals {
  const prev = (key: string) => {
    const field = source[key];
    return field && typeof field === "object" && "prev" in field ? num((field as { prev: unknown }).prev) : 0;
  };
  return { pageviews: prev("pageviews"), visitors: prev("visitors"), visits: prev("visits"), bounces: prev("bounces"), totaltime: prev("totaltime") };
}

function rows(source: unknown): Row[] {
  if (!Array.isArray(source)) return [];
  return source
    .map((item) => {
      const record = (item && typeof item === "object" ? item : {}) as Record<string, unknown>;
      const label = record.x ?? record.value;
      return { label: typeof label === "string" ? label : label == null ? "" : String(label), value: num(record.y ?? record.total) };
    })
    .filter((row) => row.value > 0);
}

function points(source: unknown): Map<string, number> {
  const map = new Map<string, number>();
  if (!Array.isArray(source)) return map;
  for (const item of source) {
    const record = (item && typeof item === "object" ? item : {}) as Record<string, unknown>;
    if (typeof record.x === "string") map.set(record.x, num(record.y));
  }
  return map;
}

function client() {
  const apiKey = Deno.env.get("UMAMI_API_KEY");
  const websiteId = Deno.env.get("UMAMI_WEBSITE_ID");
  if (!apiKey || !websiteId) throw new UmamiError("Métricas não configuradas: faltam os segredos UMAMI_API_KEY e UMAMI_WEBSITE_ID no Supabase.");
  const base = (Deno.env.get("UMAMI_API_URL") ?? "https://api.umami.is/v1").replace(/\/+$/, "");

  return async (path: string, params: Record<string, string | number> = {}): Promise<unknown> => {
    const query = new URLSearchParams(Object.entries(params).map(([key, value]) => [key, String(value)]));
    const response = await fetch(`${base}/websites/${websiteId}${path}?${query}`, {
      headers: { Accept: "application/json", Authorization: `Bearer ${apiKey}` },
    });
    if (response.status === 401 || response.status === 403) throw new UmamiError("O Umami recusou a chave (UMAMI_API_KEY) ou o site (UMAMI_WEBSITE_ID).");
    if (response.status === 404) throw new UmamiError("Site não encontrado no Umami: confira o UMAMI_WEBSITE_ID.");
    if (response.status === 429) throw new UmamiError("Limite de consultas do Umami atingido. Tente de novo em alguns segundos.");
    if (!response.ok) throw new UmamiError(`O Umami respondeu com erro ${response.status}.`);
    return response.json();
  };
}

const cache = new Map<Range, { at: number; data: Analytics }>();

async function analytics(range: Range): Promise<Analytics> {
  const cached = cache.get(range);
  if (cached && Date.now() - cached.at < CACHE_MS) return cached.data;

  const get = client();
  const { ms, unit } = ranges[range];
  // Fim na hora cheia seguinte: o período inclui a hora atual e o cache fica estável.
  const endAt = Math.ceil(Date.now() / HOUR) * HOUR;
  const startAt = endAt - ms;
  const period = { startAt, endAt, timezone: TIMEZONE };

  const listNames = Object.keys(lists) as (keyof typeof lists)[];
  const [stats, active, pageviews, sources, ...ranked] = await Promise.all([
    get("/stats", { ...period, compare: "prev" }),
    get("/active"),
    get("/pageviews", { ...period, unit }),
    get("/event-data/values", { startAt, endAt, propertyName: "source" }).catch(() => []),
    ...listNames.map((name) => get("/metrics", { ...period, type: lists[name].type, limit: lists[name].limit })),
  ]);

  const statsRecord = (stats && typeof stats === "object" ? stats : {}) as Record<string, unknown>;
  const series = (pageviews && typeof pageviews === "object" ? pageviews : {}) as Record<string, unknown>;
  const views = points(series.pageviews);
  const visits = points(series.sessions);

  const data: Analytics = {
    range,
    unit,
    startAt,
    endAt,
    timezone: TIMEZONE,
    totals: totals(statsRecord),
    previous: statsRecord.comparison ? totals(statsRecord.comparison) : legacyPrevious(statsRecord),
    active: num((active as Record<string, unknown> | null)?.visitors ?? (active as Record<string, unknown> | null)?.x),
    series: [...new Set([...views.keys(), ...visits.keys()])]
      .sort()
      .map((x) => ({ x, pageviews: views.get(x) ?? 0, visits: visits.get(x) ?? 0 })),
    lists: {
      ...(Object.fromEntries(listNames.map((name, index) => [name, rows(ranked[index])])) as Record<keyof typeof lists, Row[]>),
      conversionSources: rows(sources).sort((a, b) => b.value - a.value).slice(0, 10),
    },
    generatedAt: new Date().toISOString(),
  };
  cache.set(range, { at: Date.now(), data });
  return data;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Método não permitido." }, 405);

  try {
    // Quem chama: usuário logado no admin e com linha em profiles (mesma regra da RLS).
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? Deno.env.get("SUPABASE_PUBLISHABLE_KEY") ?? "",
      { global: { headers: { Authorization: req.headers.get("Authorization") ?? "" } } },
    );
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) return json({ error: "Entre no admin para ver as métricas." }, 401);
    const { data: profile } = await supabase.from("profiles").select("id").eq("id", auth.user.id).maybeSingle();
    if (!profile) return json({ error: "Sua conta não está liberada no admin." }, 403);

    const body = await req.json().catch(() => ({}));
    const range: Range = body && typeof body.range === "string" && body.range in ranges ? (body.range as Range) : "30d";
    return json(await analytics(range));
  } catch (problem) {
    if (problem instanceof UmamiError) return json({ error: problem.message }, 502);
    console.error(problem);
    return json({ error: "Não foi possível carregar as métricas agora." }, 500);
  }
});
