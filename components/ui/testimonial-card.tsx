import Image from "next/image";
import { Globe } from "lucide-react";
import type { ReactNode } from "react";
import { SocialLogo } from "@/components/ui/social-links";
import { useSite } from "@/content/site";
import { format, type Testimonial } from "@/content/types";
import { cn } from "@/lib/cn";

type TestimonialCardProps = Testimonial & { className?: string };

/** Link externo do cliente; sem URL, o ícone aparece sem link (TODO(content)). */
function ClientLink({ href, label, children }: { href?: string; label: string; children: ReactNode }) {
  const classes =
    "group block rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2";
  return href ? (
    <a href={href} target="_blank" rel="noopener" aria-label={label} title={label} className={classes}>
      {children}
    </a>
  ) : (
    <span role="img" aria-label={label} title={label} className="group block">
      {children}
    </span>
  );
}

export function TestimonialCard({
  quote,
  name,
  segment,
  avatar,
  instagram,
  website,
  media,
  className,
}: TestimonialCardProps) {
  const { ui } = useSite();

  return (
    <figure
      className={cn(
        "break-inside-avoid rounded-3xl bg-surface p-7 shadow-[0_1px_2px_rgba(38,38,38,0.04),0_4px_12px_-4px_rgba(38,38,38,0.1)]",
        className,
      )}
    >
      <figcaption className="flex items-center gap-4">
        {/* Foto com borda branca e sombra suave; sem foto, a inicial no mesmo formato. */}
        <span className="relative block h-14 w-14 shrink-0 overflow-hidden rounded-full border-4 border-surface bg-bg shadow-md">
          {avatar ? (
            <Image src={avatar} alt="" fill sizes="56px" className="object-cover" />
          ) : (
            <span aria-hidden className="flex h-full w-full items-center justify-center text-lg font-bold text-fg-muted">
              {name.charAt(0)}
            </span>
          )}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <p className="truncate text-lg font-bold text-ink" style={{ letterSpacing: "-0.02em" }}>
              {name}
            </p>
            {/* Instagram e site do cliente, na mesma linha do nome. */}
            <div className="flex shrink-0 items-center gap-2">
              <ClientLink href={instagram} label={format(ui.testimonialInstagram, { name })}>
                <SocialLogo network="instagram" tone="light" />
              </ClientLink>
              <ClientLink href={website} label={format(ui.testimonialWebsite, { name })}>
                <span
                  aria-hidden
                  className="flex h-6 w-6 items-center justify-center rounded-full bg-ink/60 transition-colors group-hover:bg-brand group-focus-visible:bg-brand"
                >
                  <Globe className="h-3.5 w-3.5 text-paper group-hover:text-brand-fg" aria-hidden />
                </span>
              </ClientLink>
            </div>
          </div>
          {segment && <p className="truncate text-base text-fg-muted">{segment}</p>}
        </div>
      </figcaption>

      <blockquote className="mt-5 text-balance text-sm leading-relaxed text-fg">{quote}</blockquote>

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
    </figure>
  );
}
