import { Star } from "lucide-react";
import { cn } from "@/lib/cn";

type TestimonialCardProps = {
  quote: string;
  name: string;
  handle?: string;
  role?: string;
  rating?: number;
  avatarUrl?: string;
  source?: "x";
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
    <div className={cn("flex gap-0.5", className)} aria-label={`Avaliação ${rating} de 5 estrelas`}>
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
    </figure>
  );
}
