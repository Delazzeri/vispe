"use client";

import { useSyncExternalStore } from "react";
import { isMotionPaused, setMotionPaused, subscribeMotion } from "@/lib/motion-preference";

type MotionToggleProps = {
  labels: { pause: string; play: string };
  className?: string;
};

/**
 * Controle global de animações no rodapé: pausa as faixas e os vídeos de fundo.
 * Some sob prefers-reduced-motion, quando já não há nada animando.
 */
export function MotionToggle({ labels, className }: MotionToggleProps) {
  const paused = useSyncExternalStore(subscribeMotion, isMotionPaused, () => false);

  return (
    <button
      type="button"
      onClick={() => setMotionPaused(!paused)}
      className={`${className ?? ""} motion-reduce:hidden`}
    >
      {paused ? labels.play : labels.pause}
    </button>
  );
}
