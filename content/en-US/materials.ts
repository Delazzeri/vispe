import type { Widen } from "../types";
import type { materials as ptBR } from "../pt-BR/materials";

// "Free materials" page. Files are shared with pt-BR (same slugs and `file`).

export const materials: Widen<typeof ptBR> = {
  hero: {
    eyebrow: "Free materials",
    title: "Tools to organize your finances and grow your profit",
    description:
      "Spreadsheets, checklists and practical guides made by the Vispe Capital team. Pick a material, leave your contact and download it right away.",
  },

  categories: { organizacao: "Organization", margem: "Margin", crescimento: "Growth" },

  items: [
    {
      slug: "planilha-fluxo-de-caixa",
      type: "Spreadsheet",
      category: "organizacao",
      title: "Cash flow spreadsheet",
      description: "Track inflows and outflows and project the next months' cash without a system.",
      file: undefined,
    },
    {
      slug: "modelo-dre-gerencial",
      type: "Spreadsheet",
      category: "margem",
      title: "Management income statement template",
      description: "See the month's revenue, costs and profit in a simple layout, ready for the results meeting.",
      file: undefined,
    },
    {
      slug: "checklist-due-diligence",
      type: "Checklist",
      category: "organizacao",
      title: "Due diligence checklist",
      description: "The documents and red flags a buyer or investor will ask about before closing a deal.",
      file: undefined,
    },
    {
      slug: "guia-regime-tributario",
      type: "Guide",
      category: "margem",
      title: "Choosing your tax regime",
      description: "Simples Nacional, Lucro Presumido or Lucro Real: what to compare before deciding.",
      file: undefined,
    },
    {
      slug: "guia-valuation-pmes",
      type: "E-book",
      category: "crescimento",
      title: "Valuation for SMBs",
      description: "Learn how the market values a company and what weighs most on the price.",
      file: undefined,
    },
    {
      slug: "roteiro-captacao-de-recursos",
      type: "Guide",
      category: "crescimento",
      title: "Fundraising roadmap",
      description: "From diagnosis to pitch: how to prepare to seek credit or investors.",
      file: undefined,
    },
  ],

  card: { download: "Free download", soon: "Coming soon" },
  empty: "The first materials are coming soon. Follow Vispe to know when they're published.",

  form: {
    title: "Almost there",
    description: "Leave your contact to unlock the material.",
    fields: { name: "Name", email: "Email", phone: "WhatsApp", company: "Company" },
    consent: "I agree that Vispe Capital may use this data to send content and contact me, under the LGPD.",
    submit: "Unlock download",
    sending: "Unlocking…",
    close: "Close",
  },

  messages: {
    invalid: "Please review the highlighted fields.",
    success: "Done! Your material is unlocked.",
    downloadNow: "Download now",
    errors: {
      required: "Please fill in this field.",
      email: "Enter a valid email.",
      phone: "Enter a WhatsApp number with area code.",
      material: "This material isn't available.",
      consent: "You need to agree to unlock the download.",
    },
  },
};
