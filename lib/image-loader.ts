import variants from "./image-variants.json";

// Loader do next/image no export estático (sem servidor de otimização): para
// imagens com versões por largura no nome (ver scripts/image-manifest.mjs),
// devolve a menor versão que cobre a largura pedida; as demais (e URLs externas,
// como as capas do Supabase Storage) passam como estão.

const table: Record<string, number[]> = variants;

export default function imageLoader({ src, width }: { src: string; width: number }): string {
  const match = src.match(/^(\/.*)-(\d+)(\.[a-z0-9]+)$/i);
  if (!match) return src;
  const [, base, , extension] = match;
  const widths = table[`${base}${extension}`];
  if (!widths) return src;
  const best = widths.find((candidate) => candidate >= width) ?? widths[widths.length - 1];
  return `${base}-${best}${extension}`;
}
