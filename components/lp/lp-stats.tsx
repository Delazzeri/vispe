import { Reveal } from "@/components/motion/reveal";
import type { LpStats as LpStatsData } from "@/lib/lp/types";
import { LpSectionShell } from "./parts";

/** Até 4 números de destaque (só dados reais da Vispe). */
export function LpStats({ id, data }: { id: string; data: LpStatsData }) {
  if (data.items.length === 0) return null;
  return (
    <LpSectionShell id={id} title={data.title || undefined} className="py-14 md:py-20">
      {/* Centralizado: com 2 ou 3 números a linha não fica encostada à esquerda. */}
      <dl className="flex flex-wrap justify-center gap-6">
        {data.items.map((item, index) => (
          <Reveal key={`${item.value}-${index}`} delay={index * 0.06} className="w-[calc(50%-12px)] text-center md:w-[calc(25%-18px)]">
            <dt className="sr-only">{item.label}</dt>
            <dd>
              <span className="block text-4xl font-bold tracking-tight text-ink md:text-5xl" style={{ letterSpacing: "-0.04em" }}>
                {item.value}
              </span>
              <span aria-hidden className="mt-2 block text-sm font-medium text-fg-muted">
                {item.label}
              </span>
            </dd>
          </Reveal>
        ))}
      </dl>
    </LpSectionShell>
  );
}
