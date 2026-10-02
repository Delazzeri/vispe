import { Reveal } from "@/components/motion/reveal";
import { TestimonialCard } from "@/components/ui/testimonial-card";
import { site } from "@/content/site";

export function Testimonials({ id }: { id?: string }) {
  return (
    <section id={id} aria-labelledby="testimonials-heading" className="bg-bg py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal className="text-center">
          <h2
            id="testimonials-heading"
            className="text-balance text-3xl font-bold tracking-tight text-ink md:text-[48px] md:leading-[48px]"
            style={{ letterSpacing: "-0.05em" }}
          >
            O que nossos clientes falam da gente
          </h2>
        </Reveal>

        <div className="mt-14 columns-1 gap-6 md:columns-2 lg:columns-3">
          {site.testimonials.map((testimonial, index) => (
            <Reveal key={testimonial.name + index} delay={index * 0.06} className="mb-6">
              <TestimonialCard {...testimonial} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
