import { cn } from "@/lib/cn";

type GoldBarProps = {
  className?: string;
  flip?: boolean;
};

/**
 * Lingote de ouro estilizado — substitui as "rochas" decorativas da
 * referência visual por um elemento que remete à marca (Capital).
 * Puramente decorativo: aria-hidden.
 */
export function GoldBar({ className, flip = false }: GoldBarProps) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 260 420"
      className={cn(flip && "-scale-x-100", className)}
      style={{ filter: "drop-shadow(0 24px 32px rgba(158, 107, 21, 0.25))" }}
    >
      <defs>
        <linearGradient id="gold-face" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fad643" />
          <stop offset="45%" stopColor="#d6b256" />
          <stop offset="100%" stopColor="#9e6b15" />
        </linearGradient>
        <linearGradient id="gold-top" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#eed881" />
          <stop offset="100%" stopColor="#d6b256" />
        </linearGradient>
        <linearGradient id="gold-side" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#7a5310" />
          <stop offset="100%" stopColor="#9e6b15" />
        </linearGradient>
      </defs>

      {/* face lateral (profundidade) */}
      <path d="M20 90 L0 110 L0 380 L20 400 L20 90 Z" fill="url(#gold-side)" />
      {/* topo (bisel) */}
      <path d="M20 90 L60 40 L220 40 L240 90 L20 90 Z" fill="url(#gold-top)" />
      {/* face frontal */}
      <path
        d="M20 90 L240 90 L260 110 L260 380 L240 400 L20 400 L0 380 L0 110 Z"
        fill="url(#gold-face)"
      />
      <path
        d="M20 90 L240 90 L260 110 L20 110 Z"
        fill="#ffffff"
        opacity="0.25"
      />
      {/* selo */}
      <rect x="90" y="200" width="80" height="52" rx="4" fill="#00000014" />
      <text
        x="130"
        y="233"
        textAnchor="middle"
        fontSize="18"
        fontWeight="700"
        letterSpacing="2"
        fill="#00000033"
        fontFamily="Georgia, serif"
      >
        VC
      </text>
    </svg>
  );
}
