"use client";

import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";

type ScrollScaleProps = {
  children: ReactNode;
  className?: string;
  /** Escala no início/fim do intervalo de scroll (o pico, no centro, é sempre 1). */
  fromScale?: number;
  /** Opacidade no início/fim do intervalo de scroll (o pico, no centro, é sempre 1). */
  fromOpacity?: number;
};

export function ScrollScale({
  children,
  className,
  fromScale = 0.92,
  fromOpacity = 0.4,
}: ScrollScaleProps) {
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [fromScale, 1, fromScale]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [fromOpacity, 1, fromOpacity]);

  return (
    <div ref={ref} className={className}>
      <motion.div style={shouldReduceMotion ? undefined : { scale, opacity }}>
        {children}
      </motion.div>
    </div>
  );
}
