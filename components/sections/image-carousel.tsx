import { Marquee } from "@/components/motion/marquee";
import { cn } from "@/lib/cn";
import { useSite } from "@/content/site";

// Fundos de placeholder feitos só com tokens do design system.
const placeholderBackgrounds = [
  "bg-gradient-to-br from-accent-soft to-brand",
  "bg-gradient-to-br from-fg to-fg-muted",
  "bg-gradient-to-br from-surface to-border",
  "bg-gradient-to-br from-brand to-brand-dark",
  "bg-gradient-to-br from-border to-accent-soft",
] as const;

export function ImageCarousel({ id }: { id?: string }) {
  const site = useSite();
  return (
    <section id={id} aria-label={site.ui.galleryLabel} className="overflow-hidden bg-bg pb-16 pt-40 md:pb-24 md:pt-56">
      <Marquee speed={90}>
        {site.showcaseCarousel.map((item, index) => (
          <div
            key={item.id}
            role="img"
            aria-label={item.label}
            className={cn(
              "aspect-video w-[75vw] shrink-0 rounded-3xl shadow-[0_1px_2px_rgba(38,38,38,0.04),0_4px_12px_-4px_rgba(38,38,38,0.1)] md:w-[720px]",
              placeholderBackgrounds[index % placeholderBackgrounds.length],
            )}
          />
        ))}
      </Marquee>
    </section>
  );
}
