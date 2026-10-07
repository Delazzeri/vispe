// Dados da marca que não mudam com o idioma.
export const brand = {
  name: "Vispe Capital",
  url: "https://www.vispe.com.br",
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
