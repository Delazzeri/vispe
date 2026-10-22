// Supabase Edge Function "youtube-episodes" (Deno): devolve os episódios da
// playlist Equity Talks do YouTube para o carrossel da home. O navegador não
// pode ler o feed do YouTube direto (sem CORS); esta função lê, organiza e
// devolve a lista com CORS liberado. O site já sai do build com os episódios
// da época (lib/episodes/youtube.ts) e usa esta função só para incluir os
// publicados depois.
//
// Pública e sem segredo: só lê um feed público. Guarda a resposta por 30
// minutos para não consultar o YouTube a cada visita; se o YouTube falhar,
// devolve a última lista guardada.
//
// Publicar (painel do Supabase): Edge Functions → Deploy a new function → Via
// Editor → nome "youtube-episodes" → cole este arquivo → DESLIGUE "Verify JWT"
// (o site chama sem login) → Deploy. Ver supabase/README.md.

/** Mesmo id de content/episodes.ts (playlist "Equity Talks" do canal @vispecapital). */
const PLAYLIST_ID = "PLvYKJsau6evJCJ6HJvVjLwgKvEN4jWEH-";
const CACHE_MS = 30 * 60 * 1000;

type Episode = { id: string; number: number; title: string; publishedAt: string };

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, apikey, content-type",
};

const entities: Record<string, string> = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'" };

function decode(text: string): string {
  return text.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (match, code: string) => {
    if (code[0] !== "#") return entities[code.toLowerCase()] ?? match;
    const value = code[1] === "x" || code[1] === "X" ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10);
    return Number.isFinite(value) ? String.fromCodePoint(value) : match;
  });
}

const numberPattern = /\s*[|\-–]?\s*Equity\s*Talks\s*#?\s*0*(\d+)\s*$/i;

/** Mesmas regras de lib/episodes/youtube.ts: vídeo sem "EquityTalks 0XX" no título fica de fora. */
function parseFeed(xml: string): Episode[] {
  const byId = new Map<string, Episode>();
  for (const entry of xml.split("<entry>").slice(1)) {
    const id = entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)?.[1];
    const raw = entry.match(/<media:title>([^<]*)<\/media:title>/)?.[1] ?? entry.match(/<title>([^<]*)<\/title>/)?.[1];
    if (!id || !raw) continue;
    const title = decode(raw).trim();
    const match = title.match(numberPattern);
    if (!match) continue;
    const publishedAt = entry.match(/<published>([^<]+)<\/published>/)?.[1] ?? "";
    byId.set(id, { id, number: Number(match[1]), title: title.slice(0, match.index).trim(), publishedAt });
  }
  return [...byId.values()].sort((a, b) => b.number - a.number);
}

let cache: { at: number; episodes: Episode[] } | null = null;

async function episodes(): Promise<Episode[]> {
  if (cache && Date.now() - cache.at < CACHE_MS) return cache.episodes;
  try {
    const response = await fetch(`https://www.youtube.com/feeds/videos.xml?playlist_id=${PLAYLIST_ID}`);
    if (!response.ok) throw new Error(`YouTube respondeu ${response.status}`);
    const list = parseFeed(await response.text());
    if (!list.length) throw new Error("Nenhum episódio no feed.");
    cache = { at: Date.now(), episodes: list };
    return list;
  } catch (problem) {
    if (cache) return cache.episodes;
    throw problem;
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });
  if (req.method !== "GET") return new Response("Método não permitido.", { status: 405, headers: cors });
  try {
    return new Response(JSON.stringify({ episodes: await episodes() }), {
      headers: { ...cors, "Content-Type": "application/json", "Cache-Control": "public, max-age=1800" },
    });
  } catch (problem) {
    const message = problem instanceof Error ? problem.message : String(problem);
    return new Response(JSON.stringify({ error: message }), {
      status: 502,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  }
});
