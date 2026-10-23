import Image from "next/image";
import { UserRound } from "lucide-react";
import type { LpSpeakers as LpSpeakersData } from "@/lib/lp/types";
import { LpSectionShell } from "./parts";

/** Quem conduz: foto grande, nome, cargo e mini bio. Um palestrante só vira um bloco lado a lado. */
export function LpSpeakers({ id, data }: { id: string; data: LpSpeakersData }) {
  const single = data.items.length === 1;
  return (
    <LpSectionShell id={id} title={data.title} cta={data.cta} layout="stacked">
      <ul className={single ? "max-w-4xl" : "grid gap-10 sm:grid-cols-2 lg:grid-cols-3"}>
        {data.items.map((speaker, index) => (
          <li key={`${speaker.name}-${index}`} className={single ? "grid items-center gap-8 sm:grid-cols-[14rem_1fr]" : undefined}>
            <div className="relative aspect-square overflow-hidden rounded-3xl bg-accent-soft/50">
              {speaker.photo ? (
                <Image src={speaker.photo.src} alt={speaker.photo.alt} fill sizes="(min-width: 640px) 320px, 100vw" className="object-cover" />
              ) : (
                <UserRound className="absolute inset-0 m-auto h-14 w-14 text-brand-dark" aria-hidden strokeWidth={1.25} />
              )}
            </div>
            <div className={single ? undefined : "mt-5"}>
              <h3 className="text-xl font-semibold text-ink">{speaker.name}</h3>
              {speaker.role && <p className="mt-1 text-base font-medium text-brand-dark">{speaker.role}</p>}
              {speaker.bio && <p className="mt-3 text-base leading-relaxed text-fg-muted">{speaker.bio}</p>}
            </div>
          </li>
        ))}
      </ul>
    </LpSectionShell>
  );
}
