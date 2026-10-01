import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { site } from "@/content/site";
import { HeroIntro, HeroIntroItem } from "@/components/sections/hero-intro";
import { HeroScene } from "@/components/sections/hero-scene";
import { DashboardMockup } from "@/components/showcase/dashboard-mockup";
import { HeroRock } from "@/components/ui/hero-rock";

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
      <HeroScene />

      <HeroIntro className="relative mx-auto flex max-w-4xl flex-col items-center px-6 pt-20 text-center md:pt-32">
        <HeroIntroItem>
          <p className="mb-[22px] text-sm font-bold text-fg">{site.hero.eyebrow}</p>
        </HeroIntroItem>

        <HeroIntroItem>
          <h1
            id="hero-heading"
            className="text-balance text-4xl font-bold tracking-tight text-fg md:text-7xl"
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
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-ink px-7 py-4 text-sm font-semibold text-paper transition-transform hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            {site.hero.ctaPrimary.label}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </HeroIntroItem>

        <HeroIntroItem>
          <ul className="mt-10 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            {trust.map((label) => (
              <li key={label} className="text-xs font-medium text-fg-muted">
                {label}
              </li>
            ))}
          </ul>
        </HeroIntroItem>
      </HeroIntro>

      <HeroIntro className="relative flex w-full justify-center px-6 pb-24 md:pb-32">
        <HeroIntroItem className="relative z-10 mt-20 md:mt-28">
          <DashboardMockup />
        </HeroIntroItem>

        <HeroIntroItem className="pointer-events-auto absolute left-[-100px] top-48 z-20 hidden w-[360px] md:top-[248px] md:block lg:left-[-60px] lg:w-[440px] xl:left-[-20px] xl:w-[480px]">
          <HeroRock side="left" hoverVariant="2" hoverScale={0.81} />
        </HeroIntroItem>

        <HeroIntroItem className="pointer-events-auto absolute right-[-100px] top-48 z-20 hidden w-[360px] md:top-[248px] md:block lg:right-[-60px] lg:w-[440px] xl:right-[-20px] xl:w-[480px]">
          <HeroRock side="right" />
        </HeroIntroItem>
      </HeroIntro>
    </section>
  );
}
