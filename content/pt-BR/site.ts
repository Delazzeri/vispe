// Conteúdo do site em português (fonte). A versão em inglês fica em
// content/en-US/site.ts com exatamente os mesmos campos.
export const site = {
  tagline: "ORGANIZAMOS O SEU FINANCEIRO E AUMENTAMOS O SEU LUCRO",

  hero: {
    eyebrow: "Sua controladoria financeira",
    h1: "Inteligência financeira estratégica",
    subheadline:
      "Pare de perder dinheiro por falta de controle financeiro. Organizamos o seu financeiro e aumentamos o seu lucro.",
    description:
      "Aumentamos seu caixa e maximizamos sua margem de lucro, sem precisar contratar um diretor executivo em tempo integral.",
    ctaPrimary: { label: "Potencialize seu lucro agora", href: "/contato" },
    ctaSecondary: { label: "Como funciona o CFO as Service", href: "#servicos" },
    bullets: [
      "Sem contrato de fidelidade",
      "Time dedicado ao seu caixa",
      "Diagnóstico sem custo",
      "Pronto para eventos de liquidez",
    ],
  },

  proposition: {
    eyebrow: "Com quem você vai andar",
    title: "Não é uma consultoria de relatório",
    description:
      "Transformamos negócios comuns em ativos de alto valor, prontos para atrair investidores e chegar a um evento de liquidez milionário.",
  },

  // Selos de resultado (public/media/award/). O alt repete o texto do selo
  // para manter o conteúdo indexável.
  awards: [
    { src: "/media/award/+2bi.png", width: 714, height: 765, alt: "Selo 2026: mais de R$ 2 bilhões em equity gerenciado" },
    { src: "/media/award/+700.png", width: 741, height: 766, alt: "Selo 2026: mais de R$ 700 milhões em M&A transacionado" },
    { src: "/media/award/+300.png", width: 764, height: 765, alt: "Selo 2026: mais de 300 laudos de valuation emitidos" },
  ],

  featureChips: {
    eyebrow: "Soluções",
    title: "Tudo que sua empresa precisa, em um só lugar",
    description:
      "Da controladoria do dia a dia aos eventos de liquidez mais complexos, estruturamos cada etapa com rigor técnico e proximidade de quem entende o seu negócio.",
    chips: [
      "Controladoria financeira",
      "M&A",
      "Captação de recursos",
      "Planejamento tributário",
      "Aceleração comercial",
      "Valuation",
      "Due diligence",
      "Turnaround financeiro",
      "BPO financeiro",
      "Partnership",
    ],
    // TODO(content): vídeo overview real (YouTube/Vimeo), poster e id/URL do embed.
    video: {
      title: "Como funciona a Vispe Capital",
      // TODO(content): id real do vídeo no YouTube/Vimeo.
      embedUrl: undefined as string | undefined,
    },
  },

  // TODO(content): depoimento real em destaque (abaixo do vídeo da seção de
  // soluções). Placeholder fictício — nunca publicar como se fosse real.
  featuredTestimonial: {
    quote:
      "Somos clientes há alguns anos e passamos por todas as etapas da reestruturação e organização da empresa. Os resultados têm sido excelentes, serviço de qualidade e confiança. Temos orgulho de ser clientes e temos certeza de que vocês se sairão bem juntos.",
    name: "NavegMAIS Telecom",
    role: "Provedor de Internet",
    rating: 5,
    // Logo do cliente no lugar da inicial.
    logo: { src: "/media/clients/navegmais.png" } as { src: string } | undefined,
  },

  categoryBlocks: {
    title: "Soluções para cada etapa do seu financeiro",
    description: "De operações societárias a controladoria do dia a dia, no mesmo time.",
  },

  // TODO(content): trocar os placeholders por imagens/telas reais da Vispe
  // (ex.: dashboards e relatórios) em /public/media/.
  showcaseCarousel: [
    { id: "placeholder-1", label: "Imagem ilustrativa 1" },
    { id: "placeholder-2", label: "Imagem ilustrativa 2" },
    { id: "placeholder-3", label: "Imagem ilustrativa 3" },
    { id: "placeholder-4", label: "Imagem ilustrativa 4" },
    { id: "placeholder-5", label: "Imagem ilustrativa 5" },
  ],

  servicesCarousel: {
    title: "Pilares do Equity",
    description:
      "Os três pilares que sustentam o valor da sua empresa, do caixa ao próximo salto.",
  },

  servicePillars: [
    {
      slug: "organizacao",
      shortLabel: "ORGANIZAÇÃO",
      tagline: "Organize o seu financeiro",
      name: "Organização",
      cta: "Quero me organizar",
      includes: ["Diagnóstico Financeiro", "BPO Financeiro", "Due Diligence"],
    },
    {
      slug: "margem",
      shortLabel: "MARGEM",
      tagline: "Multiplique o seu lucro",
      name: "Margem",
      cta: "Quero maximizar os lucros",
      includes: [
        "Gestão Financeira",
        "Planejamento Tributário",
        "Valuation",
        "Turnaround Financeiro",
        "Partnership",
      ],
    },
    {
      slug: "crescimento",
      shortLabel: "CRESCIMENTO",
      tagline: "Prepare-se para o próximo salto",
      name: "Crescimento",
      cta: "Quero crescer minha empresa",
      includes: ["Aceleração Comercial", "Fusões e Aquisições", "Captação de Recursos"],
    },
  ],

  // TODO(content): os campos `widgets` abaixo são ilustrativos (mini-cards de
  // UI inspirados no dashboard real), não dados de cliente — substituir pelos
  // indicadores reais de cada frente quando disponíveis.
  services: [
    {
      slug: "ma",
      shortLabel: "M&A",
      tagline: "Compre, venda ou funda com estratégia",
      name: "M&A — Fusões e Aquisições",
      description:
        "Compramos, vendemos e fundimos empresas com estratégia para maximizar o retorno.",
      includes: ["Mapeamento de compradores", "Negociação", "Due diligence", "Fechamento do deal"],
      widgets: [
        { label: "Deals em andamento", value: "3" },
        { label: "Etapa atual", value: "Due diligence" },
      ],
    },
    {
      slug: "captacao-de-recursos",
      shortLabel: "CAPTAÇÃO",
      tagline: "Conecte-se a quem investe no seu crescimento",
      name: "Captação de Recursos",
      description:
        "Estruturação e conexão com investidores, bancos e fundos para impulsionar o crescimento.",
      includes: ["Estruturação da rodada", "Rede de investidores", "Pitch deck", "Negociação de termos"],
      widgets: [
        { label: "Investidores na rede", value: "120+" },
        { label: "Rodada", value: "Série A" },
      ],
    },
    {
      slug: "planejamento-tributario",
      shortLabel: "TRIBUTÁRIO",
      tagline: "Pague só o imposto que você deve",
      name: "Planejamento Tributário",
      description:
        "Pare de pagar mais imposto do que deve. Redução legal da carga tributária com estratégia.",
      includes: ["Diagnóstico tributário", "Reorganização societária", "Enquadramento fiscal", "Compliance"],
      widgets: [
        { label: "Economia estimada", value: "-18%" },
        { label: "Regime", value: "Lucro real" },
      ],
    },
    {
      slug: "controladoria-financeira",
      shortLabel: "CONTROL",
      tagline: "Organize o seu financeiro",
      name: "Controladoria Financeira",
      description:
        "Gestão financeira estratégica que transforma números em decisões e faturamento em lucro real.",
      includes: ["Fluxo de caixa", "DRE gerencial", "Indicadores financeiros", "Rotina de fechamento"],
      widgets: [
        { label: "Margem líquida", value: "18,4%" },
        { label: "Fechamento", value: "Mensal" },
      ],
    },
    {
      slug: "aceleracao-comercial",
      shortLabel: "COMERCIAL",
      tagline: "Venda mais, com margem melhor",
      name: "Aceleração Comercial",
      description:
        "Estruturamos a sua operação comercial do zero: processos claros, inteligência de dados e um time focado em trazer contratos de alta margem.",
      includes: ["Funil comercial", "Playbook de vendas", "Inteligência de dados", "Gestão de time"],
      widgets: [
        { label: "Conversão do funil", value: "+24%" },
        { label: "Ticket médio", value: "+12%" },
      ],
    },
    {
      slug: "valuation",
      shortLabel: "VALUATION",
      tagline: "Saiba o real valor da sua empresa",
      name: "Valuation",
      description: "O valor real da sua empresa calculado com precisão. Você negocia com poder.",
      includes: ["Laudo técnico", "Múltiplos de mercado", "Fluxo de caixa descontado", "Relatório para negociação"],
      widgets: [
        { label: "Múltiplo aplicado", value: "4,8x" },
        { label: "Método", value: "Fluxo de caixa" },
      ],
    },
  ],

  about: {
    purpose:
      "A Vispe existe para democratizar o acesso ao mercado de capitais para pequenas e médias empresas. Atuamos como o braço estratégico que maximiza operações, transformando negócios locais em ativos de alto valor. Nosso objetivo é ser a bússola que guia o empresário rumo à liquidez e ao crescimento sustentável.",
    vision:
      "Ser a plataforma de referência nacional em soluções de equity para PMEs, reconhecida pela precisão técnica, integridade inabalável e por gerar resultados que impactam gerações de empreendedores.",
    values: [
      {
        name: "Soberania",
        description: "Dominamos o conhecimento técnico para dar segurança aos nossos clientes.",
      },
      {
        name: "Eficiência",
        description: "Foco absoluto na maximização da operação e dos resultados.",
      },
      {
        name: "Transparência",
        description: "Clareza total em processos complexos de equity e valuation.",
      },
      {
        name: "Impacto",
        description: "Transformamos a realidade financeira de empresas e seus fundadores.",
      },
    ],
    positioning:
      "A Vispe ocupa o espaço entre a consultoria tradicional e os grandes bancos de investimento. Oferecemos o know-how de Wall Street com a proximidade da Faria Lima, adaptado para a realidade da PME brasileira.",
    audience:
      "Atendemos fundadores e sucessores de PMEs que construíram negócios sólidos, mas precisam de braço técnico para acessar o mercado de equity. São líderes que buscam profissionalização, sucessão ou expansão e valorizam um parceiro que fale a língua do dono, mas com o rigor do mercado financeiro.",
  },

  clients: {
    title: "Nossos clientes",
    subtitle: "Eles escolheram sair do tradicional e escalar valor de verdade",
    // TODO(content): logos e nomes de clientes reais — não expor sem autorização do cliente.
    // Placeholders fictícios abaixo, nunca publicar sem substituir.
    logos: [
      "Empresa A",
      "Empresa B",
      "Empresa C",
      "Empresa D",
      "Empresa E",
      "Empresa F",
      "Empresa G",
      "Empresa H",
    ],
  },

  testimonialsSection: {
    title: "Empresários que crescem com a gente",
    description: "Feedback real de empresários que confiam na Vispe Capital.",
  },

  // TODO(content): depoimentos reais de clientes, com autorização — inclusive
  // foto (avatarUrl) quando o cliente autorizar uso de imagem. Placeholders
  // fictícios abaixo — nunca publicar como se fossem reais. `source: "x"`
  // marca depoimentos vindos de rede social (recebem o selo no card).
  testimonials: [
    {
      quote:
        "[Depoimento de exemplo: substituir] A Vispe organizou nosso financeiro em poucos meses e conseguimos enxergar onde estávamos perdendo margem.",
      name: "Cliente Exemplo",
      handle: "@clienteexemplo",
      role: "Fundador(a), Empresa Exemplo",
      rating: 5,
      source: undefined as "x" | undefined,
    },
    {
      quote:
        "[Depoimento de exemplo: substituir] O processo de valuation foi decisivo para a negociação com os investidores. Hoje conseguimos justificar cada número do nosso financeiro na mesa de negociação, sem depender de planilha avulsa.",
      name: "Cliente Exemplo",
      handle: "@clienteexemplo",
      role: "CEO, Empresa Exemplo",
      rating: 5,
      source: "x" as "x" | undefined,
    },
    {
      quote:
        "[Depoimento de exemplo: substituir] Ganhamos controladoria de verdade sem contratar um CFO em tempo integral.",
      name: "Cliente Exemplo",
      handle: "@clienteexemplo",
      role: "Sócio(a), Empresa Exemplo",
      rating: 5,
      source: undefined as "x" | undefined,
    },
    {
      quote:
        "[Depoimento de exemplo: substituir] A captação de recursos que estruturamos com a Vispe mudou o patamar da empresa. O time acompanhou cada etapa da negociação, trouxe clareza para decisões que antes travavam por falta de dado confiável, e isso fez toda diferença no fechamento.",
      name: "Cliente Exemplo",
      handle: "@clienteexemplo",
      role: "Fundador(a), Empresa Exemplo",
      rating: 5,
      source: undefined as "x" | undefined,
      avatarPlaceholder: true,
    },
    {
      quote:
        "[Depoimento de exemplo: substituir] Equipe próxima, técnica e que realmente entende a realidade de quem toca o negócio.",
      name: "Cliente Exemplo",
      handle: "@clienteexemplo",
      role: "Diretor(a) financeiro(a), Empresa Exemplo",
      rating: 5,
      source: "x" as "x" | undefined,
      avatarPlaceholder: true,
      mediaPlaceholder: true,
    },
    {
      quote:
        "[Depoimento de exemplo: substituir] Em poucos meses já conseguimos reduzir a carga tributária de forma legal e segura.",
      name: "Cliente Exemplo",
      handle: "@clienteexemplo",
      role: "Sócio(a), Empresa Exemplo",
      rating: 5,
      source: undefined as "x" | undefined,
    },
  ],

  // TODO(content): "24 Fin" é um produto ainda em definição — nome, logo e
  // copy abaixo são placeholders fictícios para fechar o layout, substituir
  // quando a marca e o posicionamento reais estiverem prontos.
  fin: {
    name: "24 Fin",
    title: "Seu CFO virtual, disponível 24 horas",
    description:
      "[Conteúdo de exemplo: substituir] Fluxo de caixa, indicadores e alertas financeiros organizados pela Vispe, acompanhando sua empresa todos os dias do mês.",
    ctaLabel: "Baixar a 24 Fin",
    // TODO(content): confirmar se 24 Fin terá app para download ou será
    // somente web — ajustar label/destino do CTA conforme a plataforma real.
    ctaHref: "/contato",
  },

  showcase: {
    title: "Organize seu financeiro, multiplique seu lucro",
    description:
      "Controladoria, fluxo de caixa e indicadores de gestão em um só lugar, para você decidir com clareza, não com achismo.",
    // TODO(content): vídeo overview real (YouTube/Vimeo), poster e id/URL do embed.
    video: {
      title: "Como a Vispe organiza o seu financeiro",
      embedUrl: undefined as string | undefined,
    },
  },

  // TODO(content): validar respostas com o time da Vispe antes de publicar.
  blog: {
    title: "Blog da Vispe",
    subtitle:
      "Conteúdo prático sobre gestão financeira, equity e crescimento para donos de empresa.",
  },

  faqIntro: {
    title: "Perguntas frequentes",
    subtitle: "Tire suas dúvidas sobre como a Vispe organiza o seu financeiro e aumenta o seu lucro.",
  },

  faq: [
    {
      question: "O que é o CFO as Service?",
      answer:
        "É a estruturação da inteligência financeira do seu negócio (controladoria, fluxo de caixa e indicadores de gestão), sem a necessidade de contratar um diretor financeiro em tempo integral.",
    },
    {
      question: "Preciso de um financeiro estruturado?",
      answer:
        "Não. Trabalhamos desde o diagnóstico inicial, organizando o financeiro do zero quando necessário, até a estruturação de processos mais avançados como M&A e captação.",
    },
    {
      question: "Como funciona o diagnóstico inicial?",
      answer:
        "Analisamos a situação financeira atual da empresa e apontamos onde estão as principais perdas de margem e oportunidades de estruturação, antes de qualquer compromisso.",
    },
    {
      question: "Vocês atendem empresas de qualquer porte?",
      answer:
        "Atendemos pequenas e médias empresas que já faturam e buscam profissionalizar a gestão financeira, seja para crescer, se preparar para sucessão ou acessar o mercado de capitais.",
    },
    {
      question: "Quais outros serviços vocês oferecem?",
      answer:
        "M&A, captação de recursos, planejamento tributário, aceleração comercial e valuation, cada um estruturado conforme o momento e a necessidade específica da empresa.",
    },
    {
      question: "Como funciona o BPO Financeiro?",
      answer:
        "Assumimos a rotina financeira da sua empresa (contas a pagar e a receber, conciliação e fluxo de caixa) para que você tenha informação confiável e tempo livre para tocar o negócio.",
    },
    {
      question: "O que é Valuation?",
      answer:
        "É a avaliação do valor real da sua empresa, com base em resultados, perspectivas e riscos. Serve de referência para vender, buscar sócios, captar recursos ou planejar a sucessão.",
    },
    {
      question: "O que é Due Diligence?",
      answer:
        "É uma análise detalhada das finanças, contratos e riscos de uma empresa antes de uma compra, fusão ou investimento, para que a decisão seja tomada com dados e sem surpresas.",
    },
    {
      question: "Quando faz sentido pensar em M&A?",
      answer:
        "Quando a empresa quer crescer comprando operações, se unir a um parceiro estratégico ou vender o negócio. Estruturamos o processo para maximizar o retorno em cada etapa.",
    },
    {
      question: "O que é Turnaround Financeiro?",
      answer:
        "É o plano de recuperação para empresas com caixa pressionado ou margens em queda: reorganizamos custos, dívidas e processos para devolver a saúde financeira ao negócio.",
    },
    {
      question: "Como funciona a captação de recursos?",
      answer:
        "Preparamos a empresa e os números para apresentar a investidores e instituições, e apoiamos a escolha da melhor fonte de recurso para o seu momento.",
    },
    {
      question: "Como o planejamento tributário ajuda?",
      answer:
        "Revisamos a estrutura fiscal da empresa para identificar o enquadramento mais eficiente e reduzir a carga tributária dentro da lei, liberando margem para o seu lucro.",
    },
  ],

  partners: {
    title: "Nossos parceiros",
    subtitle: "Ser parceiro da Vispe é acessar crescimento, comissões e valorização",
    cta: { label: "Quero me tornar um parceiro", href: "/contato" },
  },

  education: {
    eyebrow: "Educação & Equity",
    title: "O que o seu faturamento não te deixa enxergar",
    description:
      "Faturamento é ego, lucro é realidade. Nestas aulas rápidas, revelamos os erros estruturais que permanecem invisíveis até para os donos mais experientes. Entenda por que vender mais não está resolvendo seu problema de caixa e como o diagnóstico financeiro é a única ferramenta capaz de estancar a sangria do seu patrimônio.",
  },

  contact: {
    title: "Fale com a Vispe",
    subtitle: "Pronto para maximizar o valor da sua empresa?",
    description:
      "Preencha o formulário e um especialista da Vispe Capital entrará em contato, com a clareza de quem já transformou centenas de empresas Brasil afora.",
  },

  // Âncoras da home ("/#id" funciona também a partir das páginas internas).
  nav: [
    { label: "Sobre", href: "/#solucoes" },
    { label: "Soluções", href: "/#servicos" },
    { label: "Feedbacks", href: "/#depoimentos" },
    { label: "Equity", href: "/#equity" },
    { label: "FAQ", href: "/#faq" },
    { label: "Blog", href: "/#blog" },
  ],

  // Footer: só links para páginas/âncoras que existem hoje. Política de
  // privacidade e termos entram aqui quando as páginas forem criadas.
  footer: {
    description:
      "Aumentamos seu caixa e maximizamos sua margem de lucro, sem precisar contratar um diretor executivo em tempo integral.",
    cta: { label: "Agendar diagnóstico", href: "/contato" },
    socialLabel: "Siga a Vispe",
    columns: {
      company: {
        title: "Empresa",
        links: [
          { label: "Quem somos", href: "/sobre" },
          { label: "Depoimentos", href: "/#depoimentos" },
          { label: "Equity", href: "/#equity" },
          { label: "Trabalhe conosco", href: "/trabalhe-conosco" },
          { label: "Perguntas frequentes", href: "/#faq" },
        ],
      },
      services: {
        title: "Soluções",
        href: "/#servicos",
        // Rótulo mais curto só no footer (o nome completo segue nas seções).
        labels: { ma: "Fusões e Aquisições" } as Record<string, string>,
      },
      content: { title: "Conteúdo", postsLimit: 3, moreLabel: "Ver todos os artigos", moreHref: "/#blog" },
      contact: {
        title: "Atendimento",
        links: [
          { label: "Fale com a Vispe", href: "/contato" },
          { label: "Agende um diagnóstico", href: "/contato" },
          { label: "CFO virtual 24 Fin", href: "/#fin" },
        ],
      },
    },
    rights: "Todos os direitos reservados.",
    backToTop: "Voltar ao topo ↑",
  },


  // Textos de interface usados pelos componentes (acessibilidade, rótulos).
  ui: {
    mainNav: "Navegação principal",
    headerCta: { label: "Agendar diagnóstico", href: "/contato" },
    openMenu: "Abrir menu",
    closeMenu: "Fechar menu",
    resultsLabel: "Resultados da Vispe Capital",
    solutionsLabel: "Soluções oferecidas",
    pillarsLabel: "Soluções da Vispe Capital",
    galleryLabel: "Galeria da Vispe Capital",
    socialProfile: "{network} da Vispe Capital",
    includes: "Inclui:",
    pillar: "Pilar {n}",
    rating: "Avaliação {rating} de 5 estrelas",
    videoPlaceholder: "Vídeo em produção (placeholder)",
    dashboardSrc: "/media/hero/tela-mac-3-2600.webp",
    dashboardAlt:
      "Painel CFO as Service da Vispe Capital, exibindo receita recorrente, CAC, LTV/CAC, churn, funil comercial e receita por produto",
    home: "Início",
    readingTime: "{minutes} min de leitura",
    blogPosts: "Artigos do blog",
    blogPages: "Páginas do blog",
    blogGoToPage: "Ir para o grupo {page} de {total}",
    backToBlog: "Voltar ao blog",
    // Aviso exibido nos artigos fora do português (o blog só existe em pt-BR).
    portugueseOnly: "",
  },

  // Títulos das páginas internas (metadata e h1).
  pages: {
    about: { title: "Sobre", heading: "Sobre a Vispe Capital" },
    contact: { title: "Contato" },
    careers: { title: "Trabalhe conosco" },
  },
} as const;
