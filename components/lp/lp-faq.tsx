import { Plus } from "lucide-react";
import type { LpFaq as LpFaqData } from "@/lib/lp/types";
import { LpSectionShell } from "./parts";

/** Perguntas frequentes (o JSON-LD FAQPage sai na página). Abrir uma fecha a outra. */
export function LpFaq({ id, data }: { id: string; data: LpFaqData }) {
  return (
    <LpSectionShell id={id} title={data.title}>
      <div className="mx-auto grid max-w-3xl gap-4">
        {data.items.map((item) => (
          <details
            key={item.question}
            name={`${id}-faq`}
            className="group rounded-xl bg-surface p-6 shadow-[0_1px_2px_rgba(38,38,38,0.04),0_4px_12px_-4px_rgba(38,38,38,0.1)]"
          >
            <summary className="flex cursor-pointer list-none items-start gap-4 text-left text-base font-semibold text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark">
              <Plus className="mt-0.5 h-5 w-5 shrink-0 text-brand-dark transition-transform group-open:rotate-45" aria-hidden />
              {item.question}
            </summary>
            <p className="mt-3 pl-9 text-base leading-relaxed text-fg-muted">{item.answer}</p>
          </details>
        ))}
      </div>
    </LpSectionShell>
  );
}
