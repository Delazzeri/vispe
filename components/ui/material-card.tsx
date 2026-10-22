import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { LocaleLink as Link } from "@/components/ui/locale-link";
import type { MaterialItem } from "@/lib/materials/types";
import { cn } from "@/lib/cn";

type MaterialCardProps = {
  material: MaterialItem;
  cta: string;
  /** Nível do título (h2 no catálogo, h3 em "Outros materiais"). */
  headingLevel?: "h2" | "h3";
  /** Capa na primeira dobra (1º card do catálogo): carrega já, com prioridade. */
  priority?: boolean;
  className?: string;
};

/** Card do catálogo: capa + formato + título, inteiro clicável até a LP do material. */
export function MaterialCard({ material, cta, headingLevel = "h2", priority = false, className }: MaterialCardProps) {
  const Heading = headingLevel;
  return (
    <Link
      href={`/materiais/${material.slug}`}
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-surface transition-transform duration-300 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2",
        className,
      )}
    >
      {material.cover ? (
        <div className="relative aspect-[842/595] overflow-hidden">
          <Image
            src={material.cover.src}
            alt={material.cover.alt}
            fill
            sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
            priority={priority}
            className="object-cover"
          />
        </div>
      ) : (
        // Sem capa no admin: degradê da marca.
        <div aria-hidden className="aspect-[842/595] bg-gradient-to-br from-accent-soft to-brand" />
      )}
      <div className="flex flex-1 flex-col p-6">
        <span className="self-start rounded-md bg-ink px-2 py-1 text-xs font-semibold text-paper">{material.type}</span>
        <Heading className="mt-4 text-lg font-semibold leading-snug text-fg">{material.title}</Heading>
        <p className="mt-2 flex-1 text-sm leading-6 text-fg-muted">{material.tagline}</p>
        <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-fg transition-colors group-hover:text-brand-dark">
          {cta}
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
        </span>
      </div>
    </Link>
  );
}
