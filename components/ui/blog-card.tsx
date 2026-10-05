import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { formatPostDate, getReadingMinutes, type BlogPost } from "@/content/blog";

type BlogCardProps = {
  post: BlogPost;
};

export function BlogCard({ post }: BlogCardProps) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl bg-surface shadow-[0_1px_2px_rgba(38,38,38,0.04),0_4px_12px_-4px_rgba(38,38,38,0.1)]">
      {post.cover ? (
        <Image
          src={post.cover.src}
          alt={post.cover.alt}
          width={post.cover.width}
          height={post.cover.height}
          sizes="(max-width: 767px) 100vw, 33vw"
          className="aspect-video w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
        />
      ) : (
        // TODO(content): adicionar `cover` aos posts (content/blog.ts).
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
            className="after:absolute after:inset-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            {post.title}
          </Link>
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-fg-muted">{post.description}</p>
        <div className="mt-5 flex items-center justify-between text-xs text-fg-muted">
          <span>
            <time dateTime={post.publishedAt}>{formatPostDate(post.publishedAt)}</time> ·{" "}
            {getReadingMinutes(post)} min de leitura
          </span>
          <ArrowRight className="h-4 w-4 text-ink" aria-hidden />
        </div>
      </div>
    </article>
  );
}
