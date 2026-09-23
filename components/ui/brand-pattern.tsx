import { cn } from "@/lib/cn";

type BrandPatternProps = {
  className?: string;
};

/**
 * Motivo oficial de "escamas" do manual de marca (docs/design-system.md).
 * Decorativo apenas — aria-hidden, nunca usado como base de texto legível.
 */
export function BrandPattern({ className }: BrandPatternProps) {
  return (
    <svg
      aria-hidden
      className={cn("pointer-events-none", className)}
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <pattern id="vispe-scale" width="64" height="32" patternUnits="userSpaceOnUse">
          <path
            d="M0 16 Q16 0 32 16 Q48 32 64 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#vispe-scale)" />
    </svg>
  );
}
