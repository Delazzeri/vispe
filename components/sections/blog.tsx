import { Reveal } from "@/components/motion/reveal";
import { BlogCarousel } from "@/components/ui/blog-carousel";
import { blogPosts } from "@/content/blog";
import { useSite } from "@/content/site";

export function Blog({ id }: { id?: string }) {
  const site = useSite();
  const { title, subtitle } = site.blog;

  return (
    <section id={id} aria-labelledby="blog-heading" className="bg-bg py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <h2
              id="blog-heading"
              className="text-balance text-3xl font-bold tracking-tight text-ink md:text-[48px] md:leading-[48px]"
              style={{ letterSpacing: "-0.05em" }}
            >
              {title}
            </h2>
            <p className="mt-5 text-balance text-lg text-fg-muted">{subtitle}</p>
          </div>
        </Reveal>

        <div className="mt-14">
          <BlogCarousel posts={blogPosts} />
        </div>
      </div>
    </section>
  );
}
