import { site } from "@/content/site";

export default function HomePage() {
  return (
    <section aria-labelledby="hero-heading" className="mx-auto max-w-6xl px-6 py-24 md:py-32">
      <h1 id="hero-heading" className="text-fg text-4xl font-bold tracking-tight md:text-6xl">
        {site.hero.h1}
      </h1>
      <p className="mt-6 max-w-2xl text-lg text-fg-muted">{site.hero.subheadline}</p>
      {/* TODO: substituir por <Hero> real (components/sections/hero.tsx) — próxima seção a construir, ver docs/reference-analysis.md */}
    </section>
  );
}
