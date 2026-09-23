import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { site } from "@/content/site";
import { HeroIntro, HeroIntroItem } from "@/components/sections/hero-intro";
import { ValuationReport } from "@/components/showcase/valuation-report";

const trust = [
  "Sem contrato de fidelidade",
  "Time dedicado ao seu caixa",
  "Diagnóstico sem custo",
  "Pronto para eventos de liquidez",
];

export function Hero({ id }: { id?: string }) {
  return (
    <section
      id={id}
      aria-labelledby="hero-heading"
      className="relative isolate overflow-clip bg-bg"
    >
      <HeroIntro className="relative mx-auto flex max-w-4xl flex-col items-center px-6 pt-28 text-center md:pt-36">
        <HeroIntroItem>
          <p className="text-sm font-semibold text-brand-dark">{site.name}</p>
        </HeroIntroItem>

        <HeroIntroItem>
          <h1
            id="hero-heading"
            className="mt-4 text-balance text-4xl font-bold tracking-tight text-fg md:text-7xl"
            style={{ letterSpacing: "-0.03em" }}
          >
            {site.hero.h1}
          </h1>
        </HeroIntroItem>

        <HeroIntroItem>
          <p className="mt-5 max-w-2xl text-balance text-lg text-fg-muted md:text-xl">
            {site.hero.description}
          </p>
        </HeroIntroItem>

        <HeroIntroItem>
          <Link
            href={site.hero.ctaPrimary.href}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-ink px-7 py-4 text-sm font-semibold text-paper transition-transform hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            {site.hero.ctaPrimary.label}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </HeroIntroItem>

        <HeroIntroItem>
          <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            {trust.map((label) => (
              <li key={label} className="text-xs font-medium text-fg-muted">
                {label}
              </li>
            ))}
          </ul>
        </HeroIntroItem>
      </HeroIntro>

      <HeroIntro className="relative mx-auto flex max-w-5xl justify-center px-6 pb-24 pt-14 md:pb-32 md:pt-20">
        <HeroIntroItem>
          <ValuationReport />
        </HeroIntroItem>
      </HeroIntro>
    </section>
  );
}
