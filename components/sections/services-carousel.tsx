"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { Reveal } from "@/components/motion/reveal";
import { site } from "@/content/site";

const INITIAL_SLUG = "controladoria-financeira";
const REPEATS = 3; // cópias do array original para simular loop infinito
const INITIAL_SET = Math.floor(REPEATS / 2); // conjunto do meio, onde o scroll começa

const services = site.services;
const loopedServices = Array.from({ length: REPEATS }, () => services).flat();

export function ServicesCarousel({ id }: { id?: string }) {
  const { title, description } = site.servicesCarousel;
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const initialRealIndex = Math.max(
    0,
    services.findIndex((service) => service.slug === INITIAL_SLUG),
  );
  const [activeIndex, setActiveIndex] = useState(
    INITIAL_SET * services.length + initialRealIndex,
  );

  function closestIndexToCenter(): number | null {
    const track = trackRef.current;
    if (!track) return null;
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
    return closestIndex;
  }

  function scrollToIndex(index: number, behavior: ScrollBehavior = "smooth") {
    const card = cardRefs.current[index];
    card?.scrollIntoView({ behavior, inline: "center", block: "nearest" });
  }

  // Posiciona no conjunto do meio sem animação ao montar, e realinha para o
  // conjunto do meio sempre que o usuário rolar até perto de uma ponta —
  // dá a sensação de loop infinito trocando o alvo sem o usuário perceber.
  useEffect(() => {
    scrollToIndex(activeIndex, "instant" as ScrollBehavior);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleScroll() {
    window.requestAnimationFrame(() => {
      const index = closestIndexToCenter();
      if (index === null) return;
      setActiveIndex(index);

      const track = trackRef.current;
      if (!track) return;
      const realIndex = ((index % services.length) + services.length) % services.length;
      const setIndex = Math.floor(index / services.length);

      if (setIndex <= 0 || setIndex >= REPEATS - 1) {
        const recenteredIndex = INITIAL_SET * services.length + realIndex;
        track.style.scrollBehavior = "auto";
        scrollToIndex(recenteredIndex, "instant" as ScrollBehavior);
        setActiveIndex(recenteredIndex);
        requestAnimationFrame(() => {
          track.style.scrollBehavior = "";
        });
      }
    });
  }

  return (
    <section id={id} aria-label="Soluções da Vispe Capital" className="bg-bg py-24 md:py-32">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <Reveal>
          <h2 className="text-balance text-3xl font-bold tracking-tight text-ink md:text-[48px] md:leading-[48px]" style={{ letterSpacing: "-0.05em" }}>
            {title}
          </h2>
          <p className="mt-5 text-balance text-lg text-fg-muted">{description}</p>
        </Reveal>
      </div>

      <div className="relative mx-auto mt-14 max-w-7xl px-6">
        <div
          ref={trackRef}
          onScroll={handleScroll}
          className="flex snap-x snap-mandatory gap-8 overflow-x-auto scroll-smooth px-[15%] pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {loopedServices.map((service, index) => {
            const isActive = index === activeIndex;
            return (
              <div
                key={`${service.slug}-${index}`}
                ref={(el) => {
                  cardRefs.current[index] = el;
                }}
                className={cn(
                  "grid w-[350px] shrink-0 snap-center grid-rows-[auto_auto_1fr_auto] rounded-3xl bg-surface px-6 py-8 text-center shadow-[0_1px_2px_rgba(38,38,38,0.04),0_4px_12px_-4px_rgba(38,38,38,0.1)] transition-transform duration-300 md:w-[400px] md:min-h-[500px]",
                  isActive ? "scale-105" : "scale-90 opacity-70",
                )}
              >
                <h3 className="text-2xl font-bold tracking-tight text-ink">{service.name}</h3>

                <div className="mt-6">
                  <p
                    className="text-balance text-5xl font-extrabold tracking-tight text-ink"
                    style={{ letterSpacing: "-0.03em" }}
                  >
                    {service.shortLabel}
                  </p>
                  <p className="mt-2 text-sm text-fg-muted">{service.tagline}</p>
                </div>

                <ul className="mt-8 w-full space-y-4 text-left">
                  {service.includes.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-fg-muted" aria-hidden />
                      <span className="text-sm text-fg">{item}</span>
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
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => scrollToIndex(activeIndex - 1)}
          aria-label="Solução anterior"
          className="absolute left-0 top-1/2 hidden -translate-y-1/2 items-center justify-center rounded-full bg-surface p-3 shadow-[0_1px_2px_rgba(38,38,38,0.04),0_4px_12px_-4px_rgba(38,38,38,0.1)] transition-transform hover:scale-[1.02] md:flex focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        >
          <ChevronLeft className="h-5 w-5 text-fg" aria-hidden />
        </button>

        <button
          type="button"
          onClick={() => scrollToIndex(activeIndex + 1)}
          aria-label="Próxima solução"
          className="absolute right-0 top-1/2 hidden -translate-y-1/2 items-center justify-center rounded-full bg-surface p-3 shadow-[0_1px_2px_rgba(38,38,38,0.04),0_4px_12px_-4px_rgba(38,38,38,0.1)] transition-transform hover:scale-[1.02] md:flex focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        >
          <ChevronRight className="h-5 w-5 text-fg" aria-hidden />
        </button>
      </div>
    </section>
  );
}
