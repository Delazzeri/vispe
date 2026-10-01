import { Reveal } from "@/components/motion/reveal";
import { site } from "@/content/site";

export function TrustBar({ id }: { id?: string }) {
  return (
    <section id={id} aria-label="Resultados da Vispe Capital" className="bg-bg pb-10 pt-6 md:pb-12 md:pt-8">
      <ul className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-x-12 gap-y-8 px-6">
        {site.metrics.map((metric, index) => (
          <Reveal key={metric.label} delay={index * 0.06}>
            <li className="flex flex-col items-center text-center">
              <span
                className="text-3xl font-bold tracking-tight text-fg md:text-4xl"
                style={{ letterSpacing: "-0.02em" }}
              >
                {metric.prefix}
                {metric.value}
                {metric.suffix}
              </span>
              <span className="mt-1 text-sm text-fg-muted">{metric.label}</span>
            </li>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
