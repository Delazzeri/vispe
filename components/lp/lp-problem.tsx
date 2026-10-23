import { X } from "lucide-react";
import type { LpProblem as LpProblemData } from "@/lib/lp/types";
import { LpPattern } from "./lp-pattern";
import { LpButton, LpHeading } from "./parts";

/** Problema e solução: as dores de hoje (lista discreta) contra a solução (painel preto). */
export function LpProblem({ id, data }: { id: string; data: LpProblemData }) {
  const headingId = `${id}-heading`;
  return (
    <section id={id} aria-labelledby={headingId} className="bg-bg py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <LpHeading id={headingId} className="max-w-3xl">
          {data.title}
        </LpHeading>
        <div className="mt-12 grid gap-6 md:grid-cols-2 md:gap-8">
          <ul className="space-y-5 py-2 md:pr-6">
            {data.problems.map((problem) => (
              <li key={problem} className="flex gap-4 text-lg leading-snug text-fg-muted">
                <span aria-hidden className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border">
                  <X className="h-4 w-4" />
                </span>
                {problem}
              </li>
            ))}
          </ul>
          <div className="relative isolate overflow-hidden rounded-3xl bg-ink p-8 text-paper md:p-10">
            <LpPattern className="absolute inset-0 -z-10 text-paper/[0.06]" />
            {data.solutionTitle && (
              <h3 className="text-2xl font-bold text-brand" style={{ letterSpacing: "-0.03em" }}>
                {data.solutionTitle}
              </h3>
            )}
            {data.solution && <p className="mt-4 text-lg leading-relaxed text-paper/85">{data.solution}</p>}
            {data.cta.label && (
              <div className="mt-8">
                <LpButton cta={data.cta} />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
