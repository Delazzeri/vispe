import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/sections/hero";
import { TrustBar } from "@/components/sections/trust-bar";
import { FeatureChips } from "@/components/sections/feature-chips";
import { CategoryBlocks } from "@/components/sections/category-blocks";
import { Showcase } from "@/components/sections/showcase";
import { Testimonials } from "@/components/sections/testimonials";
import { Fin } from "@/components/sections/fin";
import { ImageCarousel } from "@/components/sections/image-carousel";
import { ServicePillars } from "@/components/sections/service-pillars";
import { Blog } from "@/components/sections/blog";
import { FAQ } from "@/components/sections/faq";
import { LeadSection } from "@/components/sections/lead-section";
import { localizeArticle } from "@/lib/blog/localize";
import { listArticles } from "@/lib/blog/source";
import { listEpisodes } from "@/lib/episodes/youtube";
import { resolveLocale } from "@/i18n/routing";

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <Hero id="hero" />
      <TrustBar />
      <FeatureChips id="solucoes" />
      <CategoryBlocks id="servicos" />
      <Showcase id="como-trabalhamos" />
      <Testimonials id="depoimentos" />
      <Fin id="fin" />
      <ImageCarousel episodes={await listEpisodes()} />
      <ServicePillars id="equity" />
      <Blog id="blog" posts={(await listArticles()).map((article) => localizeArticle(article, resolveLocale(locale)))} />
      <FAQ id="faq" />
      {/* Destino de todos os CTAs de diagnóstico (#diagnostico). */}
      <LeadSection />
    </>
  );
}
