import Image from "next/image";
import { LocaleLink as Link } from "@/components/ui/locale-link";
import { ArrowRight } from "lucide-react";
import { useLocale } from "next-intl";
import { formatArticleDate, readingMinutes } from "@/lib/blog/markdown";
import type { Article } from "@/lib/blog/types";
import { useSite } from "@/content/site";
import { format } from "@/content/types";

type BlogCardProps = {
  /** Já no idioma da página (localizeArticle). */
  post: Article & { contentLocale?: string };
};

export function BlogCard({ post }: BlogCardProps) {
  const locale = useLocale();
  const { ui } = useSite();
  return (
    // Artigos existem só em português; a data e o tempo de leitura seguem a interface.
    <article lang={post.contentLocale ?? "pt-BR"} className="group relative flex h-full flex-col overflow-hidden rounded-3xl bg-surface shadow-[0_1px_2px_rgba(38,38,38,0.04),0_4px_12px_-4px_rgba(38,38,38,0.1)]">
      {post.cover ? (
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={post.cover.src}
            alt={post.cover.alt}
            fill
            sizes="(max-width: 767px) 100vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          />
        </div>
      ) : (
        // Sem capa no admin: degradê da marca.
        <div
          aria-hidden
          className="aspect-video bg-gradient-to-br from-accent-soft to-brand transition-transform duration-500 group-hover:scale-[1.02]"
        />
      )}
      <div className="flex flex-1 flex-col p-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-dark">
          {post.category}
        </p>
        <h3 className="mt-3 text-lg font-bold leading-snug text-ink">
          <Link
            href={`/blog/${post.slug}`}
            className="after:absolute after:inset-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark"
          >
            {post.title}
          </Link>
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-fg-muted">{post.description}</p>
        <div className="mt-5 flex items-center justify-between text-xs text-fg-muted">
          <span lang={locale}>
            <time dateTime={post.publishedAt}>{formatArticleDate(post.publishedAt, locale)}</time> ·{" "}
            {format(ui.readingTime, { minutes: readingMinutes(post) })}
          </span>
          <ArrowRight className="h-4 w-4 text-ink" aria-hidden />
        </div>
      </div>
    </article>
  );
}
