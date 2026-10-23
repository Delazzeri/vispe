import { UserRound } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import type { LpAudience as LpAudienceData } from "@/lib/lp/types";
import { LpSectionShell } from "./parts";

/** "Para quem é": perfis em chips. */
export function LpAudience({ id, data }: { id: string; data: LpAudienceData }) {
  return (
    <LpSectionShell id={id} title={data.title} subtitle={data.subtitle} cta={data.cta}>
      <Reveal>
        <ul className="mx-auto flex max-w-4xl flex-wrap justify-center gap-3">
          {data.items.map((item) => (
            <li
              key={item}
              className="flex items-center gap-2 rounded-full bg-surface px-5 py-3 text-base font-medium text-fg shadow-[0_1px_2px_rgba(38,38,38,0.04),0_4px_12px_-4px_rgba(38,38,38,0.1)]"
            >
              <UserRound className="h-4 w-4 text-brand-dark" aria-hidden />
              {item}
            </li>
          ))}
        </ul>
      </Reveal>
    </LpSectionShell>
  );
}
