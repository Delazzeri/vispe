import { Hero } from "@/components/sections/hero";
import { FeatureChips } from "@/components/sections/feature-chips";
import { CategoryBlocks } from "@/components/sections/category-blocks";

export default function HomePage() {
  return (
    <>
      <Hero id="hero" />
      <FeatureChips id="solucoes" />
      <CategoryBlocks id="servicos" />
    </>
  );
}
