import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { ScrollScale } from "@/components/motion/scroll-scale";
import { site } from "@/content/site";

export function FinalCTA({ id }: { id?: string }) {
  return (
    <section id={id} aria-labelledby="final-cta-heading" className="bg-bg py-24 md:py-32">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <ScrollScale className="inline-block">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-surface shadow-[0_1px_2px_rgba(38,38,38,0.04),0_4px_12px_-4px_rgba(38,38,38,0.1)]">
            <Sparkles className="h-6 w-6 text-brand-dark" aria-hidden />
          </span>
        </ScrollScale>

        <Reveal>
          <h2
            id="final-cta-heading"
            className="mt-6 text-balance text-3xl font-bold tracking-tight text-ink md:text-[48px] md:leading-[48px]"
            style={{ letterSpacing: "-0.05em" }}
          >
            {site.contact.subtitle}
          </h2>
          <p className="mt-5 text-balance text-lg text-fg-muted">{site.contact.description}</p>
          <Link
            href={site.hero.ctaPrimary.href}
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-ink px-7 py-4 text-sm font-semibold text-paper transition-transform hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            {site.hero.ctaPrimary.label}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
