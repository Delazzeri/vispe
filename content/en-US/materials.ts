import type { Widen } from "../types";
import type { materialsUi as ptBR } from "../pt-BR/materials";

// UI strings for the free materials. The material pages themselves are in Portuguese only.

export const materialsUi: Widen<typeof ptBR> = {
  hero: {
    eyebrow: "Free materials",
    title: "Speed up your results with Vispe's free materials",
    description:
      "Practical checklists, spreadsheets and e-books made by the Vispe Capital team for you to apply to your controllership and finances today.",
  },

  card: { cta: "See material" },

  page: {
    back: "Free materials",
    cta: "Get the material",
    featuresTitle: "What you'll find",
    usageEyebrow: "How to use it",
    faqTitle: "Questions",
    moreTitle: "More free materials",
    portugueseOnly: "This material is available in Portuguese only.",
  },

  form: {
    title: "Get the material for free",
    fields: {
      name: "Name",
      phone: "WhatsApp",
      email: "Email",
      company: "Company",
      segment: "Industry",
      revenue: "Monthly revenue",
      role: "What is your role?",
      pain: "What is your main operational pain?",
    },
    placeholders: {
      segment: "Select your industry",
      revenue: "Select your monthly revenue",
      role: "Select your role",
      pain: "Select your main pain",
    },
    segmentOptions: [
      "Legal",
      "Agribusiness",
      "Accounting",
      "E-commerce",
      "Manufacturing",
      "Marketing",
      "Healthcare",
      "Software/IT",
      "Telecom",
      "Retail",
      "Other",
    ],
    revenueOptions: [
      "Up to R$ 100k",
      "R$ 100k to R$ 200k",
      "R$ 200k to R$ 300k",
      "R$ 300k to R$ 400k",
      "R$ 400k to R$ 500k",
      "Over R$ 500k",
    ],
    roleOptions: ["Partner/Founder", "CEO"],
    painOptions: ["Lack of profitability", "Strategic support for decisions", "Lack of tax planning", "Financial organization"],
    whatsapp: "I agree to receive news and talk to Vispe's specialists via WhatsApp",
    consent: "I agree that Vispe Capital may use this data to send the material and contact me, under the LGPD.",
    submit: "Get material",
    sending: "Sending…",
  },

  messages: {
    invalid: "Please review the highlighted fields.",
    success: "We got your details! The material will arrive in your email.",
    unavailable: "Sending through the site is still being set up. Meanwhile, reach us on Vispe's social channels.",
    errors: {
      required: "Please fill in this field.",
      email: "Enter a valid email.",
      phone: "Enter a WhatsApp number with area code.",
      option: "Select an option.",
      material: "This material isn't available.",
      consent: "You need to agree to get the material.",
    },
  },
};
