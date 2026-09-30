"use client";

import { useRef, useState, type MouseEvent } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/cn";

type HeroRockProps = {
  side: "left" | "right";
  className?: string;
};

type Spark = { id: number; x: number; y: number; angle: number; length: number };

const sizes = "(max-width: 809px) 206px, 500px";
const SPOTLIGHT_RADIUS = 110; // px — "raio" de revelação ao redor do cursor
const SPARK_INTERVAL = 70; // ms entre faíscas emitidas durante o movimento
const LEAVE_DELAY = 500; // ms antes de começar a desfazer o reveal ao tirar o mouse
const LEAVE_TRANSITION = "opacity 900ms ease-out";
const MOVE_TRANSITION = "opacity 120ms ease-out";

export function HeroRock({ side, className }: HeroRockProps) {
  const base = `/media/hero/rock-${side}-1000.webp`;
  const hover = `/media/hero/rock-${side}-hover-1000.webp`;

  const containerRef = useRef<HTMLDivElement>(null);
  const hoverLayerRef = useRef<HTMLImageElement>(null);
  const lastSparkAt = useRef(0);
  const nextSparkId = useRef(0);
  const leaveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [sparks, setSparks] = useState<Spark[]>([]);
  const shouldReduceMotion = useReducedMotion();

  function handleMouseMove(event: MouseEvent<HTMLDivElement>) {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if (leaveTimeout.current) {
      clearTimeout(leaveTimeout.current);
      leaveTimeout.current = null;
    }

    // Atualiza a máscara diretamente no DOM — sem passar pelo estado do
    // React, para não re-renderizar a cada pixel de movimento do mouse.
    const layer = hoverLayerRef.current;
    if (layer) {
      const mask = `radial-gradient(circle ${SPOTLIGHT_RADIUS}px at ${x}px ${y}px, black 0%, transparent 100%)`;
      layer.style.maskImage = mask;
      layer.style.webkitMaskImage = mask;
      layer.style.transition = MOVE_TRANSITION;
      layer.style.opacity = "1";
    }

    if (shouldReduceMotion) return;

    const now = performance.now();
    if (now - lastSparkAt.current > SPARK_INTERVAL) {
      lastSparkAt.current = now;
      const id = nextSparkId.current++;
      setSparks((current) => [
        ...current.slice(-14),
        {
          id,
          x,
          y,
          angle: Math.random() * 360,
          length: 10 + Math.random() * 10,
        },
      ]);
    }
  }

  function handleMouseLeave() {
    leaveTimeout.current = setTimeout(() => {
      const layer = hoverLayerRef.current;
      if (layer) {
        layer.style.transition = LEAVE_TRANSITION;
        layer.style.opacity = "0";
      }
    }, LEAVE_DELAY);
  }

  return (
    <div
      ref={containerRef}
      className={cn("relative", className)}
      style={{ cursor: "url(/media/hero/pickaxe-cursor.svg) 4 28, pointer" }}
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
              initial={{ opacity: 1, x: spark.x, y: spark.y, scaleX: 0.3 }}
              animate={{
                opacity: 0,
                x: spark.x + Math.cos((spark.angle * Math.PI) / 180) * spark.length * 2.4,
                y: spark.y + Math.sin((spark.angle * Math.PI) / 180) * spark.length * 2.4 - 18,
                scaleX: 1,
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              onAnimationComplete={() =>
                setSparks((current) => current.filter((s) => s.id !== spark.id))
              }
              style={{
                width: spark.length,
                height: 2,
                rotate: spark.angle,
                transformOrigin: "left center",
              }}
              className="absolute rounded-full bg-accent shadow-[0_0_5px_1.5px_rgba(250,214,67,0.9)]"
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
