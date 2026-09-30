"use client";

import { useId, useRef, type MouseEvent } from "react";
import Image from "next/image";
import { cn } from "@/lib/cn";

type HeroRockProps = {
  side: "left" | "right";
  hoverVariant?: string;
  /**
   * Fator de escala do conteúdo dentro do frame da imagem de hover,
   * relativo à imagem base — necessário quando a arte de hover foi
   * exportada com menos margem ao redor da rocha (o objeto "preenche"
   * mais o canvas), o que a faria parecer maior mesmo com as mesmas
   * dimensões de arquivo. Ex.: 0.81 encolhe o conteúdo para 81% do
   * frame, recentralizado, igualando a escala percebida à base.
   */
  hoverScale?: number;
  className?: string;
};

const sizes = "(max-width: 809px) 206px, 500px";
const SPOTLIGHT_RADIUS = 130; // px — raio do "líquido" ao redor do cursor
const LEAVE_DELAY = 1200; // ms antes de começar a desfazer o reveal ao tirar o mouse
const LEAVE_TRANSITION = "opacity 1800ms ease-out";
const MOVE_TRANSITION = "opacity 250ms ease-out";

// Borda nítida (sem esfumaçado) mas com stops próximos, para o recorte
// não ficar geométrico demais quando distorcido pelo filtro de turbulência.
const LIQUID_MASK = (x: number, y: number) =>
  `radial-gradient(circle ${SPOTLIGHT_RADIUS}px at ${x}px ${y}px, black 0%, black 92%, transparent 100%)`;

export function HeroRock({ side, hoverVariant, hoverScale, className }: HeroRockProps) {
  const base = `/media/hero/rock-${side}-1000.webp`;
  const hover = `/media/hero/rock-${side}-hover${hoverVariant ?? ""}-1000.webp`;
  const filterId = useId();

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
    // A borda em si é nítida; é o filtro SVG de turbulência (aplicado via
    // CSS filter, não no mask) que distorce o contorno do reveal em algo
    // orgânico/ondulado, lendo como líquido em vez de um círculo perfeito.
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
        className="absolute inset-0 h-full w-full select-none object-contain opacity-0"
        style={{
          filter: `url(#${filterId})`,
          transform: hoverScale ? `scale(${hoverScale})` : undefined,
        }}
      />

      <svg aria-hidden className="absolute h-0 w-0">
        <filter id={filterId}>
          <feTurbulence type="fractalNoise" baseFrequency="0.015 0.02" numOctaves="2" seed={side === "left" ? 3 : 8} result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="16" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
    </div>
  );
}
