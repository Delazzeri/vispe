import Image from "next/image";
import { Play } from "lucide-react";
import { Marquee } from "@/components/motion/marquee";
import { episodes, type Episode } from "@/content/episodes";
import { useSite } from "@/content/site";
import { format } from "@/content/types";

const cardClass =
  "group/episode relative block aspect-video w-[75vw] shrink-0 overflow-hidden rounded-3xl bg-ink shadow-[0_1px_2px_rgba(38,38,38,0.04),0_4px_12px_-4px_rgba(38,38,38,0.1)] md:w-[720px]";

function EpisodeCard({ episode }: { episode: Episode }) {
  const { ui } = useSite();
  const label = format(ui.episodeLabel, { number: episode.number, title: episode.title });
  const image = (
    <Image
      src={episode.thumbnail}
      alt={episode.youtubeUrl ? "" : label}
      width={1280}
      height={720}
      sizes="(min-width: 768px) 720px, 75vw"
      className="h-full w-full object-cover transition-transform duration-500 group-hover/episode:scale-105"
    />
  );

  if (!episode.youtubeUrl) return <div className={cardClass}>{image}</div>;

  return (
    <a
      href={episode.youtubeUrl}
      target="_blank"
      rel="noopener"
      aria-label={`${label} (${ui.episodeWatch})`}
      className={`${cardClass} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-4`}
    >
      {image}
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

/** Carrossel com as thumbnails dos episódios do podcast Equity Talks. */
export function ImageCarousel({ id }: { id?: string }) {
  const site = useSite();
  return (
    <section id={id} aria-label={site.ui.galleryLabel} className="overflow-hidden bg-bg pb-16 pt-40 md:pb-24 md:pt-56">
      {/* ~75px/s com 12 episódios (antes ~42px/s com 5 placeholders). */}
      <Marquee speed={120}>
        {episodes.map((episode) => (
          <EpisodeCard key={episode.number} episode={episode} />
        ))}
      </Marquee>
    </section>
  );
}
