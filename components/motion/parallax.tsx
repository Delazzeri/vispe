"use client";

import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";

type ParallaxProps = {
  children: ReactNode;
  speed?: number;
  className?: string;
};

export function Parallax({ children, speed = 0.2, className }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [`${-speed * 100}px`, `${speed * 100}px`]);

  return (
    <div ref={ref} className={className}>
      <motion.div style={shouldReduceMotion ? undefined : { y }}>{children}</motion.div>
    </div>
  );
}
