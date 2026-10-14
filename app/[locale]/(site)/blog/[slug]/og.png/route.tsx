import { getSite } from "@/content/site";
import { locales } from "@/i18n/routing";
import { getArticle, listArticles } from "@/lib/blog/source";
import { renderOgImage } from "@/lib/og-image";

type RouteContext = {
  params: Promise<{ locale: string; slug: string }>;
};

export const dynamic = "force-static";
export const dynamicParams = false;

export async function generateStaticParams() {
  const articles = await listArticles();
  return locales.flatMap((locale) => articles.map((article) => ({ locale, slug: article.slug })));
}

// Imagem OG do post em URL estável (/blog/<slug>/og.png), usada quando o post não tem capa.
export async function GET(_request: Request, { params }: RouteContext) {
  const { slug } = await params;
  const article = await getArticle(slug);
  return renderOgImage({
    title: article?.title ?? getSite("pt-BR").blog.title,
    eyebrow: article?.category ?? "Blog",
  });
}
