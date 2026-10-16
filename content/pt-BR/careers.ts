import { brand } from "../brand";
import { site } from "./site";

// Página "Carreiras" — textos e regras do formulário de currículos.

export const careers = {
  hero: {
    eyebrow: "Carreiras",
    title: "Construa com a gente o futuro financeiro das PMEs brasileiras",
    description:
      "Procuramos pessoas com rigor técnico, visão de dono e vontade de gerar impacto real na vida de empresários. Se é você, queremos conhecer sua trajetória.",
  },

  about: {
    title: `Por que a ${brand.name}`,
    // Reaproveita o institucional já aprovado (site.about).
    positioning: site.about.positioning,
    valuesTitle: "O que nos move",
    values: site.about.values,
    socialTitle: "Fique por dentro de tudo sobre equity",
    socialDescription: "Conteúdos sobre valuation, M&A, gestão financeira e os bastidores da Vispe nas nossas redes.",
  },

  form: {
    title: "Envie seu currículo",
    description:
      "Preencha seus dados e anexe o currículo em PDF. Nosso time de pessoas analisa cada candidatura e entra em contato quando houver uma oportunidade alinhada ao seu perfil.",
    steps: { about: "Sobre você", area: "Sua área", resume: "Seu currículo" },
    fields: {
      name: "Nome completo",
      email: "E-mail",
      phone: "Telefone / WhatsApp",
      city: "Cidade / UF",
      linkedin: "LinkedIn (opcional)",
      area: "Área de interesse",
      roles: "Cargos de interesse",
      rolesHint: "Marque um ou mais.",
      roleOther: "Qual cargo você procura?",
      message: "Conte um pouco sobre você (opcional)",
      resume: "Currículo em PDF",
      resumeDrop: "Arraste seu PDF aqui ou clique para escolher",
      resumeReplace: "Trocar arquivo",
      resumeHint: "Somente PDF, até 4 MB. Prefira um arquivo com texto selecionável (não escaneado).",
      // Rótulo do campo anti-spam (invisível; só leitores de tela antigos o veem).
      honeypot: "Empresa",
    },
    // Áreas em ordem alfabética; "Outras" fica por último e não tem lista:
    // abre um campo de texto para o candidato informar o cargo.
    areas: [
      {
        name: "Administrativo",
        roles: ["Analista Administrativo", "Analista Financeiro", "Assistente Financeiro", "RH"],
      },
      {
        name: "Comercial",
        roles: ["LDR", "BDR", "SDR", "Closer", "Parcerias", "Head Comercial", "Suporte", "CS/CX"],
      },
      {
        name: "M&A",
        roles: ["Advisor", "Head de M&A", "Closer", "BDR"],
      },
      {
        name: "Marketing",
        roles: ["Designer Gráfico", "Social Media", "Gestor de Tráfego", "Editor de Vídeo", "Videomaker", "Social Selling", "Head de Marketing"],
      },
      {
        name: "Operacional",
        roles: ["Head de Operações", "Analista Financeiro", "CFO", "Controller"],
      },
      {
        name: "Tecnologia",
        roles: ["Analista de Desenvolvimento", "Analista de Automação"],
      },
      { name: "Outras", roles: [] },
    ] as readonly { name: string; roles: readonly string[] }[],
    // Vale para todas as áreas com lista de cargos.
    internship: "Estágio",
    // TODO(content): linkar a Política de Privacidade quando a página existir.
    consent:
      "Autorizo a Vispe Capital a armazenar e tratar meus dados pessoais e meu currículo exclusivamente para fins de recrutamento e seleção, conforme a LGPD (Lei nº 13.709/2018).",
    submit: "Enviar candidatura",
    submitting: "Enviando…",
  },

  messages: {
    success: "Candidatura enviada! Obrigado pelo interesse. Entraremos em contato se houver uma vaga alinhada ao seu perfil.",
    invalid: "Revise os campos destacados e tente novamente.",
    unavailable:
      "O envio pelo site está temporariamente indisponível. Envie seu currículo diretamente para o e-mail abaixo:",
    errors: {
      required: "Campo obrigatório.",
      email: "Informe um e-mail válido.",
      phone: "Informe um telefone com DDD.",
      linkedin: "Informe a URL completa do seu perfil (linkedin.com/in/…).",
      area: "Selecione uma área.",
      roles: "Marque ao menos um cargo.",
      roleOther: "Informe o cargo que você procura.",
      resumeMissing: "Anexe seu currículo.",
      resumeType: "O currículo precisa estar em PDF.",
      resumeSize: "O arquivo passa de 4 MB.",
      consent: "É preciso autorizar o tratamento dos dados para enviar.",
    },
  },
} as const;

