import { LocaleLink as Link } from "@/components/ui/locale-link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { ZoomTrack } from "@/components/motion/zoom-track";
import { FinWall } from "@/components/showcase/fin-wall";
import { site } from "@/content/site";

/**
 * Seção 24 Fin: parede de widgets do "CFO virtual" pinned no início da
 * seção, aproximando com o scroll (ZoomTrack), seguida do CTA.
 */
export function Fin({ id }: { id?: string }) {
  const { name, title, description, ctaLabel, ctaHref } = site.fin;

  return (
    <section id={id} aria-labelledby="fin-heading" className="relative overflow-clip bg-ink">
      <ZoomTrack>
        <FinWall />
      </ZoomTrack>

      <div className="mx-auto max-w-2xl px-6 pt-24 pb-24 text-center md:pb-32">
        <Reveal>
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-brand text-base font-bold text-brand-fg">
            24
          </span>
          <p className="mt-4 text-sm font-bold text-brand">{name}</p>
          <h2
            id="fin-heading"
            className="mt-3 text-balance text-3xl font-bold tracking-tight text-paper md:text-[48px] md:leading-[48px]"
            style={{ letterSpacing: "-0.05em" }}
          >
            {title}
          </h2>
          <p className="mt-5 text-balance text-lg text-paper/70">{description}</p>
          <Link
            href={ctaHref}
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-brand px-7 py-4 text-sm font-semibold text-brand-fg transition-transform hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-paper"
          >
            {ctaLabel}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
