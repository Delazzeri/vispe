// Material gratuito no formato que as páginas usam, venha ele do Supabase
// (tabela materials) ou da reserva local (content/materials-legacy.ts).

export type MaterialImage = {
  src: string;
  alt: string;
  /** Dimensões conhecidas (imagens locais); as do Storage não têm. */
  width?: number;
  height?: number;
};

export type MaterialFaqItem = { question: string; answer: string };

/** Versão em inglês do material (coluna materials.en), preenchida no admin. */
export type MaterialTranslation = {
  type?: string;
  title: string;
  tagline: string;
  headline?: string;
  descriptionMd: string;
  metaTitle?: string;
  metaDescription?: string;
  coverAlt?: string;
  faq?: readonly MaterialFaqItem[];
};

export type MaterialItem = {
  slug: string;
  /** Nome do formato exibido no card e no topo da página (E-book, Planilha…). */
  type: string;
  /** Formato (material_formats.slug): chave do filtro do catálogo. */
  format?: string;
  /** Nome do formato em inglês (site em /en). */
  typeEn?: string;
  /** Ordem do formato no filtro (material_formats.sort_order). */
  formatOrder?: number;
  title: string;
  /** Resumo curto: card do catálogo e abertura da página. */
  tagline: string;
  /** Título da página (h1); sem ele, usa `title`. */
  headline?: string;
  /** Descrição em Markdown (mesmo formato dos artigos do blog). */
  descriptionMd: string;
  /** Capa do catálogo (arte da Vispe com título, proporção 842×595); sem ela, degradê da marca. */
  cover?: MaterialImage;
  /** Imagem de destaque da página (mockup); sem ela, usa a capa. */
  image?: MaterialImage;
  faq?: readonly MaterialFaqItem[];
  seoTitle?: string;
  seoDescription?: string;
  /** Tradução para o inglês; sem ela, /en mostra o português com aviso. */
  en?: MaterialTranslation;
};
