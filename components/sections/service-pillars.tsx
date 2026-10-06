import { CheckCircle2, ArrowRight } from "lucide-react";
import type { CSSProperties } from "react";
import { LocaleLink as Link } from "@/components/ui/locale-link";
import { cn } from "@/lib/cn";
import { Reveal } from "@/components/motion/reveal";
import { HeroRock } from "@/components/ui/hero-rock";
import { useSite } from "@/content/site";
import { format } from "@/content/types";

/** Tamanho que faz uma palavra de `length` caracteres caber na largura do card. */
function fitSize(length: number) {
  return `min(60px, ${(100 / (length * 0.78)).toFixed(2)}cqw)`;
}

export function ServicePillars({ id }: { id?: string }) {
  const site = useSite();
  const { title, description } = site.servicesCarousel;
  const longestLabel = Math.max(...site.servicePillars.map((pillar) => pillar.shortLabel.length));

  return (
    <section id={id} aria-label={site.ui.pillarsLabel} className="relative overflow-hidden bg-bg py-24 md:py-32">
      <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
        <Reveal>
          <h2
            className="text-balance text-3xl font-bold tracking-tight text-ink md:text-[48px] md:leading-[48px]"
            style={{ letterSpacing: "-0.05em" }}
          >
            {title}
          </h2>
          <p className="mt-5 text-balance text-lg text-fg-muted">{description}</p>
        </Reveal>
      </div>

      <div className="relative mx-auto mt-24 max-w-7xl px-6">
        {/* Rochas atrás dos cards, metade escondida, como na referência */}
        <div className="pointer-events-none absolute -left-[260px] z-0 -translate-y-1/2 hidden w-[425px] md:block" style={{ top: "calc(50% + 30px)" }}>
          <HeroRock side="left" trackSection />
        </div>
        <div className="pointer-events-none absolute -right-[260px] z-0 -translate-y-1/2 hidden w-[425px] md:block" style={{ top: "calc(50% - 50px)" }}>
          <HeroRock side="right" trackSection />
        </div>

        <div className="relative z-10 flex flex-col items-center gap-6 md:flex-row md:items-start md:justify-center md:gap-5">
        {site.servicePillars.map((pillar, index) => {
          const isCenter = index === 1;
          return (
            <Reveal key={pillar.slug} delay={index * 0.06}>
              <div
                className={cn(
                  "grid w-[320px] max-w-full md:w-[386px] grid-cols-[minmax(0,1fr)] grid-rows-[auto_auto_1fr_auto] rounded-3xl bg-surface px-6 pb-12 pt-8 text-center md:min-h-[490px] md:pb-10 shadow-[0_1px_2px_rgba(38,38,38,0.04),0_4px_12px_-4px_rgba(38,38,38,0.1)]",
                  isCenter &&
                    "md:-mt-10 md:min-h-[570px] md:pb-10 md:shadow-[0_24px_64px_-24px_rgba(38,38,38,0.25)]",
                )}
              >
                <h3
                  className="text-[25px] font-bold leading-[30px]"
                  style={{ color: "#000000" }}
                >
                  {format(site.ui.pillar, { n: index + 1 })}
                </h3>

                <div className="mt-6 min-w-0" style={{ containerType: "inline-size" }}>
                  <p
                    className="whitespace-nowrap font-bold text-(length:--fit-all) md:text-(length:--fit-own)"
                    style={
                      {
                        color: "#000000",
                        // Dimensiona pela largura real do container (cqw): ~0.78em
                        // por caractere em caixa alta bold, então a palavra sempre
                        // cabe em uma linha, teto de 60px. No desktop cada palavra
                        // preenche o card; no celular, com os cards empilhados, todas
                        // usam o tamanho da mais longa para ficarem padronizadas.
                        "--fit-own": fitSize(pillar.shortLabel.length),
                        "--fit-all": fitSize(longestLabel),
                        lineHeight: 1,
                      } as CSSProperties
                    }
                  >
                    {pillar.shortLabel}
                  </p>
                  <p className="mt-3 text-[12px]" style={{ color: "#65666a" }}>
                    {pillar.tagline}
                  </p>
                </div>

                <ul className="mt-8 w-full space-y-4 text-left">
                  {pillar.includes.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-fg-muted" aria-hidden />
                      <span className="text-[14px]" style={{ color: "#000000" }}>
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/contato"
                  className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-ink px-6 py-4 text-sm font-semibold text-paper transition-transform hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                >
                  {pillar.cta}
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </div>
            </Reveal>
          );
        })}
        </div>
      </div>
    </section>
  );
}
