import {
  Handshake,
  TrendingUp,
  Receipt,
  LineChart,
  Target,
  Scale,
  Check,
  type LucideIcon,
} from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { site } from "@/content/site";

const icons: Record<string, LucideIcon> = {
  ma: Handshake,
  "captacao-de-recursos": TrendingUp,
  "planejamento-tributario": Receipt,
  "controladoria-financeira": LineChart,
  "aceleracao-comercial": Target,
  valuation: Scale,
};

export function CategoryBlocks({ id }: { id?: string }) {
  return (
    <section id={id} aria-labelledby="category-blocks-heading" className="bg-bg py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal className="max-w-2xl">
          <h2
            id="category-blocks-heading"
            className="text-balance text-3xl font-bold tracking-tight text-fg md:text-5xl"
            style={{ letterSpacing: "-0.02em" }}
          >
            Sua empresa muito mais valiosa
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {site.services.map((service, index) => {
            const Icon = icons[service.slug];
            return (
              <Reveal key={service.slug} delay={index * 0.06}>
                <article className="h-full rounded-3xl border border-border bg-surface p-7">
                  <Icon className="h-6 w-6 text-brand-dark" aria-hidden />
                  <h3 className="mt-5 text-lg font-semibold text-fg">{service.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-fg-muted">
                    {service.description}
                  </p>
                  <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-fg-muted">
                    Inclui
                  </p>
                  <ul className="mt-3 space-y-2">
                    {service.includes.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-fg">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-dark" aria-hidden />
                        {item}
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
