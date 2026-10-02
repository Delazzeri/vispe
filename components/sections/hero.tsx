import Link from "next/link";
import Image from "next/image";
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

        <HeroIntroItem>
          <p
            className="mt-5 w-[680px] max-w-full text-balance text-[18px] leading-[25.2px] tracking-[-0.18px] md:text-[20px] md:leading-[28px] md:tracking-[-0.2px]"
            style={{ color: "#5f6062" }}
          >
            {site.hero.description}
          </p>
        </HeroIntroItem>

        <HeroIntroItem>
          <Link
            href={site.hero.ctaPrimary.href}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-ink px-7 py-4 text-sm font-semibold text-paper transition-transform hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
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

      <HeroIntro className="relative flex w-full justify-center px-6 pb-12 md:pb-16">
        <HeroIntroItem className="relative z-10 -mt-6 md:-mt-10">
          <DashboardMockup />
        </HeroIntroItem>

        <HeroIntroItem className="pointer-events-auto absolute left-[max(-40px,calc(50%-900px))] top-20 z-20 hidden w-[360px] md:top-24 md:block lg:w-[440px] xl:w-[480px]">
          <HeroRock side="left" hoverVariant="2" hoverScale={0.81} />
        </HeroIntroItem>

        <HeroIntroItem className="pointer-events-auto absolute right-[max(-40px,calc(50%-900px))] top-20 z-20 hidden w-[360px] md:top-24 md:block lg:w-[440px] xl:w-[480px]">
          <HeroRock side="right" hoverVariant="2" hoverScale={0.97} />
        </HeroIntroItem>
      </HeroIntro>
    </section>
  );
}
