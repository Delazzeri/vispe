import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { site } from "@/content/site";

export function FinalCTA({ id }: { id?: string }) {
  return (
    <section id={id} aria-labelledby="final-cta-heading" className="bg-ink py-24 md:py-32">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <Reveal>
          <Sparkles className="mx-auto h-8 w-8 text-brand" aria-hidden />
          <h2
            id="final-cta-heading"
            className="mt-6 text-balance text-3xl font-bold tracking-tight text-paper md:text-5xl"
            style={{ letterSpacing: "-0.02em" }}
          >
            {site.contact.subtitle}
          </h2>
          <p className="mt-5 text-balance text-lg text-paper/70">{site.contact.description}</p>
          <Link
            href={site.hero.ctaPrimary.href}
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-brand px-7 py-4 text-sm font-semibold text-brand-fg transition-transform hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-paper"
          >
            {site.hero.ctaPrimary.label}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
