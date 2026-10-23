import { CalendarDays, Clock, MapPin } from "lucide-react";
import type { LpUi } from "@/content/lp-ui";
import type { LpAgenda as LpAgendaData } from "@/lib/lp/types";
import { LpButton, LpHeading } from "./parts";

/** Programação: à esquerda o título com data, horário e local; à direita os tópicos em linha do tempo. */
export function LpAgenda({ id, data, ui }: { id: string; data: LpAgendaData; ui: LpUi }) {
  const headingId = `${id}-heading`;
  const facts = [
    { icon: CalendarDays, label: ui.date, value: data.date },
    { icon: Clock, label: ui.time, value: data.time },
    { icon: MapPin, label: ui.place, value: data.place },
  ].filter((fact) => fact.value);

  return (
    <section id={id} aria-labelledby={headingId} className="bg-bg py-20 md:py-28">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 md:grid-cols-12 md:gap-12">
        <div className="md:col-span-5">
          <LpHeading id={headingId}>{data.title}</LpHeading>
          {facts.length > 0 && (
            <dl className="mt-8 space-y-4">
              {facts.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-3">
                  <Icon className="mt-0.5 h-5 w-5 shrink-0 text-brand-dark" aria-hidden />
                  <div>
                    <dt className="text-sm text-fg-muted">{label}</dt>
                    <dd className="text-base font-semibold text-fg">{value}</dd>
                  </div>
                </div>
              ))}
            </dl>
          )}
          {data.cta.label && (
            <div className="mt-10">
              <LpButton cta={data.cta} className="w-full sm:w-auto" />
            </div>
          )}
        </div>
        {data.items.length > 0 && (
          <ol className="md:col-span-7">
            {data.items.map((item, index) => (
              <li key={`${item.title}-${index}`} className="grid gap-1 border-t border-border py-6 last:border-b sm:grid-cols-[7rem_1fr] sm:gap-6">
                <span className="text-sm font-semibold tabular-nums text-brand-dark">{item.time}</span>
                <div>
                  <h3 className="text-lg font-semibold text-ink">{item.title}</h3>
                  {item.text && <p className="mt-1.5 text-base leading-relaxed text-fg-muted">{item.text}</p>}
                </div>
              </li>
            ))}
          </ol>
        )}
      </div>
    </section>
  );
}
