import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { MaterialLoader } from "@/components/materials/material-loader";
import { brand } from "@/content/brand";
import { getMaterialsUi } from "@/content/materials";
import { resolveLocale } from "@/i18n/routing";

type PageProps = { params: Promise<{ locale: string }> };

// Sem canonical aqui: esta página é servida em /materiais/<slug>/ (materiais
// publicados depois do build) e o canonical certo é colocado pelo MaterialLoader.
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = resolveLocale((await params).locale);
  // alternates: null zera o canonical da home herdado do layout.
  return { title: `${getMaterialsUi(locale).hero.eyebrow} | ${brand.name}`, alternates: null };
}

export default async function MaterialFallbackPage({ params }: PageProps) {
  const locale = resolveLocale((await params).locale);
  setRequestLocale(locale);
  return <MaterialLoader locale={locale} />;
}
