import Image from "next/image";
import { Reveal } from "@/components/motion/reveal";
import { useSite } from "@/content/site";

export function TrustBar({ id }: { id?: string }) {
  const site = useSite();

  return (
    <section id={id} aria-label={site.ui.resultsLabel} className="bg-bg pb-10 pt-6 md:pb-12 md:pt-8">
      <ul className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-x-10 gap-y-6 px-6 md:gap-x-16">
        {site.awards.map((award, index) => {
          const { src, width, height, alt } = award;
          return (
            <li key={src}>
              <Reveal delay={index * 0.06}>
                <Image
                  src={src}
                  alt={alt}
                  width={width}
                  height={height}
                  sizes="(min-width: 768px) 108px, 84px"
                  className="h-auto w-21 md:w-27"
                />
              </Reveal>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
