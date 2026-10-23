import { CircleCheck } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import type { LpBenefits as LpBenefitsData } from "@/lib/lp/types";
import { LpSectionShell, lpCardClass, lpCardItemClass, lpCardListClass } from "./parts";

/** Benefícios em cards curtos (título + texto). */
export function LpBenefits({ id, data }: { id: string; data: LpBenefitsData }) {
  return (
    <LpSectionShell id={id} title={data.title} subtitle={data.subtitle} cta={data.cta}>
      <ul className={lpCardListClass}>
        {data.items.map((item, index) => (
          <li key={`${item.title}-${index}`} className={lpCardItemClass}>
            <Reveal delay={index * 0.06} className={`${lpCardClass} h-full p-7`}>
              <CircleCheck className="h-6 w-6 text-brand-dark" aria-hidden />
              <h3 className="mt-4 text-lg font-semibold text-ink">{item.title}</h3>
              {item.text && <p className="mt-2 text-base leading-relaxed text-fg-muted">{item.text}</p>}
            </Reveal>
          </li>
        ))}
      </ul>
    </LpSectionShell>
  );
}
