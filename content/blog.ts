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
    cover: {
      src: "/media/blog/nintendo-739.webp",
      alt: "Fachada da loja Nintendo Tokyo com o logotipo da Nintendo",
      width: 739,
      height: 416,
    },
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
          "Mapear, precificar e maximizar os ativos tangíveis e intangíveis é o primeiro passo para garantir a longevidade do negócio e preparar a empresa para captar recursos, atrair sócios ou realizar transações estratégicas.",
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
    cover: {
      src: "/media/blog/nokia-1280.webp",
      alt: "Entrada do Nokia Campus com o logotipo da empresa",
      width: 1280,
      height: 720,
    },
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
    slug: "planejamento-tributario-estrategico-margem",
    title:
      "O mito da eficiência operacional: por que cortar custos não salva empresas sem planejamento tributário estratégico",
    seoTitle: "Cortar custos não basta: planejamento tributário",
    description:
      "A recente onda de consolidações e reestruturações corporativas revela que a verdadeira blindagem de margem está na inteligência fiscal, não na tesoura operacional.",
    category: "Tributário",
    tags: ["Planejamento Tributário"],
    // TODO(content): data real de publicação (provisória: dia em que entrou no site).
    publishedAt: "2026-10-07",
    cover: {
      src: "/media/blog/eficiencia-tributaria-739.webp",
      alt: "Equipe reunida em uma mesa de trabalho analisando gráficos financeiros em um notebook",
      width: 739,
      height: 416,
    },
    sections: [
      {
        paragraphs: [
          "Noticiários financeiros como o InfoMoney e o Valor Econômico revelam um movimento claro no ecossistema corporativo brasileiro: enquanto o volume total de transações de M&A e reestruturações movimenta centenas de bilhões de reais, o número absoluto de operações diminuiu. O mercado tornou-se mais seletivo. Em um cenário de juros elevados e margens sob forte pressão, empresas capitalizadas e fundos estão adquirindo operações a múltiplos descontados, enquanto companhias com caixa estrangulado lutam para manter a liquidez diária.",
          "Diante do aperto nas margens, a reação natural da maioria dos CEOs e diretores executivos é cortar despesas operacionais (OPEX): renegociar contratos com fornecedores, congelar contratações e enxugar estruturas de marketing.",
          "Contudo, na realidade fiscal do Brasil, existe um ralo financeiro silencioso e expressivamente maior que costuma ser negligenciado nos comitês executivos: **a ineficiência tributária**.",
        ],
      },
      {
        heading: "A assimetria tributária: o ralo oculto do DRE",
        paragraphs: [
          "No ambiente B2B, o impacto da carga tributária sobre o resultado operacional frequentemente supera o custo total da folha de pagamento ou da infraestrutura logística. Quando uma média ou grande empresa opera sob um modelo tributário desalinhado com sua real dinâmica de negócios, ela gera uma perda invisível de caixa mês a mês.",
          "Existem três gargalos recorrentes que drenam a liquidez e corroem o valuation das empresas:",
          {
            kind: "list",
            ordered: true,
            items: [
              {
                label: "Acúmulo de Créditos Tributários Inaproveitados:",
                text: "Empresas industriais e distribuidoras frequentemente acumulam saldos credores de PIS/COFINS e ICMS sem um plano sistemático de ressarcimento ou compensação, transformando capital de giro líquido em patrimônio ilíquido e sem rentabilidade.",
              },
              {
                label: "Classificação Fiscal Incorreta e Segregação de Atividades:",
                text: "A ausência de um planejamento tributário preventivo impede o uso de regimes mistos e incentivos fiscais regionais ou setoriais totalmente legais, que poderiam reduzir drasticamente a alíquota efetiva sobre o faturamento.",
              },
              {
                label: "Passivos Fiscais Contingentes:",
                text: "Falhas no cumprimento de obrigações acessórias geram autuações que, além de comprometerem a certidão negativa de débitos (CND), destroem o valor da empresa em processos de [Due Diligence](/#faq) ou [captação de recursos](/#equity) junto a bancos.",
              },
            ],
          },
        ],
      },
      {
        heading: "Como o planejamento tributário transforma a margem EBITDA",
        paragraphs: [
          "Enquanto a redução de custos operacionais possui um limite físico (sob pena de comprometer a entrega e a qualidade do produto), a otimização fiscal atua diretamente no topo e no meio do DRE, convertendo impostos indevidamente pagos em geração imediata de caixa livre.",
          "Um planejamento tributário estratégico estruturado permite:",
          {
            kind: "list",
            items: [
              {
                label: "Recuperação de Indébitos:",
                text: "Identificação e compensação de tributos pagos a maior nos últimos cinco anos, injetando caixa imediato na operação sem necessidade de endividamento bancário.",
              },
              {
                label: "Readequação da Estrutura Societária e Operacional:",
                text: "Reorganização de holdings, filiais e centros de distribuição para capturar incentivos fiscais e reduzir o custo logístico-tributário total.",
              },
              {
                label: "Aumento do Valuation e do Atrativo para Investidores:",
                text: "Empresas com compliance fiscal rigoroso e planejamento tributário ativo obtêm melhores classificações de risco (rating), reduzindo o custo de capital e elevando o [múltiplo de EBITDA](/blog/efeito-nintendo-ativos-intangiveis-valuation) em eventuais [negociações de M&A](/blog/ma-ibm-red-hat-sinergia-multiplos).",
              },
            ],
          },
        ],
      },
      {
        heading: "Maximize a liquidez da sua empresa com a Vispe Capital",
        paragraphs: [
          "Cortar despesas essenciais pode sufocar o crescimento da sua empresa; otimizar a carga tributária, por outro lado, expande as margens e protege o caixa operacional sem impactar a rotina do negócio.",
          "A **Vispe Capital** conta com uma equipe especializada em [Planejamento Tributário Corporativo](/#servicos) e Engenharia Fiscal, combinando auditoria diagnóstica, recuperação de créditos e reestruturação tributária para médias e grandes empresas.",
          {
            kind: "highlight",
            text: "Sua empresa está [deixando dinheiro na mesa](/contato) por falta de eficiência fiscal?",
          },
        ],
      },
    ],
  },
  {
    slug: "ma-ibm-red-hat-sinergia-multiplos",
    title: "M&A no setor de TI: o que a maior aquisição da história da IBM ensina sobre incorporação de múltiplos",
    seoTitle: "M&A em TI: as lições da compra da Red Hat pela IBM",
    description:
      "Entenda como a compra da Red Hat por US$ 34 bilhões exemplifica a estratégia de M&A focada em sinergia, diversificação de receita e consolidação de mercado.",
    category: "M&A",
    tags: ["Fusões e Aquisições", "Due Diligence"],
    // TODO(content): data real de publicação (provisória: dia em que entrou no site).
    publishedAt: "2026-10-07",
    cover: {
      src: "/media/blog/ibm-1600.webp",
      alt: "Logotipo da IBM na fachada de um prédio",
      width: 1600,
      height: 900,
    },
    sections: [
      {
        paragraphs: [
          "Em 2019, a IBM concluiu a aquisição da Red Hat por impressionantes **US$ 34 bilhões**, o maior negócio da história da empresa e uma das maiores transações de tecnologia de todos os tempos. Na época, a IBM enfrentava uma estagnação em seus negócios tradicionais de infraestrutura e serviços de TI. A compra não foi apenas um movimento de expansão, mas uma virada estratégica deliberada para liderar o mercado de nuvem híbrida e software corporativo de margem alta.",
          "O grande trunfo dessa transação esteve na capacidade da IBM de enxergar o valor de sinergia: ao integrar o portfólio de código aberto da Red Hat à sua massiva base global de clientes corporativos, a Big Blue conseguiu acelerar a transformação do seu próprio modelo de negócios. Para empresários, founders e diretores de PMEs e empresas de médio porte, a estratégia de [M&A (Fusões e Aquisições)](/#equity) da IBM traz lições valiosas sobre como preparar uma empresa para a venda ou como crescer via aquisições estratégicas.",
        ],
      },
      {
        heading: "Lições críticas do caso IBM-Red Hat para o mercado de M&A",
        paragraphs: [
          "O sucesso dessa transação bilionária evidencia pilares fundamentais que determinam o valor de um negócio em qualquer negociação de M&A:",
          {
            kind: "list",
            items: [
              {
                label: "Sinergia Operacional e Comercial:",
                text: "Uma aquisição estratégica não busca apenas somar o faturamento das duas empresas. O comprador busca multiplicar resultados ao cruzar bases de clientes, integrar canais de distribuição e otimizar custos operacionais.",
              },
              {
                label: "Transição para Modelos de Receita Recorrente:",
                text: "A Red Hat trouxe para a IBM uma receita previsível via assinaturas (SaaS/Subscription), reduzindo a volatilidade das vendas pontuais de hardware e consultoria. Negócios com alta receita recorrente alcançam [múltiplos de valuation](/blog/efeito-nintendo-ativos-intangiveis-valuation) expressivamente superiores.",
              },
              {
                label: "Preservação da Cultura e Autonomia:",
                text: "A IBM manteve a Red Hat operando como uma unidade independente para preservar sua neutralidade, cultura de inovação e confiança da comunidade de código aberto, protegendo o ativo mais valioso que havia acabado de comprar.",
              },
              {
                label: "Preparo do Sell-Side para a Due Diligence:",
                text: "A Red Hat só pôde capturar um prêmio de 63% sobre o valor de suas ações na época porque possuía governança impecável, contratos de IP (propriedade intelectual) blindados e contabilidade transparente.",
              },
            ],
          },
        ],
      },
      {
        heading: "Como aplicar essa estratégia na preparação do seu negócio",
        paragraphs: [
          "Seja para atrair um comprador estratégico, um fundo de Private Equity, ou para realizar uma aquisição e consolidar seu setor, a preparação antecede a negociação em meses, ou até anos.",
          {
            kind: "list",
            ordered: true,
            items: [
              {
                label: "Identifique sua Tese de Sinergia:",
                text: "Mapeie quem seriam os compradores estratégicos da sua empresa e o que você possui que eles não conseguem construir rapidamente (tecnologia, canal de vendas, marca ou carteira B2B).",
              },
              {
                label: "Organize a Governança e o Data Room:",
                text: "Processos de M&A falham com frequência na etapa de [auditoria (Due Diligence)](/#faq). Tenha DREs auditáveis, contratos sociais atualizados e [contingências tributárias](/blog/planejamento-tributario-estrategico-margem)/trabalhistas sob controle.",
              },
              {
                label: "Mantenha a Operação Forte Durante a Negociação:",
                text: "O processo de venda consome energia da gestão. A operação não pode desacelerar enquanto a transação é negociada, sob pena de redução do valuation final.",
              },
            ],
          },
        ],
      },
      {
        heading: "Prepare sua empresa para a transação mais importante da sua história",
        paragraphs: [
          "Uma transação de M&A bem-sucedida requer estratégia, [valuation preciso](/#servicos) e assessoria especializada na condução das negociações. Seja para vender seu negócio pelo valor máximo de mercado ou para estruturar uma tese de aquisição e expansão, a **Vispe Capital** apoia empresários e executivos em todas as etapas do processo.",
          "Nossa equipe conduz desde o [diagnóstico de Readiness](/contato) (prontidão para negociação) e a busca de investidores estratégicos até a estruturação do Deal e encerramento do contrato.",
        ],
      },
    ],
  },
  {
    slug: "netflix-controladoria-financeira-fluxo-de-caixa",
    title: "A lição de R$ 3 mapeada pela Netflix: como a controladoria financeira evita a morte por “sangramento curto”",
    seoTitle: "Netflix e a controladoria financeira no crescimento",
    description:
      "Entenda como a migração de modelo de negócios exige uma gestão rigorosa de margem e fluxo de caixa para transformar o crescimento em lucro líquido real.",
    category: "Controladoria",
    tags: ["Gestão Financeira"],
    // TODO(content): data real de publicação (provisória: dia em que entrou no site).
    publishedAt: "2026-10-07",
    cover: {
      src: "/media/blog/netflix-1300.webp",
      alt: "Logotipo da Netflix sobre um gráfico de linha em queda",
      width: 1300,
      height: 731,
    },
    sections: [
      {
        paragraphs: [
          "A trajetória da **Netflix** é amplamente celebrada como o maior exemplo de disrupção digital do século XXI. No entanto, por trás da transição bem-sucedida do aluguel de DVDs para o streaming e, posteriormente, para a produção de conteúdo original, existe uma história menos contada: a constante batalha da empresa com o fluxo de caixa operacional durante sua fase de maior expansão.",
          "Entre 2015 e 2019, enquanto o número de assinantes globais disparava, a Netflix operava com fluxo de caixa livre negativo em bilhões de dólares. O motivo? A necessidade de pagar adiantado pela produção de filmes e séries, enquanto a receita de assinaturas entrava em parcelas mensais diluídas. A empresa só conseguiu sobreviver a essa lacuna temporal e se tornar uma geradora de caixa sustentável porque estruturou uma engenharia financeira cirúrgica, acompanhando de perto o custo de aquisição de clientes (CAC), a margem de contribuição por usuário e o burn rate.",
          "Para pequenas e médias empresas (PMEs) em fase de crescimento ou mudança de modelo de negócios, o caso da Netflix traz um alerta vital: **faturamento e crescimento de receita não significam liquidez**. Sem uma controladoria financeira ativa, a expansão acelerada pode esgotar o caixa do negócio antes que o retorno do investimento se materialize.",
        ],
      },
      {
        heading: "Os 3 erros de controle financeiro que matam empresas em expansão",
        paragraphs: [
          "A falta de visibilidade sobre os números internos é a principal causa de mortalidade corporativa no Brasil. Quando uma empresa decide acelerar vendas ou mudar seu portfólio de produtos/serviços sem o suporte do [CFO as a Service](/#faq) ou de uma [controladoria estruturada](/#servicos), ela costuma tropeçar em três gargalos críticos:",
          {
            kind: "list",
            ordered: true,
            items: [
              {
                label: "Confusão entre Lucro Contábil e Fluxo de Caixa:",
                text: "A DRE pode apontar lucro no papel, mas se os prazos médios de recebimento forem incompatíveis com os prazos de pagamento a fornecedores e folha, a empresa entra em colapso de liquidez.",
              },
              {
                label: "Ignorância da Margem de Contribuição Real:",
                text: "Aumentar o volume de vendas de produtos ou serviços com margens negativas ou mal calculadas apenas acelera o prejuízo. Cada linha de produto precisa ter seu custo direto e indireto rigorosamente mapeado.",
              },
              {
                label: "Falta de Projeção de Cenários (Budgeting e Forecast):",
                text: "Decisões de contratação, investimento em marketing ou compra de equipamentos não podem ser tomadas com base no saldo bancário de hoje, mas sim no [fluxo de caixa projetado](/blog/licao-nokia-governanca-controladoria-financeira) para os próximos 6 a 12 meses.",
              },
            ],
          },
        ],
      },
      {
        heading: "Da intuição aos dados: o papel da controladoria financeira modernizada",
        paragraphs: [
          "Implementar uma rotina de controladoria não significa burocratizar a empresa com planilhas estáticas. Significa criar um [painel de bordo (dashboard) financeiro](/#fin) focado em tomada de decisão estratégica:",
          {
            kind: "list",
            items: [
              {
                label: "Mapeamento de Indicadores de Desempenho (KPIs):",
                text: "Acompanhamento quinzenal de margem EBITDA, Runway, necessidade de capital de giro (NCG) e ponto de equilíbrio.",
              },
              {
                label: "Planejamento Orçamentário Dinâmico:",
                text: "Revisão periódica de metas de custos e despesas operacionais para alinhar os gastos da empresa à realidade de receita do mercado.",
              },
              {
                label: "Gestão Rigorosa do Capital de Giro:",
                text: "Reestruturação de prazos de recebimento e negociação com fornecedores para otimizar o ciclo financeiro da operação.",
              },
            ],
          },
        ],
      },
      {
        heading: "Assuma o controle total das finanças e da margem do seu negócio",
        paragraphs: [
          "Crescer com segurança exige números confiáveis na mesa do tomador de decisão. Se a sua empresa enfrenta desafios na gestão de caixa, previsibilidade de receita ou margens de lucro espremidas, o modelo de [Controladoria Financeira / CFO as a Service](/contato) da **Vispe Capital** entrega a inteligência executiva necessária sem os custos fixos de um CFO em tempo integral.",
          "Nossa equipe atua diretamente na estruturação de rotinas financeiras, controle de DRE, gestão de caixa e projeção orçamentária para garantir a perenidade e a lucratividade do seu negócio.",
        ],
      },
    ],
  },
  {
    slug: "kongsberg-turnaround-reestruturacao-margem",
    title:
      "A ilusão da escala sem eficiência: o que o caso Kongsberg ensina sobre reestruturação e foco em margem",
    seoTitle: "Caso Kongsberg: turnaround e foco em margem",
    description:
      "Entenda como a gigante norueguesa de tecnologia e defesa reestruturou seu portfólio para estancar perdas operacionais e recuperar a liquidez corporativa.",
    category: "Turnaround",
    tags: ["Turnaround Financeiro"],
    // TODO(content): data real de publicação (provisória: dia em que entrou no site).
    publishedAt: "2026-10-07",
    cover: {
      src: "/media/blog/kongsberg-v2-1600.webp",
      alt: "Cerimônia da Kongsberg com executivos cortando a fita diante de um painel com veículo militar",
      width: 1600,
      height: 900,
    },
    sections: [
      {
        paragraphs: [
          "Fundada há mais de dois séculos na Noruega, a **Kongsberg Gruppen** é amplamente reconhecida como um símbolo de inovação em tecnologia de defesa, sistemas marítimos e energia offshore. No entanto, sua longa trajetória não foi isenta de solavancos severos. Em meados da última década, diante da retração global no setor de petróleo e gás e de uma desaceleração em suas divisões marítimas tradicionais, a empresa viu suas margens operacionais serem corroídas rapidamente. A combinação de custos fixos elevados, investimentos dispersos em linhas de negócios não essenciais (non-core) e queda na demanda colocou em xeque a liquidez da operação.",
          "A resposta do grupo não foi tentar “vender para sair da crise” aumentando o faturamento a qualquer custo. Em vez disso, a liderança executiva da Kongsberg iniciou um plano robusto de [Turnaround Financeiro e Reestruturação Operacional](/#equity). O foco foi redirecionado para a alienação de ativos secundários, corte drástico de ineficiências operacionais, renegociação de passivos bancários e concentração absoluta em segmentos de alta margem e tecnologia proprietária. O resultado? A empresa recuperou a rentabilidade corporativa, multiplicou sua margem EBITDA e consolidou-se como uma das operadoras mais eficientes da Europa.",
          "Para diretores, Founders e CEOs de PMEs brasileiras, o caso da Kongsberg oferece uma reflexão indispensável: **em momentos de estresse de caixa ou mudança de ciclo econômico, buscar o crescimento cego de receita sem ajustar a estrutura de custos é o caminho mais rápido para o colapso financeiro.**",
        ],
      },
      {
        heading: "Os 3 sinais de alerta de que sua empresa precisa de turnaround",
        paragraphs: [
          "Muitas empresas entram em estado crítico de liquidez não por falta de produto ou mercado, mas por atrasar a tomada de decisões estruturais. Os sinais de que a operação precisa de uma reestruturação imediata incluem:",
          {
            kind: "list",
            ordered: true,
            items: [
              {
                label: "Queima Contínua de Caixa Apesar do Aumento de Vendas:",
                text: "O faturamento cresce, mas o saldo bancário ao final do mês diminui progressivamente. Isso indica descontrole na [Margem de Contribuição](/blog/licao-nokia-governanca-controladoria-financeira), custos variáveis mal precificados ou prazos médios de recebimento estrangulados.",
              },
              {
                label: "Dependência Excessiva de Capital de Giro de Curto Prazo:",
                text: "A utilização constante de rolagem de dívidas, linhas bancárias caras ou antecipação de recebíveis para cobrir despesas operacionais correntes revela uma estrutura de capital disfuncional.",
              },
              {
                label: "Imobilização de Capital em Linhas Ineficientes:",
                text: "Manter filiais, produtos ou unidades de negócio deficitárias na esperança de que “um dia deem lucro”, drenando o caixa gerado pelas divisões saudáveis da empresa.",
              },
            ],
          },
        ],
      },
      {
        heading: "O roteiro de recuperação: 4 passos para reorganizar a liquidez",
        paragraphs: [
          "A reestruturação de um negócio exige pragmatismo financeiro e execução cirúrgica. O processo de Turnaround estruturado baseia-se em quatro etapas fundamentais:",
          {
            kind: "list",
            ordered: true,
            items: [
              {
                label: "Estancamento Imediato do “Sangramento” (Gestão de Crise de Caixa):",
                text: "Centralização absoluta da gestão de pagamentos, criação de comitê de caixa semanal e corte imediato de despesas não essenciais para preservar a liquidez mínima operacional.",
              },
              {
                label: "Mapeamento da Rentabilidade Real por Linha de Negócio:",
                text: "Auditoria profunda da [DRE por produto/serviço](/blog/netflix-controladoria-financeira-fluxo-de-caixa) para identificar e eliminar os gargalos operacionais que corroem a margem EBITDA.",
              },
              {
                label: "Renegociação e Reprofilamento do Passivo:",
                text: "Reestruturação do perfil das dívidas junto a bancos e fornecedores estratégicos, alongando prazos de vencimento e reduzindo o custo médio do capital.",
              },
              {
                label: "Redesenho do Modelo Operacional e Foco no Core Business:",
                text: "Reorganização do quadro funcional, revisão de processos produtivos e concentração total dos recursos nas soluções de maior margem e menor ciclo de recebimento.",
              },
            ],
          },
        ],
      },
      {
        heading: "Proteja o futuro e a liquidez da sua empresa com a Vispe Capital",
        paragraphs: [
          "Superar um cenário de crise de margem ou reestruturar a engenharia financeira do negócio exige neutralidade, expertise técnica e negociação firme com credores e agentes de mercado.",
          "A **Vispe Capital** atua diretamente em [processos de Turnaround Financeiro e Reestruturação](/contato), auxiliando empresários e executivos na recuperação da rentabilidade, renegociação de dívidas corporativas e [otimização do fluxo de caixa](/#fin). Transformamos momentos de incerteza em uma plataforma sólida para o crescimento sustentável da sua operação.",
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
