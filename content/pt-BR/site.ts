import type { FaqItem, Testimonial } from "../types";

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
    ctaPrimary: { label: "Potencialize seu lucro agora", href: "/#diagnostico" },
    ctaSecondary: { label: "Como funciona o CFO as Service", href: "#servicos" },
    bullets: [
      "Especialistas em PMEs",
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

  // Cada solução mostra widgets ilustrativos da parede do Fin 24/7 (até 2 linhas).
  services: [
    {
      slug: "controladoria-financeira",
      shortLabel: "CONTROL",
      tagline: "Organize o seu financeiro",
      name: "Controladoria Financeira",
      description:
        "Gestão financeira estratégica que transforma números em decisões e faturamento em lucro real. Organizamos fluxo de caixa, DRE e indicadores em uma rotina mensal clara, para você saber exatamente onde a empresa ganha e onde perde margem.",
      includes: ["Fluxo de caixa", "DRE gerencial", "Indicadores financeiros", "Rotina de fechamento"],
      // Widgets da parede do Fin 24/7 (ids em content/<locale>/fin-wall.ts).
      finWidgets: ["income-statement", "reconciliation", "default-rate", "payables", "receivables"],
    },
    {
      slug: "aceleracao-comercial",
      shortLabel: "COMERCIAL",
      tagline: "Venda mais, com margem melhor",
      name: "Aceleração Comercial",
      description:
        "Estruturamos a sua operação comercial do zero: processos claros, inteligência de dados e um time focado em trazer contratos de alta margem. Cada etapa do funil passa a ser medida, para que a empresa cresça vendendo melhor, e não apenas mais.",
      includes: ["Funil comercial", "Playbook de vendas", "Inteligência de dados", "Gestão de time"],
      // Widgets da parede do Fin 24/7 (ids em content/<locale>/fin-wall.ts).
      finWidgets: ["revenue", "revenue-goal", "avg-ticket", "payment-confirmed", "break-even"],
    },
    {
      slug: "captacao-de-recursos",
      shortLabel: "CAPTAÇÃO",
      tagline: "Conecte-se a quem investe no seu crescimento",
      name: "Captação de Recursos",
      description:
        "Estruturação e conexão com investidores, bancos e fundos para impulsionar o crescimento. Preparamos os números, a tese e a apresentação da empresa, e conduzimos a negociação para que o capital chegue nas melhores condições para o seu momento.",
      includes: ["Estruturação da rodada", "Rede de investidores", "Pitch deck", "Negociação de termos"],
      // Widgets da parede do Fin 24/7 (ids em content/<locale>/fin-wall.ts).
      finWidgets: ["cash-runway", "in-today", "out-today", "balance", "bank-balances"],
    },
    {
      slug: "ma",
      shortLabel: "M&A",
      tagline: "Compre, venda ou funda com estratégia",
      name: "Fusões e Aquisições (M&A)",
      description:
        "Compramos, vendemos e fundimos empresas com estratégia para maximizar o retorno. Conduzimos todo o processo, do mapeamento de oportunidades à negociação e ao fechamento, com due diligence rigorosa para que cada decisão seja tomada sem surpresas.",
      includes: ["Mapeamento de compradores", "Negociação", "Due diligence", "Fechamento do deal"],
      // Widgets da parede do Fin 24/7 (ids em content/<locale>/fin-wall.ts).
      finWidgets: ["cash-flow-30d", "monthly-report", "gross-margin"],
    },
    {
      slug: "planejamento-tributario",
      shortLabel: "TRIBUTÁRIO",
      tagline: "Pague só o imposto que você deve",
      name: "Planejamento Tributário",
      description:
        "Pare de pagar mais imposto do que deve. Redução legal da carga tributária com estratégia. Revisamos o enquadramento fiscal e a estrutura societária da empresa para liberar margem dentro da lei, com segurança e conformidade em cada etapa.",
      includes: ["Diagnóstico tributário", "Reorganização societária", "Enquadramento fiscal", "Compliance"],
      // Widgets da parede do Fin 24/7 (ids em content/<locale>/fin-wall.ts).
      finWidgets: ["tax-savings", "tax-regime", "fixed-cost", "taxes", "expenses-by-category"],
    },
    {
      slug: "valuation",
      shortLabel: "VALUATION",
      tagline: "Saiba o real valor da sua empresa",
      name: "Valuation",
      description:
        "O valor real da sua empresa calculado com precisão. Você negocia com poder. Combinamos fluxo de caixa descontado e múltiplos de mercado em um laudo técnico que sustenta cada número na mesa, seja para vender, captar ou planejar a sucessão.",
      includes: ["Laudo técnico", "Múltiplos de mercado", "Fluxo de caixa descontado", "Relatório para negociação"],
      // Widgets da parede do Fin 24/7 (ids em content/<locale>/fin-wall.ts).
      finWidgets: ["ytd-profit", "ebitda", "net-margin"],
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
    description: "Depoimentos reais de empresários que confiam na Vispe Capital.",
  },

  // Depoimentos reais: trechos literais dos clientes (texto completo no commit cc3659a).
  testimonials: [
    {
      quote:
        "…com o serviço de CFO, o negócio pegou uma velocidade muito maior. E hoje nós estamos extremamente satisfeitos. Eu super indico a Vispe…",
      name: "JR Net",
      segment: "Provedor de Internet",
      avatar: "/media/clients/jr-net-160.webp",
      instagram: "https://www.instagram.com/jrnet_provedor/",
      website: "https://jrnetprovedor.com.br/",
    },
    {
      quote:
        "…passamos por todas as etapas de reestruturação da empresa seguindo as indicações dos consultores, e os resultados foram maravilhosos.",
      name: "FlyFibra",
      segment: "Provedor de Internet",
      avatar: "/media/clients/flyfibra-160.webp",
      instagram: "https://www.instagram.com/flyfibra/",
      website: "https://flyfibra.com.br/",
    },
    {
      quote:
        "…realizamos o serviço de Valuation com a Vispe e não temos nenhum acontecimento que nos impeça de recomendar com total segurança e confiança os serviços oferecidos por ela.",
      name: "Virtex",
      segment: "Provedor de Internet",
      avatar: "/media/clients/virtex-160.webp",
      instagram: "https://www.instagram.com/virtextelecom/",
      website: "https://virtex.com.br",
    },
    {
      quote:
        "…contratei o serviço de Equity Mentory, e desde então, o planejamento de minhas estratégias tem sido elaboradas e organizadas pela Vispe. Sempre indico, pois vi a diferença de perto, e foi necessária!",
      name: "GLPNet",
      segment: "Provedor de Internet",
      avatar: "/media/clients/glpnet-160.webp",
      instagram: "https://www.instagram.com/glpnet/",
      website: "https://glpnet.com.br/",
    },
    {
      quote:
        "…eu digo que eles estão me ensinando, tô aprendendo com eles. Tô aprendendo a gerir… 20 anos de empresa, tô aprendendo a gerir com eles agora.",
      name: "Cyber Internet",
      segment: "Provedor de Internet",
      avatar: "/media/clients/cyber-160.webp",
      instagram: "https://www.instagram.com/cyber.internet/",
      website: "https://www.cyberinternet.com.br/",
    },
    {
      quote:
        "Com orgulho dizemos que há anos somos clientes da Vispe Capital, e fazemos questão de contatá-la em todos os nossos planos e processos, dos mais simples aos mais estratégicos…",
      name: "AONET",
      segment: "Provedor de Internet",
      avatar: "/media/clients/aonet-160.webp",
      instagram: "https://www.instagram.com/aonet.internet/",
      website: "https://aonet.com.br/",
    },
    {
      quote:
        "…devido à ótima experiência que tivemos, recomendamos os serviços da Vispe Capital. Empresa essa que sempre nos atendeu com muito profissionalismo, segurança e dedicação.",
      name: "TR Dream Telecom",
      segment: "Provedor de Internet",
      avatar: "/media/clients/tr-dream-160.webp",
      instagram: "https://www.instagram.com/trdreamtelecom/",
    },
  ] as readonly Testimonial[],

  // Fin 24/7: CFO virtual da Vispe (portal web do cliente).
  fin: {
    name: "Fin 24/7",
    title: "Seu CFO virtual, disponível 24 horas",
    description:
      "O Fin 24/7 conecta seus bancos via Open Finance e mostra caixa, projeção de 90 dias e contas a pagar e a receber em um só painel. Simule cenários e tire dúvidas com a IA para decidir com segurança, a qualquer hora.",
    ctaLabel: "Conhecer o Fin 24/7",
    // Login do portal do Fin 24/7 (link externo, abre em nova aba).
    ctaHref: "https://vispeos.vercel.app/cfo/portal/login",
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
    title: "Conteúdos para você ficar por dentro sobre Equity",
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
        "É a contratação do know-how estratégico de um Diretor Financeiro (CFO) sênior de forma fracionada/terceirizada. Em vez de arcar com os altos custos trabalhistas de um executivo CLT, sua empresa conta com uma equipe especializada da Vispe para estruturar DRE gerencial, analisar margens de lucro, projetar fluxo de caixa e orientar suas decisões de crescimento.",
    },
    {
      question: "Preciso de um financeiro estruturado?",
      answer:
        "Se a sua empresa vende bem mas o caixa não cresce, se você toma decisões no “achismo” ou gasta tempo demais apagando incêndios operacionais, sim. Um financeiro estruturado traz previsibilidade de caixa, clareza sobre quais produtos geram lucro real e proteção contra desperdícios.",
    },
    {
      question: "Como funciona o diagnóstico inicial?",
      answer:
        "Nosso diagnóstico é um raio-X completo das finanças da sua empresa. Analisamos seus processos, indicadores de caixa, margens e custos ocultos para identificar exatamente onde seu negócio está perdendo dinheiro e quais são as maiores oportunidades para destravar lucro e aumentar o valor de mercado (Equity) do seu negócio.",
    },
    {
      question: "Vocês atendem empresas de qualquer porte?",
      answer:
        "Atendemos principalmente pequenas e médias empresas (PMEs) que buscam sair do amadorismo financeiro e escalar seu valor de mercado. Temos soluções adaptadas para cada estágio de maturidade: desde quem precisa organizar o operacional até PMEs em fase de captação de investimentos ou M&A.",
    },
    {
      question: "Quais outros serviços vocês oferecem?",
      answer:
        "Oferecemos um ecossistema completo para a maturidade financeira do seu negócio:",
      items: [
        { label: "Estratégicos", text: "CFO as a Service, Controladoria, Valuation e Planejamento Tributário." },
        { label: "Operacionais", text: "BPO Financeiro e Diagnóstico de Eficiência." },
        { label: "Transacionais", text: "M&A (Compra e Venda de Empresas), Captação de Recursos e Due Diligence." },
      ],
    },
    {
      question: "Como funciona o BPO Financeiro?",
      answer:
        "É a terceirização do “braço operacional” do seu financeiro. A equipe da Vispe assume a rotina pesada de contas a pagar e receber, conciliação bancária diária e emissão de notas/boletos. Você ganha tempo e a garantia de dados 100% organizados e confiáveis para alimentar a gestão estratégica.",
    },
    {
      question: "O que é Valuation?",
      answer:
        "É o cálculo técnico e rigoroso do valor real de mercado da sua empresa. O Valuation da Vispe considera seus fluxos de caixa projetados, margens e ativos para te dar poder de negociação perante investidores, sócios ou compradores em processos de fusão e aquisição.",
    },
    {
      question: "O que é Due Diligence?",
      answer:
        "É uma auditoria aprofundada nas áreas financeira, contábil, fiscal e jurídica da empresa. Ela serve para validar as informações antes de uma operação de M&A ou captação, identificando riscos ocultos e garantindo total segurança tanto para quem compra/investe quanto para quem vende.",
    },
    {
      question: "Quando faz sentido pensar em M&A?",
      answer:
        "O M&A (Fusões e Aquisições) faz sentido em momentos estratégicos: quando você deseja realizar o ganho financeiro vendendo a empresa (evento de liquidez), quer atrair um sócio investidor para acelerar a expansão, ou pretende adquirir concorrentes para dominar o mercado. O momento ideal de preparação é antes de precisar vender.",
    },
    {
      question: "O que é Turnaround Financeiro?",
      answer:
        "É o processo de reestruturação intensiva para empresas que enfrentam crises severas de caixa, endividamento alto ou margens corroídas. Nós intervimos para estancar sangrias financeiras, renegociar passivos, ajustar a operação e reestabelecer a saúde e lucratividade do negócio.",
    },
    {
      question: "Como funciona a captação de recursos?",
      answer:
        "Nós estruturamos a tese financeira da sua empresa, preparamos a documentação executiva e conectamos seu negócio às melhores fontes de capital do mercado (bancos, fundos de investimento, crédito estruturado e investidores privados), garantindo as melhores taxas e condições.",
    },
    {
      question: "Como o planejamento tributário ajuda?",
      answer:
        "O planejamento tributário identifica formas legais e estratégicas de reduzir a carga de impostos cobrada sobre o seu faturamento e lucro. Ao pagar apenas o estritamente necessário por lei, o dinheiro economizado vai direto para o caixa da empresa, aumentando a margem de lucro líquida.",
    },
  ] as readonly FaqItem[],

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
    form: {
      fields: {
        name: "Nome",
        email: "E-mail",
        phone: "WhatsApp",
        company: "Empresa",
        segment: "Segmento",
        revenue: "Faturamento mensal",
        interest: "Como podemos ajudar?",
        message: "Conte um pouco do seu momento (opcional)",
      },
      revenueOptions: [
        "Até R$ 100 mil",
        "R$ 100 mil a R$ 500 mil",
        "R$ 500 mil a R$ 2 milhões",
        "Acima de R$ 2 milhões",
      ],
      revenuePlaceholder: "Selecione",
      notSure: "Ainda não sei",
      consent: "Concordo que a Vispe Capital use estes dados para entrar em contato sobre o diagnóstico, conforme a LGPD.",
      submit: "Quero meu diagnóstico",
      sending: "Enviando…",
    },
    messages: {
      invalid: "Revise os campos destacados.",
      success: "Recebemos seus dados. Um especialista da Vispe Capital vai entrar em contato em breve.",
      unavailable:
        "O envio pelo site ainda está sendo configurado. Enquanto isso, fale com a gente pelas redes da Vispe.",
      errors: {
        required: "Preencha este campo.",
        email: "Informe um e-mail válido.",
        phone: "Informe um WhatsApp com DDD.",
        revenue: "Selecione uma faixa de faturamento.",
        interest: "Escolha uma opção.",
        consent: "É preciso concordar para enviarmos o contato.",
      },
    },
  },

  // Âncoras da home ("/#id" funciona também a partir das páginas internas).
  nav: [
    { label: "Sobre", href: "/#solucoes" },
    { label: "Soluções", href: "/#servicos" },
    { label: "Depoimentos", href: "/#depoimentos" },
    { label: "Equity", href: "/#equity" },
    { label: "Conteúdo", href: "/#blog" },
    { label: "FAQ", href: "/#faq" },
  ],

  // Footer: só links para páginas/âncoras que existem hoje. Política de
  // privacidade e termos entram aqui quando as páginas forem criadas.
  footer: {
    description:
      "Aumentamos seu caixa e maximizamos sua margem de lucro, sem precisar contratar um diretor executivo em tempo integral.",
    cta: { label: "Agendar diagnóstico", href: "/#diagnostico" },
    socialLabel: "Siga a Vispe",
    columns: {
      company: {
        title: "Empresa",
        // Mesmos destinos do menu (site.nav), com outras palavras; + Carreiras.
        links: [
          { label: "Conheça a Vispe", href: "/#solucoes" },
          { label: "Nossas soluções", href: "/#servicos" },
          { label: "Depoimentos", href: "/#depoimentos" },
          { label: "Pilares do Equity", href: "/#equity" },
          { label: "Conteúdos e artigos", href: "/#blog" },
          { label: "Perguntas frequentes", href: "/#faq" },
          { label: "Carreiras", href: "/trabalhe-conosco" },
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
          { label: "Agende um diagnóstico", href: "/#diagnostico" },
          { label: "Fin 24/7, CFO virtual", href: "/#fin" },
        ],
      },
    },
    rights: "Todos os direitos reservados.",
    backToTop: "Voltar ao topo ↑",
    cookiePreferences: "Preferências de cookies",
    motionPause: "Pausar animações",
    motionPlay: "Retomar animações",
  },


  // Textos de interface usados pelos componentes (acessibilidade, rótulos).
  ui: {
    mainNav: "Navegação principal",
    headerCta: { label: "Agendar diagnóstico", href: "/#diagnostico" },
    openMenu: "Abrir menu",
    closeMenu: "Fechar menu",
    resultsLabel: "Resultados da Vispe Capital",
    solutionsLabel: "Soluções oferecidas",
    pillarsLabel: "Soluções da Vispe Capital",
    galleryLabel: "Episódios do podcast Equity Talks",
    episodeLabel: "Equity Talks, episódio {number}: {title}",
    episodeWatch: "Assistir no YouTube",
    socialProfile: "{network} da Vispe Capital",
    testimonialInstagram: "Instagram da {name}",
    testimonialWebsite: "Site da {name}",
    testimonialRating: "Avaliação: {rating} de {max} estrelas",
    byAuthor: "Por {name}",
    followTitle: "Acompanhe a Vispe nas redes",
    followText: "Mais conteúdo sobre equity, gestão e crescimento no Instagram, LinkedIn, Facebook, YouTube e no podcast Equity Talks, no Spotify.",
    widgetAdjust: "Arraste para os lados para ajustar",
    widgetCycle: "Toque para trocar",
    cookies: {
      title: "Valorizamos a sua privacidade",
      description:
        "Usamos cookies essenciais para o site funcionar e, com a sua permissão, cookies de análise e marketing para entender como o site é usado e quais campanhas trazem visitantes. Você pode aceitar tudo, rejeitar tudo ou escolher.",
      acceptAll: "Aceitar todos",
      rejectAll: "Rejeitar todos",
      manage: "Gerenciar preferências",
      preferencesTitle: "Preferências de cookies",
      save: "Salvar preferências",
      alwaysOn: "Sempre ativos",
      categories: {
        necessary: {
          label: "Essenciais",
          description: "Necessários para o site funcionar, como lembrar a sua escolha sobre cookies. Não podem ser desativados.",
        },
        analytics: {
          label: "Análise",
          description: "Ajudam a entender como o site é usado, de forma agregada, para melhorar páginas e conteúdos.",
        },
        marketing: {
          label: "Marketing",
          description: "Medem quais campanhas e anúncios trazem visitantes e permitem mostrar conteúdos mais relevantes.",
        },
      },
    },
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
    blogCategories: "Filtrar por categoria",
    blogAllCategories: "Tudo",
    backToBlog: "Voltar aos conteúdos",
    // Aviso exibido nos artigos fora do português (o blog só existe em pt-BR).
    portugueseOnly: "",
  },

  // Títulos das páginas internas (metadata e h1).
  pages: {
    about: { title: "Sobre", heading: "Sobre a Vispe Capital" },
    contact: { title: "Contato" },
    careers: { title: "Carreiras" },
  },
} as const;
