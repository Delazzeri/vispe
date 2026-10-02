import { Reveal } from "@/components/motion/reveal";
import { TestimonialCard } from "@/components/ui/testimonial-card";
import { site } from "@/content/site";

export function Testimonials({ id }: { id?: string }) {
  return (
    <section id={id} aria-labelledby="testimonials-heading" className="bg-surface py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal className="text-center">
          <h2
            id="testimonials-heading"
            className="text-balance text-3xl font-bold tracking-tight text-fg md:text-5xl"
            style={{ letterSpacing: "-0.02em" }}
          >
            O que nossos clientes falam da gente
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {site.testimonials.map((testimonial, index) => (
            <Reveal key={testimonial.name + index} delay={index * 0.06}>
              <TestimonialCard className="h-full" {...testimonial} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
