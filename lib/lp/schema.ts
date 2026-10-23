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
  | { kind: "formFields"; key: string; label: string }
  /** Lista fixa de opções no admin (não se traduz); o primeiro valor é o padrão. */
  | { kind: "choice"; key: string; label: string; options: readonly (readonly [string, string])[]; hint?: string };

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
      {
        kind: "choice",
        key: "variant",
        label: "Formato do topo",
        options: [
          ["default", "Título e botão"],
          ["form", "Título com o formulário ao lado"],
          ["confirmation", "Confirmação (página de obrigado)"],
        ],
        hint: "Com o formulário ao lado, a seção Formulário aparece dentro do topo.",
      },
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
      {
        kind: "choice",
        key: "afterSubmit",
        label: "Depois do envio",
        options: [
          ["message", "Mostrar a mensagem na própria página"],
          ["redirect", "Ir para a página de obrigado"],
        ],
      },
      { kind: "plain", key: "redirectTo", label: "Página de obrigado", hint: "Endereço de outra LP (ex.: obrigado-workshop) ou link completo." },
    ],
  },
  problem: {
    label: "Problema e solução",
    description: "As dores de hoje de um lado, a solução do outro.",
    fields: [
      text("title", "Título"),
      { kind: "strings", key: "problems", label: "Dores (como está hoje)", max: 6, itemLabel: "Dor" },
      text("solutionTitle", "Título da solução"),
      text("solution", "Solução", { multiline: true }),
      { kind: "cta", key: "cta", label: "Botão abaixo da seção (opcional)" },
    ],
  },
  gallery: {
    label: "Galeria",
    description: "Fotos de edições anteriores, bastidores ou resultados, com legenda.",
    fields: [
      text("title", "Título"),
      text("subtitle", "Subtítulo", { multiline: true }),
      {
        kind: "list",
        key: "items",
        label: "Fotos",
        max: 6,
        itemLabel: "Foto",
        fields: [{ kind: "image", key: "photo", label: "Foto" }, text("caption", "Legenda")],
      },
    ],
  },
  countdown: {
    label: "Contagem regressiva",
    description: "Contador até uma data (lançamento, fim das inscrições).",
    fields: [
      text("title", "Título"),
      text("text", "Texto", { multiline: true }),
      { kind: "plain", key: "target", label: "Data e hora final", hint: "Formato 2026-11-20T19:00 (horário de Brasília)." },
      text("expiredText", "Texto depois do prazo", { hint: "Ex.: As inscrições foram encerradas." }),
      { kind: "cta", key: "cta", label: "Botão (opcional)" },
    ],
  },
  offer: {
    label: "Oferta",
    description: "O que está sendo oferecido, o que inclui e o valor. O botão leva ao formulário.",
    fields: [
      text("title", "Título da seção"),
      text("name", "Nome da oferta"),
      text("description", "Descrição", { multiline: true }),
      { kind: "strings", key: "includes", label: "O que inclui", max: 10, itemLabel: "Item" },
      text("oldPrice", "Valor 'de' (opcional)", { hint: "Ex.: R$ 4.997" }),
      text("price", "Valor 'por' (opcional)", { hint: "Ex.: R$ 2.997 ou 'Sob consulta'" }),
      text("terms", "Condição (opcional)", { hint: "Ex.: em até 12x" }),
      text("guarantee", "Garantia (opcional)", { multiline: true }),
      { kind: "cta", key: "cta", label: "Botão principal" },
      { kind: "cta", key: "decline", label: "Link de recusa (upsell): ex. Não, obrigado → endereço da página de obrigado" },
    ],
  },
  comparison: {
    label: "Comparação",
    description: "O que a pessoa já tem × o que ganha com o upgrade.",
    fields: [
      text("title", "Título"),
      text("subtitle", "Subtítulo", { multiline: true }),
      text("currentLabel", "Nome da coluna atual", { hint: "Ex.: O que você já tem" }),
      text("upgradeLabel", "Nome da coluna do upgrade", { hint: "Ex.: Com o upgrade" }),
      {
        kind: "list",
        key: "rows",
        label: "Linhas",
        max: 10,
        itemLabel: "Linha",
        fields: [text("feature", "Item"), text("current", "Atual", { hint: "Ex.: Não incluso" }), text("upgrade", "Upgrade", { hint: "Ex.: Incluso" })],
      },
      { kind: "cta", key: "cta", label: "Botão abaixo da seção (opcional)" },
    ],
  },
  follow: {
    label: "Siga a Vispe",
    description: "Convite para as redes da Vispe (as do site) e um botão opcional, como o grupo do WhatsApp.",
    fields: [text("title", "Título"), text("text", "Texto", { multiline: true }), { kind: "cta", key: "cta", label: "Botão extra (opcional)" }],
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
