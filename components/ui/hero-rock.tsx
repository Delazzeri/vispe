"use client";

import { useRef, useState, type MouseEvent } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/cn";

type HeroRockProps = {
  side: "left" | "right";
  className?: string;
};

type Spark = { id: number; x: number; y: number; dx: number; dy: number };

const sizes = "(max-width: 809px) 206px, 500px";
const SPOTLIGHT_RADIUS = 110; // px — "raio" de revelação ao redor do cursor
const SPARK_INTERVAL = 60; // ms entre fagulhas emitidas durante o movimento

export function HeroRock({ side, className }: HeroRockProps) {
  const base = `/media/hero/rock-${side}-1000.webp`;
  const hover = `/media/hero/rock-${side}-hover-1000.webp`;

  const containerRef = useRef<HTMLDivElement>(null);
  const hoverLayerRef = useRef<HTMLImageElement>(null);
  const lastSparkAt = useRef(0);
  const nextSparkId = useRef(0);
  const [sparks, setSparks] = useState<Spark[]>([]);
  const shouldReduceMotion = useReducedMotion();

  function handleMouseMove(event: MouseEvent<HTMLDivElement>) {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Atualiza a máscara diretamente no DOM — sem passar pelo estado do
    // React, para não re-renderizar a cada pixel de movimento do mouse.
    const layer = hoverLayerRef.current;
    if (layer) {
      const mask = `radial-gradient(circle ${SPOTLIGHT_RADIUS}px at ${x}px ${y}px, black 0%, transparent 100%)`;
      layer.style.maskImage = mask;
      layer.style.webkitMaskImage = mask;
      layer.style.opacity = "1";
    }

    if (shouldReduceMotion) return;

    const now = performance.now();
    if (now - lastSparkAt.current > SPARK_INTERVAL) {
      lastSparkAt.current = now;
      const id = nextSparkId.current++;
      setSparks((current) => [
        ...current.slice(-12),
        {
          id,
          x,
          y,
          dx: (Math.random() - 0.5) * 60,
          dy: -30 - Math.random() * 40,
        },
      ]);
    }
  }

  function handleMouseLeave() {
    const layer = hoverLayerRef.current;
    if (layer) layer.style.opacity = "0";
  }

  return (
    <div
      ref={containerRef}
      className={cn("relative", className)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <Image
        src={base}
        alt=""
        width={1000}
        height={1453}
        sizes={sizes}
        className="h-auto w-full select-none"
      />
      <Image
        ref={hoverLayerRef}
        src={hover}
        alt=""
        width={1000}
        height={1453}
        sizes={sizes}
        className="absolute inset-0 h-full w-full select-none opacity-0"
      />

      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <AnimatePresence>
          {sparks.map((spark) => (
            <motion.span
              key={spark.id}
              initial={{ opacity: 1, x: spark.x, y: spark.y, scale: 0.6 }}
              animate={{ opacity: 0, x: spark.x + spark.dx, y: spark.y + spark.dy, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              onAnimationComplete={() =>
                setSparks((current) => current.filter((s) => s.id !== spark.id))
              }
              className="absolute h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_6px_2px_rgba(250,214,67,0.8)]"
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
