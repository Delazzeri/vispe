import { Reveal } from "@/components/motion/reveal";
import { VideoPlaceholder } from "@/components/ui/video-placeholder";
import { site } from "@/content/site";

export function Showcase({ id }: { id?: string }) {
  const { title, description, video } = site.showcase;

  return (
    <section id={id} aria-labelledby="showcase-heading" className="bg-bg py-24 md:py-32">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <Reveal>
          <h2
            id="showcase-heading"
            className="text-balance text-3xl font-bold tracking-tight text-ink md:text-[48px] md:leading-[48px]"
            style={{ letterSpacing: "-0.05em" }}
          >
            {title}
          </h2>
          <p className="mt-5 text-balance text-lg text-fg-muted">{description}</p>
        </Reveal>
      </div>

      <Reveal delay={0.1} className="mx-auto mt-14 max-w-[1104px] px-6">
        <VideoPlaceholder title={video.title} />
      </Reveal>
    </section>
  );
}
