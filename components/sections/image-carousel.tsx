import { EpisodeMarquee } from "@/components/sections/episode-marquee";
import type { Episode } from "@/lib/episodes/youtube";
import { useSite } from "@/content/site";

/** Carrossel com as thumbnails dos episódios do podcast Equity Talks (playlist do YouTube). */
export function ImageCarousel({ id, episodes }: { id?: string; episodes: Episode[] }) {
  const site = useSite();
  return (
    <section id={id} aria-label={site.ui.galleryLabel} className="overflow-hidden bg-bg pb-16 pt-40 md:pb-24 md:pt-56">
      <EpisodeMarquee episodes={episodes} />
    </section>
  );
}
