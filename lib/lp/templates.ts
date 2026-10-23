import type { LpCta, LpFormField, LpSection, LpTemplate } from "./types";

// Modelos padrão das LPs, um por objetivo, cada um com a estrutura que serve à
// ação que a página pede. Os textos são exemplos para editar: nada aqui é dado
// real da Vispe — números, depoimentos, nomes, datas e valores ficam marcados
// com [colchetes] para substituir.

type TemplateInfo = {
  label: string;
  description: string;
  whatsappMessage: string;
  whatsappMessageEn: string;
  /** Páginas que só fazem sentido no meio de um fluxo (obrigado, upsell) nascem fora do Google. */
  noindex: boolean;
};

export const lpTemplateInfo: Record<LpTemplate, TemplateInfo> = {
  captura: {
    label: "Captura de leads",
    description: "Oferece um incentivo (e-book, aula, newsletter) em troca de nome, e-mail e telefone.",
    whatsappMessage: "Olá, gostaria de mais informações sobre o conteúdo gratuito da Vispe.",
    whatsappMessageEn: "Hello, I'd like more information about Vispe's free content.",
    noindex: false,
  },
  vendas: {
    label: "Vendas",
    description: "Apresenta um serviço, os benefícios, a prova e a oferta; o botão leva ao formulário.",
    whatsappMessage: "Olá, gostaria de mais informações sobre os serviços da Vispe Capital.",
    whatsappMessageEn: "Hello, I'd like more information about Vispe Capital's services.",
    noindex: false,
  },
  prelancamento: {
    label: "Pré-lançamento",
    description: "Cria expectativa para algo que vai sair: contagem regressiva e lista de espera.",
    whatsappMessage: "Olá, gostaria de mais informações sobre o lançamento.",
    whatsappMessageEn: "Hello, I'd like more information about the launch.",
    noindex: false,
  },
  evento: {
    label: "Inscrição em evento",
    description: "Data, prazo, programação, palestrantes e edições anteriores, com o formulário de inscrição.",
    whatsappMessage: "Olá, gostaria de mais informações sobre o evento.",
    whatsappMessageEn: "Hello, I'd like more information about the event.",
    noindex: false,
  },
  obrigado: {
    label: "Obrigado",
    description: "Confirma a ação concluída e mostra os próximos passos. Use como destino de outra LP.",
    whatsappMessage: "Olá, acabei de me inscrever e gostaria de mais informações.",
    whatsappMessageEn: "Hello, I've just signed up and would like more information.",
    noindex: true,
  },
  upsell: {
    label: "Upsell ou cross-sell",
    description: "Sugere um upgrade ou um complemento a quem acabou de contratar.",
    whatsappMessage: "Olá, gostaria de mais informações sobre a oferta.",
    whatsappMessageEn: "Hello, I'd like more information about the offer.",
    noindex: true,
  },
};

const field = (id: string, kind: LpFormField["kind"], label: string, required = true, options: string[] = []): LpFormField => ({
  id,
  kind,
  label,
  required,
  options,
});

const contact = [field("nome", "name", "Nome"), field("email", "email", "E-mail"), field("whatsapp", "phone", "WhatsApp")];

/** Botão que rola até o formulário da LP (href vazio). */
const toForm = (label: string): LpCta => ({ label, href: "" });
const none: LpCta = { label: "", href: "" };

const form = (data: { title: string; subtitle: string; submitLabel: string; fields: LpFormField[]; redirect?: boolean }): LpSection => ({
  id: "formulario",
  type: "form",
  data: {
    title: data.title,
    subtitle: data.subtitle,
    submitLabel: data.submitLabel,
    successMessage: "",
    consent: "",
    fields: data.fields,
    afterSubmit: data.redirect ? "redirect" : "message",
    redirectTo: "",
  },
});

const templates: Record<LpTemplate, LpSection[]> = {
  captura: [
    {
      id: "hero",
      type: "hero",
      data: {
        variant: "form",
        eyebrow: "Conteúdo gratuito",
        title: "[Receba o (nome do conteúdo) gratuito]",
        subtitle: "[Em uma frase: o que a pessoa ganha e por que vale a pena.]",
        date: "",
        cta: toForm("Quero receber"),
        bullets: ["Gratuito", "[Formato: e-book, aula, planilha]"],
      },
    },
    {
      id: "o-que-recebe",
      type: "benefits",
      data: {
        title: "O que você recebe",
        subtitle: "",
        items: [
          { title: "[Item 1]", text: "[O que a pessoa aprende ou resolve com ele.]" },
          { title: "[Item 2]", text: "[O que a pessoa aprende ou resolve com ele.]" },
          { title: "[Item 3]", text: "[O que a pessoa aprende ou resolve com ele.]" },
        ],
        cta: toForm("Quero receber"),
      },
    },
    {
      id: "numeros",
      type: "stats",
      data: { title: "", items: [{ value: "[número real]", label: "[legenda]" }, { value: "[número real]", label: "[legenda]" }, { value: "[número real]", label: "[legenda]" }] },
    },
    {
      id: "perguntas",
      type: "faq",
      data: { title: "Perguntas frequentes", items: [{ question: "É gratuito mesmo?", answer: "[Resposta]" }, { question: "Como eu recebo?", answer: "[Resposta]" }] },
    },
    form({ title: "Receba agora", subtitle: "Preencha seus dados.", submitLabel: "Quero receber", fields: contact }),
  ],

  vendas: [
    {
      id: "hero",
      type: "hero",
      data: {
        variant: "default",
        eyebrow: "[Nome do serviço]",
        title: "[A transformação principal em uma frase]",
        subtitle: "[Para quem é e o que muda na empresa depois.]",
        date: "",
        cta: toForm("Quero contratar"),
        bullets: ["[Diferencial 1]", "[Diferencial 2]", "[Diferencial 3]"],
      },
    },
    {
      id: "problema",
      type: "problem",
      data: {
        title: "[Por que isso importa agora]",
        problems: ["[Dor 1 do cliente]", "[Dor 2 do cliente]", "[Dor 3 do cliente]"],
        solutionTitle: "Como a Vispe resolve",
        solution: "[Como o serviço resolve essas dores, em poucas frases.]",
        cta: none,
      },
    },
    {
      id: "beneficios",
      type: "benefits",
      data: {
        title: "O que você ganha",
        subtitle: "",
        items: [
          { title: "[Benefício 1]", text: "[Resultado concreto para a empresa.]" },
          { title: "[Benefício 2]", text: "[Resultado concreto para a empresa.]" },
          { title: "[Benefício 3]", text: "[Resultado concreto para a empresa.]" },
        ],
        cta: toForm("Quero contratar"),
      },
    },
    {
      id: "depoimentos",
      type: "testimonials",
      data: { title: "Quem já contratou", items: [{ name: "[Nome do cliente]", company: "[Empresa]", text: "[Depoimento real do cliente]" }] },
    },
    {
      id: "oferta",
      type: "offer",
      data: {
        title: "A oferta",
        name: "[Nome da oferta]",
        description: "[O que a pessoa contrata, em uma ou duas frases.]",
        includes: ["[Item incluso 1]", "[Item incluso 2]", "[Item incluso 3]"],
        oldPrice: "",
        price: "[Valor ou 'Sob consulta']",
        terms: "",
        guarantee: "",
        cta: toForm("Quero contratar"),
        decline: none,
      },
    },
    {
      id: "duvidas",
      type: "faq",
      data: {
        title: "Dúvidas antes de contratar",
        items: [
          { question: "[Objeção comum 1]", answer: "[Resposta]" },
          { question: "[Objeção comum 2]", answer: "[Resposta]" },
          { question: "[Objeção comum 3]", answer: "[Resposta]" },
        ],
      },
    },
    form({
      title: "Fale com um especialista",
      subtitle: "Conte o momento da sua empresa e retornamos com uma proposta.",
      submitLabel: "Quero contratar",
      fields: [...contact, field("empresa", "company", "Empresa"), field("faturamento", "revenue", "Faturamento mensal")],
    }),
  ],

  prelancamento: [
    {
      id: "hero",
      type: "hero",
      data: {
        variant: "form",
        eyebrow: "Em breve",
        title: "[Nome do lançamento] está chegando",
        subtitle: "Entre na lista para saber antes de todo mundo e ter acesso antecipado.",
        date: "[Data do lançamento]",
        cta: toForm("Entrar na lista"),
        bullets: [],
      },
    },
    {
      id: "contagem",
      type: "countdown",
      data: { title: "Falta pouco", text: "", target: "", expiredText: "Já está no ar.", cta: none },
    },
    {
      id: "o-que-vem",
      type: "benefits",
      data: {
        title: "O que vem aí",
        subtitle: "",
        items: [
          { title: "[Novidade 1]", text: "[Descrição curta]" },
          { title: "[Novidade 2]", text: "[Descrição curta]" },
          { title: "[Novidade 3]", text: "[Descrição curta]" },
        ],
        cta: none,
      },
    },
    {
      id: "vantagens",
      type: "benefits",
      data: {
        title: "Quem entra na lista",
        subtitle: "",
        items: [
          { title: "Acesso antecipado", text: "[O que a pessoa recebe antes.]" },
          { title: "[Bônus de lançamento]", text: "[Descrição curta]" },
          { title: "Aviso em primeira mão", text: "[Por onde chega o aviso.]" },
        ],
        cta: toForm("Entrar na lista"),
      },
    },
    form({ title: "Entre na lista", subtitle: "", submitLabel: "Entrar na lista", fields: [field("email", "email", "E-mail"), field("whatsapp", "phone", "WhatsApp", false)] }),
  ],

  evento: [
    {
      id: "hero",
      type: "hero",
      data: {
        variant: "form",
        eyebrow: "[Tipo de evento]",
        title: "[Nome do evento]",
        subtitle: "[Em uma frase: o que o participante leva do evento.]",
        date: "[Dia de mês, horário, local]",
        cta: toForm("Garantir minha vaga"),
        bullets: ["[Presencial ou online]", "[Vagas limitadas]"],
      },
    },
    {
      id: "prazo",
      type: "countdown",
      data: { title: "As inscrições encerram em", text: "", target: "", expiredText: "As inscrições foram encerradas.", cta: none },
    },
    {
      id: "programacao",
      type: "agenda",
      data: {
        title: "Programação",
        date: "[Dia de mês]",
        time: "[Horário]",
        place: "[Endereço ou 'Online, ao vivo']",
        items: [
          { time: "[horário]", title: "[Tópico 1]", text: "[Descrição curta]" },
          { time: "[horário]", title: "[Tópico 2]", text: "[Descrição curta]" },
          { time: "[horário]", title: "[Tópico 3]", text: "[Descrição curta]" },
        ],
        cta: toForm("Garantir minha vaga"),
      },
    },
    {
      id: "palestrantes",
      type: "speakers",
      data: { title: "Quem conduz", items: [{ name: "[Nome]", role: "[Cargo]", bio: "[Mini bio]" }], cta: none },
    },
    {
      id: "edicoes",
      type: "gallery",
      data: {
        title: "Edições anteriores",
        subtitle: "",
        items: [{ caption: "[Legenda da foto]" }, { caption: "[Legenda da foto]" }, { caption: "[Legenda da foto]" }],
      },
    },
    {
      id: "perguntas",
      type: "faq",
      data: { title: "Perguntas frequentes", items: [{ question: "[Pergunta 1]", answer: "[Resposta]" }, { question: "[Pergunta 2]", answer: "[Resposta]" }] },
    },
    form({
      title: "Confirme sua inscrição",
      subtitle: "",
      submitLabel: "Garantir minha vaga",
      fields: [...contact, field("empresa", "company", "Empresa"), field("cargo", "role", "Cargo")],
      redirect: true,
    }),
  ],

  obrigado: [
    {
      id: "hero",
      type: "hero",
      data: {
        variant: "confirmation",
        eyebrow: "",
        title: "[Inscrição confirmada]",
        subtitle: "Recebemos seus dados. Veja abaixo o que acontece agora.",
        date: "",
        cta: none,
        bullets: [],
      },
    },
    {
      id: "proximos-passos",
      type: "steps",
      data: {
        title: "Próximos passos",
        subtitle: "",
        items: [
          { title: "[Passo 1]", text: "[Ex.: salve a data na sua agenda.]" },
          { title: "[Passo 2]", text: "[Ex.: entre no grupo do WhatsApp.]" },
          { title: "[Passo 3]", text: "[Ex.: fique de olho no seu e-mail.]" },
        ],
        cta: none,
      },
    },
    {
      id: "siga",
      type: "follow",
      data: { title: "Enquanto isso, acompanhe a Vispe", text: "Conteúdo sobre gestão financeira, equity e crescimento para donos de empresa.", cta: none },
    },
  ],

  upsell: [
    {
      id: "hero",
      type: "hero",
      data: {
        variant: "default",
        eyebrow: "Antes de você sair",
        title: "[Leve também (upgrade ou complemento)]",
        subtitle: "[Por que faz sentido para quem acabou de contratar.]",
        date: "",
        cta: toForm("Sim, quero"),
        bullets: [],
      },
    },
    {
      id: "comparacao",
      type: "comparison",
      data: {
        title: "O que muda com o upgrade",
        subtitle: "",
        currentLabel: "O que você já tem",
        upgradeLabel: "Com o upgrade",
        rows: [
          { feature: "[Item 1]", current: "[Incluso]", upgrade: "[Incluso]" },
          { feature: "[Item 2]", current: "[Não incluso]", upgrade: "[Incluso]" },
          { feature: "[Item 3]", current: "[Não incluso]", upgrade: "[Incluso]" },
        ],
        cta: none,
      },
    },
    {
      id: "oferta",
      type: "offer",
      data: {
        title: "Oferta para quem acabou de contratar",
        name: "[Nome do upgrade]",
        description: "[O que a pessoa ganha com ele.]",
        includes: ["[Item incluso 1]", "[Item incluso 2]"],
        oldPrice: "[Valor 'de', opcional]",
        price: "[Valor 'por']",
        terms: "",
        guarantee: "",
        cta: toForm("Sim, quero o upgrade"),
        decline: { label: "Não, obrigado", href: "" },
      },
    },
    {
      id: "depoimento",
      type: "testimonials",
      data: { title: "Quem já fez o upgrade", items: [{ name: "[Nome do cliente]", company: "[Empresa]", text: "[Depoimento real do cliente]" }] },
    },
    form({ title: "Confirme seu interesse", subtitle: "Um especialista entra em contato para ativar.", submitLabel: "Sim, quero", fields: contact }),
  ],
};

/** Cópia nova das seções do modelo (o admin edita sem mexer no original). */
export function templateSections(template: LpTemplate): LpSection[] {
  return structuredClone(templates[template]);
}
