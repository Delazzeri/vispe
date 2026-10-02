"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";

/**
 * Transição de seção, não uma seção de conteúdo: o scroll "revela" a Mari
 * crescendo de um retângulo pequeno e transparente até cobrir a viewport
 * inteira, de forma pinned, antes de liberar o scroll para a seção seguinte.
 */
export function Mari({ id }: { id?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const scale = useTransform(scrollYProgress, [0, 0.85], [0.3, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [0, 1]);
  const radius = useTransform(scrollYProgress, [0, 0.85], [32, 0]);

  if (shouldReduceMotion) {
    return (
      <section id={id} aria-label="Mari, o radar de oportunidades de venda da Vispe" className="bg-bg">
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
      className="relative h-[250vh] bg-bg"
    >
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
        <motion.div
          style={{ scale, opacity, borderRadius: radius }}
          className="h-full w-full overflow-hidden"
        >
          <Image
            src="/media/motion/motion-mari.png"
            alt="Painel da Mari mostrando CNPJs analisados, empresas em janela de venda e volume de mercado mapeado em tempo real."
            width={1897}
            height={862}
            className="h-full w-full object-cover"
            sizes="100vw"
          />
        </motion.div>
      </div>
    </section>
  );
}
