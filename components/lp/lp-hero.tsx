import type { ReactNode } from "react";
import Image from "next/image";
import { CalendarDays, Check, CircleCheck } from "lucide-react";
import { LpPattern } from "./lp-pattern";
import { cn } from "@/lib/cn";
import type { LpHero as LpHeroData } from "@/lib/lp/types";
import { LpButton } from "./parts";

/**
 * Topo da LP: faixa preta com as escamas da marca saindo pela direita. Logo
 * sem link (não tira a pessoa da página), título grande à esquerda. Variações:
 * - default: título, subtítulo, data, botão e destaques (com foto ao lado, se houver);
 * - form: o formulário da LP (`form`) num cartão branco ao lado do título;
 * - confirmation: página de obrigado, com o selo de confirmação.
 * Sem animação de entrada: o h1 e a foto (LCP) aparecem na primeira pintura.
 */
export function LpHero({ id, data, form }: { id: string; data: LpHeroData; form?: ReactNode }) {
  const withForm = data.variant === "form" && Boolean(form);
  const confirmation = data.variant === "confirmation";
  const side: ReactNode = withForm ? form : data.image && !confirmation ? (
    <div className="relative aspect-[4/5] overflow-hidden rounded-3xl md:aspect-[4/5]">
      <Image src={data.image.src} alt={data.image.alt} fill priority sizes="(min-width: 768px) 40vw, 100vw" className="object-cover" />
    </div>
  ) : null;

  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="relative isolate overflow-hidden bg-ink text-paper">
      <LpPattern className="absolute inset-y-0 right-0 -z-10 w-3/4 text-paper/[0.08] [mask-image:linear-gradient(to_left,black,transparent)]" />
      <div className={cn("mx-auto max-w-6xl px-6 pt-8 md:pt-10", confirmation ? "pb-16 md:pb-20" : "pb-20 md:pb-28")}>
        <Image src="/media/brand/logo-vispe-branco-2204.png" alt="Vispe Capital" width={122} height={24} priority className="h-6 w-auto md:h-7" />

        <div className={cn("mt-14 md:mt-20", side ? "grid items-start gap-12 md:grid-cols-12" : "max-w-4xl")}>
          <div className={side ? "md:col-span-7 md:pt-6" : undefined}>
            {confirmation && <CircleCheck className="mb-6 h-14 w-14 text-brand" aria-hidden strokeWidth={1.5} />}
            {data.eyebrow && <p className="text-base font-semibold text-brand">{data.eyebrow}</p>}
            <h1
              id={`${id}-heading`}
              className="mt-4 text-balance text-5xl font-bold leading-[0.98] md:text-7xl"
              style={{ letterSpacing: "-0.045em" }}
            >
              {data.title}
            </h1>
            {data.subtitle && <p className="mt-6 max-w-2xl text-lg leading-relaxed text-paper/75 md:text-xl">{data.subtitle}</p>}
            {data.date && (
              <p className="mt-6 flex items-center gap-2.5 text-base font-semibold text-paper">
                <CalendarDays className="h-5 w-5 text-brand" aria-hidden />
                {data.date}
              </p>
            )}
            {/* Com o formulário ao lado, o botão seria redundante (no celular, a barra fixa leva ao formulário). */}
            {!withForm && data.cta.label && (
              <div className="mt-9">
                <LpButton cta={data.cta} className="w-full sm:w-auto" />
              </div>
            )}
            {data.bullets.length > 0 && (
              <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2.5 text-sm font-medium text-paper/80">
                {data.bullets.map((bullet) => (
                  <li key={bullet} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-brand" aria-hidden />
                    {bullet}
                  </li>
                ))}
              </ul>
            )}
          </div>
          {side && <div className="md:col-span-5">{side}</div>}
        </div>
      </div>
    </section>
  );
}
