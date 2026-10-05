import Image from "next/image";
import { useLocale } from "next-intl";
import { Reveal } from "@/components/motion/reveal";
import { site } from "@/content/site";
import { defaultLocale, resolveLocale } from "@/i18n/routing";

export function TrustBar({ id }: { id?: string }) {
  const locale = resolveLocale(useLocale());
  // Selos em inglês ficam em award/en-US/ com o mesmo nome de arquivo.
  const dir = locale === defaultLocale ? "/media/award/" : `/media/award/${locale}/`;

  return (
    <section id={id} aria-label="Resultados da Vispe Capital" className="bg-bg pb-10 pt-6 md:pb-12 md:pt-8">
      <ul className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-x-10 gap-y-6 px-6 md:gap-x-16">
        {site.awards.map((award, index) => {
          const { width, height, alt } = award[locale];
          return (
            <li key={award.file}>
              <Reveal delay={index * 0.06}>
                <Image
                  src={`${dir}${award.file}`}
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
