import { setRequestLocale } from "next-intl/server";
import { resolveLocale } from "@/i18n/routing";
import { MaterialList } from "@/components/materials/material-list";
import { getMaterialsUi } from "@/content/materials";
import { localizeMaterial } from "@/lib/materials/localize";
import { listMaterials } from "@/lib/materials/source";
import { getSite } from "@/content/site";
import { localizePath } from "@/i18n/href";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/materiais">) {
  const locale = resolveLocale((await params).locale);
  return buildMetadata({
    title: getSite(locale).pages.materials.title,
    description: getMaterialsUi(locale).hero.description,
    locale,
    path: "/materiais",
  });
}

/** Catálogo de materiais gratuitos (build + atualização no navegador): cada card leva à página do material. */
export default async function MateriaisPage({ params }: PageProps<"/[locale]/materiais">) {
  const locale = resolveLocale((await params).locale);
  setRequestLocale(locale);
  const { hero, card, page } = getMaterialsUi(locale);
  const { ui } = getSite(locale);

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

      <div className="mx-auto max-w-3xl text-center">
        <h1
          id="materials-heading"
          className="text-balance text-4xl font-bold tracking-tight text-ink md:text-6xl"
          style={{ letterSpacing: "-0.05em" }}
        >
          {hero.title}
        </h1>
        <p className="mt-6 text-balance text-base leading-7 text-fg-muted md:text-lg">{hero.description}</p>
      </div>

      <div className="mt-14">
        <MaterialList
          initial={(await listMaterials()).map((material) => localizeMaterial(material, locale))}
          cta={card.cta}
          emptyLabel={page.empty}
          locale={locale}
        />
      </div>
    </section>
  );
}
