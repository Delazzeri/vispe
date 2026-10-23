import { Reveal } from "@/components/motion/reveal";
import type { LpCtaBlock as LpCtaBlockData } from "@/lib/lp/types";
import { LpButton } from "./parts";

/** Chamada final: bloco escuro com título, texto e botão. */
export function LpCtaBlock({ id, data }: { id: string; data: LpCtaBlockData }) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="bg-bg py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <div className="rounded-3xl bg-ink px-6 py-14 text-center md:px-16 md:py-20">
            <h2
              id={`${id}-heading`}
              className="mx-auto max-w-3xl text-balance text-3xl font-bold tracking-tight text-paper md:text-[48px] md:leading-[48px]"
              style={{ letterSpacing: "-0.05em" }}
            >
              {data.title}
            </h2>
            {data.text && <p className="mx-auto mt-5 max-w-2xl text-balance text-lg text-paper/75">{data.text}</p>}
            <div className="mt-8 flex justify-center">
              <LpButton cta={data.cta} className="w-full bg-brand text-brand-fg sm:w-auto" />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
