"use client";

import { useEffect, useRef, useState } from "react";
import {
  Handshake,
  TrendingUp,
  Receipt,
  LineChart,
  Target,
  Scale,
  ChevronLeft,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { site } from "@/content/site";

const icons: Record<string, LucideIcon> = {
  ma: Handshake,
  "captacao-de-recursos": TrendingUp,
  "planejamento-tributario": Receipt,
  "controladoria-financeira": LineChart,
  "aceleracao-comercial": Target,
  valuation: Scale,
};

const INITIAL_SLUG = "controladoria-financeira";

export function ServicesCarousel({ id }: { id?: string }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(() =>
    Math.max(
      0,
      site.services.findIndex((service) => service.slug === INITIAL_SLUG),
    ),
  );

  function updateActiveIndex() {
    const track = trackRef.current;
    if (!track) return;
    const trackCenter = track.scrollLeft + track.clientWidth / 2;

    let closestIndex = 0;
    let closestDistance = Infinity;
    cardRefs.current.forEach((card, index) => {
      if (!card) return;
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const distance = Math.abs(cardCenter - trackCenter);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });
    setActiveIndex(closestIndex);
  }

  function scrollToIndex(index: number) {
    const card = cardRefs.current[index];
    card?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }

  useEffect(() => {
    scrollToIndex(activeIndex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleScroll() {
    window.requestAnimationFrame(updateActiveIndex);
  }

  return (
    <section id={id} aria-label="Soluções da Vispe Capital" className="bg-bg py-16 md:py-20">
      <div className="relative mx-auto max-w-6xl px-6">
        <div
          ref={trackRef}
          onScroll={handleScroll}
          className="flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth px-[10%] pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {site.services.map((service, index) => {
            const Icon = icons[service.slug];
            const isActive = index === activeIndex;
            return (
              <div
                key={service.slug}
                ref={(el) => {
                  cardRefs.current[index] = el;
                }}
                className={cn(
                  "flex w-[280px] shrink-0 snap-center flex-col items-start rounded-3xl p-7 transition-all duration-300 md:w-[340px]",
                  isActive
                    ? "scale-100 bg-ink opacity-100 shadow-[0_24px_64px_-24px_rgba(38,38,38,0.35)]"
                    : "scale-90 bg-surface opacity-60",
                )}
              >
                <Icon
                  className={cn("h-7 w-7", isActive ? "text-brand" : "text-brand-dark")}
                  aria-hidden
                />
                <h3
                  className={cn(
                    "mt-5 text-lg font-semibold",
                    isActive ? "text-paper" : "text-fg",
                  )}
                >
                  {service.name}
                </h3>
                <p
                  className={cn(
                    "mt-2 text-sm leading-relaxed",
                    isActive ? "text-paper/70" : "text-fg-muted",
                  )}
                >
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => scrollToIndex(Math.max(0, activeIndex - 1))}
          disabled={activeIndex === 0}
          aria-label="Solução anterior"
          className="absolute left-0 top-1/2 hidden -translate-y-1/2 items-center justify-center rounded-full bg-surface p-3 shadow-[0_1px_2px_rgba(38,38,38,0.04),0_4px_12px_-4px_rgba(38,38,38,0.1)] transition-opacity hover:scale-[1.02] disabled:opacity-0 md:flex focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        >
          <ChevronLeft className="h-5 w-5 text-fg" aria-hidden />
        </button>

        <button
          type="button"
          onClick={() => scrollToIndex(Math.min(site.services.length - 1, activeIndex + 1))}
          disabled={activeIndex === site.services.length - 1}
          aria-label="Próxima solução"
          className="absolute right-0 top-1/2 hidden -translate-y-1/2 items-center justify-center rounded-full bg-surface p-3 shadow-[0_1px_2px_rgba(38,38,38,0.04),0_4px_12px_-4px_rgba(38,38,38,0.1)] transition-opacity hover:scale-[1.02] disabled:opacity-0 md:flex focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        >
          <ChevronRight className="h-5 w-5 text-fg" aria-hidden />
        </button>
      </div>
    </section>
  );
}
