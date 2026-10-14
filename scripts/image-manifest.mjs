// Gera lib/image-variants.json: para cada imagem de public/media com versões
// por largura no nome ("tela-mac-3-1000.webp", "-1600", …), a lista de larguras.
// O loader do next/image (lib/image-loader.ts) usa a lista para servir a menor
// versão que cobre o tamanho pedido — o export estático não redimensiona sozinho.
// Roda no build; para imagens novas em dev: node scripts/image-manifest.mjs

import { readdirSync, statSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";

const publicDir = "public";
const groups = {};

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path);
    else {
      const match = name.match(/^(.*)-(\d+)(\.(?:webp|png|jpe?g|avif))$/i);
      if (!match) continue;
      const key = `/${relative(publicDir, join(dir, match[1])).replaceAll("\\", "/")}${match[3]}`;
      (groups[key] ??= []).push(Number(match[2]));
    }
  }
}

walk(join(publicDir, "media"));
const manifest = Object.fromEntries(
  Object.entries(groups)
    .filter(([, widths]) => widths.length > 1)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, widths]) => [key, widths.sort((a, b) => a - b)]),
);
writeFileSync("lib/image-variants.json", `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`lib/image-variants.json: ${Object.keys(manifest).length} imagens com várias larguras.`);
