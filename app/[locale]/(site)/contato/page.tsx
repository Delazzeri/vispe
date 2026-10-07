import { setRequestLocale } from "next-intl/server";
import { LeadSection } from "@/components/sections/lead-section";
import { getSite } from "@/content/site";
import { resolveLocale } from "@/i18n/routing";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/contato">) {
  const locale = resolveLocale((await params).locale);
  const site = getSite(locale);
  return buildMetadata({
    title: site.pages.contact.title,
    description: site.contact.description,
    locale,
    path: "/contato",
  });
}

export default async function ContatoPage({ params }: PageProps<"/[locale]/contato">) {
  const locale = resolveLocale((await params).locale);
  setRequestLocale(locale);
  // Mesmo formulário da home; aqui o título é o h1 da página.
  return <LeadSection headingLevel="h1" />;
}
