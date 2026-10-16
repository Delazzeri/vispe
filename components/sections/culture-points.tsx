import { Reveal } from "@/components/motion/reveal";
import { stagger } from "@/components/motion/presets";
import { cn } from "@/lib/cn";

type CulturePointsProps = {
  id?: string;
  title: string;
  description: string;
  points: readonly string[];
  className?: string;
};

/** Pontos de cultura numerados (página de carreiras). */
export function CulturePoints({ id = "cultura", title, description, points, className }: CulturePointsProps) {
  const headingId = `${id}-heading`;
  return (
    <section id={id} aria-labelledby={headingId} className={cn("scroll-mt-28", className)}>
      <div className="max-w-2xl">
        <h2
          id={headingId}
          className="text-3xl font-bold tracking-tight text-fg md:text-5xl md:leading-none"
          style={{ letterSpacing: "-0.05em" }}
        >
          {title}
        </h2>
        <p className="mt-4 text-base leading-7 text-fg-muted">{description}</p>
      </div>

      <ol className="mt-8 grid gap-2 sm:mt-10 sm:gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {points.map((point, i) => (
          <li key={point}>
            <Reveal delay={(i % 5) * stagger} className="h-full">
              <div className="flex h-full items-baseline gap-4 rounded-2xl border border-border bg-surface px-5 py-4 sm:flex-col sm:items-start sm:gap-0 sm:rounded-3xl sm:p-6">
                <span aria-hidden className="shrink-0 text-sm font-bold tabular-nums text-brand-dark">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-balance sm:mt-6 text-base font-semibold leading-snug text-fg">{point}</p>
              </div>
            </Reveal>
          </li>
        ))}
      </ol>
    </section>
  );
}
