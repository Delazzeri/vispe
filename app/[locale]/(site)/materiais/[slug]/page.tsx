import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { MaterialView } from "@/components/materials/material-view";
import { getMaterialsUi } from "@/content/materials";
import { getSite } from "@/content/site";
import { localizePath } from "@/i18n/href";
import { locales, resolveLocale } from "@/i18n/routing";
import { materialDescription } from "@/lib/materials/rows";
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
  const material = await getMaterialItem(slug);
  if (!material) return {};
  return buildMetadata({
    title: material.seoTitle ?? material.title,
    description: materialDescription(material),
    locale: resolveLocale(raw),
    // Conteúdo só em português: a URL canônica é sempre a pt-BR.
    contentLocale: "pt-BR",
    path: `/materiais/${material.slug}`,
  });
}

export default async function MaterialPage({ params }: PageProps<"/[locale]/materiais/[slug]">) {
  const { locale: raw, slug } = await params;
  const locale = resolveLocale(raw);
  setRequestLocale(locale);
  const material = await getMaterialItem(slug);
  if (!material) notFound();

  const { page } = getMaterialsUi(locale);
  const { ui } = getSite(locale);
  const others = (await listMaterials()).filter((m) => m.slug !== material.slug).slice(0, 3);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: ui.home, path: localizePath("/", locale) },
              { name: page.back, path: localizePath("/materiais", locale) },
              { name: material.title, path: localizePath(`/materiais/${material.slug}`, locale) },
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
