import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

// Hospedagem estática (Hostinger Single: Apache/LiteSpeed, sem Node). O build
// gera out/ e scripts/generate-htaccess.mjs escreve out/.htaccess com as rotas
// de idioma que antes ficavam no proxy do next-intl. Restrições em CLAUDE.md.
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  // Sem servidor de otimização: o loader escolhe a versão por largura já gerada
  // em public/ (nomes "-1600.webp"; manifesto em lib/image-variants.json).
  images: { loader: "custom", loaderFile: "./lib/image-loader.ts" },
  // app/global-not-found.tsx: 404 da marca para qualquer URL inexistente.
  experimental: { globalNotFound: true },
};

export default withNextIntl(nextConfig);
