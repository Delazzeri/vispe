import type { LpSteps as LpStepsData } from "@/lib/lp/types";
import { LpSectionShell } from "./parts";

/** Etapas em sequência (o número só aparece porque a ordem importa), ligadas por uma linha. */
export function LpSteps({ id, data }: { id: string; data: LpStepsData }) {
  return (
    <LpSectionShell id={id} title={data.title} subtitle={data.subtitle} cta={data.cta}>
      <ol>
        {data.items.map((item, index) => (
          <li key={`${item.title}-${index}`} className="relative flex gap-5 pb-10 last:pb-0">
            {index < data.items.length - 1 && <span aria-hidden className="absolute left-5 top-11 bottom-1 w-px bg-border" />}
            <span aria-hidden className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink text-base font-bold text-paper">
              {index + 1}
            </span>
            <div className="pt-1.5">
              <h3 className="text-lg font-semibold text-ink">{item.title}</h3>
              {item.text && <p className="mt-1.5 text-base leading-relaxed text-fg-muted">{item.text}</p>}
            </div>
          </li>
        ))}
      </ol>
    </LpSectionShell>
  );
}
