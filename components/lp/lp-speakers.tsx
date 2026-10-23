import Image from "next/image";
import { UserRound } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import type { LpSpeakers as LpSpeakersData } from "@/lib/lp/types";
import { LpSectionShell, lpCardClass, lpCardItemClass, lpCardListClass } from "./parts";

/** Quem conduz o evento: foto, nome, cargo e mini bio. */
export function LpSpeakers({ id, data }: { id: string; data: LpSpeakersData }) {
  return (
    <LpSectionShell id={id} title={data.title} cta={data.cta}>
      <ul className={lpCardListClass}>
        {data.items.map((speaker, index) => (
          <li key={`${speaker.name}-${index}`} className={lpCardItemClass}>
            <Reveal delay={index * 0.06} className={`${lpCardClass} h-full p-7 text-center`}>
              <div className="relative mx-auto h-28 w-28 overflow-hidden rounded-full bg-accent-soft/60">
                {speaker.photo ? (
                  <Image src={speaker.photo.src} alt={speaker.photo.alt} fill sizes="112px" className="object-cover" />
                ) : (
                  <UserRound className="absolute inset-0 m-auto h-10 w-10 text-brand-dark" aria-hidden />
                )}
              </div>
              <h3 className="mt-5 text-lg font-semibold text-ink">{speaker.name}</h3>
              {speaker.role && <p className="mt-1 text-sm font-medium text-brand-dark">{speaker.role}</p>}
              {speaker.bio && <p className="mt-3 text-base leading-relaxed text-fg-muted">{speaker.bio}</p>}
            </Reveal>
          </li>
        ))}
      </ul>
    </LpSectionShell>
  );
}
