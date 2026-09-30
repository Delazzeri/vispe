"use client";

import { useRef, useState, type MouseEvent } from "react";
import Image from "next/image";
import { cn } from "@/lib/cn";

type HeroRockProps = {
  side: "left" | "right";
  className?: string;
};

const sizes = "(max-width: 809px) 206px, 500px";
const SPOTLIGHT_RADIUS = 140; // px — "raio" de revelação ao redor do cursor

export function HeroRock({ side, className }: HeroRockProps) {
  const base = `/media/hero/rock-${side}-1000.webp`;
  const hover = `/media/hero/rock-${side}-hover-1000.webp`;

  const containerRef = useRef<HTMLDivElement>(null);
  const [spotlight, setSpotlight] = useState<{ x: number; y: number } | null>(null);

  function handleMouseMove(event: MouseEvent<HTMLDivElement>) {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setSpotlight({ x: event.clientX - rect.left, y: event.clientY - rect.top });
  }

  return (
    <div
      ref={containerRef}
      className={cn("relative", className)}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setSpotlight(null)}
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
        src={hover}
        alt=""
        width={1000}
        height={1453}
        sizes={sizes}
        className="absolute inset-0 h-full w-full select-none transition-opacity duration-150 ease-out"
        style={{
          opacity: spotlight ? 1 : 0,
          maskImage: spotlight
            ? `radial-gradient(circle ${SPOTLIGHT_RADIUS}px at ${spotlight.x}px ${spotlight.y}px, black 0%, transparent 100%)`
            : undefined,
          WebkitMaskImage: spotlight
            ? `radial-gradient(circle ${SPOTLIGHT_RADIUS}px at ${spotlight.x}px ${spotlight.y}px, black 0%, transparent 100%)`
            : undefined,
        }}
      />
    </div>
  );
}
