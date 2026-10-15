import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { LocaleLink as Link } from "@/components/ui/locale-link";
import { SocialLinks } from "@/components/ui/social-links";
import { getSite } from "@/content/site";
import { format } from "@/content/types";
import type { Locale } from "@/i18n/routing";
import { formatArticleDate, readingMinutes, renderInlineMarkdown, renderMarkdown } from "@/lib/blog/markdown";
import type { Article } from "@/lib/blog/types";
import type { Locale as ContentLocale } from "@/i18n/routing";

type ArticleViewProps = {
  /** Já no idioma da página (localizeArticle); `contentLocale` diz em que idioma o texto está. */
  article: Article & { contentLocale?: ContentLocale };
  locale: Locale;
  /** Na prévia do admin, sem o link de voltar nem o bloco de redes. */
  preview?: boolean;
};

/**
 * Corpo do artigo, igual nos três lugares em que aparece: página pré-renderizada
 * no build, página única lida no navegador (post publicado depois do build) e
 * prévia do admin. Os JSON-LD ficam com a página, não aqui.
 */
export function ArticleView({ article, locale, preview }: ArticleViewProps) {
  const { ui } = getSite(locale);

  return (
    <article lang={article.contentLocale ?? "pt-BR"} aria-labelledby="post-heading" className="mx-auto max-w-3xl px-6 py-24 md:py-32">
      {!preview && (
        <Link
          href="/blog"
          lang={locale}
          className="inline-flex items-center gap-2 rounded-sm text-sm font-medium text-fg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          {ui.backToBlog}
        </Link>
      )}

      {!preview && ui.portugueseOnly && (article.contentLocale ?? "pt-BR") !== locale && (
        <p lang={locale} className="mt-6 rounded-xl bg-accent-soft/40 px-4 py-3 text-sm text-fg">
          {ui.portugueseOnly}
        </p>
      )}

      <header className="mt-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-dark">{article.category}</p>
        <h1 id="post-heading" className="mt-3 text-balance text-4xl font-bold tracking-tight text-ink md:text-5xl">
          {article.title}
        </h1>
        <p className="mt-4 text-lg text-fg-muted">{article.description}</p>
        <p lang={locale} className="mt-4 text-sm text-fg-muted">
          {article.author && (
            <>
              <span className="font-medium text-fg">{format(ui.byAuthor, { name: article.author })}</span> ·{" "}
            </>
          )}
          <time dateTime={article.publishedAt}>{formatArticleDate(article.publishedAt, locale)}</time> ·{" "}
          {format(ui.readingTime, { minutes: readingMinutes(article) })}
        </p>
      </header>

      {article.cover && (
        <figure className="mt-10">
          <div className="relative aspect-video overflow-hidden rounded-3xl bg-surface">
            <Image
              src={article.cover.src}
              alt={article.cover.alt}
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              priority
              className="object-cover"
            />
          </div>
          <figcaption className="mt-3 text-sm text-fg-muted">{article.cover.alt}</figcaption>
        </figure>
      )}

      <div className="article-body mt-12" dangerouslySetInnerHTML={{ __html: renderMarkdown(article.bodyMd, locale) }} />

      {article.faq && article.faq.length > 0 && (
        <section aria-labelledby="post-faq-heading" className="mt-10">
          <h2 id="post-faq-heading" className="text-2xl font-bold tracking-tight text-ink">
            {ui.blogFaqTitle}
          </h2>
          <div className="mt-6 space-y-6">
            {article.faq.map((item) => (
              <div key={item.question}>
                <h3 className="text-lg font-semibold text-ink">{item.question}</h3>
                <p
                  className="article-body mt-2"
                  dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(item.answer, locale) }}
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Fim de todo artigo: redes da Vispe (links externos). */}
      {!preview && (
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
      )}
    </article>
  );
}
