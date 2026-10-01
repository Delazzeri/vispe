import { Reveal } from "@/components/motion/reveal";
import { site } from "@/content/site";

export function Showcase({ id }: { id?: string }) {
  const { eyebrow, title, description, steps } = site.showcase;

  return (
    <section id={id} aria-labelledby="showcase-heading" className="bg-bg py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal className="max-w-2xl">
          <p className="text-sm font-bold text-brand-dark">{eyebrow}</p>
          <h2
            id="showcase-heading"
            className="mt-3 text-balance text-3xl font-bold tracking-tight text-fg md:text-5xl"
            style={{ letterSpacing: "-0.02em" }}
          >
            {title}
          </h2>
          <p className="mt-5 text-balance text-lg text-fg-muted">{description}</p>
        </Reveal>

        <ol className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <Reveal key={step.title} delay={index * 0.08}>
              <li className="h-full list-none rounded-3xl border border-border bg-surface p-6">
                <span className="text-xs font-semibold text-fg-muted">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 text-base font-semibold text-fg">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-fg-muted">{step.description}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
