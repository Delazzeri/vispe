import Image from "next/image";
import { Globe, Star } from "lucide-react";
import type { ReactNode, SVGProps } from "react";
import { useSite } from "@/content/site";
import { format, type Testimonial } from "@/content/types";
import { cn } from "@/lib/cn";

/**
 * `profile`: onde fica o perfil (foto + nome). "top" = perfil no topo e
 * estrelas no fim; "bottom" = estrelas e ícones no topo, perfil no fim.
 * A seção alterna as duas para os cards não ficarem repetitivos.
 */
type TestimonialCardProps = Testimonial & { profile?: "top" | "bottom"; className?: string };

const ratingMax = 5;

/** Logo do Instagram só em traço (sem fundo), no mesmo estilo dos ícones do lucide. */
function InstagramOutline(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      <rect x="2" y="2" width="20" height="20" rx="5.5" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="17.6" cy="6.4" r="0.6" fill="currentColor" />
    </svg>
  );
}

/** Link externo do cliente; sem URL (ex.: empresa sem site), o ícone não aparece. */
function ClientLink({ href, label, children }: { href?: string; label: string; children: ReactNode }) {
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener"
      aria-label={label}
      title={label}
      // Discreto por padrão; ganha contraste só no hover/foco.
      className="block rounded-md text-ink/25 transition-colors hover:text-ink focus-visible:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
    >
      {children}
    </a>
  );
}

function Stars({ rating, label }: { rating: number; label: string }) {
  return (
    <div role="img" aria-label={label} className="flex gap-0.5">
      {Array.from({ length: ratingMax }, (_, i) => (
        <Star
          key={i}
          aria-hidden
          className={cn("h-4 w-4", i < rating ? "fill-brand text-brand" : "fill-border text-border")}
          strokeWidth={0}
        />
      ))}
    </div>
  );
}

export function TestimonialCard({
  quote,
  name,
  segment,
  avatar,
  instagram,
  website,
  rating = ratingMax,
  media,
  profile = "top",
  className,
}: TestimonialCardProps) {
  const { ui } = useSite();

  const links = (instagram || website) && (
    <div className="flex shrink-0 items-center gap-2.5">
      <ClientLink href={instagram} label={format(ui.testimonialInstagram, { name })}>
        <InstagramOutline className="h-5 w-5" />
      </ClientLink>
      <ClientLink href={website} label={format(ui.testimonialWebsite, { name })}>
        <Globe className="h-5 w-5" strokeWidth={2} aria-hidden />
      </ClientLink>
    </div>
  );

  const stars = <Stars rating={rating} label={format(ui.testimonialRating, { rating, max: ratingMax })} />;

  const person = (
    <div className="flex min-w-0 flex-1 items-center gap-4">
      {/* Logo ocupando o círculo inteiro, com sombra suave; sem logo, a inicial no mesmo formato. */}
      <span className="relative block h-14 w-14 shrink-0 overflow-hidden rounded-full bg-bg shadow-md">
        {avatar ? (
          <Image src={avatar} alt="" fill sizes="56px" className="object-cover" />
        ) : (
          <span aria-hidden className="flex h-full w-full items-center justify-center text-lg font-bold text-fg-muted">
            {name.charAt(0)}
          </span>
        )}
      </span>
      <div className="min-w-0">
        {/* Nome e setor medidos na referência: 16/16 negrito preto; 12/16.8 preto a ~60%. */}
        <p className="truncate text-base leading-4 font-bold text-ink">{name}</p>
        {segment && (
          <p className="mt-1 truncate text-xs text-ink/60" style={{ lineHeight: 1.4 }}>
            {segment}
          </p>
        )}
      </div>
    </div>
  );

  // Estilo medido no depoimento da referência: 16/22.4, itálico, preto a ~60% (contraste ~5,7).
  const body = (
    <>
      <blockquote className="mt-5 text-base text-ink/60 italic" style={{ lineHeight: 1.4 }}>
        “{quote}”
      </blockquote>
      {media && (
        <Image
          src={media.src}
          alt={media.alt}
          width={media.width}
          height={media.height}
          sizes="(min-width: 768px) 520px, 100vw"
          className="mt-5 h-auto w-full rounded-2xl"
        />
      )}
    </>
  );

  return (
    <figure
      className={cn(
        "break-inside-avoid rounded-3xl bg-surface p-7 shadow-[0_1px_2px_rgba(38,38,38,0.04),0_4px_12px_-4px_rgba(38,38,38,0.1)]",
        className,
      )}
    >
      {profile === "top" ? (
        <>
          <figcaption className="flex items-center justify-between gap-3">
            {person}
            {links}
          </figcaption>
          {body}
          <div className="mt-5">{stars}</div>
        </>
      ) : (
        <>
          <div className="flex items-center justify-between gap-3">
            {stars}
            {links}
          </div>
          {body}
          <figcaption className="mt-6 flex items-center">{person}</figcaption>
        </>
      )}
    </figure>
  );
}
