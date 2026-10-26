import type { Locale } from "@/i18n/routing";

// Textos fixos da interface das landing pages (o conteúdo de cada LP vem do admin).

const pt = {
  watchVideo: "Assistir ao vídeo",
  date: "Data",
  time: "Horário",
  place: "Local",
  untranslated: "Esta página ainda não tem versão em inglês: o conteúdo abaixo está em português.",
  loading: "Carregando…",
  notFoundTitle: "Página não encontrada",
  notFoundText: "Esta página não existe ou não está mais no ar.",
  notFoundCta: "Ir para o site da Vispe",
  countdown: { days: "dias", hours: "horas", minutes: "min", seconds: "seg", label: "Tempo restante" },
  offer: { from: "De", to: "Por", includes: "O que está incluso" },
  comparison: { feature: "Item" },
  follow: { open: "Abrir o perfil da Vispe no {network}" },
  form: {
    sending: "Enviando…",
    redirecting: "Enviado. Abrindo a próxima página…",
    redirectingWhatsapp: "Enviado. Abrindo o grupo do WhatsApp…",
    previewRedirect: "Na página publicada, o envio leva a {target}.",
    selectPlaceholder: "Selecione",
    consent: "Concordo que a Vispe Capital use estes dados para entrar em contato, conforme a LGPD.",
    invalid: "Revise os campos destacados.",
    unavailable: "Não foi possível enviar agora. Tente de novo em instantes ou fale com a gente pelo WhatsApp.",
    success: "Recebemos seus dados. Em breve a Vispe Capital entra em contato.",
    errors: {
      required: "Preencha este campo.",
      email: "Informe um e-mail válido.",
      phone: "Informe um WhatsApp com DDD.",
      option: "Escolha uma opção.",
      consent: "É preciso concordar para enviarmos o contato.",
    },
  },
};

const en: typeof pt = {
  watchVideo: "Watch the video",
  date: "Date",
  time: "Time",
  place: "Location",
  untranslated: "This page is not available in English yet: the content below is in Portuguese.",
  loading: "Loading…",
  notFoundTitle: "Page not found",
  notFoundText: "This page doesn't exist or is no longer available.",
  notFoundCta: "Go to the Vispe website",
  countdown: { days: "days", hours: "hours", minutes: "min", seconds: "sec", label: "Time left" },
  offer: { from: "From", to: "Now", includes: "What's included" },
  comparison: { feature: "Item" },
  follow: { open: "Open Vispe's {network} profile" },
  form: {
    sending: "Sending…",
    redirecting: "Sent. Opening the next page…",
    redirectingWhatsapp: "Sent. Opening the WhatsApp group…",
    previewRedirect: "On the published page, submitting goes to {target}.",
    selectPlaceholder: "Select",
    consent: "I agree that Vispe Capital may use this information to contact me, in line with Brazil's data protection law (LGPD).",
    invalid: "Please review the highlighted fields.",
    unavailable: "We couldn't send your details right now. Please try again in a moment or reach us on WhatsApp.",
    success: "We've received your details. Vispe Capital will be in touch soon.",
    errors: {
      required: "Please fill in this field.",
      email: "Please enter a valid email.",
      phone: "Please enter a phone number with area code.",
      option: "Please choose an option.",
      consent: "You need to agree so we can contact you.",
    },
  },
};

export type LpUi = typeof pt;

export function getLpUi(locale: Locale): LpUi {
  return locale === "en-US" ? en : pt;
}
