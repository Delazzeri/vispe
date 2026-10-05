// Dados da marca que não mudam com o idioma.
export const brand = {
  name: "Vispe Capital",
  url: "https://www.vispe.com.br",
  social: {
    // TODO(content): preencher as URLs oficiais. Enquanto estiverem
    // undefined, o footer mostra o ícone sem link.
    instagram: undefined as string | undefined,
    facebook: undefined as string | undefined,
    linkedin: undefined as string | undefined,
    spotify: undefined as string | undefined,
    youtube: undefined as string | undefined,
    whatsapp: undefined as string | undefined,
  },
} as const;
