import Image from "next/image";
import { Quote } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import type { LpTestimonials as LpTestimonialsData } from "@/lib/lp/types";
import { LpSectionShell, lpCardClass, lpCardItemClass, lpCardListClass } from "./parts";

/** Depoimentos reais de clientes. */
export function LpTestimonials({ id, data }: { id: string; data: LpTestimonialsData }) {
  return (
    <LpSectionShell id={id} title={data.title}>
      <ul className={lpCardListClass}>
        {data.items.map((item, index) => (
          <li key={`${item.name}-${index}`} className={lpCardItemClass}>
            <Reveal delay={index * 0.06} className={`${lpCardClass} flex h-full flex-col p-7`}>
              <Quote className="h-6 w-6 text-brand-dark" aria-hidden />
              <blockquote className="mt-4 flex-1 text-base leading-relaxed text-fg italic">“{item.text}”</blockquote>
              <div className="mt-6 flex items-center gap-3">
                {item.photo && (
                  <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full">
                    <Image src={item.photo.src} alt={item.photo.alt} fill sizes="44px" className="object-cover" />
                  </div>
                )}
                <div>
                  <p className="text-sm font-semibold text-ink">{item.name}</p>
                  {item.company && <p className="text-sm text-fg-muted">{item.company}</p>}
                </div>
              </div>
            </Reveal>
          </li>
        ))}
      </ul>
    </LpSectionShell>
  );
}
