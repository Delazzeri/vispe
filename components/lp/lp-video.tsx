"use client";

import { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import type { LpUi } from "@/content/lp-ui";
import { youtubeId } from "@/lib/lp/normalize";
import type { LpVideo as LpVideoData } from "@/lib/lp/types";
import { LpSectionShell } from "./parts";

/**
 * Vídeo do YouTube com carregamento sob demanda: até o clique, só a capa
 * (a enviada no admin ou a thumbnail do próprio vídeo); o player
 * (youtube-nocookie) entra só quando a pessoa pede.
 */
export function LpVideo({ id, data, ui }: { id: string; data: LpVideoData; ui: LpUi }) {
  const [playing, setPlaying] = useState(false);
  const videoId = youtubeId(data.youtubeId);
  if (!videoId) return null;
  const poster = data.poster ?? { src: `https://i.ytimg.com/vi_webp/${videoId}/maxresdefault.webp`, alt: "" };
  const label = data.title || ui.watchVideo;

  return (
    <LpSectionShell id={id} title={data.title} subtitle={data.text}>
      <Reveal>
        <div className="relative mx-auto aspect-video max-w-4xl overflow-hidden rounded-3xl bg-ink">
          {playing ? (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
              title={label}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 h-full w-full"
            />
          ) : (
            <button
              type="button"
              onClick={() => setPlaying(true)}
              aria-label={`${ui.watchVideo}: ${label}`}
              className="group absolute inset-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-inset"
            >
              <Image src={poster.src} alt={poster.alt} fill sizes="(min-width: 1024px) 896px, 100vw" className="object-cover" />
              <span aria-hidden className="absolute inset-0 bg-ink/20 transition-colors group-hover:bg-ink/35" />
              <span
                aria-hidden
                className="absolute left-1/2 top-1/2 flex h-18 w-18 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-brand text-brand-fg transition-transform group-hover:scale-105"
              >
                <Play className="ml-1 h-8 w-8 fill-current" />
              </span>
            </button>
          )}
        </div>
      </Reveal>
    </LpSectionShell>
  );
}
