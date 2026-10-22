"use client";

import type { ReactNode } from "react";
import { domAnimation, LazyMotion } from "motion/react";

/**
 * Motion enxuta: os componentes usam `m.*` em vez de `motion.*` e só o pacote
 * domAnimation (animações, variants, exit, hover/tap/foco e whileInView) entra
 * no bundle de toda página. `strict` acusa erro se alguém usar `motion.*`.
 * Precisar de layout/drag: trocar para domMax (bem mais pesado).
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      {children}
    </LazyMotion>
  );
}
