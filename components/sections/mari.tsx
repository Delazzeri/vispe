"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { Reveal } from "@/components/motion/reveal";
import { site } from "@/content/site";

export function Mari({ id }: { id?: string }) {
  const { eyebrow, title, description } = site.mari;
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.85, 1.05, 0.85]);

  return (
    <section id={id} aria-labelledby="mari-heading" className="bg-bg py-24 md:py-32">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <Reveal>
          <p className="text-sm font-bold text-brand-dark">{eyebrow}</p>
          <h2
            id="mari-heading"
            className="mt-3 text-balance text-3xl font-bold tracking-tight text-ink md:text-[48px] md:leading-[48px]"
            style={{ letterSpacing: "-0.05em" }}
          >
            {title}
          </h2>
          <p className="mt-5 text-balance text-lg text-fg-muted">{description}</p>
        </Reveal>
      </div>

      <div ref={ref} className="mx-auto mt-14 max-w-[1104px] px-6">
        <motion.div
          style={shouldReduceMotion ? undefined : { scale }}
          className="overflow-hidden rounded-3xl shadow-[0_1px_2px_rgba(38,38,38,0.04),0_24px_64px_-24px_rgba(38,38,38,0.25)]"
        >
          <Image
            src="/media/motion/motion-mari.png"
            alt="Painel da Mari mostrando CNPJs analisados, empresas em janela de venda e volume de mercado mapeado em tempo real."
            width={1897}
            height={862}
            className="h-auto w-full"
            sizes="(min-width: 1104px) 1104px, 100vw"
          />
        </motion.div>
      </div>
    </section>
  );
}
