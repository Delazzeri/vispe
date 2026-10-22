import { equityTalks } from "@/content/episodes";

// Episódios do Equity Talks lidos da playlist do YouTube (feed público, sem
// chave de API). No build, o feed é lido direto e os episódios saem no HTML; no
// navegador, a Edge Function youtube-episodes (supabase/functions) entrega a
// mesma lista com CORS, e o carrossel acrescenta o que saiu depois do build.

export type Episode = {
  /** Id do vídeo no YouTube. */
  id: string;
  /** Número do "EquityTalks 0XX" no título do vídeo. */
  number: number;
  /** Título do vídeo, sem o sufixo "| EquityTalks 0XX". */
  title: string;
  publishedAt: string;
};

/** O feed traz só os 15 vídeos mais recentes da playlist. */
export const maxEpisodes = 15;

export const episodeThumbnail = (id: string) => `https://i.ytimg.com/vi_webp/${id}/maxresdefault.webp`;
export const episodeUrl = (id: string) => `https://youtu.be/${id}`;

const feedUrl = (playlistId: string) => `https://www.youtube.com/feeds/videos.xml?playlist_id=${playlistId}`;

const entities: Record<string, string> = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'" };

function decode(text: string): string {
  return text.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (match, code: string) => {
    if (code[0] !== "#") return entities[code.toLowerCase()] ?? match;
    const value = code[1] === "x" || code[1] === "X" ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10);
    return Number.isFinite(value) ? String.fromCodePoint(value) : match;
  });
}

const numberPattern = /\s*[|\-–]?\s*Equity\s*Talks\s*#?\s*0*(\d+)\s*$/i;

/** Vídeo sem "EquityTalks 0XX" no fim do título (corte, short) fica de fora. */
function episodeFromTitle(id: string, rawTitle: string, publishedAt: string): Episode | null {
  const title = decode(rawTitle).trim();
  const match = title.match(numberPattern);
  if (!match) return null;
  return { id, number: Number(match[1]), title: title.slice(0, match.index).trim(), publishedAt };
}

export function sortEpisodes(list: Episode[]): Episode[] {
  const byId = new Map(list.map((episode) => [episode.id, episode]));
  return [...byId.values()].sort((a, b) => b.number - a.number).slice(0, maxEpisodes);
}

export function parseFeed(xml: string): Episode[] {
  const episodes: Episode[] = [];
  for (const entry of xml.split("<entry>").slice(1)) {
    const id = entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)?.[1];
    const title = entry.match(/<media:title>([^<]*)<\/media:title>/)?.[1] ?? entry.match(/<title>([^<]*)<\/title>/)?.[1];
    const publishedAt = entry.match(/<published>([^<]+)<\/published>/)?.[1] ?? "";
    const episode = id && title ? episodeFromTitle(id, title, publishedAt) : null;
    if (episode) episodes.push(episode);
  }
  return sortEpisodes(episodes);
}

/** Valida a resposta da Edge Function (dado externo: nada é confiado sem checar). */
export function parseEpisodes(value: unknown): Episode[] {
  const list = typeof value === "object" && value !== null ? (value as { episodes?: unknown }).episodes : undefined;
  if (!Array.isArray(list)) return [];
  const episodes: Episode[] = [];
  for (const item of list as unknown[]) {
    if (typeof item !== "object" || item === null) continue;
    const { id, number, title, publishedAt } = item as Record<string, unknown>;
    if (typeof id !== "string" || !/^[\w-]{6,20}$/.test(id)) continue;
    if (typeof number !== "number" || !Number.isInteger(number) || typeof title !== "string") continue;
    episodes.push({ id, number, title, publishedAt: typeof publishedAt === "string" ? publishedAt : "" });
  }
  return sortEpisodes(episodes);
}

/** Endereço da Edge Function; sem Supabase configurado, o carrossel fica com a lista do build. */
export function episodesEndpoint(): string | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return url ? `${url.replace(/\/$/, "")}/functions/v1/youtube-episodes` : null;
}

const attempts = 4;
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Lê a playlist no build. Como o Supabase (lib/supabase/build-query.ts), tenta
 * de novo e, se continuar falhando, derruba o build em vez de publicar a faixa
 * vazia em silêncio.
 */
export async function listEpisodes(): Promise<Episode[]> {
  let lastError = "";
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      const response = await fetch(feedUrl(equityTalks.playlistId));
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const episodes = parseFeed(await response.text());
      if (episodes.length) return episodes;
      lastError = "nenhum episódio no feed";
    } catch (problem) {
      lastError = problem instanceof Error ? problem.message : String(problem);
    }
    if (attempt < attempts) await wait(attempt * 1500);
  }
  throw new Error(
    `[episodes] A playlist do Equity Talks no YouTube não respondeu no build depois de ${attempts} tentativas (${lastError}). ` +
      "Confira a internet e o id da playlist em content/episodes.ts e rode o build de novo.",
  );
}
