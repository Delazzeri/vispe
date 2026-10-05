"use client";

import { useReducedMotion } from "motion/react";

const heroClassName =
  "absolute inset-x-0 top-[280px] -z-10 h-[420px] overflow-hidden md:top-[360px] md:h-[620px]";

type HeroSceneProps = {
  /** Posicionamento/tamanho do wrapper (padrão: faixa do hero). */
  className?: string;
  preload?: "auto" | "metadata" | "none";
  /** Degradê inferior até o fundo da página (desligar quando algo ocupa a base). */
  fadeBottom?: boolean;
  /** Vídeo único (sem versão mobile); substitui as fontes padrão do hero. */
  src?: string;
};

export function HeroScene({ className = heroClassName, preload = "auto", fadeBottom = true, src }: HeroSceneProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div aria-hidden className={className}>
      {shouldReduceMotion ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src="/media/hero/scene-poster-1600.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <video
          ref={(el) => {
            if (el) el.playbackRate = 0.5;
          }}
          className="absolute inset-0 h-full w-full object-cover"
          poster="/media/hero/scene-poster-1600.jpg"
          autoPlay
          muted
          loop
          playsInline
          disablePictureInPicture
          preload={preload}
        >
          {src ? (
            <source src={src} type="video/mp4" />
          ) : (
            <>
              <source
                src="/media/hero/scene-mobile.mp4"
                media="(max-width: 809px)"
                type="video/mp4"
              />
              <source src="/media/hero/scene3.mp4" type="video/mp4" />
            </>
          )}
        </video>
      )}
      <div className="absolute inset-x-0 top-0 h-2/5 bg-gradient-to-b from-bg to-transparent" />
      {fadeBottom && (
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-bg to-transparent" />
      )}
    </div>
  );
}
