"use client";

import type { ReactNode } from "react";
import * as m from "motion/react-m";
import { useReducedMotion, type Variants } from "motion/react";
import { cn } from "@/lib/cn";

/**
 * EXCEÇÃO À REGRA GERAL DE MOTION (CLAUDE.md §8: "o H1 do hero aparece
 * imediatamente"): por decisão explícita do time, o Hero replica fielmente
 * a intro animada do cooldock.app, incluindo o H1 com fade+translate.
 * Isso troca uma fração de LCP por fidelidade visual à referência — decisão
 * consciente, não descuido. Não usar este padrão em outras seções acima
 * da dobra sem a mesma aprovação explícita.
 *
 * No celular, o painel (LCP da home) aparece pronto, sem o fade (staticOnMobile):
 * decisão do time para o LCP do mobile; no desktop a intro segue igual.
 */
const container: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.09, delayChildren: 0.05 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 200, damping: 26 },
  },
};

export function HeroIntro({ children, className }: { children: ReactNode; className?: string }) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <m.div initial="hidden" animate="visible" variants={container} className={className}>
      {children}
    </m.div>
  );
}

export function HeroIntroItem({
  children,
  className,
  staticOnMobile = false,
}: {
  children: ReactNode;
  className?: string;
  /** No celular, ignora o fade/translate (vence o estilo inline do Motion com !important). */
  staticOnMobile?: boolean;
}) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <m.div
      variants={item}
      className={cn(className, staticOnMobile && "max-md:opacity-100! max-md:[transform:none]!")}
    >
      {children}
    </m.div>
  );
}
