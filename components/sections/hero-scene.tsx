"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { useReducedMotion } from "motion/react";
import { cn } from "@/lib/cn";
import { isMotionPaused, subscribeMotion } from "@/lib/motion-preference";

// No celular a cena fica presa à base da seção: com top fixo ela passava do fim
// do hero e o overflow cortava o degradê, deixando uma linha reta.
const heroClassName =
  "absolute inset-x-0 bottom-0 -z-10 h-[380px] overflow-hidden md:bottom-auto md:top-[360px] md:h-[620px]";

type HeroSceneProps = {
  /** Posicionamento/tamanho do wrapper (padrão: faixa do hero). */
  className?: string;
  preload?: "auto" | "metadata" | "none";
  /** Degradê inferior até o fundo da página (desligar quando algo ocupa a base). */
  fadeBottom?: boolean;
  /** Vídeo único (sem versão mobile); substitui as fontes padrão do hero. */
  src?: string;
  /**
   * No celular, degradê inferior mais alto e com faixa sólida na base, para a
   * passagem ao fundo não marcar uma linha (usado no hero, onde a cena é baixa).
   */
  softFadeOnMobile?: boolean;
};

export function HeroScene({
  className = heroClassName,
  preload = "auto",
  fadeBottom = true,
  src,
  softFadeOnMobile,
}: HeroSceneProps) {
  const shouldReduceMotion = useReducedMotion();
  const paused = useSyncExternalStore(subscribeMotion, isMotionPaused, () => false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // "Pausar animações" do rodapé (WCAG 2.2.2): o vídeo em loop também para.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (paused) video.pause();
    else video.play().catch(() => {});
  }, [paused]);

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
            videoRef.current = el;
            if (el) el.playbackRate = 0.5;
          }}
          className="absolute inset-0 h-full w-full object-cover"
          poster="/media/hero/scene-poster-1600.jpg"
          autoPlay={!paused}
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
        <div
          className={cn(
            "absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-bg to-transparent",
            softFadeOnMobile && "max-md:h-3/5 max-md:from-20%",
          )}
        />
      )}
    </div>
  );
}
