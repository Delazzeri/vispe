import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { LpPage } from "@/components/lp/lp-page";
import { locales, resolveLocale } from "@/i18n/routing";
import { localizeLandingPage } from "@/lib/lp/localize";
import { landingPageDescription, landingPageTitle } from "@/lib/lp/rows";
import { getLandingPage, listLandingPages } from "@/lib/lp/source";
import { buildMetadata } from "@/lib/seo";

// Pré-renderiza as LPs publicadas até o build. As publicadas depois abrem pela
// página única /lp/pagina/ (o .htaccess manda para ela quando não há HTML).
export const dynamicParams = false;

type PageProps = { params: Promise<{ locale: string; slug: string }> };

/**
 * O export estático não aceita rota dinâmica sem nenhum parâmetro: sem LP
 * publicada, gera só esta página vazia (404), que nenhum link usa.
 */
const emptyPlaceholder = "_sem-lp";

export async function generateStaticParams() {
  const pages = await listLandingPages();
  const slugs = pages.length ? pages.map((page) => page.slug) : [emptyPlaceholder];
  return locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params }: PageProps) {
  const { locale: raw, slug } = await params;
  const found = await getLandingPage(slug);
  if (!found) return {};
  const locale = resolveLocale(raw);
  const page = localizeLandingPage(found, locale);
  const metadata = buildMetadata({
    title: landingPageTitle(page),
    description: landingPageDescription(page),
    locale,
    // Sem tradução, a URL canônica é a pt-BR (a /en mostra o português).
    contentLocale: found.en ? undefined : "pt-BR",
    path: `/lp/${page.slug}`,
    image: page.ogImage ? { url: page.ogImage, alt: landingPageTitle(page) } : undefined,
  });
  // Página de anúncio: fora do Google (e do sitemap).
  return page.noindex ? { ...metadata, robots: { index: false, follow: false } } : metadata;
}

export default async function LandingPageRoute({ params }: PageProps) {
  const { locale: raw, slug } = await params;
  const locale = resolveLocale(raw);
  setRequestLocale(locale);
  const found = await getLandingPage(slug);
  if (!found) notFound();
  return <LpPage page={localizeLandingPage(found, locale)} source={found} locale={locale} />;
}
