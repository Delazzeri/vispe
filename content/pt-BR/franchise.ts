import { brand } from "../brand";

// Franquia Vispe: /franquia (escolha do modelo) → /franquia/comercial ou
// /franquia/financeira (apresentação + formulário).
// TODO(content): validar todos os textos com o time de expansão da Vispe. Não
// há valores (investimento, taxa, royalties, retorno) de propósito: entram só
// quando a empresa fornecer, ou ficam na Circular de Oferta de Franquia.

/** Modelos de franquia (também são os slugs das páginas). */
export const franchiseModels = ["comercial", "financeira"] as const;

export const franchise = {
  selector: {
    eyebrow: "Franquia Vispe",
    title: "Escolha o modelo de franquia ideal para você",
    description: `Dois caminhos para levar a ${brand.name} à sua região. Escolha o que combina com o seu perfil e conheça os detalhes.`,
    cta: "Conhecer o modelo",
    options: {
      comercial: {
        title: "Franquia Comercial",
        text: "Para quem tem perfil de vendas e rede de relacionamento: você abre portas com empresários e a Vispe entrega os projetos.",
      },
      financeira: {
        title: "Franquia Financeira",
        text: "Para profissionais de finanças e contabilidade: você atende os clientes da sua região com o método e a tecnologia da Vispe.",
      },
    },
  },

  models: {
    comercial: {
      eyebrow: "Franquia Comercial",
      title: "Gere negócios com a marca Vispe na sua região",
      description:
        "Você conecta empresários da sua região às soluções da Vispe Capital e é remunerado pelos contratos fechados. O time Vispe cuida da entrega.",
      cta: "Quero ser franqueado comercial",
      // TODO(content): número real de unidades da Franquia Comercial.
      stats: [{ value: "{{N}}", label: "franqueados comerciais" }],
      about: {
        title: "Como funciona",
        text: "O franqueado comercial é o rosto da Vispe na sua praça: prospecta empresas, faz o primeiro diagnóstico e apresenta as soluções. Depois do contrato, os especialistas da Vispe assumem a entrega, e você segue no relacionamento com o cliente.",
        items: [
          { title: "Prospecção", text: "Você identifica empresas com potencial e agenda as conversas." },
          { title: "Diagnóstico", text: "Com o roteiro da Vispe, você entende o momento do empresário." },
          { title: "Proposta e fechamento", text: "Você apresenta a solução certa, com apoio do time Vispe." },
          { title: "Entrega e relacionamento", text: "A Vispe executa o projeto e você acompanha o cliente." },
        ],
      },
      offer: {
        title: "O que você recebe",
        items: [
          { icon: "method", title: "Portfólio completo", text: "Todas as soluções da Vispe para oferecer, de BPO Financeiro a M&A." },
          { icon: "support", title: "Treinamento comercial", text: "Formação em diagnóstico, proposta e negociação com empresários." },
          { icon: "brand", title: "Marca e geração de demanda", text: "Conteúdos, podcast e materiais para abrir portas na sua região." },
          { icon: "tech", title: "Entrega garantida", text: "Especialistas da Vispe executam os projetos que você vende." },
        ],
      },
      profile: {
        title: "Para quem é",
        items: [
          "Perfil comercial e boa rede de relacionamento com empresários",
          "Experiência em vendas consultivas ou B2B",
          "Disponibilidade para prospectar e acompanhar clientes",
        ],
      },
    },
    financeira: {
      eyebrow: "Franquia Financeira",
      title: "Atenda empresas da sua região com o método Vispe",
      description:
        "Você presta os serviços financeiros da Vispe Capital aos empresários da sua praça, com a metodologia, a tecnologia e o suporte de quem é especialista em PMEs.",
      cta: "Quero ser franqueado financeiro",
      // TODO(content): número real de unidades da Franquia Financeira.
      stats: [{ value: "{{N}}", label: "franqueados financeiros" }],
      about: {
        title: "Como funciona",
        text: "O franqueado financeiro conduz a operação na sua região: atrai clientes, aplica o método da Vispe e entrega organização financeira e aumento de margem, com o Fin 24/7 e o suporte técnico do time Vispe por trás.",
        items: [
          { title: "Organização", text: "Você estrutura o financeiro do cliente: rotinas, controles e indicadores." },
          { title: "Margem", text: "Com os dados em ordem, você encontra onde a empresa perde lucro." },
          { title: "Crescimento", text: "Você apoia decisões de expansão, crédito e investimento." },
          { title: "Acompanhamento", text: "O Fin 24/7 mostra os números em tempo real para você e o cliente." },
        ],
      },
      offer: {
        title: "O que você recebe",
        items: [
          { icon: "method", title: "Metodologia testada", text: "Os pilares Organização, Margem e Crescimento, com processos e entregáveis prontos." },
          { icon: "tech", title: "Tecnologia própria", text: "Acesso ao Fin 24/7, o CFO virtual da Vispe, para acompanhar cada cliente." },
          { icon: "brand", title: "Marca de referência", text: "Uma marca reconhecida em finanças para PMEs, com conteúdos para atrair clientes." },
          { icon: "support", title: "Treinamento e suporte", text: "Formação inicial e suporte técnico contínuo do time Vispe." },
        ],
      },
      profile: {
        title: "Para quem é",
        items: [
          "Experiência em finanças, contabilidade ou controladoria",
          "Vontade de empreender e atender empresários de perto",
          "Disponibilidade para se dedicar à operação e seguir o método",
        ],
      },
    },
  },

  steps: {
    title: "Etapas para se tornar franqueado",
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

  otherModel: "Conheça também a {model}",

  form: {
    title: "Cadastre-se",
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
    submit: "Enviar cadastro",
    sending: "Enviando…",
  },

  messages: {
    invalid: "Revise os campos destacados.",
    success: "Recebemos seu cadastro! O time de expansão da Vispe vai entrar em contato em breve.",
    unavailable:
      "O envio pelo site ainda está sendo configurado. Enquanto isso, fale com a gente pelas redes da Vispe.",
    errors: {
      required: "Preencha este campo.",
      email: "Informe um e-mail válido.",
      phone: "Informe um WhatsApp com DDD.",
      capital: "Selecione uma faixa.",
      model: "Escolha um modelo de franquia.",
      consent: "É preciso concordar para enviarmos o contato.",
    },
  },
} as const;
