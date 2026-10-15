// Artigo do blog no formato que as páginas usam, venha ele do Supabase (tabela
// articles) ou do conteúdo local de reserva (content/blog.ts).

export type ArticleCover = {
  src: string;
  alt: string;
  /** Dimensões conhecidas (capas locais); imagens do Storage não têm. */
  width?: number;
  height?: number;
};

export type ArticleFaqItem = { question: string; answer: string };

/** Versão em inglês do artigo (coluna articles.en), preenchida no admin. */
export type ArticleTranslation = {
  title: string;
  excerpt: string;
  bodyMd: string;
  category?: string;
  metaTitle?: string;
  metaDescription?: string;
  coverAlt?: string;
  faq?: readonly ArticleFaqItem[];
};

export type Article = {
  slug: string;
  title: string;
  /** Título mais curto para a aba e o Google; padrão: `title`. */
  seoTitle?: string;
  description: string;
  /** Descrição para o Google; padrão: `description`. */
  seoDescription?: string;
  category: string;
  /** Serviços relacionados (nomes dos pilares em pt-BR): definem os filtros do blog. */
  tags: readonly string[];
  /** Data ISO (YYYY-MM-DD ou timestamp completo). */
  publishedAt: string;
  updatedAt?: string;
  /** Autor pessoa física; sem ele, assina a Vispe Capital. */
  author?: string;
  cover?: ArticleCover;
  /** Corpo em Markdown: links [texto](href), **negrito**, ## / ###, listas e > destaque. */
  bodyMd: string;
  faq?: readonly ArticleFaqItem[];
  /** Tradução para o inglês; sem ela, /en mostra o português com aviso. */
  en?: ArticleTranslation;
};
