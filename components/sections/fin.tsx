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
    "mt-10 inline-flex items-center gap-2 rounded-2xl bg-fin px-8 py-4 text-base font-semibold text-fin-fg transition-transform hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-paper md:px-10 md:py-5 md:text-lg";

  return (
    <section id={id} aria-labelledby="fin-heading" className="relative overflow-clip bg-ink">
      <ZoomTrack>
        <FinWall />
      </ZoomTrack>

      {/* O conteúdo sobe por cima do fim da animação: quando a parede termina
          pequena e apagada no centro da tela, o selo do Fin pousa sobre ela.
          Sem animação (reduced motion), fica abaixo da parede, sem sobreposição. */}
      <div className="relative z-10 mx-auto max-w-3xl px-6 pt-24 pb-24 text-center md:pb-32 motion-safe:-mt-[calc(50vh+90px)] motion-safe:pt-0">
        <Reveal>
          {/* Logo do Fin 24/7: selo verde em gradiente com "24", em destaque, e o nome embaixo. */}
          <div className="flex flex-col items-center gap-4">
            <span
              aria-hidden
              className="flex h-28 w-28 items-center justify-center rounded-4xl bg-linear-to-br from-fin-light to-fin text-5xl font-bold tracking-tight text-paper shadow-[0_0_64px_-8px_rgba(34,197,142,0.55),inset_0_1px_0_rgba(255,255,255,0.35)] md:h-36 md:w-36 md:text-6xl"
            >
              24
            </span>
            <span className="text-lg leading-6 font-semibold text-paper/80">{name}</span>
          </div>
          <h2
            id="fin-heading"
            className="mt-8 text-balance text-4xl font-bold tracking-tight text-paper md:text-7xl"
            style={{ letterSpacing: "-0.05em", lineHeight: 1 }}
          >
            {title}
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-balance text-lg text-paper/70 md:text-2xl md:leading-snug">
            {description}
          </p>
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
