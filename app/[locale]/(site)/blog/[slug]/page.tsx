import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";
import { SocialLinks } from "@/components/ui/social-links";
import {
  blogPosts,
  formatPostDate,
  getPostBySlug,
  getReadingMinutes,
  inlineBoldPattern,
  inlineLinkPattern,
  plainText,
  type BlogBlock,
} from "@/content/blog";
import { brand, getSite } from "@/content/site";
import { format } from "@/content/types";
import { setRequestLocale } from "next-intl/server";
import { localizeHref } from "@/i18n/href";
import { resolveLocale, type Locale } from "@/i18n/routing";
import { cn } from "@/lib/cn";
import { articleJsonLd, breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

type PageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

const paragraphClass = "max-w-[65ch] text-base leading-relaxed text-fg";
const inlineLinkClass =
  "font-medium text-ink underline decoration-brand-dark/50 underline-offset-4 transition-colors hover:text-brand-dark hover:decoration-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm";

/** Trecho de texto com **negrito**. */
function withBold(text: string, key: string): ReactNode[] {
  return text.split(inlineBoldPattern).map((part, i) =>
    // split com grupo de captura: posições ímpares são os trechos em negrito.
    i % 2 === 1 ? (
      <strong key={`${key}-${i}`} className="font-semibold text-ink">
        {part}
      </strong>
    ) : (
      part
    ),
  );
}

/**
 * Texto com links [texto](href) e **negrito**: links internos via next/link
 * (no idioma da página), externos em nova aba.
 */
function RichText({ text, locale }: { text: string; locale: Locale }) {
  const parts: ReactNode[] = [];
  let last = 0;
  for (const match of text.matchAll(inlineLinkPattern)) {
    const [whole, label, href] = match;
    const start = match.index ?? 0;
    if (start > last) parts.push(...withBold(text.slice(last, start), `t${last}`));
    const external = /^https?:\/\//.test(href);
    parts.push(
      external ? (
        <a key={start} href={href} target="_blank" rel="noopener" className={inlineLinkClass}>
          {label}
        </a>
      ) : (
        <Link key={start} href={localizeHref(href, locale)} className={inlineLinkClass}>
          {label}
        </Link>
      ),
    );
    last = start + whole.length;
  }
  if (last < text.length) parts.push(...withBold(text.slice(last), `t${last}`));
  return <>{parts}</>;
}

/** Bloco do corpo: parágrafo, frase em destaque ou lista com rótulos em negrito. */
function Block({ block, locale }: { block: BlogBlock; locale: Locale }) {
  if (typeof block === "string") {
    return (
      <p className={paragraphClass}>
        <RichText text={block} locale={locale} />
      </p>
    );
  }
  if (block.kind === "highlight") {
    return (
      <blockquote className="max-w-[65ch] border-l-4 border-brand pl-5 text-lg font-semibold leading-relaxed text-ink">
        <RichText text={block.text} locale={locale} />
      </blockquote>
    );
  }
  const List = block.ordered ? "ol" : "ul";
  return (
    <List
      className={cn(
        "max-w-[65ch] space-y-2 pl-5 text-base leading-relaxed text-fg marker:text-brand-dark",
        block.ordered ? "list-decimal marker:font-semibold" : "list-disc",
      )}
    >
      {block.items.map((item) => (
        <li key={item.text}>
          {item.label && <strong className="font-semibold text-ink">{item.label}</strong>}{" "}
          <RichText text={item.text} locale={locale} />
        </li>
      ))}
    </List>
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
                acceptedAnswer: { "@type": "Answer", text: plainText(item.answer) },
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
                  <Block key={i} block={block} locale={locale} />
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
                  <p className={cn(paragraphClass, "mt-2")}>
                    <RichText text={item.answer} locale={locale} />
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Fim de todo artigo: redes da Vispe (links externos). */}
      <aside
        lang={locale}
        aria-labelledby="post-follow-heading"
        className="mt-16 rounded-3xl bg-surface p-8 shadow-[0_1px_2px_rgba(38,38,38,0.04),0_4px_12px_-4px_rgba(38,38,38,0.1)]"
      >
        <h2 id="post-follow-heading" className="text-xl font-bold tracking-tight text-ink">
          {ui.followTitle}
        </h2>
        <p className="mt-2 max-w-[65ch] text-sm leading-relaxed text-fg-muted">{ui.followText}</p>
        <SocialLinks className="mt-5 gap-4" />
      </aside>
    </article>
  );
}
