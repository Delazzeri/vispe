"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { Reveal } from "@/components/motion/reveal";
import { site } from "@/content/site";

/**
 * Mari + 24 Fin compartilham um único fundo: a imagem da Mari fica pinned
 * (sticky) atrás de um wrapper alto, com motion de escala/opacidade ligado
 * ao scroll dessa extensão — entra em zoom, segura cheia-tela e encolhe,
 * desaparecendo perto do fim do wrapper. O conteúdo estático da Fin vem
 * logo em seguida no fluxo normal, por isso a imagem (sticky) some pouco
 * antes dele aparecer na tela.
 */
export function Mari({ id, finId }: { id?: string; finId?: string }) {
  const { name, title, description, ctaLabel, ctaHref } = site.fin;
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const scale = useTransform(scrollYProgress, [0, 0.3, 0.75, 1], [3, 1, 1, 0.3]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.75, 1], [0.05, 1, 1, 0]);

  const finContent = (
    <div className="mx-auto max-w-2xl px-6 text-center">
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
    </div>
  );

  if (shouldReduceMotion) {
    return (
      <>
        <section id={id} aria-label="Mari, o radar de oportunidades de venda da Vispe" className="bg-ink">
          <Image
            src="/media/motion/motion-mari.png"
            alt="Painel da Mari mostrando CNPJs analisados, empresas em janela de venda e volume de mercado mapeado em tempo real."
            width={1897}
            height={862}
            className="h-auto w-full"
          />
        </section>
        <section id={finId} aria-labelledby="fin-heading" className="bg-ink py-24 md:py-32">
          {finContent}
        </section>
      </>
    );
  }

  return (
    <div id={id} aria-label="Mari, o radar de oportunidades de venda da Vispe" className="bg-ink">
      <div ref={ref} className="relative h-[250vh]">
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

      <section id={finId} aria-labelledby="fin-heading" className="relative bg-ink py-24 md:py-32">
        <Reveal>{finContent}</Reveal>
      </section>
    </div>
  );
}
