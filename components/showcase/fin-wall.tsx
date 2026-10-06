import { useFinWall } from "@/content/fin-wall";
import { cn } from "@/lib/cn";
import { Widget } from "./widgets/widgets";

/**
 * Parede de widgets HTML do Fin 24/7 — decorativa (aria-hidden), o conteúdo
 * semântico da seção é o H2/texto/CTA. Layout fixo por breakpoint + scale,
 * para a composição das linhas não "quebrar" em larguras intermediárias.
 */
export function FinWall({ className }: { className?: string }) {
  const finWall = useFinWall();
  return (
    <div
      aria-hidden
      className={cn(
        "flex w-2xl shrink-0 scale-55 flex-wrap content-center items-center justify-center gap-5",
        "md:w-5xl md:scale-75 lg:w-6xl lg:scale-90 xl:w-7xl xl:scale-100",
        className,
      )}
    >
      {finWall.map((widget) => (
        <div key={widget.id} className={cn(widget.hideOnMobile && "hidden md:block")}>
          <Widget widget={widget} />
        </div>
      ))}
    </div>
  );
}
