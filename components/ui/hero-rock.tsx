"use client";

import { useRef, type MouseEvent } from "react";
import Image from "next/image";
import { cn } from "@/lib/cn";

type HeroRockProps = {
  side: "left" | "right";
  className?: string;
};

const sizes = "(max-width: 809px) 206px, 500px";
const SPOTLIGHT_RADIUS = 130; // px — raio do "líquido" ao redor do cursor
const LEAVE_DELAY = 1200; // ms antes de começar a desfazer o reveal ao tirar o mouse
const LEAVE_TRANSITION = "opacity 1800ms ease-out";
const MOVE_TRANSITION = "opacity 400ms ease-out";

// Gradiente com vários stops suaves em vez de um corte nítido — a borda
// do reveal fica difusa e irregular, lendo como líquido se espalhando
// em vez de um círculo recortado seguindo o cursor.
const LIQUID_MASK = (x: number, y: number) =>
  `radial-gradient(circle ${SPOTLIGHT_RADIUS}px at ${x}px ${y}px, ` +
  `black 0%, black 35%, rgba(0,0,0,0.85) 50%, rgba(0,0,0,0.4) 70%, transparent 100%)`;

export function HeroRock({ side, className }: HeroRockProps) {
  const base = `/media/hero/rock-${side}-1000.webp`;
  const hover = `/media/hero/rock-${side}-hover-1000.webp`;

  const containerRef = useRef<HTMLDivElement>(null);
  const hoverLayerRef = useRef<HTMLImageElement>(null);
  const leaveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

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
      const mask = LIQUID_MASK(x, y);
      layer.style.maskImage = mask;
      layer.style.webkitMaskImage = mask;
      layer.style.transition = MOVE_TRANSITION;
      layer.style.opacity = "1";
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
    </div>
  );
}
