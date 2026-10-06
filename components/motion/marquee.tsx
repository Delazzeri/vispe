import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/cn";

type MarqueeProps = {
  children: ReactNode;
  direction?: "left" | "right";
  speed?: number;
  className?: string;
};

/**
 * Loop CSS puro (sem JS/motion) com conteúdo duplicado para o efeito de
 * fileira contínua — a cópia é aria-hidden e inert para não duplicar
 * conteúdo para leitores de tela nem links no Tab. Pausa no hover;
 * motion-safe: desliga sob prefers-reduced-motion.
 */
export function Marquee({ children, direction = "left", speed = 30, className }: MarqueeProps) {
  const trackStyle: CSSProperties = {
    animationDuration: `${speed}s`,
    animationDirection: direction === "right" ? "reverse" : "normal",
  };

  return (
    <div className={cn("group flex overflow-hidden", className)}>
      <div
        className="flex shrink-0 items-center gap-8 pr-8 motion-safe:animate-[marquee_linear_infinite] group-hover:[animation-play-state:paused]"
        style={trackStyle}
      >
        {children}
      </div>
      <div
        aria-hidden
        inert
        className="flex shrink-0 items-center gap-8 pr-8 motion-safe:animate-[marquee_linear_infinite] group-hover:[animation-play-state:paused]"
        style={trackStyle}
      >
        {children}
      </div>
    </div>
  );
}
