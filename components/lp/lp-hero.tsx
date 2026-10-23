import Image from "next/image";
import { CalendarDays, Check } from "lucide-react";
import { cn } from "@/lib/cn";
import type { LpHero as LpHeroData } from "@/lib/lp/types";
import { LpButton, lpCardClass } from "./parts";

/**
 * Topo da LP: logo (sem link, para não tirar a pessoa da página), selo, h1,
 * subtítulo, data do evento, CTA e destaques. Com foto, duas colunas no
 * desktop; sem foto, centralizado. Sem animação de entrada: o h1 e a foto
 * (LCP) aparecem na primeira pintura (CLAUDE.md §8).
 */
export function LpHero({ id, data }: { id: string; data: LpHeroData }) {
  const withImage = Boolean(data.image);
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="bg-bg pt-8 pb-16 md:pt-10 md:pb-24">
      <div className="mx-auto max-w-6xl px-6">
        <Image
          src="/media/brand/logo-vispe-preto-2204.png"
          alt="Vispe Capital"
          width={122}
          height={24}
          priority
          className="h-6 w-auto md:h-7"
        />

        <div
          className={cn(
            "mt-12 md:mt-16",
            withImage ? "grid items-center gap-10 md:grid-cols-12 md:gap-12" : "mx-auto max-w-3xl text-center",
          )}
        >
          <div className={withImage ? "md:col-span-6" : undefined}>
            {data.eyebrow && <p className="text-sm font-semibold uppercase tracking-wide text-brand-dark">{data.eyebrow}</p>}
            <h1
              id={`${id}-heading`}
              className="mt-3 text-balance text-4xl font-bold tracking-tight text-fg md:text-6xl"
              style={{ letterSpacing: "-0.03em" }}
            >
              {data.title}
            </h1>
            {data.subtitle && (
              <p className="mt-5 text-balance text-lg leading-relaxed text-fg-muted md:text-xl">{data.subtitle}</p>
            )}
            {data.date && (
              <p
                className={cn(
                  "mt-6 inline-flex items-center gap-2 rounded-full bg-accent-soft/60 px-4 py-2 text-sm font-semibold text-fg",
                  !withImage && "mx-auto",
                )}
              >
                <CalendarDays className="h-4 w-4 text-brand-dark" aria-hidden />
                {data.date}
              </p>
            )}
            <div className={cn("mt-8", !withImage && "flex justify-center")}>
              <LpButton cta={data.cta} className="w-full sm:w-auto" />
            </div>
            {data.bullets.length > 0 && (
              <ul
                className={cn(
                  "mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium text-fg-muted",
                  !withImage && "justify-center",
                )}
              >
                {data.bullets.map((bullet) => (
                  <li key={bullet} className="flex items-center gap-1.5">
                    <Check className="h-4 w-4 text-brand-dark" aria-hidden />
                    {bullet}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {data.image && (
            <div className={cn("relative aspect-[4/3] overflow-hidden md:col-span-6", lpCardClass)}>
              <Image
                src={data.image.src}
                alt={data.image.alt}
                fill
                priority
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
