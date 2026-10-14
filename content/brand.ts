// Dados da marca que não mudam com o idioma.

/**
 * Domínio oficial (canonical, sitemap, Open Graph, JSON-LD). Vem de
 * NEXT_PUBLIC_SITE_URL no build, para trocar de domínio sem mexer no código.
 */
const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://vispecapital.com").replace(/\/+$/, "");

export const brand = {
  name: "Vispe Capital",
  url: siteUrl,
  social: {
    instagram: "https://www.instagram.com/vispecapital",
    facebook: "https://www.facebook.com/vispecapital/",
    linkedin: "https://www.linkedin.com/company/vispe-capital/",
    // Link do programa sem os parâmetros de rastreio do compartilhamento.
    spotify: "https://open.spotify.com/show/09f6Lx4ckx7sltGudSAu92",
    youtube: "https://www.youtube.com/@vispecapital",
    // TODO(content): número oficial. Enquanto for undefined, não aparece.
    whatsapp: undefined as string | undefined,
  },
} as const;
