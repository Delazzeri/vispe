import type { LpAudience as LpAudienceData } from "@/lib/lp/types";
import { LpSectionShell } from "./parts";

/** "Para quem é": perfis em pílulas brancas, ao lado do título. */
export function LpAudience({ id, data }: { id: string; data: LpAudienceData }) {
  return (
    <LpSectionShell id={id} title={data.title} subtitle={data.subtitle} cta={data.cta}>
      <ul className="flex flex-wrap gap-3">
        {data.items.map((item) => (
          <li key={item} className="rounded-full border border-border bg-surface px-5 py-3 text-base font-medium text-fg">
            {item}
          </li>
        ))}
      </ul>
    </LpSectionShell>
  );
}
