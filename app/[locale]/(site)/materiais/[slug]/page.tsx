import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { MaterialView } from "@/components/materials/material-view";
import { getMaterialsUi } from "@/content/materials";
import { getSite } from "@/content/site";
import { localizePath } from "@/i18n/href";
import { locales, resolveLocale } from "@/i18n/routing";
import { materialDescription } from "@/lib/materials/rows";
import { localizeMaterial } from "@/lib/materials/localize";
import { getMaterialItem, listMaterials } from "@/lib/materials/source";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

// Pré-renderiza os materiais publicados até o build. Os publicados depois abrem
// pela página única /materiais/item/ (o .htaccess manda para ela quando não há HTML).
export const dynamicParams = false;

export async function generateStaticParams() {
  const materials = await listMaterials();
  return locales.flatMap((locale) => materials.map((material) => ({ locale, slug: material.slug })));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/materiais/[slug]">) {
  const { locale: raw, slug } = await params;
  const found = await getMaterialItem(slug);
  if (!found) return {};
  const material = localizeMaterial(found, resolveLocale(raw));
  return buildMetadata({
    title: material.seoTitle ?? material.title,
    description: materialDescription(material),
    locale: resolveLocale(raw),
    // Sem tradução, a URL canônica é a pt-BR (a /en mostra o português).
    contentLocale: found.en ? undefined : "pt-BR",
    path: `/materiais/${material.slug}`,
  });
}

export default async function MaterialPage({ params }: PageProps<"/[locale]/materiais/[slug]">) {
  const { locale: raw, slug } = await params;
  const locale = resolveLocale(raw);
  setRequestLocale(locale);
  const found = await getMaterialItem(slug);
  if (!found) notFound();
  const material = localizeMaterial(found, locale);

  const { page } = getMaterialsUi(locale);
  const { ui } = getSite(locale);
  const others = (await listMaterials())
    .filter((m) => m.slug !== material.slug)
    .slice(0, 3)
    .map((m) => localizeMaterial(m, locale));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: ui.home, path: localizePath("/", locale) },
              { name: page.back, path: localizePath("/materiais", locale) },
              { name: material.title, path: localizePath(`/materiais/${material.slug}`, material.contentLocale) },
            ]),
          ),
        }}
      />
      {material.faq && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: material.faq.map((item) => ({
                "@type": "Question",
                name: item.question,
                acceptedAnswer: { "@type": "Answer", text: item.answer },
              })),
            }),
          }}
        />
      )}
      <MaterialView material={material} locale={locale} others={others} />
    </>
  );
}
