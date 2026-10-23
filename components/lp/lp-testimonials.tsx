import Image from "next/image";
import type { LpTestimonials as LpTestimonialsData } from "@/lib/lp/types";
import { LpSectionShell } from "./parts";

type Item = LpTestimonialsData["items"][number];

function Author({ item }: { item: Item }) {
  return (
    <figcaption className="mt-6 flex items-center gap-3">
      {item.photo && (
        <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full">
          <Image src={item.photo.src} alt={item.photo.alt} fill sizes="48px" className="object-cover" />
        </span>
      )}
      <span>
        <span className="block text-base font-semibold text-ink">{item.name}</span>
        {item.company && <span className="block text-sm text-fg-muted">{item.company}</span>}
      </span>
    </figcaption>
  );
}

/** Depoimentos: o primeiro em destaque, grande; os demais menores, abaixo. */
export function LpTestimonials({ id, data }: { id: string; data: LpTestimonialsData }) {
  const [featured, ...rest] = data.items;
  if (!featured) return null;
  return (
    <LpSectionShell id={id} title={data.title} layout="stacked">
      <figure className="max-w-4xl border-l-4 border-brand pl-6 md:pl-10">
        <blockquote className="text-2xl font-medium leading-snug text-ink md:text-4xl" style={{ letterSpacing: "-0.02em" }}>
          “{featured.text}”
        </blockquote>
        <Author item={featured} />
      </figure>
      {rest.length > 0 && (
        <div className="mt-14 grid gap-10 md:grid-cols-2">
          {rest.map((item, index) => (
            <figure key={`${item.name}-${index}`}>
              <blockquote className="text-lg leading-relaxed text-fg">“{item.text}”</blockquote>
              <Author item={item} />
            </figure>
          ))}
        </div>
      )}
    </LpSectionShell>
  );
}
