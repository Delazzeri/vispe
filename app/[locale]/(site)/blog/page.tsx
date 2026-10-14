import { setRequestLocale } from "next-intl/server";
import { BlogList } from "@/components/blog/blog-list";
import { getSite } from "@/content/site";
import { localizePath } from "@/i18n/href";
import { resolveLocale } from "@/i18n/routing";
import { listArticles } from "@/lib/blog/source";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps) {
  const locale = resolveLocale((await params).locale);
  const { blog } = getSite(locale);
  return buildMetadata({ title: blog.title, description: blog.subtitle, locale, path: "/blog" });
}

/** Todos os artigos publicados (pré-renderizados no build e atualizados no navegador). */
export default async function BlogIndexPage({ params }: PageProps) {
  const locale = resolveLocale((await params).locale);
  setRequestLocale(locale);
  const { blog, ui } = getSite(locale);

  return (
    <section aria-labelledby="blog-index-heading" className="mx-auto max-w-6xl px-6 pt-32 pb-24 md:pt-40 md:pb-32">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: ui.home, path: localizePath("/", locale) },
              { name: blog.title, path: localizePath("/blog", locale) },
            ]),
          ),
        }}
      />
      <div className="mx-auto max-w-3xl text-center">
        <h1
          id="blog-index-heading"
          className="text-balance text-4xl font-bold tracking-tight text-ink md:text-6xl"
          style={{ letterSpacing: "-0.05em" }}
        >
          {blog.title}
        </h1>
        <p className="mt-6 text-balance text-base leading-7 text-fg-muted md:text-lg">{blog.subtitle}</p>
      </div>
      <div className="mt-14">
        <BlogList initial={await listArticles()} emptyLabel={ui.blogEmpty} />
      </div>
    </section>
  );
}
