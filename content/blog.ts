/**
 * Bloco do corpo de uma seção: parágrafo (texto simples), frase em destaque
 * ou lista (itens com rótulo opcional em negrito, ex.: "Sem valuation-alvo:").
 */
export type BlogBlock =
  | string
  | { kind: "highlight"; text: string }
  | { kind: "list"; items: readonly { label?: string; text: string }[] };

export type BlogSection = {
  /** Sem título: bloco de abertura logo abaixo do h1. */
  heading?: string;
  /** 3 = subtítulo (h3) dentro da seção h2 anterior. Padrão: 2. */
  level?: 2 | 3;
  paragraphs: readonly BlogBlock[];
};

export type BlogFaq = {
  /** Título da seção (o artigo é sempre em português). */
  title: string;
  items: readonly { question: string; answer: string }[];
};

export type BlogPost = {
  slug: string;
  title: string;
  /** Título mais curto para a aba e o Google (até ~60 caracteres); padrão: `title`. */
  seoTitle?: string;
  description: string;
  category: string;
  /**
   * Serviços relacionados, com os mesmos nomes dos pilares (servicePillars.includes
   * em pt-BR). Definem em quais filtros do blog (Organização, Margem, Crescimento) o
   * post aparece; pode estar em mais de um.
   */
  tags: readonly string[];
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
  /** Perguntas frequentes no fim do artigo (também viram JSON-LD FAQPage). */
  faq?: BlogFaq;
};

/** Texto puro de um bloco (tempo de leitura, JSON-LD). */
export function blockText(block: BlogBlock): string {
  if (typeof block === "string") return block;
  if (block.kind === "highlight") return block.text;
  return block.items.map((item) => (item.label ? `${item.label} ${item.text}` : item.text)).join(" ");
}

// Artigos reais primeiro. TODO(content): os posts depois deste ainda são
// provisórios (só para montar a estrutura) — substituir pelos artigos reais.
export const blogPosts: readonly BlogPost[] = [
  {
    // Mesmo slug da URL original (vispe.com.br/planejamento-estrategico/).
    slug: "planejamento-estrategico",
    title: "LTV: a visão de longo prazo que define quanto sua empresa vai valer",
    seoTitle: "LTV: planejamento estratégico para PMEs",
    description:
      "LTV não é meta bonita nem sonho solto. É a metodologia que define valuation, receita, time e propósito para sua empresa valer mais em 5 anos.",
    category: "Equity",
    tags: ["Valuation"],
    publishedAt: "2026-09-04",
    author: "Pablo Constantino",
    cover: {
      src: "/media/blog/planejamento-estrategico-v2-1600.webp",
      alt: "A visão de longo prazo que define quanto sua empresa vai valer: crescimento sustentável e visão estratégica",
      width: 1600,
      height: 750,
    },
    sections: [
      {
        // Abertura sem subtítulo: o h2 original repetia o título do artigo.
        paragraphs: [
          "LTV é a história objetiva de onde a sua empresa precisa estar em 5 anos para se tornar um ativo mais valioso, escalável e vendável. Não é uma meta bonita. Não é um sonho solto. Não é “queremos crescer”. É uma visão de longo prazo com quatro respostas obrigatórias: quanto a empresa vai valer, qual faturamento sustenta isso, que time torna ela independente do dono, e por que ela deve existir nesse tamanho. Sem essas quatro respostas, você não tem um LTV: tem um desejo.",
        ],
      },
      {
        heading: "Por que a maioria dos planos estratégicos não vale nada",
        paragraphs: [
          "Já sentei na frente de centenas de donos de PME. Quando pergunto “qual é o plano para os próximos cinco anos?”, a resposta quase sempre tem o mesmo problema: ela fala de crescimento, mas não fala de valor.",
          "“Queremos dobrar o faturamento.” Tudo bem. Mas quanto a empresa vai valer quando dobrar? Quem vai tocar a operação quando você não estiver? Por que um comprador ou sócio pagaria mais por ela do que paga hoje?",
          "Crescimento sem direção de valor é como correr mais rápido sem saber pra onde você está indo. Você chega cansado num lugar errado.",
          "É exatamente aí que o LTV entra.",
        ],
      },
      {
        heading: "O que é o método LTV da Vispe",
        paragraphs: [
          "LTV significa Long Term Vision. Na Vispe, é a metodologia que usamos para transformar uma empresa que tem planos em uma empresa que tem destino. Destino com número, estrutura e narrativa.",
          "Um LTV real precisa responder quatro perguntas. Todas as quatro. Se uma falta, o método não está completo.",
        ],
      },
      {
        heading: "Destino de Valor: quanto a empresa precisa valer em 5 anos?",
        level: 3,
        paragraphs: [
          "Esse é o ponto de chegada. Não em faturamento, não em funcionários: em valuation. Porque valuation é a métrica que resume tudo.",
          "Um exemplo concreto: “Queremos transformar uma empresa que hoje vale R$ 8 milhões em uma companhia de R$ 40 milhões.” Isso é um destino. É um número que você pode trabalhar de trás pra frente e descobrir o que precisa mudar agora para chegar lá.",
          "Quem não define valuation-alvo constrói um negócio no escuro. Às vezes cresce, às vezes não. Mas raramente chega onde poderia.",
        ],
      },
      {
        heading: "Motor de Receita: qual faturamento sustenta esse valuation?",
        level: 3,
        paragraphs: [
          "Valuation não existe no vácuo. Ele é sustentado por receita, margem e recorrência. E esses três precisam estar no plano.",
          "No exemplo acima, uma empresa que quer ir de R$ 8 milhões para R$ 40 milhões em valor precisa sair de R$ 500 mil por mês para R$ 2 milhões por mês em faturamento. Esse é o motor. Sem ele, o destino de valor é ficção.",
          "E não basta faturamento bruto. O comprador olha margem. O investidor olha recorrência. Um negócio que fatura R$ 2 milhões por mês com margem de 5% e sem contrato nenhum vale muito menos do que um que fatura o mesmo com margem de 20% e 70% de receita recorrente. Isso não é detalhe: isso é a diferença entre vender bem e vender barato.",
        ],
      },
      {
        heading: "Arquitetura de Time: quais cadeiras precisam existir para a empresa crescer sem você?",
        level: 3,
        paragraphs: [
          "Esse é o ponto que mais dói. Porque a maioria das PMEs não tem um time: tem um dono que faz tudo e algumas pessoas que ajudam.",
          "Empresa centrada no dono não escala. E empresa que não escala sem o dono vale muito menos do que poderia. Para o comprador, você não está vendendo uma empresa: está vendendo um emprego embrulhado em CNPJ.",
          "O LTV exige que você defina quais cadeiras precisam existir em 5 anos. Direção comercial, financeiro estruturado, liderança operacional, gestão por indicadores. Cada cadeira que você preenche é risco que você tira do comprador. E menos risco para o comprador significa mais dinheiro no seu bolso.",
        ],
      },
      {
        heading: "Tese de Mercado: por que essa empresa deve existir nesse tamanho?",
        level: 3,
        paragraphs: [
          "Aqui não é propósito abstrato. Não é “ajudar pessoas” ou “transformar o mercado”. É direção de mercado com uma posição clara.",
          "Por exemplo: “Ser a principal consolidadora regional de provedores pequenos no interior do RS.” Ou: “Virar a assessoria financeira B2B mais desejada por empresas de R$ 5 a R$ 50 milhões.”",
          "Essa tese importa porque é ela que torna a empresa desejável para um comprador estratégico. Quando você tem uma posição de mercado clara, você não está esperando que alguém apareça e faça uma oferta. Você está construindo algo que alguém vai querer comprar.",
        ],
      },
      {
        heading: "O quinto elemento: Narrativa de Equity",
        paragraphs: [
          "Depois de responder as quatro perguntas, tem um passo que separa quem entende de equity de quem ainda está no modo “vou ver o que acontece”. É a Narrativa de Equity.",
          "É transformar tudo isso numa frase que qualquer pessoa entende:",
          {
            kind: "highlight",
            text: "“Hoje somos X. Em 5 anos seremos Y. Para isso, vamos crescer por A, estruturar B, contratar C, capturar D e nos tornar valiosos por E.”",
          },
          "Parece simples. E é. Mas é exatamente essa simplicidade que falta na maioria dos planos. Quando você consegue contar a história da sua empresa em uma frase assim, você não está só se planejando: você está construindo o argumento de venda da empresa antes mesmo de colocá-la no mercado.",
        ],
      },
      {
        heading: "O que falta quando um dos quatro pilares não está presente",
        paragraphs: [
          {
            kind: "list",
            items: [
              {
                label: "Sem valuation-alvo:",
                text: "é sonho. Você não sabe pra onde está indo, então qualquer caminho parece certo.",
              },
              {
                label: "Sem faturamento definido:",
                text: "é discurso. O destino existe no papel, mas não tem motor pra chegar lá.",
              },
              {
                label: "Sem arquitetura de time:",
                text: "é dependência. A empresa cresce, mas não vale mais, porque sem você ela para.",
              },
              {
                label: "Sem tese de mercado:",
                text: "é crescimento burro. Você fica maior, mas não fica mais desejável. E empresa que não é desejável, não é vendida pelo preço que merece.",
              },
            ],
          },
          "Os quatro precisam estar juntos. Não é opcional.",
        ],
      },
      {
        heading: "Por que isso importa para uma PME agora",
        paragraphs: [
          "Eu ouvi durante anos que equity era coisa de startup, de empresa grande, de quem já tinha chegado lá. Ouvi isso quando estava construindo a IPv7. Ouvi isso quando vendia. E ouvi isso das pessoas que ficaram de fora de negócios que poderiam ter feito.",
          "Não é verdade. Equity é pra qualquer empresa que tem concorrente, que fatura, que tem operação. O que muda é o preparo. E o LTV é exatamente esse preparo.",
          "Quem define um LTV hoje não está sonhando. Está construindo, com método, uma empresa que em 5 anos vai ter mais valor do que teria se continuasse no automático.",
          "A pergunta que fica é simples: você sabe quanto a sua empresa precisa valer em 5 anos? Ou está construindo sem saber o destino?",
        ],
      },
    ],
    faq: {
      title: "Perguntas frequentes",
      items: [
        {
          question: "O que é LTV no contexto de PMEs?",
          answer:
            "LTV, ou Long Term Vision, é a metodologia que define onde uma empresa precisa estar em 5 anos para se tornar mais valiosa, escalável e vendável. Ela responde quatro perguntas obrigatórias: valuation-alvo, faturamento necessário, estrutura de time e tese de mercado.",
        },
        {
          question: "Qual a diferença entre LTV e planejamento estratégico tradicional?",
          answer:
            "O planejamento estratégico tradicional geralmente foca em metas de crescimento (faturamento, clientes, expansão). O LTV foca em valor: quanto a empresa precisa valer e o que precisa ser verdade para que esse valor exista. É uma visão orientada a equity, não só a receita.",
        },
        {
          question: "Uma PME pequena precisa de um LTV?",
          answer:
            "Sim. O tamanho atual da empresa não importa. O que importa é que, sem um destino de valor definido, as decisões do dia a dia raramente apontam na direção certa. PMEs que definem LTV cedo chegam à venda, à captação ou ao crescimento muito mais preparadas do que as que deixam pra pensar nisso quando o comprador aparece.",
        },
        {
          question: "Quanto tempo leva para montar um LTV?",
          answer:
            "Depende do nível de clareza que o dono já tem sobre o negócio. Na Vispe, o processo envolve diagnóstico de valuation atual, análise de receita e margem, mapeamento de estrutura de time e definição de tese de mercado. Em geral, algumas semanas de trabalho estruturado já produzem um LTV funcional e acionável.",
        },
        {
          question: "LTV e valuation são a mesma coisa?",
          answer:
            "Não. O valuation é um dos quatro pilares do LTV. O LTV é a visão completa: valuation-alvo, motor de receita, arquitetura de time e tese de mercado. Saber quanto sua empresa vale hoje é diagnóstico. Saber quanto ela precisa valer em 5 anos, e o que fazer para chegar lá, é LTV.",
        },
      ],
    },
  },
  {
    slug: "o-que-e-valuation-e-quando-fazer",
    title: "O que é valuation e quando fazer o da sua empresa",
    description:
      "Entenda para que serve a avaliação do valor de uma empresa e em quais momentos ela faz diferença.",
    category: "Equity",
    tags: ["Valuation"],
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
    tags: ["Planejamento Tributário"],
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
    tags: ["BPO Financeiro"],
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
    tags: ["Due Diligence"],
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
    tags: ["Captação de Recursos"],
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
  const words = [
    ...post.sections.flatMap((section) => [section.heading, ...section.paragraphs.map(blockText)]),
    ...(post.faq?.items.flatMap((item) => [item.question, item.answer]) ?? []),
  ]
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
