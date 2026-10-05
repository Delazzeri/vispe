import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Formulário "Trabalhe conosco" envia currículo em PDF de até 4 MB.
    // (A Vercel aceita até 4,5 MB por requisição — não subir além disso.)
    serverActions: { bodySizeLimit: "4.4mb" },
  },
};

export default nextConfig;
