import type { LegacyMaterial } from "@/content/materials-legacy";
import type { MaterialItem } from "./types";

// Converte os materiais de content/materials-legacy.ts para o formato do banco:
// abertura, "O que você vai encontrar" e "Como usar" viram a descrição em
// Markdown (a tabela de indicadores vira uma lista — o editor não tem tabelas).
// Usado como reserva no build e pelo scripts/materials-to-sql.mjs (seed).
// Só imports de tipo: o script roda este arquivo direto no Node.

export function legacyToMarkdown(material: LegacyMaterial): string {
  const parts: string[] = [];
  if (material.intro) parts.push(material.intro);
  if (material.features?.length) {
    parts.push(
      "## O que você vai encontrar",
      material.features.map((f) => `- **${f.title}**${f.text ? `: ${f.text}` : ""}`).join("\n"),
    );
  }
  if (material.usage) {
    const { columns, rows } = material.usage.table;
    parts.push(`## ${material.usage.title}`, ...material.usage.paragraphs);
    parts.push(
      rows
        .map((row) => {
          const details = row.slice(1).map((cell, i) => `${columns[i + 1]}: ${cell}`);
          return `- **${row[0]}**: ${details.join(" · ")}`;
        })
        .join("\n"),
    );
  }
  return parts.join("\n\n");
}

// Formato do conteúdo local → slug de material_formats (0009), para o filtro funcionar sem o banco.
const legacyFormats: Record<string, string> = { "E-book": "ebook", Planilha: "planilha", Checklist: "checklist", "Guia prático": "guia" };

export function legacyToItem(material: LegacyMaterial): MaterialItem {
  return {
    slug: material.slug,
    type: material.type,
    format: legacyFormats[material.type],
    title: material.title,
    tagline: material.tagline,
    headline: material.headline,
    descriptionMd: legacyToMarkdown(material),
    cover: { ...material.cover, alt: "" },
    image: material.mockup ? { ...material.mockup, alt: `${material.type}: ${material.title}` } : undefined,
    faq: material.faq,
    seoDescription: material.intro,
  };
}
