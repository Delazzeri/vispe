import { site } from "@/content/site";
import { renderOgImage } from "@/lib/og-image";

export const dynamic = "force-static";

// Imagem OG padrão do site em URL estável (/og), usada por buildMetadata.
export function GET() {
  return renderOgImage({ title: site.hero.h1, eyebrow: site.name });
}
