// Gera supabase/migrations/0007_seed_materials.sql com os materiais de
// content/materials-legacy.ts no formato do banco (descrição em Markdown, a
// tabela "Como usar" vira lista). Uso: pnpm materials:seed
// "on conflict do nothing": rodar de novo não sobrescreve edições do admin.
// Os arquivos (PDF/planilha) não entram: são enviados pelo admin.

import { writeFileSync } from "node:fs";
import { legacyMaterials } from "../content/materials-legacy.ts";
import { legacyToItem } from "../lib/materials/legacy.ts";

const tag = "$vispe$";
const text = (value) => {
  if (value === undefined || value === null || value === "") return "null";
  const s = String(value);
  if (s.includes(tag)) throw new Error(`O texto contém ${tag}: troque a tag de dollar-quoting.`);
  return `${tag}${s}${tag}`;
};

const rows = legacyMaterials.map((legacy, index) => {
  const item = legacyToItem(legacy);
  const faq = item.faq ? `${text(JSON.stringify(item.faq))}::jsonb` : "null";
  return `(
  ${text(item.slug)},
  ${text(item.type)},
  ${text(item.title)},
  ${text(item.tagline)},
  ${text(item.headline)},
  ${text(item.descriptionMd)},
  ${text(item.cover?.src)},
  ${text(`Capa: ${item.title}`)},
  ${text(item.image?.src)},
  ${text(item.seoDescription)},
  ${faq},
  'published',
  ${(index + 1) * 10},
  now()
)`;
});

const sql = `-- Gerado por scripts/materials-to-sql.mjs a partir de content/materials-legacy.ts — não editar à mão.
-- Os ${rows.length} materiais que já estavam no site, publicados e sem arquivo
-- (o PDF/planilha de cada um é enviado pelo admin).

insert into public.materials
  (slug, type, title, tagline, headline, description_md, cover_image_url, cover_image_alt,
   image_url, meta_description, faq, status, sort_order, published_at)
values
${rows.join(",\n")}
on conflict (slug) do nothing;
`;

writeFileSync("supabase/migrations/0007_seed_materials.sql", sql);
console.log(`Seed gerado com ${rows.length} materiais.`);
