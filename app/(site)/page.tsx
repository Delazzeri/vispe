import { Hero } from "@/components/sections/hero";
import { FeatureChips } from "@/components/sections/feature-chips";

export default function HomePage() {
  return (
    <>
      <Hero id="hero" />
      <FeatureChips id="servicos" />
    </>
  );
}
