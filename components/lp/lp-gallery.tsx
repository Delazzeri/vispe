import Image from "next/image";
import { ImageIcon } from "lucide-react";
import type { LpGallery as LpGalleryData } from "@/lib/lp/types";
import { LpSectionShell } from "./parts";

/** Galeria (edições anteriores, bastidores): a primeira foto maior, legendas em figcaption. */
export function LpGallery({ id, data }: { id: string; data: LpGalleryData }) {
  if (data.items.length === 0) return null;
  return (
    <LpSectionShell id={id} title={data.title} subtitle={data.subtitle} layout="stacked">
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {data.items.map((item, index) => (
          <li key={`${item.caption}-${index}`} className={index === 0 && data.items.length > 2 ? "sm:col-span-2 lg:row-span-2" : undefined}>
            <figure className="h-full">
              <div className={`relative overflow-hidden rounded-3xl bg-accent-soft/40 ${index === 0 && data.items.length > 2 ? "aspect-[4/3] lg:aspect-auto lg:h-[calc(100%-2.5rem)]" : "aspect-[4/3]"}`}>
                {item.photo ? (
                  <Image src={item.photo.src} alt={item.photo.alt} fill sizes="(min-width: 1024px) 50vw, (min-width: 640px) 50vw, 100vw" className="object-cover" />
                ) : (
                  <ImageIcon className="absolute inset-0 m-auto h-10 w-10 text-brand-dark" aria-hidden strokeWidth={1.25} />
                )}
              </div>
              {item.caption && <figcaption className="mt-3 text-sm text-fg-muted">{item.caption}</figcaption>}
            </figure>
          </li>
        ))}
      </ul>
    </LpSectionShell>
  );
}
