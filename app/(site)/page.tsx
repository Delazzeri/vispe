import { Hero } from "@/components/sections/hero";
import { TrustBar } from "@/components/sections/trust-bar";
import { FeatureChips } from "@/components/sections/feature-chips";
import { CategoryBlocks } from "@/components/sections/category-blocks";
import { Showcase } from "@/components/sections/showcase";
import { Testimonials } from "@/components/sections/testimonials";
import { Fin } from "@/components/sections/fin";
import { ServicesCarousel } from "@/components/sections/services-carousel";
import { LogoWall } from "@/components/sections/logo-wall";
import { FAQ } from "@/components/sections/faq";

export default function HomePage() {
  return (
    <>
      <Hero id="hero" />
      <TrustBar />
      <FeatureChips id="solucoes" />
      <CategoryBlocks id="servicos" />
      <Showcase id="como-trabalhamos" />
      <Testimonials id="depoimentos" />
      <Fin id="fin" />
      <ServicesCarousel />
      <LogoWall id="clientes" />
      <FAQ id="faq" />
    </>
  );
}
