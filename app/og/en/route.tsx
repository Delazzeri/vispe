import { brand, getSite } from "@/content/site";
import { renderOgImage } from "@/lib/og-image";

export const dynamic = "force-static";

// Imagem OG padrão da versão em inglês (/og/en), usada por buildMetadata.
export function GET() {
  return renderOgImage({ title: getSite("en-US").hero.h1, eyebrow: brand.name, locale: "en-US" });
}
