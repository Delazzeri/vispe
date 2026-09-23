import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { site } from "@/content/site";
import { HeroIntro, HeroIntroItem } from "@/components/sections/hero-intro";
import { FinancialDashboard } from "@/components/showcase/financial-dashboard";
import { GoldBar } from "@/components/ui/gold-bar";

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
      className="relative isolate overflow-clip bg-surface"
    >
      {/* Cena de fundo: gradiente radial dourado, dissolvendo no bg no topo e no fundo */}
      <div className="absolute inset-x-0 top-[80px] h-[520px] overflow-hidden md:top-[150px] md:h-[800px]">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(60% 60% at 50% 35%, rgba(250,214,67,0.18) 0%, rgba(214,178,86,0.10) 45%, transparent 75%)",
          }}
        />
        <div className="absolute inset-x-0 top-0 h-[45%] bg-gradient-to-b from-surface to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-[40%] bg-gradient-to-t from-surface to-transparent" />
      </div>

      <HeroIntro className="relative mx-auto flex max-w-4xl flex-col items-center px-6 pt-28 text-center md:pt-40">
        <HeroIntroItem>
          <p className="inline-flex items-center gap-2 text-sm font-semibold text-brand-dark">
            {site.name}
          </p>
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

      {/* Mockup + barras de ouro: camada única, barras avançam sobre o mockup */}
      <HeroIntro className="relative mx-auto mt-12 flex max-w-5xl justify-center px-6 pb-24 md:mt-16 md:pb-32">
        <HeroIntroItem className="pointer-events-none absolute -left-16 top-6 hidden w-32 -rotate-6 md:-left-20 md:top-10 md:block md:w-40 lg:-left-28 lg:w-48">
          <GoldBar className="w-full drop-shadow-xl" />
        </HeroIntroItem>

        <HeroIntroItem className="relative z-10">
          <FinancialDashboard />
        </HeroIntroItem>

        <HeroIntroItem className="pointer-events-none absolute -right-16 top-10 hidden w-32 rotate-6 md:-right-20 md:top-16 md:block md:w-40 lg:-right-28 lg:w-48">
          <GoldBar flip className="w-full drop-shadow-xl" />
        </HeroIntroItem>
      </HeroIntro>
    </section>
  );
}
