import { brand } from "../brand";
import type { Widen } from "../types";
import type { franchise as ptBR } from "../pt-BR/franchise";

// "Become a franchisee" page. TODO(content): validate with the Vispe expansion team.

export const franchise: Widen<typeof ptBR> = {
  hero: {
    eyebrow: "Vispe Franchise",
    title: "Bring the Vispe method to business owners in your region",
    description: `Become a ${brand.name} franchisee and help small and mid-sized companies organize their finances and grow their profit, with the method, brand and technology of SMB specialists.`,
    cta: "Become a franchisee",
  },

  offer: {
    title: "What you get",
    description: "Everything Vispe uses with its own clients, ready for you to apply in your market.",
    items: [
      {
        icon: "method",
        title: "A proven method",
        text: "The Organization, Margin and Growth pillars, with the processes and deliverables Vispe applies every day.",
      },
      {
        icon: "tech",
        title: "Proprietary technology",
        text: "Access to Fin 24/7, Vispe's virtual CFO, to follow your clients' numbers in real time.",
      },
      {
        icon: "brand",
        title: "Brand and demand generation",
        text: "A reference brand in SMB finance, with content, a podcast and materials to attract clients.",
      },
      {
        icon: "support",
        title: "Training and support",
        text: "Initial training and ongoing support from the Vispe team so you can sell and deliver with confidence.",
      },
    ],
  },

  profile: {
    title: "Who it's for",
    items: [
      "Experience in finance, accounting, controllership or business management",
      "Good relationships with business owners and an entrepreneurial drive",
      "Availability to run the operation and follow the method",
      "Interest in delivering real results for companies in your region",
    ],
  },

  steps: {
    title: "How it works",
    items: [
      { title: "Sign up", text: "Fill in the form with your profile and the region you're interested in." },
      { title: "First conversation", text: "Our expansion team gets in touch to meet you and answer your questions." },
      {
        title: "Model presentation",
        text: "You receive the Franchise Disclosure Document, with the investment, fees and every rule of the business.",
      },
      { title: "Contract and training", text: "Once everything is aligned, we sign the contract and your training begins." },
    ],
  },

  investment: {
    title: "Investment",
    text: "The initial investment, franchise fee and royalties are presented in the Franchise Disclosure Document (COF), delivered after the first conversation, as required by the Brazilian Franchise Law (Law No. 13,966/2019).",
  },

  form: {
    title: "Become a franchisee",
    description: "Fill in your details and the Vispe expansion team will reach out for a first conversation.",
    fields: {
      name: "Full name",
      email: "Email",
      phone: "WhatsApp",
      city: "City / state of interest",
      background: "Education or field of work",
      capital: "Capital available to invest",
      message: "Tell us a bit about yourself (optional)",
    },
    capitalOptions: ["Up to R$ 50k", "R$ 50k to R$ 100k", "R$ 100k to R$ 200k", "Over R$ 200k"],
    capitalPlaceholder: "Select",
    consent: "I agree that Vispe Capital may use this data to contact me about the franchise, under the LGPD.",
    submit: "Send my interest",
    sending: "Sending…",
  },

  messages: {
    invalid: "Please review the highlighted fields.",
    success: "We got your interest! The Vispe expansion team will reach out soon.",
    unavailable: "Sending through the site is still being set up. Meanwhile, reach us on Vispe's social channels.",
    errors: {
      required: "Please fill in this field.",
      email: "Enter a valid email.",
      phone: "Enter a WhatsApp number with area code.",
      capital: "Select a range.",
      consent: "You need to agree so we can contact you.",
    },
  },
};
