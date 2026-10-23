import type { LpCtaBlock as LpCtaBlockData } from "@/lib/lp/types";
import { LpPattern } from "./lp-pattern";
import { LpButton, LpHeading } from "./parts";

/** Chamada final: faixa preta, título grande e o botão dourado. */
export function LpCtaBlock({ id, data }: { id: string; data: LpCtaBlockData }) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="relative isolate overflow-hidden bg-ink py-20 text-paper md:py-28">
      <LpPattern className="absolute inset-y-0 right-0 -z-10 w-1/2 text-paper/[0.07] [mask-image:linear-gradient(to_left,black,transparent)]" />
      <div className="mx-auto max-w-6xl px-6">
        <LpHeading id={`${id}-heading`} tone="dark" className="max-w-3xl">
          {data.title}
        </LpHeading>
        {data.text && <p className="mt-5 max-w-2xl text-lg leading-relaxed text-paper/75">{data.text}</p>}
        <div className="mt-9">
          <LpButton cta={data.cta} className="w-full sm:w-auto" />
        </div>
      </div>
    </section>
  );
}
