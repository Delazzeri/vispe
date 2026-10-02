export const site = {
  name: "Vispe Capital",
  tagline: "ORGANIZAMOS O SEU FINANCEIRO E AUMENTAMOS O SEU LUCRO",
  url: "https://www.vispe.com.br",
  locale: "pt-BR",

  hero: {
    eyebrow: "Sua controladoria financeira",
    h1: "Inteligência financeira estratégica",
    subheadline:
      "Pare de perder dinheiro por falta de controle financeiro. Organizamos o seu financeiro e aumentamos o seu lucro.",
    description:
      "Aumentamos seu caixa e maximizamos sua margem de lucro, sem precisar contratar um diretor executivo em tempo integral.",
    ctaPrimary: { label: "Potencialize seu lucro agora", href: "/contato" },
    ctaSecondary: { label: "Como funciona o CFO as Service", href: "#servicos" },
  },

  proposition: {
    eyebrow: "Com quem você vai andar",
    title: "Não é uma consultoria de relatório",
    description:
      "Transformamos negócios comuns em ativos de alto valor, prontos para atrair investidores e chegar a um evento de liquidez milionário.",
  },

  metrics: [
    { label: "Equity gerenciado", value: "2", prefix: "+R$", suffix: "Bi" },
    { label: "M&A transacionado", value: "700", prefix: "+R$", suffix: "Mi" },
    { label: "Laudos de valuation emitidos", value: "300", prefix: "+", suffix: "" },
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
      "[Depoimento de exemplo — substituir] Finalmente consegui enxergar para onde estava indo o lucro da empresa. O time da Vispe fala a nossa língua.",
    name: "Cliente Exemplo",
    role: "Fundador(a), Empresa Exemplo",
    rating: 5,
  },

  categoryBlocks: {
    title: "Soluções para cada etapa do seu financeiro",
    description: "De operações societárias a controladoria do dia a dia, no mesmo time.",
  },

  servicesCarousel: {
    title: "Explore nossas soluções",
    description: "Cada frente do seu financeiro, com processo, entrega e resultado claros.",
  },

  servicePillars: [
    {
      slug: "organizacao",
      shortLabel: "ORGANIZAÇÃO",
      tagline: "Organize o seu financeiro",
      name: "Organização",
      includes: ["Diagnóstico Financeiro", "BPO Financeiro", "Due Diligence"],
    },
    {
      slug: "margem",
      shortLabel: "MARGEM",
      tagline: "Multiplique o seu lucro",
      name: "Margem",
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
        "[Depoimento de exemplo — substituir] A Vispe organizou nosso financeiro em poucos meses e conseguimos enxergar onde estávamos perdendo margem.",
      name: "Cliente Exemplo",
      handle: "@clienteexemplo",
      role: "Fundador(a), Empresa Exemplo",
      rating: 5,
      source: undefined as "x" | undefined,
    },
    {
      quote:
        "[Depoimento de exemplo — substituir] O processo de valuation foi decisivo para a negociação com os investidores. Hoje conseguimos justificar cada número do nosso financeiro na mesa de negociação, sem depender de planilha avulsa.",
      name: "Cliente Exemplo",
      handle: "@clienteexemplo",
      role: "CEO, Empresa Exemplo",
      rating: 5,
      source: "x" as "x" | undefined,
    },
    {
      quote:
        "[Depoimento de exemplo — substituir] Ganhamos controladoria de verdade sem contratar um CFO em tempo integral.",
      name: "Cliente Exemplo",
      handle: "@clienteexemplo",
      role: "Sócio(a), Empresa Exemplo",
      rating: 5,
      source: undefined as "x" | undefined,
    },
    {
      quote:
        "[Depoimento de exemplo — substituir] A captação de recursos que estruturamos com a Vispe mudou o patamar da empresa. O time acompanhou cada etapa da negociação, trouxe clareza para decisões que antes travavam por falta de dado confiável, e isso fez toda diferença no fechamento.",
      name: "Cliente Exemplo",
      handle: "@clienteexemplo",
      role: "Fundador(a), Empresa Exemplo",
      rating: 5,
      source: undefined as "x" | undefined,
      avatarPlaceholder: true,
    },
    {
      quote:
        "[Depoimento de exemplo — substituir] Equipe próxima, técnica e que realmente entende a realidade de quem toca o negócio.",
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
        "[Depoimento de exemplo — substituir] Em poucos meses já conseguimos reduzir a carga tributária de forma legal e segura.",
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
      "[Conteúdo de exemplo — substituir] Fluxo de caixa, indicadores e alertas financeiros organizados pela Vispe, acompanhando sua empresa todos os dias do mês.",
    ctaLabel: "Baixar a 24 Fin",
    // TODO(content): confirmar se 24 Fin terá app para download ou será
    // somente web — ajustar label/destino do CTA conforme a plataforma real.
    ctaHref: "/contato",
  },

  showcase: {
    title: "Organize seu financeiro, multiplique seu lucro",
    description:
      "Controladoria, fluxo de caixa e indicadores de gestão em um só lugar — para você decidir com clareza, não com achismo.",
    // TODO(content): vídeo overview real (YouTube/Vimeo), poster e id/URL do embed.
    video: {
      title: "Como a Vispe organiza o seu financeiro",
      embedUrl: undefined as string | undefined,
    },
  },

  faq: [
    {
      question: "O que é o CFO as Service?",
      answer:
        "É a estruturação da inteligência financeira do seu negócio — controladoria, fluxo de caixa e indicadores de gestão — sem a necessidade de contratar um diretor financeiro em tempo integral.",
    },
    {
      question: "Preciso ter um financeiro estruturado para contratar a Vispe?",
      answer:
        "Não. Trabalhamos desde o diagnóstico inicial, organizando o financeiro do zero quando necessário, até a estruturação de processos mais avançados como M&A e captação.",
    },
    {
      question: "Como funciona o diagnóstico inicial?",
      answer:
        "Analisamos a situação financeira atual da empresa e apontamos onde estão as principais perdas de margem e oportunidades de estruturação, antes de qualquer compromisso.",
    },
    {
      question: "A Vispe atende empresas de qualquer porte?",
      answer:
        "Atendemos pequenas e médias empresas que já faturam e buscam profissionalizar a gestão financeira, seja para crescer, se preparar para sucessão ou acessar o mercado de capitais.",
    },
    {
      question: "Quais serviços a Vispe oferece além da controladoria?",
      answer:
        "M&A, captação de recursos, planejamento tributário, aceleração comercial e valuation — cada um estruturado conforme o momento e a necessidade específica da empresa.",
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

  nav: [
    { label: "Soluções", href: "#servicos" },
    { label: "Educação", href: "#educacao" },
    { label: "Sobre", href: "/sobre" },
    { label: "Contato", href: "/contato" },
  ],

  social: {
    // TODO(content): confirmar handles/URLs exatos antes de publicar no footer.
    instagram: undefined,
    whatsapp: undefined,
    youtube: undefined,
    spotify: undefined,
  },
} as const;
