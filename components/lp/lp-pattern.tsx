import { useId } from "react";
import { cn } from "@/lib/cn";

/**
 * Motivo de "escamas" do manual de marca (mesmo desenho de components/ui/brand-pattern.tsx),
 * com id único por instância: a LP usa o padrão em mais de uma faixa da página.
 * Decorativo: aria-hidden, nunca atrás de texto corrido sem contraste.
 */
export function LpPattern({ className }: { className?: string }) {
  const id = `lp-scale-${useId().replace(/:/g, "")}`;
  return (
    <svg aria-hidden className={cn("pointer-events-none", className)} width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
      <defs>
        <pattern id={id} width="64" height="32" patternUnits="userSpaceOnUse">
          <path d="M0 16 Q16 0 32 16 Q48 32 64 16" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}
