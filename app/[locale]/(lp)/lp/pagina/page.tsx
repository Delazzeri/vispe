import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { LpLoader } from "@/components/lp/lp-loader";
import { brand } from "@/content/brand";
import { resolveLocale } from "@/i18n/routing";

type PageProps = { params: Promise<{ locale: string }> };

// Sem canonical aqui: esta página é servida em /lp/<slug>/ (LPs publicadas
// depois do build) e o canonical certo é colocado pelo LpLoader.
export async function generateMetadata(): Promise<Metadata> {
  // alternates: null zera o canonical da home herdado do layout.
  return { title: brand.name, alternates: null };
}

export default async function LandingFallbackPage({ params }: PageProps) {
  const locale = resolveLocale((await params).locale);
  setRequestLocale(locale);
  return <LpLoader locale={locale} />;
}
