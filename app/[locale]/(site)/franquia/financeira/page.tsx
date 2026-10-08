import { setRequestLocale } from "next-intl/server";
import { resolveLocale } from "@/i18n/routing";
import { FranchiseModelPage } from "@/components/sections/franchise-model";
import { getFranchise } from "@/content/franchise";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/franquia/financeira">) {
  const locale = resolveLocale((await params).locale);
  const page = getFranchise(locale).models.financeira;
  return buildMetadata({ title: page.eyebrow, description: page.description, locale, path: "/franquia/financeira" });
}

export default async function FranquiaFinanceiraPage({ params }: PageProps<"/[locale]/franquia/financeira">) {
  const locale = resolveLocale((await params).locale);
  setRequestLocale(locale);
  return <FranchiseModelPage locale={locale} model="financeira" />;
}
