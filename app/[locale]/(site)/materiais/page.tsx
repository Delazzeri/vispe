import { setRequestLocale } from "next-intl/server";
import { resolveLocale } from "@/i18n/routing";
import { MaterialsCatalog } from "@/components/sections/materials-catalog";
import { SocialLinks } from "@/components/ui/social-links";
import { getMaterials } from "@/content/materials";
import { getSite } from "@/content/site";
import { localizePath } from "@/i18n/href";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/materiais">) {
  const locale = resolveLocale((await params).locale);
  return buildMetadata({
    title: getSite(locale).pages.materials.title,
    description: getMaterials(locale).hero.description,
    locale,
    path: "/materiais",
  });
}

/** Catálogo de materiais gratuitos: download liberado após um cadastro rápido. */
export default async function MateriaisPage({ params }: PageProps<"/[locale]/materiais">) {
  const locale = resolveLocale((await params).locale);
  setRequestLocale(locale);
  const content = getMaterials(locale);
  const { hero } = content;
  const { ui } = getSite(locale);
  const hasDownloads = content.items.some((item) => item.file);

  return (
    <section aria-labelledby="materials-heading" className="mx-auto max-w-6xl px-6 pt-32 pb-24 md:pt-40 md:pb-32">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: ui.home, path: localizePath("/", locale) },
              { name: hero.eyebrow, path: localizePath("/materiais", locale) },
            ]),
          ),
        }}
      />

      <div className="max-w-3xl">
        <p className="text-sm font-bold text-brand-dark">{hero.eyebrow}</p>
        <h1
          id="materials-heading"
          className="mt-4 text-balance text-4xl font-bold tracking-tight text-ink md:text-6xl"
          style={{ letterSpacing: "-0.05em" }}
        >
          {hero.title}
        </h1>
        <p className="mt-6 text-base leading-7 text-fg-muted md:text-lg">{hero.description}</p>
      </div>

      {!hasDownloads && (
        <div className="mt-10 flex flex-col gap-4 rounded-3xl bg-accent-soft/40 p-6 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-fg">{content.empty}</p>
          <SocialLinks className="shrink-0" />
        </div>
      )}

      <div className="mt-12">
        <MaterialsCatalog locale={locale} content={content} />
      </div>
    </section>
  );
}
