import type { LpSectionType } from "./types";

// Esquema das seções da LP: quais campos cada uma tem. Uma fonte só para a
// leitura defensiva do banco (normalize.ts), o editor do admin (formulários
// gerados daqui), a tradução (quais campos são texto) e os modelos.

export type LpFieldSpec =
  | { kind: "text"; key: string; label: string; multiline?: boolean; hint?: string }
  /** Texto que não se traduz (id do YouTube, data em formato livre etc.). */
  | { kind: "plain"; key: string; label: string; hint?: string }
  | { kind: "image"; key: string; label: string }
  | { kind: "cta"; key: string; label: string }
  | { kind: "strings"; key: string; label: string; max: number; itemLabel: string }
  | { kind: "list"; key: string; label: string; max: number; itemLabel: string; fields: LpFieldSpec[] }
  | { kind: "formFields"; key: string; label: string };

export type LpSectionSpec = {
  /** Nome no admin. */
  label: string;
  description: string;
  fields: LpFieldSpec[];
};

const text = (key: string, label: string, extra: { multiline?: boolean; hint?: string } = {}): LpFieldSpec => ({
  kind: "text",
  key,
  label,
  ...extra,
});

export const lpSectionSpecs: Record<LpSectionType, LpSectionSpec> = {
  hero: {
    label: "Hero (topo)",
    description: "Abertura da página: título principal, foto e botão.",
    fields: [
      text("eyebrow", "Selo acima do título", { hint: "Curto, ex.: Workshop presencial" }),
      text("title", "Título (h1)"),
      text("subtitle", "Subtítulo", { multiline: true }),
      text("date", "Data e horário", { hint: "Só em eventos, ex.: 12 de novembro, 19h" }),
      { kind: "image", key: "image", label: "Foto ou imagem" },
      { kind: "cta", key: "cta", label: "Botão" },
      { kind: "strings", key: "bullets", label: "Destaques abaixo do botão", max: 4, itemLabel: "Destaque" },
    ],
  },
  stats: {
    label: "Números",
    description: "Até 4 números de destaque (só dados reais).",
    fields: [
      text("title", "Título (opcional)"),
      {
        kind: "list",
        key: "items",
        label: "Números",
        max: 4,
        itemLabel: "Número",
        fields: [text("value", "Valor", { hint: "Ex.: +300" }), text("label", "Legenda")],
      },
    ],
  },
  benefits: {
    label: "Benefícios",
    description: "O que a pessoa ganha: cards curtos com título e texto.",
    fields: [
      text("title", "Título"),
      text("subtitle", "Subtítulo", { multiline: true }),
      {
        kind: "list",
        key: "items",
        label: "Benefícios",
        max: 8,
        itemLabel: "Benefício",
        fields: [text("title", "Título"), text("text", "Texto", { multiline: true })],
      },
      { kind: "cta", key: "cta", label: "Botão abaixo da seção (opcional)" },
    ],
  },
  audience: {
    label: "Para quem é",
    description: "Perfis que devem participar ou contratar.",
    fields: [
      text("title", "Título"),
      text("subtitle", "Subtítulo", { multiline: true }),
      { kind: "strings", key: "items", label: "Perfis", max: 8, itemLabel: "Perfil" },
      { kind: "cta", key: "cta", label: "Botão abaixo da seção (opcional)" },
    ],
  },
  steps: {
    label: "Como funciona",
    description: "Etapas numeradas do processo.",
    fields: [
      text("title", "Título"),
      text("subtitle", "Subtítulo", { multiline: true }),
      {
        kind: "list",
        key: "items",
        label: "Etapas",
        max: 6,
        itemLabel: "Etapa",
        fields: [text("title", "Título"), text("text", "Texto", { multiline: true })],
      },
      { kind: "cta", key: "cta", label: "Botão abaixo da seção (opcional)" },
    ],
  },
  agenda: {
    label: "Programação",
    description: "Data, local e tópicos do evento.",
    fields: [
      text("title", "Título"),
      text("date", "Data"),
      text("time", "Horário"),
      text("place", "Local", { hint: "Endereço ou 'Online, ao vivo'" }),
      {
        kind: "list",
        key: "items",
        label: "Tópicos",
        max: 10,
        itemLabel: "Tópico",
        fields: [text("time", "Horário (opcional)"), text("title", "Título"), text("text", "Descrição", { multiline: true })],
      },
      { kind: "cta", key: "cta", label: "Botão abaixo da seção (opcional)" },
    ],
  },
  speakers: {
    label: "Palestrantes",
    description: "Quem conduz: foto, nome, cargo e mini bio.",
    fields: [
      text("title", "Título"),
      {
        kind: "list",
        key: "items",
        label: "Palestrantes",
        max: 4,
        itemLabel: "Palestrante",
        fields: [
          { kind: "image", key: "photo", label: "Foto" },
          text("name", "Nome"),
          text("role", "Cargo"),
          text("bio", "Mini bio", { multiline: true }),
        ],
      },
      { kind: "cta", key: "cta", label: "Botão abaixo da seção (opcional)" },
    ],
  },
  testimonials: {
    label: "Depoimentos",
    description: "Depoimentos reais de clientes.",
    fields: [
      text("title", "Título"),
      {
        kind: "list",
        key: "items",
        label: "Depoimentos",
        max: 6,
        itemLabel: "Depoimento",
        fields: [
          { kind: "image", key: "photo", label: "Foto (opcional)" },
          text("name", "Nome"),
          text("company", "Empresa / cargo"),
          text("text", "Depoimento", { multiline: true }),
        ],
      },
    ],
  },
  video: {
    label: "Vídeo",
    description: "Vídeo do YouTube: só carrega o player no clique.",
    fields: [
      text("title", "Título"),
      text("text", "Texto", { multiline: true }),
      { kind: "plain", key: "youtubeId", label: "Link ou id do YouTube" },
      { kind: "image", key: "poster", label: "Capa do vídeo" },
    ],
  },
  faq: {
    label: "Perguntas frequentes",
    description: "Perguntas e respostas (aparecem também no Google).",
    fields: [
      text("title", "Título"),
      {
        kind: "list",
        key: "items",
        label: "Perguntas",
        max: 12,
        itemLabel: "Pergunta",
        fields: [text("question", "Pergunta"), text("answer", "Resposta", { multiline: true })],
      },
    ],
  },
  form: {
    label: "Formulário",
    description: "Formulário da LP; cada LP grava numa aba própria da planilha.",
    fields: [
      text("title", "Título"),
      text("subtitle", "Subtítulo", { multiline: true }),
      { kind: "formFields", key: "fields", label: "Campos" },
      text("submitLabel", "Texto do botão"),
      text("successMessage", "Mensagem depois do envio", { multiline: true }),
      text("consent", "Texto do aceite (LGPD)", { multiline: true, hint: "Vazio usa o texto padrão do site" }),
    ],
  },
  cta: {
    label: "Chamada final",
    description: "Fechamento com título, texto e botão.",
    fields: [text("title", "Título"), text("text", "Texto", { multiline: true }), { kind: "cta", key: "cta", label: "Botão" }],
  },
};

export const lpSectionTypes = Object.keys(lpSectionSpecs) as LpSectionType[];

/** Rótulos dos tipos de campo do formulário (admin). */
export const lpFieldKindLabels: Record<string, string> = {
  name: "Nome",
  email: "E-mail",
  phone: "WhatsApp",
  company: "Empresa",
  role: "Cargo",
  revenue: "Faturamento mensal",
  segment: "Segmento",
  message: "Mensagem",
  text: "Pergunta aberta",
  select: "Múltipla escolha",
};
