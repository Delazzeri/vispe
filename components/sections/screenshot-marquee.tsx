import { ImageIcon } from "lucide-react";
import { Marquee } from "@/components/motion/marquee";

const placeholders = ["Dashboard", "Relatórios", "Fluxo de caixa", "Indicadores"];

export function ScreenshotMarquee({ id }: { id?: string }) {
  return (
    <section id={id} aria-label="Telas da plataforma Vispe" className="bg-bg py-16 md:py-20">
      <Marquee speed={38}>
        {placeholders.map((label) => (
          <div
            key={label}
            className="flex aspect-video w-[480px] shrink-0 flex-col items-center justify-center gap-3 rounded-3xl bg-surface shadow-[0_1px_2px_rgba(38,38,38,0.04),0_4px_12px_-4px_rgba(38,38,38,0.1)] md:w-[640px]"
          >
            <ImageIcon className="h-8 w-8 text-fg-muted" aria-hidden />
            <p className="text-sm text-fg-muted">{label} — captura em produção</p>
          </div>
        ))}
      </Marquee>
    </section>
  );
}
