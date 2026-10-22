"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import { Marquee } from "@/components/motion/marquee";
import { episodeThumbnail, episodeUrl, episodesEndpoint, parseEpisodes, sortEpisodes, type Episode } from "@/lib/episodes/youtube";
import { useSite } from "@/content/site";
import { format } from "@/content/types";

const cardClass =
  "group/episode relative block aspect-video w-[75vw] shrink-0 overflow-hidden rounded-3xl bg-ink shadow-[0_1px_2px_rgba(38,38,38,0.04),0_4px_12px_-4px_rgba(38,38,38,0.1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-4 md:w-[720px]";

function EpisodeCard({ episode }: { episode: Episode }) {
  const { ui } = useSite();
  const label = format(ui.episodeLabel, { number: episode.number, title: episode.title });

  return (
    <a href={episodeUrl(episode.id)} target="_blank" rel="noopener" aria-label={`${label} (${ui.episodeWatch})`} className={cardClass}>
      {/* Thumbnail personalizada do vídeo, servida pelo YouTube (1280×720). */}
      <Image
        src={episodeThumbnail(episode.id)}
        alt=""
        width={1280}
        height={720}
        sizes="(min-width: 768px) 720px, 75vw"
        className="h-full w-full object-cover transition-transform duration-500 group-hover/episode:scale-105"
      />
      {/* Botão de play que aparece no hover/foco. */}
      <span
        aria-hidden
        className="absolute inset-0 flex items-center justify-center bg-ink/0 transition-colors group-hover/episode:bg-ink/30 group-focus-visible/episode:bg-ink/30"
      >
        <span className="flex h-16 w-16 scale-90 items-center justify-center rounded-full bg-brand text-brand-fg opacity-0 transition duration-300 group-hover/episode:scale-100 group-hover/episode:opacity-100 group-focus-visible/episode:scale-100 group-focus-visible/episode:opacity-100">
          <Play className="ml-1 h-7 w-7 fill-current" />
        </span>
      </span>
    </a>
  );
}

/**
 * Faixa de episódios: renderiza a lista do build e, depois do mount, pede a
 * playlist atual à Edge Function youtube-episodes para incluir episódios
 * publicados depois do build. Se a função falhar, fica a lista do build.
 */
export function EpisodeMarquee({ episodes: initial }: { episodes: Episode[] }) {
  const [episodes, setEpisodes] = useState(initial);

  useEffect(() => {
    const endpoint = episodesEndpoint();
    if (!endpoint) return;
    const controller = new AbortController();
    fetch(endpoint, { signal: controller.signal })
      .then((response) => (response.ok ? response.json() : null))
      .then((body: unknown) => {
        const fresh = parseEpisodes(body);
        // A lista da função vence a do build no mesmo vídeo (título pode ter mudado).
        if (fresh.length) setEpisodes((current) => sortEpisodes([...current, ...fresh]));
      })
      .catch(() => {});
    return () => controller.abort();
  }, []);

  // ~75px/s em qualquer quantidade de episódios (120s com 12).
  return (
    <Marquee speed={episodes.length * 10}>
      {episodes.map((episode) => (
        <EpisodeCard key={episode.id} episode={episode} />
      ))}
    </Marquee>
  );
}
