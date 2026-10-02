"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { Reveal } from "@/components/motion/reveal";
import { site } from "@/content/site";

/**
 * A imagem da Mari ocupa um trecho fixo de 1300px no início da seção Fin,
 * pinned (sticky) enquanto o scroll avança por essa faixa. Escala/opacidade
 * seguem offsets exatos em pixels dentro dela: 0-50px = 300%/5%,
 * 500-1000px = 100%/100%, 1000-1300px = 50%/0%.
 */
export function Fin({ id }: { id?: string }) {
  const { name, title, description, ctaLabel, ctaHref } = site.fin;
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  // scrollYProgress vai de 0 a 1 ao longo dos 1300px do ref — os pontos de
  // corte abaixo já são esses px convertidos em fração (px / 1300).
  const scale = useTransform(
    scrollYProgress,
    [0, 50 / 1300, 500 / 1300, 1000 / 1300, 1300 / 1300],
    [3, 3, 1, 1, 0.5],
  );
  const opacity = useTransform(
    scrollYProgress,
    [0, 50 / 1300, 500 / 1300, 1000 / 1300, 1300 / 1300],
    [0.05, 0.05, 1, 1, 0],
  );

  return (
    <section id={id} aria-labelledby="fin-heading" className="relative bg-ink">
      {shouldReduceMotion ? (
        <Image
          src="/media/motion/motion-mari.png"
          alt="Painel da Mari mostrando CNPJs analisados, empresas em janela de venda e volume de mercado mapeado em tempo real."
          width={1897}
          height={862}
          className="h-auto w-full"
        />
      ) : (
        <div ref={ref} className="relative h-[1300px]">
          <motion.div
            style={{ scale, opacity }}
            className="pointer-events-none sticky top-0 h-screen w-full overflow-hidden"
          >
            <Image
              src="/media/motion/motion-mari.png"
              alt="Painel da Mari mostrando CNPJs analisados, empresas em janela de venda e volume de mercado mapeado em tempo real."
              fill
              className="object-fill"
              sizes="100vw"
            />
          </motion.div>
        </div>
      )}

      <div className="mx-auto max-w-2xl px-6 pt-24 pb-24 text-center md:pb-32">
        <Reveal>
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-brand text-base font-bold text-brand-fg">
            24
          </span>
          <p className="mt-4 text-sm font-bold text-brand">{name}</p>
          <h2
            id="fin-heading"
            className="mt-3 text-balance text-3xl font-bold tracking-tight text-paper md:text-[48px] md:leading-[48px]"
            style={{ letterSpacing: "-0.05em" }}
          >
            {title}
          </h2>
          <p className="mt-5 text-balance text-lg text-paper/70">{description}</p>
          <Link
            href={ctaHref}
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-brand px-7 py-4 text-sm font-semibold text-brand-fg transition-transform hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-paper"
          >
            {ctaLabel}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
