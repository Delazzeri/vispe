import type { LpCta, LpFormField, LpSection, LpTemplate } from "./types";

// Modelos padrão das LPs (um por objetivo). Viram o ponto de partida no admin:
// os textos são exemplos para editar. Nada aqui é dado real da Vispe — números,
// depoimentos, nomes e datas ficam marcados com [colchetes] para substituir.
//
// Enxutos e focados na conversão: hero com CTA, uma seção que sustenta a
// decisão (com botão para o formulário), o formulário e, no máximo, um FAQ curto.

export const lpTemplateInfo: Record<
  LpTemplate,
  { label: string; description: string; whatsappMessage: string; whatsappMessageEn: string }
> = {
  diagnostico: {
    label: "Diagnóstico financeiro",
    description: "Captação de leads para o diagnóstico gratuito.",
    whatsappMessage: "Olá, gostaria de mais informações sobre o diagnóstico financeiro.",
    whatsappMessageEn: "Hello, I'd like more information about the financial diagnosis.",
  },
  workshop: {
    label: "Workshop",
    description: "Inscrição em evento presencial ou online, com programação e palestrantes.",
    whatsappMessage: "Olá, gostaria de mais informações sobre o workshop.",
    whatsappMessageEn: "Hello, I'd like more information about the workshop.",
  },
  ma: {
    label: "M&A",
    description: "Empresários que querem vender, comprar ou fundir empresas.",
    whatsappMessage: "Olá, gostaria de mais informações sobre o processo de M&A.",
    whatsappMessageEn: "Hello, I'd like more information about the M&A process.",
  },
  superaula: {
    label: "Superaula",
    description: "Aula ao vivo ou gravada: o que vai aprender e inscrição.",
    whatsappMessage: "Olá, gostaria de mais informações sobre a superaula.",
    whatsappMessageEn: "Hello, I'd like more information about the masterclass.",
  },
};

const field = (id: string, kind: LpFormField["kind"], label: string, required = true, options: string[] = []): LpFormField => ({
  id,
  kind,
  label,
  required,
  options,
});

const baseFields = [field("nome", "name", "Nome"), field("email", "email", "E-mail"), field("whatsapp", "phone", "WhatsApp")];

/** Botão que rola até o formulário da LP (href vazio). */
const toForm = (label: string): LpCta => ({ label, href: "" });

const templates: Record<LpTemplate, LpSection[]> = {
  diagnostico: [
    {
      id: "hero",
      type: "hero",
      data: {
        eyebrow: "Diagnóstico financeiro gratuito",
        title: "Descubra onde sua empresa está perdendo lucro",
        subtitle:
          "Um especialista da Vispe Capital analisa seus números e mostra o que ajustar primeiro em caixa, margem e estrutura.",
        date: "",
        cta: toForm("Quero meu diagnóstico"),
        bullets: ["Sem custo", "Conversa com especialista", "Plano de ação claro"],
      },
    },
    {
      id: "beneficios",
      type: "benefits",
      data: {
        title: "O que você recebe no diagnóstico",
        subtitle: "Uma leitura objetiva da saúde financeira da sua empresa, com prioridades definidas.",
        items: [
          { title: "Raio-x do caixa", text: "Entradas, saídas e o que está prendendo dinheiro na operação." },
          { title: "Margem real", text: "Quanto sobra de cada venda depois de custos e despesas variáveis." },
          { title: "Prioridades", text: "As primeiras ações para aumentar o lucro, em ordem de impacto." },
        ],
        cta: toForm("Quero meu diagnóstico"),
      },
    },
    {
      id: "formulario",
      type: "form",
      data: {
        title: "Agende seu diagnóstico",
        subtitle: "Preencha seus dados e um especialista da Vispe Capital entra em contato.",
        submitLabel: "Quero meu diagnóstico",
        successMessage: "",
        consent: "",
        fields: [...baseFields, field("empresa", "company", "Empresa"), field("faturamento", "revenue", "Faturamento mensal")],
      },
    },
    {
      id: "perguntas",
      type: "faq",
      data: {
        title: "Perguntas frequentes",
        items: [
          { question: "O diagnóstico tem custo?", answer: "[Resposta]" },
          { question: "Quanto tempo leva?", answer: "[Resposta]" },
        ],
      },
    },
  ],

  workshop: [
    {
      id: "hero",
      type: "hero",
      data: {
        eyebrow: "Workshop",
        title: "[Tema do workshop]",
        subtitle: "[Em uma frase, o que o participante sai sabendo fazer.]",
        date: "[Dia de mês, horário]",
        cta: toForm("Quero me inscrever"),
        bullets: ["[Presencial ou online]", "[Vagas limitadas]"],
      },
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
        cta: toForm("Quero me inscrever"),
      },
    },
    {
      id: "palestrantes",
      type: "speakers",
      data: {
        title: "Quem conduz",
        items: [{ name: "[Nome]", role: "[Cargo]", bio: "[Mini bio]" }],
        cta: toForm(""),
      },
    },
    {
      id: "formulario",
      type: "form",
      data: {
        title: "Garanta sua vaga",
        subtitle: "Preencha seus dados para se inscrever.",
        submitLabel: "Quero me inscrever",
        successMessage: "",
        consent: "",
        fields: [...baseFields, field("empresa", "company", "Empresa"), field("cargo", "role", "Cargo")],
      },
    },
  ],

  ma: [
    {
      id: "hero",
      type: "hero",
      data: {
        eyebrow: "Fusões e aquisições",
        title: "Venda, compre ou una empresas com quem conhece o processo",
        subtitle:
          "Da preparação ao fechamento: valuation, busca de contrapartes, negociação e due diligence com a Vispe Capital.",
        date: "",
        cta: toForm("Quero conversar sobre M&A"),
        bullets: ["Sigilo do início ao fim", "Processo estruturado"],
      },
    },
    {
      id: "como-funciona",
      type: "steps",
      data: {
        title: "Como funciona um processo de M&A",
        subtitle: "",
        items: [
          { title: "Preparação", text: "Organização das finanças, documentos e valuation da empresa." },
          { title: "Contrapartes", text: "Busca e abordagem de compradores, vendedores ou parceiros." },
          { title: "Negociação e fechamento", text: "Propostas, due diligence, contratos e assinatura." },
        ],
        cta: toForm("Quero conversar sobre M&A"),
      },
    },
    {
      id: "formulario",
      type: "form",
      data: {
        title: "Fale com um especialista em M&A",
        subtitle: "Conte o seu objetivo e retornamos com os próximos passos.",
        submitLabel: "Quero conversar",
        successMessage: "",
        consent: "",
        fields: [
          ...baseFields,
          field("empresa", "company", "Empresa"),
          field("objetivo", "select", "Qual é o seu objetivo?", true, ["Vender a empresa", "Comprar uma empresa", "Fusão", "Captar investimento"]),
        ],
      },
    },
    {
      id: "perguntas",
      type: "faq",
      data: {
        title: "Perguntas frequentes",
        items: [
          { question: "Quanto tempo leva um processo de M&A?", answer: "[Resposta]" },
          { question: "Como fica o sigilo?", answer: "[Resposta]" },
        ],
      },
    },
  ],

  superaula: [
    {
      id: "hero",
      type: "hero",
      data: {
        eyebrow: "Superaula gratuita",
        title: "[Tema da superaula]",
        subtitle: "[Em uma frase, a principal transformação da aula.]",
        date: "[Dia de mês, horário]",
        cta: toForm("Quero assistir"),
        bullets: ["Online e gratuita", "[Ao vivo ou gravada]"],
      },
    },
    {
      id: "o-que-aprender",
      type: "benefits",
      data: {
        title: "O que você vai aprender",
        subtitle: "",
        items: [
          { title: "[Aprendizado 1]", text: "[Descrição curta]" },
          { title: "[Aprendizado 2]", text: "[Descrição curta]" },
          { title: "[Aprendizado 3]", text: "[Descrição curta]" },
        ],
        cta: toForm("Quero assistir"),
      },
    },
    {
      id: "formulario",
      type: "form",
      data: {
        title: "Inscreva-se na superaula",
        subtitle: "Você recebe o link de acesso por e-mail e WhatsApp.",
        submitLabel: "Quero assistir",
        successMessage: "",
        consent: "",
        fields: [...baseFields],
      },
    },
  ],
};

/** Cópia nova das seções do modelo (o admin edita sem mexer no original). */
export function templateSections(template: LpTemplate): LpSection[] {
  return structuredClone(templates[template]);
}
