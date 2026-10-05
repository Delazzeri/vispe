"use client";

import { useEffect, useId, useRef } from "react";
import Image from "next/image";
import { useReducedMotion } from "motion/react";
import { cn } from "@/lib/cn";

type HeroRockProps = {
  side: "left" | "right";
  /**
   * Fator de escala do conteúdo dentro do frame da imagem de hover,
   * relativo à imagem base — necessário quando a arte de hover foi
   * exportada com menos margem ao redor da rocha (o objeto "preenche"
   * mais o canvas), o que a faria parecer maior mesmo com as mesmas
   * dimensões de arquivo. Ex.: 0.81 encolhe o conteúdo para 81% do
   * frame, recentralizado, igualando a escala percebida à base.
   */
  hoverScale?: number;
  /** Escuta o mouse na <section> inteira (útil quando outros elementos cobrem a rocha). */
  trackSection?: boolean;
  /** Raio do reveal em px (padrão 75). */
  spotlightRadius?: number;
  className?: string;
};

const sizes = "(max-width: 809px) 206px, 500px";
const SPOTLIGHT_RADIUS = 75; // px — raio padrão do reveal ao redor do cursor
const CORE_RATIO = 0.3; // fração do raio que fica sólida/estável, sem distorção
const LEAVE_DELAY = 1200; // ms antes de começar a desfazer o reveal ao tirar o mouse
const LEAVE_TRANSITION = "opacity 5000ms ease-out";
const MOVE_TRANSITION = "opacity 1400ms ease-out";

export function HeroRock({ side, hoverScale, trackSection, spotlightRadius = SPOTLIGHT_RADIUS, className }: HeroRockProps) {
  const base = `/media/hero/padrao-${side}-1000.webp`;
  const hover = `/media/hero/ouro-hover-${side}-1000.webp`;
  const filterId = useId();

  const containerRef = useRef<HTMLDivElement>(null);
  const hoverLayerRef = useRef<HTMLImageElement>(null);
  const coreRef = useRef<SVGCircleElement>(null);
  const ringRef = useRef<SVGCircleElement>(null);
  const leaveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const shouldReduceMotion = useReducedMotion();

  function handleMouseMove(event: { clientX: number; clientY: number }) {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if (leaveTimeout.current) {
      clearTimeout(leaveTimeout.current);
      leaveTimeout.current = null;
    }

    // Move os dois círculos da máscara diretamente no DOM — sem passar
    // pelo estado do React — para não re-renderizar a cada pixel.
    coreRef.current?.setAttribute("cx", String(x));
    coreRef.current?.setAttribute("cy", String(y));
    ringRef.current?.setAttribute("cx", String(x));
    ringRef.current?.setAttribute("cy", String(y));

    const layer = hoverLayerRef.current;
    if (layer) {
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

  useEffect(() => {
    if (!trackSection) return;
    const host = containerRef.current?.closest("section");
    if (!host) return;
    host.addEventListener("mousemove", handleMouseMove);
    host.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      host.removeEventListener("mousemove", handleMouseMove);
      host.removeEventListener("mouseleave", handleMouseLeave);
    };
    // handlers só usam refs e props estáveis
  }, [trackSection]);

  const coreRadius = spotlightRadius * CORE_RATIO;

  return (
    <div
      ref={containerRef}
      className={cn("relative", className)}
      onMouseMove={trackSection ? undefined : handleMouseMove}
      onMouseLeave={trackSection ? undefined : handleMouseLeave}
    >
      <Image
        src={base}
        alt=""
        width={1000}
        height={1454}
        sizes={sizes}
        className="h-auto w-full select-none"
      />
      <Image
        ref={hoverLayerRef}
        src={hover}
        alt=""
        width={1000}
        height={1454}
        sizes={sizes}
        className="absolute inset-0 h-full w-full select-none object-contain opacity-0"
        style={{
          mask: `url(#${filterId}-mask)`,
          WebkitMask: `url(#${filterId}-mask)`,
          transform: hoverScale ? `scale(${hoverScale})` : undefined,
        }}
      />

      {/*
        A máscara combina duas regiões: um núcleo circular sólido e
        estático (sem filtro — sempre nítido, o "foco" do pincel) e um
        anel externo que passa pela turbulência animada, ondulando só
        a borda. feComposite "over" funde o núcleo por cima do anel
        distorcido, garantindo que a distorção nunca invada o centro.
      */}
      <svg aria-hidden className="absolute h-0 w-0">
        <defs>
          <filter id={`${filterId}-wobble`} x="-40%" y="-40%" width="180%" height="180%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.006 0.008"
              numOctaves="2"
              seed={side === "left" ? 3 : 8}
              result="noiseA"
            >
              {!shouldReduceMotion && (
                <animate
                  attributeName="baseFrequency"
                  dur="7s"
                  values="0.005 0.007;0.009 0.005;0.006 0.010;0.005 0.007"
                  repeatCount="indefinite"
                />
              )}
            </feTurbulence>
            <feTurbulence
              type="turbulence"
              baseFrequency="0.011 0.01"
              numOctaves="1"
              seed={side === "left" ? 11 : 19}
              result="noiseB"
            >
              {!shouldReduceMotion && (
                <animate
                  attributeName="baseFrequency"
                  dur="5.3s"
                  values="0.012 0.009;0.008 0.015;0.014 0.006;0.012 0.009"
                  repeatCount="indefinite"
                />
              )}
            </feTurbulence>
            <feMerge result="noise">
              <feMergeNode in="noiseA" />
              <feMergeNode in="noiseB" />
            </feMerge>
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="90"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>

          <mask id={`${filterId}-mask`} maskUnits="objectBoundingBox" maskContentUnits="userSpaceOnUse">
            {/* Anel: círculo cheio (levemente maior que o núcleo) distorcido pela turbulência */}
            <circle
              ref={ringRef}
              cx="-1000"
              cy="-1000"
              r={spotlightRadius}
              fill="white"
              filter={`url(#${filterId}-wobble)`}
            />
            {/* Núcleo: sólido, nítido, sem filtro — a área de foco estável */}
            <circle ref={coreRef} cx="-1000" cy="-1000" r={coreRadius} fill="white" />
          </mask>
        </defs>
      </svg>
    </div>
  );
}
