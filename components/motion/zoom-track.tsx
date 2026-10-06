"use client";

import { useRef, type ReactNode } from "react";
import { motion, transform, useScroll, useTransform, useReducedMotion } from "motion/react";

type ZoomTrackProps = {
  children: ReactNode;
};

/**
 * Faixa de 1300px em que o conteúdo fica pinned (sticky) e "aproxima" com o
 * scroll. Escala/opacidade seguem offsets exatos em pixels: 0-50px = 300%/5%,
 * 500-1000px = 100%/100%, 1000-1300px = 50%/0%.
 * A faixa inteira começa `lead` px antes de a seção chegar ao topo, para o
 * zoom já estar em andamento enquanto ela entra na tela.
 * Com reduced motion, o conteúdo aparece estático e visível.
 */
const lead = 200;

export function ZoomTrack({ children }: ZoomTrackProps) {
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: [`start ${lead}px`, `end ${lead}px`] });

  // scrollYProgress vai de 0 a 1 ao longo dos 1300px do ref — os pontos de
  // corte abaixo já são esses px convertidos em fração (px / 1300).
  const stops = [0, 50 / 1300, 500 / 1300, 1000 / 1300, 1300 / 1300];
  const scale = useTransform(scrollYProgress, stops, [3, 3, 1, 1, 0.5]);
  // Forma com função de propósito: com ranges, o Motion acelera opacity via
  // ViewTimeline nativo, que calcula a faixa errada com o filho sticky e
  // deixa o valor travado em 0.05.
  const toOpacity = transform(stops, [0.05, 0.05, 1, 1, 0]);
  const opacity = useTransform(scrollYProgress, (v) => toOpacity(v));

  if (shouldReduceMotion) {
    return <div className="flex h-96 items-center justify-center overflow-hidden md:h-160">{children}</div>;
  }

  return (
    <div ref={ref} className="relative h-[calc(1300px+100vh)]">
      <div className="pointer-events-none sticky top-0 h-screen w-full overflow-hidden">
        <motion.div style={{ scale, opacity }} className="flex h-full w-full items-center justify-center">
          {children}
        </motion.div>
      </div>
    </div>
  );
}
