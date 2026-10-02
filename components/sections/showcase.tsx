import { Reveal } from "@/components/motion/reveal";
import { VideoPlaceholder } from "@/components/ui/video-placeholder";
import { site } from "@/content/site";

export function Showcase({ id }: { id?: string }) {
  const { eyebrow, title, description, video } = site.showcase;

  return (
    <section id={id} aria-labelledby="showcase-heading" className="bg-bg py-24 md:py-32">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <Reveal>
          <p className="text-sm font-bold text-brand-dark">{eyebrow}</p>
          <h2
            id="showcase-heading"
            className="mt-3 text-balance text-3xl font-bold tracking-tight text-fg md:text-5xl"
            style={{ letterSpacing: "-0.02em" }}
          >
            {title}
          </h2>
          <p className="mt-5 text-balance text-lg text-fg-muted">{description}</p>
        </Reveal>
      </div>

      <Reveal delay={0.1} className="mx-auto mt-14 max-w-[960px] px-6">
        <VideoPlaceholder title={video.title} />
      </Reveal>
    </section>
  );
}
