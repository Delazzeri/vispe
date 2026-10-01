import { Quote } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { site } from "@/content/site";

export function Testimonials({ id }: { id?: string }) {
  return (
    <section id={id} aria-labelledby="testimonials-heading" className="bg-bg py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <h2
            id="testimonials-heading"
            className="text-balance text-3xl font-bold tracking-tight text-fg md:text-5xl"
            style={{ letterSpacing: "-0.02em" }}
          >
            O que dizem os clientes
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {site.testimonials.map((testimonial, index) => (
            <Reveal key={testimonial.name + index} delay={index * 0.08}>
              <figure className="h-full rounded-3xl border border-border bg-surface p-7">
                <Quote className="h-6 w-6 text-brand-dark" aria-hidden />
                <blockquote className="mt-4 text-balance text-sm leading-relaxed text-fg">
                  {testimonial.quote}
                </blockquote>
                <figcaption className="mt-5 text-sm font-semibold text-fg">
                  {testimonial.name}
                  <span className="block font-normal text-fg-muted">{testimonial.role}</span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
