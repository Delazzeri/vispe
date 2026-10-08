import { brand } from "../brand";
import type { Widen } from "../types";
import type { franchise as ptBR } from "../pt-BR/franchise";

// Vispe franchise pages. TODO(content): validate with the Vispe expansion team.

export const franchise: Widen<typeof ptBR> = {
  selector: {
    eyebrow: "Vispe Franchise",
    title: "Choose the franchise model that fits you",
    description: `Two ways to bring ${brand.name} to your region. Pick the one that matches your profile and see the details.`,
    cta: "See the model",
    options: {
      comercial: {
        title: "Commercial Franchise",
        text: "For people with a sales profile and a strong network: you open doors with business owners and Vispe delivers the projects.",
      },
      financeira: {
        title: "Financial Franchise",
        text: "For finance and accounting professionals: you serve clients in your region with Vispe's method and technology.",
      },
    },
  },

  models: {
    comercial: {
      eyebrow: "Commercial Franchise",
      title: "Generate business with the Vispe brand in your region",
      description:
        "You connect business owners in your region to Vispe Capital's solutions and earn on every closed contract. The Vispe team handles delivery.",
      cta: "Become a commercial franchisee",
      stats: [{ value: "{{N}}", label: "commercial franchisees" }],
      bullets: ["Delivery by the Vispe team", "Sales training", "Full solutions portfolio"],
      about: {
        title: "How it works",
        text: "The commercial franchisee is the face of Vispe in their market: prospecting companies, running the first diagnosis and presenting the solutions. After the contract, Vispe's specialists take over delivery while you keep the client relationship.",
        items: [
          { title: "Prospecting", text: "You find companies with potential and book the conversations." },
          { title: "Diagnosis", text: "With Vispe's playbook, you understand the owner's situation." },
          { title: "Proposal and closing", text: "You present the right solution, backed by the Vispe team." },
          { title: "Delivery and relationship", text: "Vispe runs the project and you stay close to the client." },
        ],
      },
      offer: {
        title: "What you get",
        items: [
          { icon: "method", title: "Full portfolio", text: "Every Vispe solution to offer, from Financial BPO to M&A." },
          { icon: "support", title: "Sales training", text: "Training in diagnosis, proposals and negotiation with business owners." },
          { icon: "brand", title: "Brand and demand generation", text: "Content, a podcast and materials to open doors in your region." },
          { icon: "tech", title: "Guaranteed delivery", text: "Vispe specialists run the projects you sell." },
        ],
      },
      profile: {
        title: "Who it's for",
        items: [
          "A sales profile and a good network of business owners",
          "Experience in consultative or B2B sales",
          "Availability to prospect and follow up with clients",
        ],
      },
    },
    financeira: {
      eyebrow: "Financial Franchise",
      title: "Serve companies in your region with the Vispe method",
      description:
        "You provide Vispe Capital's financial services to business owners in your market, with the method, technology and support of SMB specialists.",
      cta: "Become a financial franchisee",
      stats: [{ value: "{{N}}", label: "financial franchisees" }],
      bullets: ["Vispe method and Fin 24/7", "Training and technical support", "A reference SMB brand"],
      about: {
        title: "How it works",
        text: "The financial franchisee runs the operation in their region: attracting clients, applying Vispe's method and delivering financial organization and higher margins, backed by Fin 24/7 and the Vispe team's technical support.",
        items: [
          { title: "Organization", text: "You structure the client's finances: routines, controls and KPIs." },
          { title: "Margin", text: "With the data in order, you find where the company is losing profit." },
          { title: "Growth", text: "You support decisions on expansion, credit and investment." },
          { title: "Monitoring", text: "Fin 24/7 shows the numbers in real time to you and the client." },
        ],
      },
      offer: {
        title: "What you get",
        items: [
          { icon: "method", title: "A proven method", text: "The Organization, Margin and Growth pillars, with ready processes and deliverables." },
          { icon: "tech", title: "Proprietary technology", text: "Access to Fin 24/7, Vispe's virtual CFO, to follow every client." },
          { icon: "brand", title: "A reference brand", text: "A recognized SMB finance brand, with content to attract clients." },
          { icon: "support", title: "Training and support", text: "Initial training and ongoing technical support from the Vispe team." },
        ],
      },
      profile: {
        title: "Who it's for",
        items: [
          "Experience in finance, accounting or controllership",
          "An entrepreneurial drive and a wish to work closely with owners",
          "Availability to run the operation and follow the method",
        ],
      },
    },
  },

  steps: {
    title: "Steps to become a franchisee",
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

  otherModel: "See also the {model}",

  form: {
    title: "Sign up",
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
    submit: "Send",
    sending: "Sending…",
  },

  messages: {
    invalid: "Please review the highlighted fields.",
    success: "We got your details! The Vispe expansion team will reach out soon.",
    unavailable: "Sending through the site is still being set up. Meanwhile, reach us on Vispe's social channels.",
    errors: {
      required: "Please fill in this field.",
      email: "Enter a valid email.",
      phone: "Enter a WhatsApp number with area code.",
      capital: "Select a range.",
      model: "Choose a franchise model.",
      consent: "You need to agree so we can contact you.",
    },
  },
};
