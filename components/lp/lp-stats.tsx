import type { LpStats as LpStatsData } from "@/lib/lp/types";
import { LpSectionShell } from "./parts";

/** Números de destaque (só dados reais da Vispe) em uma linha, separados por fios. */
export function LpStats({ id, data }: { id: string; data: LpStatsData }) {
  if (data.items.length === 0) return null;
  return (
    <LpSectionShell id={id} title={data.title || undefined} layout="stacked" className="py-14 md:py-20">
      <dl className="grid grid-cols-2 gap-y-10 md:flex md:divide-x md:divide-border">
        {data.items.map((item, index) => (
          <div key={`${item.value}-${index}`} className="md:flex-1 md:px-8 md:first:pl-0">
            <dt className="sr-only">{item.label}</dt>
            <dd>
              <span className="block text-5xl font-bold tabular-nums text-ink md:text-6xl" style={{ letterSpacing: "-0.045em" }}>
                {item.value}
              </span>
              <span aria-hidden className="mt-2 block text-base text-fg-muted">
                {item.label}
              </span>
            </dd>
          </div>
        ))}
      </dl>
    </LpSectionShell>
  );
}
