import { Reveal } from "@/components/motion/reveal";
import { TestimonialCard } from "@/components/ui/testimonial-card";
import { useSite } from "@/content/site";

export function Testimonials({ id }: { id?: string }) {
  const site = useSite();
  const { title, description } = site.testimonialsSection;

  return (
    <section id={id} aria-labelledby="testimonials-heading" className="bg-bg py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal className="text-center">
          <h2
            id="testimonials-heading"
            className="text-balance text-3xl font-bold tracking-tight text-ink md:text-[48px] md:leading-[48px]"
            style={{ letterSpacing: "-0.05em" }}
          >
            {title}
          </h2>
          <p className="mt-3 text-balance text-lg text-fg-muted">{description}</p>
        </Reveal>

        <div className="mt-14 columns-1 gap-6 md:columns-2">
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
