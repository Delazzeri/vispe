import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { blogPosts, formatPostDate, getPostBySlug, getReadingMinutes, type BlogBlock } from "@/content/blog";
import { brand, getSite } from "@/content/site";
import { format } from "@/content/types";
import { setRequestLocale } from "next-intl/server";
import { localizeHref } from "@/i18n/href";
import { resolveLocale } from "@/i18n/routing";
import { cn } from "@/lib/cn";
import { articleJsonLd, breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

type PageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

const paragraphClass = "max-w-[65ch] text-base leading-relaxed text-fg";

/** Bloco do corpo: parágrafo, frase em destaque ou lista com rótulos em negrito. */
function Block({ block }: { block: BlogBlock }) {
  if (typeof block === "string") return <p className={paragraphClass}>{block}</p>;
  if (block.kind === "highlight") {
    return (
      <blockquote className="max-w-[65ch] border-l-4 border-brand pl-5 text-lg font-semibold leading-relaxed text-ink">
        {block.text}
      </blockquote>
    );
  }
  return (
    <ul className="max-w-[65ch] list-disc space-y-2 pl-5 text-base leading-relaxed text-fg marker:text-brand-dark">
      {block.items.map((item) => (
        <li key={item.text}>
          {item.label && <strong className="font-semibold text-ink">{item.label}</strong>} {item.text}
        </li>
      ))}
    </ul>
  );
}

export async function generateMetadata({ params }: PageProps) {
  const { locale, slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return buildMetadata({
    title: post.seoTitle ?? post.title,
    description: post.description,
    locale: resolveLocale(locale),
    // Artigos existem só em português: o canonical aponta para a versão pt-BR.
    contentLocale: "pt-BR",
    path: `/blog/${post.slug}`,
    type: "article",
    article: {
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt ?? post.publishedAt,
      authors: post.author ? [post.author] : [brand.name],
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
  const { ui } = getSite(locale);

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
              { name: ui.home, path: localizeHref("/", locale) },
              { name: post.title, path: `/blog/${post.slug}` },
            ]),
          ),
        }}
      />
      {post.faq && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: post.faq.items.map((item) => ({
                "@type": "Question",
                name: item.question,
                acceptedAnswer: { "@type": "Answer", text: item.answer },
              })),
            }),
          }}
        />
      )}

      <Link
        href={localizeHref("/#blog", locale)}
        lang={locale}
        className="inline-flex items-center gap-2 rounded-sm text-sm font-medium text-fg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        {ui.backToBlog}
      </Link>

      {ui.portugueseOnly && (
        <p lang={locale} className="mt-6 rounded-xl bg-accent-soft/40 px-4 py-3 text-sm text-fg">
          {ui.portugueseOnly}
        </p>
      )}

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
        <p lang={locale} className="mt-4 text-sm text-fg-muted">
          {post.author && (
            <>
              <span className="font-medium text-fg">{format(ui.byAuthor, { name: post.author })}</span> ·{" "}
            </>
          )}
          <time dateTime={post.publishedAt}>{formatPostDate(post.publishedAt, locale)}</time> ·{" "}
          {format(ui.readingTime, { minutes: getReadingMinutes(post) })}
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
        {post.sections.map((section, index) => {
          const Heading = section.level === 3 ? "h3" : "h2";
          return (
            <section key={section.heading ?? index} className={cn(section.level === 3 && "-mt-4")}>
              {section.heading && (
                <Heading
                  className={cn(
                    "font-bold tracking-tight text-ink",
                    section.level === 3 ? "text-xl" : "text-2xl",
                  )}
                >
                  {section.heading}
                </Heading>
              )}
              <div className={cn("space-y-4", section.heading && "mt-4")}>
                {section.paragraphs.map((block, i) => (
                  <Block key={i} block={block} />
                ))}
              </div>
            </section>
          );
        })}

        {post.faq && (
          <section aria-labelledby="post-faq-heading">
            <h2 id="post-faq-heading" className="text-2xl font-bold tracking-tight text-ink">
              {post.faq.title}
            </h2>
            <div className="mt-6 space-y-6">
              {post.faq.items.map((item) => (
                <div key={item.question}>
                  <h3 className="text-lg font-semibold text-ink">{item.question}</h3>
                  <p className={cn(paragraphClass, "mt-2")}>{item.answer}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  );
}
