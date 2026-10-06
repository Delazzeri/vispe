import { Reveal } from "@/components/motion/reveal";
import { TestimonialCard } from "@/components/ui/testimonial-card";
import { useSite } from "@/content/site";
import { cn } from "@/lib/cn";

export function Testimonials({ id }: { id?: string }) {
  const site = useSite();
  const { title, description } = site.testimonialsSection;
  // Alterna os depoimentos entre as colunas (0, 2, 4… à esquerda; 1, 3, 5… à direita).
  const items = site.testimonials.map((testimonial, index) => ({ testimonial, index }));
  const columns = [items.filter((_, i) => i % 2 === 0), items.filter((_, i) => i % 2 === 1)];

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

        {/* Duas colunas independentes, a da direita começando mais abaixo: cards
            desencontrados, sem cara de tabela. No celular as colunas somem
            (display: contents) e os cards viram uma lista única. */}
        <div className="mt-14 grid grid-cols-1 items-start gap-6 md:grid-cols-2">
          {columns.map((column, col) => (
            <div key={col} className={cn("contents md:flex md:flex-col md:gap-6", col === 1 && "md:pt-12.5")}>
              {column.map(({ testimonial, index }) => (
                <Reveal key={testimonial.name} delay={index * 0.06}>
                  <TestimonialCard {...testimonial} />
                </Reveal>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
