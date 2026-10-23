import type { ReactNode } from "react";
import { LpPattern } from "./lp-pattern";
import type { LpForm } from "@/lib/lp/types";
import { LpHeading } from "./parts";

/**
 * Faixa preta do formulário (quando ele não está no topo): título à esquerda,
 * cartão branco à direita. Fecha a página com a mesma linguagem do hero.
 */
export function LpFormSection({ id, data, children }: { id: string; data: LpForm; children: ReactNode }) {
  const headingId = `${id}-heading`;
  return (
    <section aria-labelledby={headingId} className="relative isolate overflow-hidden bg-ink py-20 text-paper md:py-28">
      <LpPattern className="absolute inset-y-0 left-0 -z-10 w-2/3 text-paper/[0.07] [mask-image:linear-gradient(to_right,black,transparent)]" />
      <div className="mx-auto grid max-w-6xl gap-10 px-6 md:grid-cols-12 md:gap-12">
        <div className="md:col-span-5 md:pt-4">
          <LpHeading id={headingId} tone="dark">
            {data.title}
          </LpHeading>
          {data.subtitle && <p className="mt-4 max-w-md text-lg leading-relaxed text-paper/75">{data.subtitle}</p>}
        </div>
        <div className="md:col-span-7">{children}</div>
      </div>
    </section>
  );
}
