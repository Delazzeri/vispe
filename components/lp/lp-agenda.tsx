import { CalendarDays, Clock, MapPin } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import type { LpUi } from "@/content/lp-ui";
import type { LpAgenda as LpAgendaData } from "@/lib/lp/types";
import { LpSectionShell, lpCardClass } from "./parts";

/** Programação do evento: data, horário, local e tópicos em linha do tempo. */
export function LpAgenda({ id, data, ui }: { id: string; data: LpAgendaData; ui: LpUi }) {
  const facts = [
    { icon: CalendarDays, label: ui.date, value: data.date },
    { icon: Clock, label: ui.time, value: data.time },
    { icon: MapPin, label: ui.place, value: data.place },
  ].filter((fact) => fact.value);

  return (
    <LpSectionShell id={id} title={data.title} cta={data.cta}>
      {facts.length > 0 && (
        <Reveal>
          <dl className="mx-auto flex max-w-4xl flex-wrap justify-center gap-4">
            {facts.map(({ icon: Icon, label, value }) => (
              <div key={label} className={`${lpCardClass} flex items-center gap-3 px-5 py-4`}>
                <Icon className="h-5 w-5 shrink-0 text-brand-dark" aria-hidden />
                <div>
                  <dt className="text-xs font-medium text-fg-muted">{label}</dt>
                  <dd className="text-base font-semibold text-fg">{value}</dd>
                </div>
              </div>
            ))}
          </dl>
        </Reveal>
      )}

      {data.items.length > 0 && (
        <ol className={`mx-auto max-w-3xl ${facts.length ? "mt-10" : ""}`}>
          {data.items.map((item, index) => (
            <li key={`${item.title}-${index}`} className="relative border-l-2 border-accent-soft pb-8 pl-8 last:pb-0">
              <Reveal delay={index * 0.05}>
                <span aria-hidden className="absolute -left-[7px] top-1.5 h-3 w-3 rounded-full bg-brand" />
                {item.time && <p className="text-sm font-semibold text-brand-dark">{item.time}</p>}
                <h3 className="mt-1 text-lg font-semibold text-ink">{item.title}</h3>
                {item.text && <p className="mt-1.5 text-base leading-relaxed text-fg-muted">{item.text}</p>}
              </Reveal>
            </li>
          ))}
        </ol>
      )}
    </LpSectionShell>
  );
}
