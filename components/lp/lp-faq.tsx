import { Plus } from "lucide-react";
import type { LpFaq as LpFaqData } from "@/lib/lp/types";
import { LpSectionShell } from "./parts";

/** Perguntas frequentes em lista com fios (o JSON-LD FAQPage sai na página). Abrir uma fecha a outra. */
export function LpFaq({ id, data }: { id: string; data: LpFaqData }) {
  return (
    <LpSectionShell id={id} title={data.title}>
      <div className="divide-y divide-border border-y border-border">
        {data.items.map((item) => (
          <details key={item.question} name={`${id}-faq`} className="group py-5">
            <summary className="flex cursor-pointer list-none items-start justify-between gap-6 text-left text-lg font-semibold text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark">
              {item.question}
              <Plus className="mt-1 h-5 w-5 shrink-0 text-brand-dark transition-transform group-open:rotate-45" aria-hidden />
            </summary>
            <p className="mt-3 max-w-2xl pr-10 text-base leading-relaxed text-fg-muted">{item.answer}</p>
          </details>
        ))}
      </div>
    </LpSectionShell>
  );
}
