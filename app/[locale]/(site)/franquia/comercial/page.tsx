import { setRequestLocale } from "next-intl/server";
import { resolveLocale } from "@/i18n/routing";
import { FranchiseModelPage } from "@/components/sections/franchise-model";
import { getFranchise } from "@/content/franchise";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/franquia/comercial">) {
  const locale = resolveLocale((await params).locale);
  const page = getFranchise(locale).models.comercial;
  return buildMetadata({ title: page.eyebrow, description: page.description, locale, path: "/franquia/comercial" });
}

export default async function FranquiaComercialPage({ params }: PageProps<"/[locale]/franquia/comercial">) {
  const locale = resolveLocale((await params).locale);
  setRequestLocale(locale);
  return <FranchiseModelPage locale={locale} model="comercial" />;
}
