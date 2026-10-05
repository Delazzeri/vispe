import Image from "next/image";
import { Reveal } from "@/components/motion/reveal";
import { site } from "@/content/site";

export function TrustBar({ id }: { id?: string }) {
  return (
    <section id={id} aria-label="Resultados da Vispe Capital" className="bg-bg pb-10 pt-6 md:pb-12 md:pt-8">
      <ul className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-x-10 gap-y-6 px-6 md:gap-x-16">
        {site.awards.map((award, index) => (
          <li key={award.src}>
            <Reveal delay={index * 0.06}>
              <Image
                src={award.src}
                alt={award.alt}
                width={award.width}
                height={award.height}
                sizes="(min-width: 768px) 108px, 84px"
                className="h-auto w-21 md:w-27"
              />
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
