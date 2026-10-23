import { Reveal } from "@/components/motion/reveal";
import type { LpSteps as LpStepsData } from "@/lib/lp/types";
import { LpSectionShell, lpCardClass, lpCardItemClass, lpCardListClass } from "./parts";

/** "Como funciona": etapas numeradas. */
export function LpSteps({ id, data }: { id: string; data: LpStepsData }) {
  return (
    <LpSectionShell id={id} title={data.title} subtitle={data.subtitle} cta={data.cta}>
      <ol className={lpCardListClass}>
        {data.items.map((item, index) => (
          <li key={`${item.title}-${index}`} className={lpCardItemClass}>
            <Reveal delay={index * 0.06} className={`${lpCardClass} h-full p-7`}>
              <span
                aria-hidden
                className="flex h-10 w-10 items-center justify-center rounded-full bg-brand text-base font-bold text-brand-fg"
              >
                {index + 1}
              </span>
              <h3 className="mt-4 text-lg font-semibold text-ink">{item.title}</h3>
              {item.text && <p className="mt-2 text-base leading-relaxed text-fg-muted">{item.text}</p>}
            </Reveal>
          </li>
        ))}
      </ol>
    </LpSectionShell>
  );
}
