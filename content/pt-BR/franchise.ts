import { brand } from "../brand";

// Página "Seja um franqueado" — apresentação do modelo + formulário de interesse.
// TODO(content): validar todos os textos com o time de expansão da Vispe. Não
// há números (investimento, taxa, royalties, retorno) de propósito: entram só
// quando a empresa fornecer, ou ficam na Circular de Oferta de Franquia.

export const franchise = {
  hero: {
    eyebrow: "Franquia Vispe",
    title: "Leve o método Vispe para empresários da sua região",
    description: `Seja um franqueado da ${brand.name} e ajude pequenas e médias empresas a organizar o financeiro e aumentar o lucro, com a metodologia, a marca e a tecnologia de quem é especialista em PMEs.`,
    cta: "Quero ser franqueado",
  },

  offer: {
    title: "O que você recebe",
    description: "Tudo o que a Vispe usa nos próprios clientes, pronto para você aplicar na sua praça.",
    // TODO(content): confirmar cada item do pacote do franqueado.
    items: [
      {
        icon: "method",
        title: "Metodologia testada",
        text: "Os pilares Organização, Margem e Crescimento, com os processos e entregáveis que a Vispe aplica no dia a dia.",
      },
      {
        icon: "tech",
        title: "Tecnologia própria",
        text: "Acesso ao Fin 24/7, o CFO virtual da Vispe, para acompanhar os números dos seus clientes em tempo real.",
      },
      {
        icon: "brand",
        title: "Marca e geração de demanda",
        text: "Uma marca de referência em finanças para PMEs, com conteúdos, podcast e materiais para atrair clientes.",
      },
      {
        icon: "support",
        title: "Treinamento e suporte",
        text: "Formação inicial e acompanhamento contínuo do time Vispe para você vender e entregar com segurança.",
      },
    ],
  },

  profile: {
    title: "Para quem é",
    // TODO(content): confirmar o perfil buscado.
    items: [
      "Experiência em finanças, contabilidade, controladoria ou gestão de empresas",
      "Bom relacionamento com empresários e vontade de empreender",
      "Disponibilidade para se dedicar à operação e seguir o método",
      "Interesse em gerar resultado real para as empresas da sua região",
    ],
  },

  steps: {
    title: "Como funciona",
    items: [
      { title: "Cadastro", text: "Você preenche o formulário com seu perfil e sua região de interesse." },
      { title: "Conversa inicial", text: "Nosso time de expansão entra em contato para conhecer você e tirar dúvidas." },
      {
        title: "Apresentação do modelo",
        text: "Você recebe a Circular de Oferta de Franquia, com investimento, taxas e todas as regras do negócio.",
      },
      { title: "Contrato e treinamento", text: "Com tudo alinhado, assinamos o contrato e começa a sua formação." },
    ],
  },

  investment: {
    title: "Investimento",
    text: "Os valores de investimento inicial, taxa de franquia e royalties são apresentados na Circular de Oferta de Franquia (COF), entregue após a conversa inicial, como prevê a Lei de Franquias (Lei nº 13.966/2019).",
  },

  form: {
    title: "Quero ser franqueado",
    description: "Preencha seus dados e o time de expansão da Vispe entra em contato para a conversa inicial.",
    fields: {
      name: "Nome completo",
      email: "E-mail",
      phone: "WhatsApp",
      city: "Cidade / UF de interesse",
      background: "Formação ou área de atuação",
      capital: "Capital disponível para investir",
      message: "Conte um pouco sobre você (opcional)",
    },
    // TODO(content): ajustar as faixas ao investimento real da franquia.
    capitalOptions: ["Até R$ 50 mil", "R$ 50 mil a R$ 100 mil", "R$ 100 mil a R$ 200 mil", "Acima de R$ 200 mil"],
    capitalPlaceholder: "Selecione",
    // TODO(content): linkar a Política de Privacidade quando a página existir.
    consent: "Concordo que a Vispe Capital use estes dados para entrar em contato sobre a franquia, conforme a LGPD.",
    submit: "Enviar interesse",
    sending: "Enviando…",
  },

  messages: {
    invalid: "Revise os campos destacados.",
    success: "Recebemos seu interesse! O time de expansão da Vispe vai entrar em contato em breve.",
    unavailable:
      "O envio pelo site ainda está sendo configurado. Enquanto isso, fale com a gente pelas redes da Vispe.",
    errors: {
      required: "Preencha este campo.",
      email: "Informe um e-mail válido.",
      phone: "Informe um WhatsApp com DDD.",
      capital: "Selecione uma faixa.",
      consent: "É preciso concordar para enviarmos o contato.",
    },
  },
} as const;
