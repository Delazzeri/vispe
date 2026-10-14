// Textos de interface dos materiais gratuitos (o catálogo em si está em content/materials.ts).

export const materialsUi = {
  hero: {
    eyebrow: "Materiais gratuitos",
    title: "Acelere seus resultados com os materiais gratuitos da Vispe",
    description:
      "Checklists, planilhas e e-books práticos feitos pelo time da Vispe Capital para você aplicar na sua controladoria e nas suas finanças hoje mesmo.",
  },

  card: { cta: "Ver material" },

  page: {
    back: "Materiais gratuitos",
    cta: "Quero receber o material",
    featuresTitle: "O que você vai encontrar",
    usageEyebrow: "Como usar",
    faqTitle: "Dúvidas",
    moreTitle: "Outros materiais gratuitos",
    // Exibido nas versões em outro idioma (o conteúdo das LPs é só em português).
    portugueseOnly: "",
  },

  form: {
    title: "Receba o material gratuitamente",
    fields: {
      name: "Nome",
      phone: "WhatsApp",
      email: "E-mail",
      company: "Empresa",
      segment: "Segmento",
      revenue: "Faturamento mensal",
      role: "Qual seu cargo na empresa?",
      pain: "Qual sua principal dor na operação?",
    },
    placeholders: {
      segment: "Selecione o segmento",
      revenue: "Selecione o faturamento mensal",
      role: "Selecione seu cargo",
      pain: "Selecione sua principal dor",
    },
    segmentOptions: [
      "Advocacia",
      "Agronegócio",
      "Contabilidade",
      "E-Commerce",
      "Indústria",
      "Marketing",
      "Serviços de saúde",
      "Software/TI",
      "Telecom",
      "Varejo",
      "Outros",
    ],
    revenueOptions: [
      "Até R$ 100 mil",
      "Entre R$ 100 mil e R$ 200 mil",
      "Entre R$ 200 mil e R$ 300 mil",
      "Entre R$ 300 mil e R$ 400 mil",
      "Entre R$ 400 mil e R$ 500 mil",
      "Acima de R$ 500 mil",
    ],
    roleOptions: ["Sócio/Fundador", "CEO"],
    painOptions: [
      "Falta de lucratividade",
      "Auxílio Estratégico para Tomar Decisões",
      "Falta de Planejamento Tributário",
      "Organização financeira",
    ],
    whatsapp: "Aceito receber novidades e falar com o time de especialistas da Vispe via WhatsApp",
    // TODO(content): linkar a Política de Privacidade quando a página existir.
    consent: "Concordo que a Vispe Capital use estes dados para enviar o material e entrar em contato, conforme a LGPD.",
    submit: "Receber material",
    sending: "Enviando…",
  },

  messages: {
    invalid: "Revise os campos destacados.",
    success: "Recebemos seu cadastro! O material vai chegar no seu e-mail.",
    unavailable:
      "O envio pelo site ainda está sendo configurado. Enquanto isso, fale com a gente pelas redes da Vispe.",
    errors: {
      required: "Preencha este campo.",
      email: "Informe um e-mail válido.",
      phone: "Informe um WhatsApp com DDD.",
      option: "Selecione uma opção.",
      material: "Este material não está disponível.",
      consent: "É preciso concordar para receber o material.",
    },
  },
} as const;
