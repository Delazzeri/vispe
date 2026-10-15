import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { ArticleView } from "@/components/blog/article-view";
import { brand, getSite } from "@/content/site";
import { localizePath } from "@/i18n/href";
import { locales, resolveLocale } from "@/i18n/routing";
import { markdownToText } from "@/lib/blog/markdown";
import { localizeArticle } from "@/lib/blog/localize";
import { getArticle, listArticles } from "@/lib/blog/source";
import { articleJsonLd, breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

type PageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

// Pré-renderiza os artigos publicados até o build. Os publicados depois abrem
// pela página única /blog/post/ (o .htaccess manda para ela quando não há HTML).
export const dynamicParams = false;

export async function generateStaticParams() {
  const articles = await listArticles();
  return locales.flatMap((locale) => articles.map((article) => ({ locale, slug: article.slug })));
}

export async function generateMetadata({ params }: PageProps) {
  const { locale: raw, slug } = await params;
  const locale = resolveLocale(raw);
  const found = await getArticle(slug);
  if (!found) return {};
  const article = localizeArticle(found, locale);
  return buildMetadata({
    title: article.seoTitle ?? article.title,
    description: article.seoDescription ?? article.description,
    locale,
    // Sem tradução, o canonical aponta para a versão pt-BR (a /en mostra o português).
    contentLocale: found.en ? undefined : "pt-BR",
    path: `/blog/${article.slug}`,
    type: "article",
    article: {
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt ?? article.publishedAt,
      authors: article.author ? [article.author] : [brand.name],
    },
    image: article.cover
      ? { url: article.cover.src, alt: article.cover.alt }
      : { url: `/blog/${article.slug}/og.png`, alt: article.title },
  });
}

export default async function BlogPostPage({ params }: PageProps) {
  const { locale: requested, slug } = await params;
  const locale = resolveLocale(requested);
  setRequestLocale(locale);
  const found = await getArticle(slug);
  if (!found) notFound();
  const article = localizeArticle(found, locale);
  const { ui } = getSite(locale);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd(article, article.contentLocale)) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: ui.home, path: localizePath("/", locale) },
              { name: getSite(locale).blog.title, path: localizePath("/blog", locale) },
              { name: article.title, path: localizePath(`/blog/${article.slug}`, article.contentLocale) },
            ]),
          ),
        }}
      />
      {article.faq && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: article.faq.map((item) => ({
                "@type": "Question",
                name: item.question,
                acceptedAnswer: { "@type": "Answer", text: markdownToText(item.answer) },
              })),
            }),
          }}
        />
      )}
      <ArticleView article={article} locale={locale} />
    </>
  );
}
