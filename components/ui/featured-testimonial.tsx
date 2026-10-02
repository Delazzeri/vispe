import { Star } from "lucide-react";
import { cn } from "@/lib/cn";

type FeaturedTestimonialProps = {
  quote: string;
  name: string;
  handle?: string;
  role?: string;
  rating?: number;
  className?: string;
};

export function FeaturedTestimonial({
  quote,
  name,
  handle,
  role,
  rating,
  className,
}: FeaturedTestimonialProps) {
  return (
    <figure className={cn("flex flex-col items-center text-center", className)}>
      {rating ? (
        <div className="flex gap-0.5" aria-label={`Avaliação ${rating} de 5 estrelas`}>
          {Array.from({ length: 5 }).map((_, index) => (
            <Star
              key={index}
              className={cn(
                "h-5 w-5",
                index < rating ? "fill-brand text-brand" : "fill-border text-border",
              )}
              aria-hidden
            />
          ))}
        </div>
      ) : null}

      <blockquote className="mt-4 max-w-xl text-balance text-lg font-medium leading-relaxed text-fg">
        {quote}
      </blockquote>

      <figcaption className="mt-5 flex items-center gap-3">
        <span
          aria-hidden
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-border text-sm font-semibold text-fg-muted"
        >
          {name.charAt(0)}
        </span>
        <div className="text-left">
          <p className="text-sm font-semibold text-fg">{name}</p>
          <p className="text-xs text-fg-muted">{handle ?? role}</p>
        </div>
      </figcaption>
    </figure>
  );
}
