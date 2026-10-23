import { CircleCheck } from "lucide-react";
import type { LpBenefits as LpBenefitsData } from "@/lib/lp/types";
import { LpSectionShell } from "./parts";

/** Benefícios em lista (ícone dourado + título + texto), ao lado do título da seção. */
export function LpBenefits({ id, data }: { id: string; data: LpBenefitsData }) {
  return (
    <LpSectionShell id={id} title={data.title} subtitle={data.subtitle} cta={data.cta}>
      <ul className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
        {data.items.map((item, index) => (
          <li key={`${item.title}-${index}`} className="flex gap-4">
            <CircleCheck className="mt-0.5 h-6 w-6 shrink-0 text-brand-dark" aria-hidden />
            <div>
              <h3 className="text-lg font-semibold text-ink">{item.title}</h3>
              {item.text && <p className="mt-1.5 text-base leading-relaxed text-fg-muted">{item.text}</p>}
            </div>
          </li>
        ))}
      </ul>
    </LpSectionShell>
  );
}
