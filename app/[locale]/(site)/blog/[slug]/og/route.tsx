import { blogPosts, getPostBySlug } from "@/content/blog";
import { getSite } from "@/content/site";
import { renderOgImage } from "@/lib/og-image";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

// Imagem OG do post em URL estável (/blog/<slug>/og), usada na metadata e no JSON-LD.
export async function GET(_request: Request, { params }: RouteContext) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  return renderOgImage({
    title: post?.title ?? getSite("pt-BR").blog.title,
    eyebrow: post?.category ?? "Blog",
  });
}
