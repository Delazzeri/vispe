/**
 * Bloco do corpo de uma seção: parágrafo (texto simples), frase em destaque
 * ou lista (itens com rótulo opcional em negrito, ex.: "Sem valuation-alvo:").
 * Textos aceitam links no formato [texto](/caminho) — internos (ex.: "/#servicos",
 * "/contato", "/blog/slug") ou externos ("https://...") — e negrito com **trecho**.
 */
export type BlogBlock =
  | string
  | { kind: "highlight"; text: string }
  | { kind: "list"; ordered?: boolean; items: readonly { label?: string; text: string }[] };

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

/** Padrão dos links no texto: [texto](href). */
export const inlineLinkPattern = /\[([^\]]+)\]\(([^)\s]+)\)/g;
/** Padrão do negrito no texto: **trecho**. */
export const inlineBoldPattern = /\*\*([^*]+)\*\*/g;

/** Remove a marcação de links e negrito, mantendo só o texto (JSON-LD, tempo de leitura). */
export function plainText(text: string): string {
  return text.replace(inlineLinkPattern, "$1").replace(inlineBoldPattern, "$1");
}

/** Texto puro de um bloco (tempo de leitura, JSON-LD). */
export function blockText(block: BlogBlock): string {
  if (typeof block === "string") return plainText(block);
  if (block.kind === "highlight") return plainText(block.text);
  return block.items.map((item) => plainText(item.label ? `${item.label} ${item.text}` : item.text)).join(" ");
}

// Artigos reais, do mais recente para o mais antigo.
export const blogPosts: readonly BlogPost[] = [
  {
    slug: "efeito-nintendo-ativos-intangiveis-valuation",
    title: "O Efeito Nintendo: como a gestão de ativos intangíveis eleva o valuation da sua empresa",
    seoTitle: "Efeito Nintendo: intangíveis que elevam o valuation",
    description:
      "A estratégia da gigante dos games revela como proteger margens, blindar a propriedade intelectual e construir valor de mercado sustentável no longo prazo.",
    category: "Valuation",
    tags: ["Valuation"],
    // TODO(content): data real de publicação (provisória: dia em que entrou no site).
    publishedAt: "2026-10-07",
    sections: [
      {
        paragraphs: [
          "No mercado B2B e no ecossistema de investimentos, poucas empresas demonstram tanta resiliência financeira quanto a **Nintendo**. Enquanto concorrentes diretos enfrentam ciclos severos de depreciação de hardware e dependência de subsídios cruzados, a companhia japonesa mantém margens operacionais invejáveis e uma posição de caixa líquido extraordinária. O segredo dessa perenidade não está apenas na inovação de produto, mas na gestão milimétrica de seus **ativos intangíveis** e do seu **Valuation**.",
          "Ao longo das últimas décadas, a Nintendo transformou suas propriedades intelectuais (IPs), marcas registradas e patentes nos principais direcionadores de valor do seu balanço patrimonial. Quando uma organização consegue desassociar a sua precificação do custo direto de produção ou das oscilações de commodities e insumos, ela atinge o ápice da diferenciação estratégica, o verdadeiro propulsor do valor da marca.",
        ],
      },
      {
        heading: "A anatomia dos intangíveis: o que realmente constrói valor?",
        paragraphs: [
          "No ecossistema corporativo tradicional, gestores frequentemente cometem o erro de focar excessivamente no patrimônio líquido tangível (máquinas, imóveis, estoques e frota). Contudo, na economia moderna, a participação dos **ativos intangíveis** no valuation total de grandes empresas supera os 80%.",
          "A Nintendo exemplifica como a governança sobre ativos não materiais blinda a empresa contra flutuações de mercado por meio de quatro pilares essenciais:",
          {
            kind: "list",
            ordered: true,
            items: [
              {
                label: "Poder de Precificação (Pricing Power):",
                text: "A recusa histórica em realizar descontos agressivos em seus títulos principais preserva a percepção de valor e garante margens brutas elevadas de forma consistente.",
              },
              {
                label: "Moat Competitivo (Barreira de Entrada):",
                text: "A proteção rigorosa de suas marcas e patentes impede que concorrentes repliquem suas dinâmicas de consumo ou usufruam da sua reputação.",
              },
              {
                label: "Previsibilidade de Fluxo de Caixa:",
                text: "Personagens e franquias consolidadas geram receitas recorrentes não apenas via produtos diretos, mas por meio de licenciamento, parques temáticos e produções audiovisuais.",
              },
              {
                label: "Governança de Marcas:",
                text: "O rigor com que a empresa gerencia a exposição e a qualidade de seus ativos evita a diluição do valor da marca ao longo do tempo.",
              },
            ],
          },
        ],
      },
      {
        heading: "O impacto direto no valuation de médias e grandes empresas",
        paragraphs: [
          "Para CEOs, CFOs e Founders de empresas em crescimento, o modelo da Nintendo traz uma lição crucial: **o valor real de um negócio não se resume ao múltiplo do EBITDA atual, mas à capacidade de perpetuar e proteger a geração de caixa futuro.**",
          "Ao realizar uma avaliação corporativa, investidores e compradores estratégicos precificam rigorosamente a sustentabilidade dos ativos intangíveis. Empresas que possuem marca forte, processos proprietários, contratos de longo prazo e propriedade intelectual bem estruturada alcançam:",
          {
            kind: "list",
            items: [
              {
                label: "Múltiplos de transação expressivamente superiores",
                text: "em rodadas de captação ou [processos de M&A](/#equity);",
              },
              {
                label: "Menor custo de capital,",
                text: "reduzindo a percepção de risco por parte dos credores e investidores;",
              },
              {
                label: "Proteção contra volatilidades do setor,",
                text: "garantindo resiliência de caixa mesmo sob pressão macroeconômica.",
              },
            ],
          },
          "Se a sua empresa depende exclusivamente da disputa por preço ou da alocação de ativos físicos para crescer, seu valuation está vulnerável e subtraído da sua real capacidade de mercado.",
        ],
      },
      {
        heading: "Descubra o real valor da sua empresa com a Vispe Capital",
        paragraphs: [
          "Mapear, precificar e maximizar os ativos tangíveis e intangíveis é o primeiro passo para garantir a [longevidade do negócio](/blog/planejamento-estrategico) e preparar a empresa para captar recursos, atrair sócios ou realizar transações estratégicas.",
          "A **Vispe Capital** desenvolve estudos profundos de [Valuation de Precisão](/#servicos), alinhando metodologia financeira de ponta (Fluxo de Caixa Descontado, Múltiplos de Mercado e Avaliação de Intangíveis) às dinâmicas reais do seu setor.",
          {
            kind: "highlight",
            text: "Sua empresa está pronta para [descobrir e expandir seu valor de mercado](/contato)?",
          },
        ],
      },
    ],
  },
  {
    slug: "licao-nokia-governanca-controladoria-financeira",
    title:
      "A lição de R$ 1,5 bilhão da Nokia: como a falta de governança e processos financeiros destrói empresas gigantes",
    seoTitle: "Lição da Nokia: governança e controladoria financeira",
    description:
      "Uma análise crítica sobre como a cegueira operacional, a falta de visibilidade sobre margens e a ausência de uma controladoria estratégica minaram o líder mundial da tecnologia.",
    category: "Controladoria",
    tags: ["Gestão Financeira", "Turnaround Financeiro"],
    // TODO(content): data real de publicação (provisória: dia em que entrou no site).
    publishedAt: "2026-10-07",
    sections: [
      {
        paragraphs: [
          "Durante mais de uma década, a marca **Nokia** foi sinônimo incontestável de liderança global em telecomunicações e dispositivos móveis. Em seu pico de mercado, a gigante finlandesa detinha mais de 40% de participação de mercado global e gerava bilhões de Euros em caixa livre. No entanto, o colapso vertiginoso que culminou na venda da sua divisão de celulares por uma fração do seu valor histórico não foi causado apenas pela ascensão do iPhone ou do ecossistema Android.",
          "Sob a ótica de M&A e [turnaround financeiro](/#equity), a queda da Nokia foi provocada por falhas profundas de **visibilidade de custos, rigidez operacional e ausência de uma controladoria financeira estratégica**. Quando os números de margem começam a ser mascarados por eficiências passadas, o conselho e a diretoria perdem o termômetro do negócio: um erro fatal para empresas de qualquer porte.",
        ],
      },
      {
        heading: "A anatomia do colapso: o que os demonstrativos não mostravam",
        paragraphs: [
          "Enquanto a receita consolidada da Nokia ainda impressionava os analistas de mercado nos anos 2000, a estrutura interna de custos e a margem por unidade operacional já apresentavam sérios sinais de degradação.",
          "Uma análise minuciosa da estratégia da Nokia revela três erros graves de gestão financeira e operacional:",
          {
            kind: "list",
            ordered: true,
            items: [
              {
                label: "Ilusão do Volume vs. Margem de Contribuição:",
                text: "A empresa focava em manter o volume de vendas global por meio de aparelhos de baixa margem em mercados emergentes, camuflando a erosão acelerada do EBITDA nos segmentos premium.",
              },
              {
                label: "Desconexão do DRE Gerencial:",
                text: "A alocação de recursos em P&D (Pesquisa e Desenvolvimento) era bilionária, porém sem KPIs claros de retorno sobre o capital investido (ROIC). Bilhões de Euros foram queimados em software proprietário sem aderência de mercado.",
              },
              {
                label: "Ausência de Indicadores Antecedentes de Caixa:",
                text: "O ciclo de conversão de caixa (CCC) da companhia se deteriorou à medida que estoques de componentes obsoletos se acumulavam nos centros de distribuição mundiais, destruindo o capital de giro.",
              },
            ],
          },
        ],
      },
      {
        heading: "Do erro da gigante à realidade das médias e grandes empresas",
        paragraphs: [
          "No ecossistema corporativo médio e grande, a “Síndrome de Nokia” acontece com frequência assustadora. Empresas em fase de crescimento acelerado frequentemente negligenciam a [Controladoria Financeira](/#servicos) e a figura do [CFO as Service](/#faq), acreditando que o aumento do faturamento corrige qualquer desalinhamento interno.",
          "Quando a governança de caixa falha, os sintomas surgem de forma silenciosa:",
          {
            kind: "list",
            items: [
              { text: "Incapacidade de identificar a lucratividade real por produto, cliente ou canal;" },
              { text: "Descasamento entre o faturamento contábil e a liquidez real na conta bancária;" },
              { text: "Modelos orçamentários estáticos que impedem pivotagens estratégicas rápidas;" },
              { text: "Aumento da dependência de linhas de crédito de curto prazo para honrar capital de giro." },
            ],
          },
          "A Nokia demonstrou que o volume de caixa acumulado no passado não garante sobrevivência se os processos de gestão financeira do presente não forem ágeis, transparentes e orientados à tomada de decisão.",
        ],
      },
      {
        heading: "Transforme a gestão do seu caixa com a Vispe Capital",
        paragraphs: [
          "Ter controle absoluto sobre DRE gerencial, margens de contribuição, [fluxo de caixa projetado](/#fin) e capital de giro é a diferença entre liderar o mercado ou ser engolido por ele.",
          "A **Vispe Capital** oferece soluções completas de **Controladoria Financeira e CFO as Service**, estruturando governança de dados, relatórios executivos para conselho e [otimização de margens operacionais](/blog/efeito-nintendo-ativos-intangiveis-valuation) para médias e grandes empresas.",
          {
            kind: "highlight",
            text: "Sua empresa possui [total visibilidade sobre as margens](/contato) e a geração real de caixa do seu negócio?",
          },
        ],
      },
    ],
  },
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
          "LTV significa Long Term Vision. Na [Vispe](/sobre), é a metodologia que usamos para transformar uma empresa que tem planos em uma empresa que tem destino. Destino com número, estrutura e narrativa.",
          "Um LTV real precisa responder quatro perguntas. Todas as quatro. Se uma falta, o método não está completo.",
        ],
      },
      {
        heading: "Destino de Valor: quanto a empresa precisa valer em 5 anos?",
        level: 3,
        paragraphs: [
          "Esse é o ponto de chegada. Não em faturamento, não em funcionários: em [valuation](/#servicos). Porque valuation é a métrica que resume tudo.",
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
          "O LTV exige que você defina quais cadeiras precisam existir em 5 anos. Direção comercial, financeiro estruturado, liderança operacional, [gestão por indicadores](/#fin). Cada cadeira que você preenche é risco que você tira do comprador. E menos risco para o comprador significa mais dinheiro no seu bolso.",
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
          "Não é verdade. [Equity](/#equity) é pra qualquer empresa que tem concorrente, que fatura, que tem operação. O que muda é o preparo. E o LTV é exatamente esse preparo.",
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
            "Depende do nível de clareza que o dono já tem sobre o negócio. Na Vispe, o processo envolve [diagnóstico de valuation atual](/contato), análise de receita e margem, mapeamento de estrutura de time e definição de tese de mercado. Em geral, algumas semanas de trabalho estruturado já produzem um LTV funcional e acionável.",
        },
        {
          question: "LTV e valuation são a mesma coisa?",
          answer:
            "Não. O valuation é um dos quatro pilares do LTV. O LTV é a visão completa: valuation-alvo, motor de receita, arquitetura de time e tese de mercado. Saber quanto sua empresa vale hoje é diagnóstico. Saber quanto ela precisa valer em 5 anos, e o que fazer para chegar lá, é LTV.",
        },
      ],
    },
  },
] as const;

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}

export function getReadingMinutes(post: BlogPost): number {
  const words = [
    ...post.sections.flatMap((section) => [section.heading, ...section.paragraphs.map(blockText)]),
    ...(post.faq?.items.flatMap((item) => [item.question, plainText(item.answer)]) ?? []),
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
