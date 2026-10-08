// Página "Materiais gratuitos" — catálogo de downloads com cadastro rápido.
// TODO(content): os itens abaixo são sugestões de pauta, não materiais prontos.
// Para publicar um material, coloque o arquivo em public/materiais/ e preencha
// `file` (ex.: "/materiais/planilha-fluxo-de-caixa.xlsx"). Sem `file`, o card
// aparece como "Em breve".

export const materials = {
  hero: {
    eyebrow: "Materiais gratuitos",
    title: "Ferramentas para organizar o financeiro e aumentar o lucro",
    description:
      "Planilhas, checklists e guias práticos feitos pelo time da Vispe Capital. Escolha um material, deixe seu contato e baixe na hora.",
  },

  categories: { organizacao: "Organização", margem: "Margem", crescimento: "Crescimento" },

  items: [
    {
      slug: "planilha-fluxo-de-caixa",
      type: "Planilha",
      category: "organizacao",
      title: "Planilha de fluxo de caixa",
      description: "Registre entradas e saídas e projete o caixa dos próximos meses sem depender de sistema.",
      file: undefined,
    },
    {
      slug: "modelo-dre-gerencial",
      type: "Planilha",
      category: "margem",
      title: "Modelo de DRE gerencial",
      description: "Veja receita, custos e lucro do mês em uma estrutura simples, pronta para a reunião de resultados.",
      file: undefined,
    },
    {
      slug: "checklist-due-diligence",
      type: "Checklist",
      category: "organizacao",
      title: "Checklist de due diligence",
      description: "Os documentos e pontos de atenção que um comprador ou investidor vai pedir antes de fechar negócio.",
      file: undefined,
    },
    {
      slug: "guia-regime-tributario",
      type: "Guia",
      category: "margem",
      title: "Como escolher o regime tributário",
      description: "Simples Nacional, Lucro Presumido ou Lucro Real: o que comparar antes de decidir.",
      file: undefined,
    },
    {
      slug: "guia-valuation-pmes",
      type: "E-book",
      category: "crescimento",
      title: "Valuation para PMEs",
      description: "Entenda como o mercado calcula o valor de uma empresa e o que mais pesa no preço.",
      file: undefined,
    },
    {
      slug: "roteiro-captacao-de-recursos",
      type: "Guia",
      category: "crescimento",
      title: "Roteiro para captação de recursos",
      description: "Do diagnóstico à apresentação: como se preparar para buscar crédito ou investidores.",
      file: undefined,
    },
  ] as readonly {
    slug: string;
    type: string;
    category: "organizacao" | "margem" | "crescimento";
    title: string;
    description: string;
    file: string | undefined;
  }[],

  card: { download: "Baixar grátis", soon: "Em breve" },
  empty: "Os primeiros materiais chegam em breve. Siga a Vispe para saber quando forem publicados.",

  form: {
    title: "Falta pouco para o seu download",
    description: "Deixe seu contato para liberar o material.",
    fields: { name: "Nome", email: "E-mail", phone: "WhatsApp", company: "Empresa" },
    // TODO(content): linkar a Política de Privacidade quando a página existir.
    consent:
      "Concordo que a Vispe Capital use estes dados para enviar conteúdos e entrar em contato, conforme a LGPD.",
    submit: "Liberar download",
    sending: "Liberando…",
    close: "Fechar",
  },

  messages: {
    invalid: "Revise os campos destacados.",
    success: "Pronto! Seu material está liberado.",
    downloadNow: "Baixar agora",
    errors: {
      required: "Preencha este campo.",
      email: "Informe um e-mail válido.",
      phone: "Informe um WhatsApp com DDD.",
      material: "Este material não está disponível.",
      consent: "É preciso concordar para liberar o download.",
    },
  },
} as const;
