"use client";

import { useRef, type ReactNode } from "react";
import { motion, transform, useScroll, useTransform, useReducedMotion } from "motion/react";

type ZoomTrackProps = {
  children: ReactNode;
};

/**
 * Faixa de 700px em que o conteúdo fica pinned (sticky) e "aproxima" com o
 * scroll. A animação começa assim que o topo da seção aparece na base da tela
 * e termina quando a faixa sai pelo topo: 300%/5% → 100%/100% (até 40% do
 * percurso), parado até 48%, depois encolhe para 42%/25% até ~62% (fim do
 * pin) e fica assim, pequena e apagada atrás do selo do Fin que sobe por cima.
 * Com reduced motion, o conteúdo aparece estático e visível.
 */

export function ZoomTrack({ children }: ZoomTrackProps) {
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  // scrollYProgress vai de 0 (topo da seção na base da tela) a 1 (fim da
  // faixa no topo da tela); os pontos de corte são frações desse percurso.
  const stops = [0, 0.4, 0.48, 0.62, 1];
  const scale = useTransform(scrollYProgress, stops, [3, 1, 1, 0.42, 0.42]);
  // Forma com função de propósito: com ranges, o Motion acelera opacity via
  // ViewTimeline nativo, que calcula a faixa errada com o filho sticky e
  // deixa o valor travado em 0.05.
  const toOpacity = transform(stops, [0.05, 1, 1, 0.25, 0.25]);
  const opacity = useTransform(scrollYProgress, (v) => toOpacity(v));

  if (shouldReduceMotion) {
    return <div className="flex h-96 items-center justify-center overflow-hidden md:h-160">{children}</div>;
  }

  return (
    <div ref={ref} className="relative h-[calc(700px+100vh)]">
      <div className="pointer-events-none sticky top-0 h-screen w-full overflow-hidden">
        <motion.div style={{ scale, opacity }} className="flex h-full w-full items-center justify-center">
          {children}
        </motion.div>
      </div>
    </div>
  );
}
