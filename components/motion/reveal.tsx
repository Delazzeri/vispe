"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { reveal } from "@/components/motion/presets";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

export function Reveal({ children, className, delay = 0 }: RevealProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={reveal.initial}
      whileInView={reveal.whileInView}
      viewport={reveal.viewport}
      transition={{ ...reveal.transition, delay }}
    >
      {children}
    </motion.div>
  );
}
