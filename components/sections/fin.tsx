import { LocaleLink as Link } from "@/components/ui/locale-link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { ZoomTrack } from "@/components/motion/zoom-track";
import { FinWall } from "@/components/showcase/fin-wall";
import { useSite } from "@/content/site";

/**
 * Seção Fin 24/7: parede de widgets do "CFO virtual" pinned no início da
 * seção, aproximando com o scroll (ZoomTrack), seguida do CTA.
 */
export function Fin({ id }: { id?: string }) {
  const site = useSite();
  const { name, title, description, ctaLabel, ctaHref } = site.fin;
  const isExternal = ctaHref.startsWith("http://") || ctaHref.startsWith("https://");
  const ctaClass =
    "mt-8 inline-flex items-center gap-2 rounded-xl bg-fin px-7 py-4 text-sm font-semibold text-fin-fg transition-transform hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-paper";

  return (
    <section id={id} aria-labelledby="fin-heading" className="relative overflow-clip bg-ink">
      <ZoomTrack>
        <FinWall />
      </ZoomTrack>

      <div className="mx-auto max-w-2xl px-6 pt-24 pb-24 text-center md:pb-32">
        <Reveal>
          {/* Logo do Fin 24/7: selo verde em gradiente com "24" e o nome. No
              celular o selo vira o destaque, grande e centralizado, com o nome embaixo. */}
          <div className="flex flex-col items-center gap-4 md:inline-flex md:flex-row md:gap-3 md:text-left">
            <span
              aria-hidden
              className="flex h-24 w-24 items-center justify-center rounded-3xl bg-linear-to-br from-fin-light to-fin text-4xl font-bold text-paper shadow-[0_0_48px_-8px_rgba(34,197,142,0.6)] md:h-12 md:w-12 md:rounded-2xl md:text-lg md:shadow-none"
            >
              24
            </span>
            <span className="text-xl leading-6 font-bold text-paper">{name}</span>
          </div>
          <h2
            id="fin-heading"
            className="mt-6 text-balance text-3xl font-bold tracking-tight text-paper md:text-[48px] md:leading-[48px]"
            style={{ letterSpacing: "-0.05em" }}
          >
            {title}
          </h2>
          <p className="mt-5 text-balance text-lg text-paper/70">{description}</p>
          {isExternal ? (
            // Portal do Fin 24/7 é outro sistema: abre em nova aba.
            <a href={ctaHref} target="_blank" rel="noopener" className={ctaClass}>
              {ctaLabel}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </a>
          ) : (
            <Link href={ctaHref} className={ctaClass}>
              {ctaLabel}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          )}
        </Reveal>
      </div>
    </section>
  );
}
