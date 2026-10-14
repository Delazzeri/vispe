import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { ArticleLoader } from "@/components/blog/article-loader";
import { brand, getSite } from "@/content/site";
import { resolveLocale } from "@/i18n/routing";

type PageProps = { params: Promise<{ locale: string }> };

// Sem canonical aqui: esta página é servida em /blog/<slug>/ (posts publicados
// depois do build) e o canonical certo é colocado pelo ArticleLoader.
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = resolveLocale((await params).locale);
  // alternates: null zera o canonical da home herdado do layout.
  return { title: `${getSite(locale).blog.title} | ${brand.name}`, alternates: null };
}

export default async function BlogPostFallbackPage({ params }: PageProps) {
  const locale = resolveLocale((await params).locale);
  setRequestLocale(locale);
  return <ArticleLoader locale={locale} />;
}
