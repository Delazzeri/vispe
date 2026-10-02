import { Star } from "lucide-react";
import { cn } from "@/lib/cn";

type TestimonialCardProps = {
  quote: string;
  name: string;
  handle?: string;
  role?: string;
  rating?: number;
  className?: string;
};

export function TestimonialCard({
  quote,
  name,
  handle,
  role,
  rating,
  className,
}: TestimonialCardProps) {
  return (
    <figure
      className={cn(
        "rounded-3xl border border-border bg-bg p-7 shadow-[0_1px_2px_rgba(38,38,38,0.04)]",
        className,
      )}
    >
      <figcaption className="flex items-center gap-3">
        <span
          aria-hidden
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-border text-sm font-semibold text-fg-muted"
        >
          {name.charAt(0)}
        </span>
        <div>
          <p className="text-sm font-semibold text-fg">{name}</p>
          <p className="text-xs text-fg-muted">{handle ?? role}</p>
        </div>
      </figcaption>

      <blockquote className="mt-4 text-balance text-sm leading-relaxed text-fg">
        {quote}
      </blockquote>

      {rating ? (
        <div className="mt-4 flex gap-0.5" aria-label={`Avaliação ${rating} de 5 estrelas`}>
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
      ) : null}
    </figure>
  );
}
