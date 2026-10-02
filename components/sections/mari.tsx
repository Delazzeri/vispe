"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { site } from "@/content/site";

/**
 * Transição de seção, não uma seção de conteúdo comum: a imagem da Mari
 * preenche a viewport inteira (pinned) e o scroll conduz um zoom — entra em
 * 300% de escala e 5% de opacidade, atinge 100%/100% aos 25% do scroll,
 * segura até 55%, depois encolhe e recua. O bloco de conteúdo da 24 Fin é
 * estático (sem motion próprio) e fica atrás da imagem na pilha, revelado
 * conforme ela encolhe/perde opacidade.
 */
export function Mari({ id }: { id?: string }) {
  const { name, title, description, ctaLabel, ctaHref } = site.fin;
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const scale = useTransform(scrollYProgress, [0, 0.25, 0.55, 0.8], [3, 1, 1, 0.3]);
  const opacity = useTransform(scrollYProgress, [0, 0.25, 0.55, 0.8], [0.05, 1, 1, 0.05]);

  if (shouldReduceMotion) {
    return (
      <section id={id} aria-label={`Mari e ${name}`} className="bg-ink">
        <Image
          src="/media/motion/motion-mari.png"
          alt="Painel da Mari mostrando CNPJs analisados, empresas em janela de venda e volume de mercado mapeado em tempo real."
          width={1897}
          height={862}
          className="h-auto w-full"
        />
        <div className="mx-auto max-w-2xl px-6 py-24 text-center">
          <p className="text-sm font-bold text-brand">{name}</p>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-paper md:text-5xl">
            {title}
          </h2>
          <p className="mt-5 text-balance text-lg text-paper/70">{description}</p>
          <Link
            href={ctaHref}
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-brand px-7 py-4 text-sm font-semibold text-brand-fg"
          >
            {ctaLabel}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section id={id} ref={ref} aria-label={`Mari e ${name}`} className="relative h-[350vh] bg-ink">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <motion.div style={{ scale, opacity }} className="absolute inset-0 h-full w-full">
          <Image
            src="/media/motion/motion-mari.png"
            alt="Painel da Mari mostrando CNPJs analisados, empresas em janela de venda e volume de mercado mapeado em tempo real."
            fill
            className="object-fill"
            sizes="100vw"
          />
        </motion.div>

        <div className="relative mx-auto flex h-full max-w-2xl flex-col items-center justify-center px-6 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand text-base font-bold text-brand-fg">
            24
          </span>
          <p className="mt-4 text-sm font-bold text-brand">{name}</p>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-paper md:text-5xl">
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
      </div>
    </section>
  );
}
