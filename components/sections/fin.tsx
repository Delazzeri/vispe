import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { site } from "@/content/site";

export function Fin({ id }: { id?: string }) {
  const { name, title, description, ctaLabel, ctaHref } = site.fin;

  return (
    <section id={id} aria-labelledby="fin-heading" className="bg-ink pt-[400px] pb-24 md:pb-32">
      <div className="mx-auto max-w-2xl px-6 text-center">
        <Reveal>
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-brand text-base font-bold text-brand-fg">
            24
          </span>
          <p className="mt-4 text-sm font-bold text-brand">{name}</p>
          <h2
            id="fin-heading"
            className="mt-3 text-balance text-3xl font-bold tracking-tight text-paper md:text-[48px] md:leading-[48px]"
            style={{ letterSpacing: "-0.05em" }}
          >
            {title}
          </h2>
          <p className="mt-5 text-balance text-lg text-paper/70">{description}</p>
          <Link
            href={ctaHref}
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-brand px-7 py-4 text-sm font-semibold text-brand-fg transition-transform hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-paper"
          >
            {ctaLabel}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
