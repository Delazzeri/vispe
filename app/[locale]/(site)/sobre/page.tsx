import { setRequestLocale } from "next-intl/server";
import { getSite } from "@/content/site";
import { resolveLocale } from "@/i18n/routing";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/sobre">) {
  const locale = resolveLocale((await params).locale);
  const site = getSite(locale);
  return buildMetadata({
    title: site.pages.about.title,
    description: site.about.purpose,
    locale,
    path: "/sobre",
  });
}

export default async function SobrePage({ params }: PageProps<"/[locale]/sobre">) {
  const locale = resolveLocale((await params).locale);
  setRequestLocale(locale);
  const { about, pages } = getSite(locale);

  return (
    <section aria-labelledby="sobre-heading" className="mx-auto max-w-6xl px-6 py-24 md:py-32">
      <h1 id="sobre-heading" className="text-fg text-4xl font-bold tracking-tight md:text-5xl">
        {pages.about.heading}
      </h1>
      <p className="mt-6 max-w-2xl text-lg text-fg-muted">{about.purpose}</p>
      {/* TODO: construir seções completas (Visão, Valores, Posicionamento, Público) — ver content/pt-BR/site.ts:about */}
    </section>
  );
}
