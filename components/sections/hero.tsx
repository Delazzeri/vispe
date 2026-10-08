import { LocaleLink as Link } from "@/components/ui/locale-link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useSite } from "@/content/site";
import { HeroIntro, HeroIntroItem } from "@/components/sections/hero-intro";
import { HeroScene } from "@/components/sections/hero-scene";
import { DashboardMockup } from "@/components/showcase/dashboard-mockup";
import { HeroRock } from "@/components/ui/hero-rock";

export function Hero({ id }: { id?: string }) {
  const site = useSite();
  return (
    <section
      id={id}
      aria-labelledby="hero-heading"
      className="relative isolate overflow-clip bg-bg"
    >
      <HeroScene softFadeOnMobile />

      <HeroIntro className="relative mx-auto flex max-w-4xl flex-col items-center px-6 pt-10 text-center md:pt-16">
        <HeroIntroItem>
          <p className="mb-3 flex items-center justify-center gap-2 text-[20px] font-semibold text-ink">
            <Image
              src="/media/brand/simbolo-vispe-preto-326.png"
              alt=""
              width={24}
              height={24}
              className="h-6 w-6"
            />
            {site.hero.eyebrow}
          </p>
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

        {/* max-w-full: sem ele o item cresce até os 680px do parágrafo e gera scroll horizontal no celular. */}
        <HeroIntroItem className="max-w-full">
          <p
            className="mt-5 w-[680px] max-w-full text-balance text-[18px] leading-[25.2px] tracking-[-0.18px] md:text-[20px] md:leading-[28px] md:tracking-[-0.2px] text-fg-muted"
          >
            {site.hero.description}
          </p>
        </HeroIntroItem>

        {/* No celular o CTA ocupa a largura toda, como na referência. */}
        <HeroIntroItem className="w-full sm:w-auto">
          <Link
            href={site.hero.ctaPrimary.href}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-ink px-7 py-4 text-base font-semibold text-paper transition-transform hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark sm:inline-flex sm:w-auto sm:text-sm"
          >
            {site.hero.ctaPrimary.label}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </HeroIntroItem>

        <HeroIntroItem>
          <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            {site.hero.bullets.map((label) => (
              <li key={label} className="text-xs font-medium text-fg-muted">
                {label}
              </li>
            ))}
          </ul>
        </HeroIntroItem>
      </HeroIntro>

      <HeroIntro className="relative flex w-full justify-center px-6 pb-12 md:pb-16">
        <HeroIntroItem className="relative z-10 -mt-6 md:-mt-10">
          <DashboardMockup />
        </HeroIntroItem>

        <HeroIntroItem className="pointer-events-auto absolute -left-12 top-2 z-20 w-34 md:left-[max(-40px,calc(50%-900px))] md:top-24 md:w-[360px] lg:w-[440px] xl:w-[480px]">
          <HeroRock side="left" />
        </HeroIntroItem>

        <HeroIntroItem className="pointer-events-auto absolute -right-12 top-2 z-20 w-34 md:right-[max(-40px,calc(50%-900px))] md:top-24 md:w-[360px] lg:w-[440px] xl:w-[480px]">
          <HeroRock side="right" />
        </HeroIntroItem>
      </HeroIntro>
    </section>
  );
}
