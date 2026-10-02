"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";

/**
 * Transição de seção, não uma seção de conteúdo: a imagem preenche a
 * viewport inteira (pinned) e o scroll conduz um zoom — entra em 300% de
 * escala e 5% de opacidade, atinge 100%/100% aos 30% do scroll e segura até
 * 70%, depois termina em 30% de escala e 5% de opacidade.
 */
export function Mari({ id }: { id?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [3, 1, 1, 0.3]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.05, 1, 1, 0.05]);

  if (shouldReduceMotion) {
    return (
      <section id={id} aria-label="Mari, o radar de oportunidades de venda da Vispe" className="bg-ink">
        <Image
          src="/media/motion/motion-mari.png"
          alt="Painel da Mari mostrando CNPJs analisados, empresas em janela de venda e volume de mercado mapeado em tempo real."
          width={1897}
          height={862}
          className="h-auto w-full"
        />
      </section>
    );
  }

  return (
    <section
      id={id}
      ref={ref}
      aria-label="Mari, o radar de oportunidades de venda da Vispe"
      className="relative h-[250vh] bg-ink"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <motion.div style={{ scale, opacity }} className="h-full w-full">
          <Image
            src="/media/motion/motion-mari.png"
            alt="Painel da Mari mostrando CNPJs analisados, empresas em janela de venda e volume de mercado mapeado em tempo real."
            fill
            className="object-fill"
            sizes="100vw"
          />
        </motion.div>
      </div>
    </section>
  );
}
