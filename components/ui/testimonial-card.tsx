import { ImageIcon, Star, User } from "lucide-react";
import { useSite } from "@/content/site";
import { format } from "@/content/types";
import { cn } from "@/lib/cn";

type TestimonialCardProps = {
  quote: string;
  name: string;
  handle?: string;
  role?: string;
  rating?: number;
  avatarUrl?: string;
  /** Placeholder visual de foto de perfil pendente (sem foto real autorizada ainda). */
  avatarPlaceholder?: boolean;
  /** Placeholder de mídia anexa ao depoimento (screenshot/foto pendente). */
  mediaPlaceholder?: boolean;
  /** "x" marca depoimento vindo do X (recebe o selo). */
  source?: string;
  className?: string;
};

function XMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function Rating({ rating, className }: { rating: number; className?: string }) {
  return (
    <div className={cn("flex gap-0.5", className)} role="img" aria-label={format(useSite().ui.rating, { rating })}>
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          className={cn(
            "h-4 w-4",
            index < rating ? "fill-brand text-brand" : "fill-border text-border",
          )}
          aria-hidden
        />
      ))}
    </div>
  );
}

export function TestimonialCard({
  quote,
  name,
  handle,
  role,
  rating,
  avatarUrl,
  avatarPlaceholder,
  mediaPlaceholder,
  source,
  className,
}: TestimonialCardProps) {
  return (
    <figure
      className={cn(
        "break-inside-avoid rounded-3xl bg-surface p-7 shadow-[0_1px_2px_rgba(38,38,38,0.04),0_4px_12px_-4px_rgba(38,38,38,0.1)]",
        className,
      )}
    >
      <figcaption className="flex items-center gap-3">
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={avatarUrl}
            alt=""
            className="h-10 w-10 shrink-0 rounded-full object-cover"
          />
        ) : avatarPlaceholder ? (
          <span
            aria-hidden
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-border"
          >
            <User className="h-5 w-5 text-fg-muted" aria-hidden />
          </span>
        ) : (
          <span
            aria-hidden
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-border text-sm font-semibold text-fg-muted"
          >
            {name.charAt(0)}
          </span>
        )}
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-fg">{name}</p>
          <p className="truncate text-xs text-fg-muted">{handle ?? role}</p>
        </div>
        {source === "x" ? <XMark className="h-4 w-4 shrink-0 text-ink" /> : null}
      </figcaption>

      <blockquote className="mt-4 text-balance text-sm leading-relaxed text-fg">
        {quote}
      </blockquote>

      {rating ? <Rating rating={rating} className="mt-4" /> : null}

      {mediaPlaceholder ? (
        <div
          className="mt-4 flex aspect-video items-center justify-center rounded-2xl bg-border/50"
          aria-hidden
        >
          <ImageIcon className="h-8 w-8 text-fg-muted" aria-hidden />
        </div>
      ) : null}
    </figure>
  );
}
