import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { blogPosts, formatPostDate, getPostBySlug, getReadingMinutes } from "@/content/blog";
import { site } from "@/content/site";
import { setRequestLocale } from "next-intl/server";
import { localizeHref } from "@/i18n/href";
import { resolveLocale } from "@/i18n/routing";
import { articleJsonLd, breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

type PageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { locale, slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return buildMetadata({
    title: post.title,
    description: post.description,
    locale: resolveLocale(locale),
    // Artigos existem só em português: o canonical aponta para a versão pt-BR.
    contentLocale: "pt-BR",
    path: `/blog/${post.slug}`,
    type: "article",
    article: {
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt ?? post.publishedAt,
      authors: post.author ? [post.author] : [site.name],
    },
    image: post.cover
      ? { url: post.cover.src, alt: post.cover.alt }
      : { url: `/blog/${post.slug}/og`, alt: post.title },
  });
}

export default async function BlogPostPage({ params }: PageProps) {
  const { locale: requested, slug } = await params;
  const locale = resolveLocale(requested);
  setRequestLocale(locale);
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return (
    <article lang="pt-BR" aria-labelledby="post-heading" className="mx-auto max-w-3xl px-6 py-24 md:py-32">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd(post)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Início", path: "/" },
              { name: post.title, path: `/blog/${post.slug}` },
            ]),
          ),
        }}
      />

      <Link
        href={localizeHref("/#blog", locale)}
        className="inline-flex items-center gap-2 rounded-sm text-sm font-medium text-fg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Voltar ao blog
      </Link>

      <header className="mt-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-dark">
          {post.category}
        </p>
        <h1
          id="post-heading"
          className="mt-3 text-balance text-4xl font-bold tracking-tight text-ink md:text-5xl"
        >
          {post.title}
        </h1>
        <p className="mt-4 text-lg text-fg-muted">{post.description}</p>
        <p className="mt-4 text-sm text-fg-muted">
          <time dateTime={post.publishedAt}>{formatPostDate(post.publishedAt)}</time> ·{" "}
          {getReadingMinutes(post)} min de leitura
        </p>
      </header>

      {post.cover && (
        <figure className="mt-10">
          <Image
            src={post.cover.src}
            alt={post.cover.alt}
            width={post.cover.width}
            height={post.cover.height}
            sizes="(max-width: 768px) 100vw, 768px"
            priority
            className="w-full rounded-3xl"
          />
          <figcaption className="mt-3 text-sm text-fg-muted">{post.cover.alt}</figcaption>
        </figure>
      )}

      <div className="mt-12 space-y-10">
        {post.sections.map((section) => (
          <section key={section.heading}>
            <h2 className="text-2xl font-bold tracking-tight text-ink">{section.heading}</h2>
            <div className="mt-4 space-y-4">
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph} className="max-w-[65ch] text-base leading-relaxed text-fg">
                  {paragraph}
                </p>
              ))}
            </div>
          </section>
        ))}
      </div>
    </article>
  );
}
