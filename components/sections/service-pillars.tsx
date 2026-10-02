import { CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { Reveal } from "@/components/motion/reveal";
import { site } from "@/content/site";

export function ServicePillars({ id }: { id?: string }) {
  const { title, description } = site.servicesCarousel;

  return (
    <section id={id} aria-label="Soluções da Vispe Capital" className="bg-bg py-24 md:py-32">
      <div className="mx-auto max-w-3xl px-6 text-center">
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

      <div className="mx-auto mt-14 flex max-w-5xl flex-col items-center gap-6 px-6 md:flex-row md:items-start md:justify-center">
        {site.servicePillars.map((pillar, index) => {
          const isCenter = index === 1;
          return (
            <Reveal key={pillar.slug} delay={index * 0.06}>
              <div
                className={cn(
                  "grid w-[320px] grid-rows-[auto_auto_1fr_auto] rounded-3xl bg-surface px-6 py-8 text-center shadow-[0_1px_2px_rgba(38,38,38,0.04),0_4px_12px_-4px_rgba(38,38,38,0.1)]",
                  isCenter &&
                    "md:-mt-6 md:min-h-[560px] md:pb-10 md:shadow-[0_24px_64px_-24px_rgba(38,38,38,0.25)]",
                )}
              >
                <h3
                  className="text-[25px] font-bold leading-[30px]"
                  style={{ color: "#000000" }}
                >
                  Pilar {index + 1}
                </h3>

                <div className="mt-6">
                  <p
                    className="whitespace-nowrap font-bold"
                    style={{
                      color: "#000000",
                      // 60px cabe em ~9 caracteres num card de 320px; palavras
                      // mais longas (ORGANIZAÇÃO, CRESCIMENTO) encolhem
                      // proporcionalmente para caber numa linha só.
                      fontSize: `min(60px, ${(9 / pillar.shortLabel.length) * 60}px)`,
                      lineHeight: 1,
                    }}
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
                  Conhecer solução
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
