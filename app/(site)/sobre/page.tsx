import { buildMetadata } from "@/lib/seo";
import { site } from "@/content/site";

export const metadata = buildMetadata({
  title: "Sobre",
  description: site.about.purpose,
  path: "/sobre",
});

export default function SobrePage() {
  return (
    <section aria-labelledby="sobre-heading" className="mx-auto max-w-6xl px-6 py-24 md:py-32">
      <h1 id="sobre-heading" className="text-fg text-4xl font-bold tracking-tight md:text-5xl">
        Sobre a {site.name}
      </h1>
      <p className="mt-6 max-w-2xl text-lg text-fg-muted">{site.about.purpose}</p>
      {/* TODO: construir seções completas (Visão, Valores, Posicionamento, Público) — ver content/site.ts:about */}
    </section>
  );
}
