"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion, type Variants } from "motion/react";

/**
 * EXCEÇÃO À REGRA GERAL DE MOTION (CLAUDE.md §8: "o H1 do hero aparece
 * imediatamente"): por decisão explícita do time, o Hero replica fielmente
 * a intro animada do cooldock.app, incluindo o H1 com fade+translate.
 * Isso troca uma fração de LCP por fidelidade visual à referência — decisão
 * consciente, não descuido. Não usar este padrão em outras seções acima
 * da dobra sem a mesma aprovação explícita.
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
    <motion.div initial="hidden" animate="visible" variants={container} className={className}>
      {children}
    </motion.div>
  );
}

export function HeroIntroItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div variants={item} className={className}>
      {children}
    </motion.div>
  );
}
