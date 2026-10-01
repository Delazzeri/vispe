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

  // TODO(content): números reais — o site atual renderiza esses contadores via JS
  // (client-side animation), não foi possível capturar os valores finais no fetch.
  // Confirmar com o time antes de publicar.
  metrics: [
    { label: "Equity gerenciado", value: "TODO", prefix: "+R$", suffix: "bi" },
    { label: "M&A transacionados", value: "TODO", prefix: "+R$", suffix: "mi" },
    { label: "Laudos de valuation emitidos", value: "TODO", prefix: "+" },
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
  },

  services: [
    {
      slug: "ma",
      name: "M&A — Fusões e Aquisições",
      description:
        "Compramos, vendemos e fundimos empresas com estratégia para maximizar o retorno.",
      includes: ["Mapeamento de compradores", "Negociação", "Due diligence", "Fechamento do deal"],
    },
    {
      slug: "captacao-de-recursos",
      name: "Captação de Recursos",
      description:
        "Estruturação e conexão com investidores, bancos e fundos para impulsionar o crescimento.",
      includes: ["Estruturação da rodada", "Rede de investidores", "Pitch deck", "Negociação de termos"],
    },
    {
      slug: "planejamento-tributario",
      name: "Planejamento Tributário",
      description:
        "Pare de pagar mais imposto do que deve. Redução legal da carga tributária com estratégia.",
      includes: ["Diagnóstico tributário", "Reorganização societária", "Enquadramento fiscal", "Compliance"],
    },
    {
      slug: "controladoria-financeira",
      name: "Controladoria Financeira",
      description:
        "Gestão financeira estratégica que transforma números em decisões e faturamento em lucro real.",
      includes: ["Fluxo de caixa", "DRE gerencial", "Indicadores financeiros", "Rotina de fechamento"],
    },
    {
      slug: "aceleracao-comercial",
      name: "Aceleração Comercial",
      description:
        "Estruturamos a sua operação comercial do zero: processos claros, inteligência de dados e um time focado em trazer contratos de alta margem.",
      includes: ["Funil comercial", "Playbook de vendas", "Inteligência de dados", "Gestão de time"],
    },
    {
      slug: "valuation",
      name: "Valuation",
      description: "O valor real da sua empresa calculado com precisão. Você negocia com poder.",
      includes: ["Laudo técnico", "Múltiplos de mercado", "Fluxo de caixa descontado", "Relatório para negociação"],
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
    logos: [],
  },

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
