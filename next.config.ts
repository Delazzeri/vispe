import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  experimental: {
    // Formulário "Trabalhe conosco" envia currículo em PDF de até 4 MB.
    // (A Vercel aceita até 4,5 MB por requisição — não subir além disso.)
    serverActions: { bodySizeLimit: "4.4mb" },
  },
};

export default withNextIntl(nextConfig);
