export type BlogSection = {
  heading: string;
  paragraphs: readonly string[];
};

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  category: string;
  /** ISO date (YYYY-MM-DD). */
  publishedAt: string;
  /** ISO date da última atualização relevante; omitir se nunca foi editado. */
  updatedAt?: string;
  /** Autor pessoa física; omitir para assinar como a Vispe Capital. */
  author?: string;
  /**
   * Capa do post em /public/media/blog/ (1200×630 recomendado). Sem capa, o
   * card usa um degradê e o OG usa a imagem gerada em opengraph-image.tsx.
   */
  cover?: { src: string; alt: string; width: number; height: number };
  sections: readonly BlogSection[];
};

// TODO(content): posts provisórios, escritos só para montar a estrutura do
// blog — substituir por artigos reais (e datas reais) revisados pela Vispe.
export const blogPosts: readonly BlogPost[] = [
  {
    slug: "fluxo-de-caixa-o-que-acompanhar",
    title: "Fluxo de caixa: o que acompanhar toda semana",
    description:
      "Os indicadores mínimos para enxergar a saúde do caixa da sua empresa antes que um problema vire crise.",
    category: "Gestão financeira",
    publishedAt: "2026-10-02",
    sections: [
      {
        heading: "Por que olhar o caixa com frequência",
        paragraphs: [
          "Faturamento alto não garante caixa saudável. O prazo entre pagar e receber é o que define se a empresa respira ou sufoca.",
          "Acompanhar o fluxo de caixa toda semana permite antecipar apertos e decidir com calma, em vez de reagir no limite.",
        ],
      },
      {
        heading: "O básico que não pode faltar",
        paragraphs: [
          "Saldo projetado para as próximas semanas, contas a pagar e a receber por vencimento e inadimplência são o ponto de partida.",
          "Com esses três números atualizados, já é possível priorizar pagamentos e cobrar com critério.",
        ],
      },
    ],
  },
  {
    slug: "o-que-e-valuation-e-quando-fazer",
    title: "O que é valuation e quando fazer o da sua empresa",
    description:
      "Entenda para que serve a avaliação do valor de uma empresa e em quais momentos ela faz diferença.",
    category: "Equity",
    publishedAt: "2026-10-02",
    sections: [
      {
        heading: "Valuation em poucas palavras",
        paragraphs: [
          "É a avaliação do valor de uma empresa com base em resultados, perspectivas e riscos. Ela transforma a percepção do dono em um número defensável.",
        ],
      },
      {
        heading: "Quando faz sentido",
        paragraphs: [
          "Antes de vender o negócio, buscar sócios ou investidores, planejar a sucessão ou simplesmente entender quanto a empresa vale hoje e o que move esse valor.",
        ],
      },
    ],
  },
  {
    slug: "planejamento-tributario-sem-complicacao",
    title: "Planejamento tributário sem complicação",
    description:
      "Como rever o enquadramento fiscal da empresa pode liberar margem sem sair da lei.",
    category: "Tributário",
    publishedAt: "2026-10-02",
    sections: [
      {
        heading: "Imposto também é custo a ser planejado",
        paragraphs: [
          "Muitas empresas pagam mais do que precisam por manter o mesmo enquadramento durante anos, mesmo depois de mudar de tamanho ou de operação.",
        ],
      },
      {
        heading: "Por onde começar",
        paragraphs: [
          "Reúna o histórico de faturamento, a folha e a estrutura de custos. Com esses dados, compare os regimes possíveis e escolha o mais eficiente para o momento.",
        ],
      },
    ],
  },
  {
    slug: "bpo-financeiro-vale-a-pena",
    title: "BPO financeiro: vale a pena terceirizar a rotina?",
    description:
      "Quando faz sentido entregar contas a pagar, a receber e conciliação a um time especializado.",
    category: "BPO",
    publishedAt: "2026-10-02",
    sections: [
      {
        heading: "O que o BPO assume",
        paragraphs: [
          "Contas a pagar e a receber, conciliação bancária e fluxo de caixa: a rotina que consome tempo do dono e costuma ficar para depois.",
        ],
      },
      {
        heading: "Sinais de que chegou a hora",
        paragraphs: [
          "Decisões tomadas sem números confiáveis, atrasos frequentes em fechamentos e um dono preso a tarefas operacionais são os sinais mais comuns.",
        ],
      },
    ],
  },
  {
    slug: "due-diligence-o-que-olhar-antes-de-comprar",
    title: "Due diligence: o que olhar antes de comprar uma empresa",
    description:
      "Os pontos financeiros, contratuais e de risco que merecem atenção antes de fechar uma aquisição.",
    category: "M&A",
    publishedAt: "2026-10-02",
    sections: [
      {
        heading: "Por que investigar antes de assinar",
        paragraphs: [
          "Uma aquisição leva para dentro da sua empresa também os problemas da outra. A due diligence existe para encontrá-los antes do fechamento.",
        ],
      },
      {
        heading: "Onde concentrar a análise",
        paragraphs: [
          "Qualidade dos resultados, dívidas e passivos, contratos relevantes e dependência de poucos clientes ou pessoas-chave são os primeiros pontos de atenção.",
        ],
      },
    ],
  },
  {
    slug: "captacao-de-recursos-como-se-preparar",
    title: "Captação de recursos: como se preparar",
    description:
      "O que organizar antes de procurar investidores ou instituições financeiras.",
    category: "Crescimento",
    publishedAt: "2026-10-02",
    sections: [
      {
        heading: "Comece pelos números",
        paragraphs: [
          "Quem financia quer entender o histórico, a geração de caixa e para onde o dinheiro vai. Demonstrativos organizados encurtam a conversa.",
        ],
      },
      {
        heading: "Escolha a fonte certa",
        paragraphs: [
          "Dívida, sócio investidor e linhas de fomento servem a momentos diferentes. A melhor opção depende do estágio da empresa e do uso do recurso.",
        ],
      },
    ],
  },
] as const;

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}

export function getReadingMinutes(post: BlogPost): number {
  const words = post.sections
    .flatMap((section) => [section.heading, ...section.paragraphs])
    .join(" ")
    .split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

/** Data no formato do idioma da interface (o artigo em si é sempre pt-BR). */
export function formatPostDate(isoDate: string, locale: string = "pt-BR"): string {
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(isoDate));
}
