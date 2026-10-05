import type { SiteContent } from "../site";

// Site content in English — same fields as content/pt-BR/site.ts.
// TODO(content): review by a native English speaker before publishing.

export const site: SiteContent = {
  tagline: "WE ORGANIZE YOUR FINANCES AND INCREASE YOUR PROFIT",

  hero: {
    eyebrow: "Your financial controllership",
    h1: "Strategic financial intelligence",
    subheadline:
      "Stop losing money to a lack of financial control. We organize your finances and increase your profit.",
    description:
      "We grow your cash position and maximize your profit margin — without hiring a full-time executive director.",
    ctaPrimary: { label: "Boost your profit now", href: "/contato" },
    ctaSecondary: { label: "How CFO as a Service works", href: "#servicos" },
    bullets: [
      "No lock-in contract",
      "A team dedicated to your cash flow",
      "Free diagnosis",
      "Ready for liquidity events",
    ],
  },

  proposition: {
    eyebrow: "Who you'll be working with",
    title: "Not a report-only consultancy",
    description:
      "We turn ordinary businesses into high-value assets, ready to attract investors and reach a multimillion liquidity event.",
  },

  awards: [
    { src: "/media/award/en-US/+2bi.png", width: 655, height: 766, alt: "2026 seal: over R$ 2 billion in managed equity" },
    { src: "/media/award/en-US/+700.png", width: 684, height: 766, alt: "2026 seal: over R$ 700 million in M&A transactions" },
    { src: "/media/award/en-US/+300.png", width: 719, height: 765, alt: "2026 seal: over 300 valuation reports issued" },
  ],

  featureChips: {
    eyebrow: "Solutions",
    title: "Everything your company needs, in one place",
    description:
      "From day-to-day controllership to the most complex liquidity events, we structure every step with technical rigor and the closeness of people who understand your business.",
    chips: [
      "Financial controllership",
      "M&A",
      "Fundraising",
      "Tax planning",
      "Sales acceleration",
      "Valuation",
      "Due diligence",
      "Financial turnaround",
      "Finance BPO",
      "Partnership",
    ],
    video: {
      title: "How Vispe Capital works",
      embedUrl: undefined,
    },
  },

  // TODO(content): translation of the client's original quote (Portuguese) —
  // confirm with NavegMAIS Telecom that the English version can be published.
  featuredTestimonial: {
    quote:
      "We've been clients for a few years and went through every stage of restructuring and organizing the company. The results have been excellent — quality service you can trust. We're proud to be clients and we're sure you'll do great together.",
    name: "NavegMAIS Telecom",
    role: "Internet Service Provider",
    rating: 5,
    logo: { src: "/media/clients/navegmais.png" },
  },

  categoryBlocks: {
    title: "Solutions for every stage of your finances",
    description: "From corporate transactions to day-to-day controllership, all with the same team.",
  },

  showcaseCarousel: [
    { id: "placeholder-1", label: "Illustrative image 1" },
    { id: "placeholder-2", label: "Illustrative image 2" },
    { id: "placeholder-3", label: "Illustrative image 3" },
    { id: "placeholder-4", label: "Illustrative image 4" },
    { id: "placeholder-5", label: "Illustrative image 5" },
  ],

  servicesCarousel: {
    title: "Equity Pillars",
    description: "The three pillars that sustain your company's value, from cash flow to the next leap.",
  },

  servicePillars: [
    {
      slug: "organizacao",
      shortLabel: "ORGANIZATION",
      tagline: "Get your finances in order",
      name: "Organization",
      cta: "I want to get organized",
      includes: ["Financial Diagnosis", "Finance BPO", "Due Diligence"],
    },
    {
      slug: "margem",
      shortLabel: "MARGIN",
      tagline: "Multiply your profit",
      name: "Margin",
      cta: "I want to maximize profits",
      includes: [
        "Financial Management",
        "Tax Planning",
        "Valuation",
        "Financial Turnaround",
        "Partnership",
      ],
    },
    {
      slug: "crescimento",
      shortLabel: "GROWTH",
      tagline: "Get ready for the next leap",
      name: "Growth",
      cta: "I want to grow my company",
      includes: ["Sales Acceleration", "Mergers & Acquisitions", "Fundraising"],
    },
  ],

  services: [
    {
      slug: "ma",
      shortLabel: "M&A",
      tagline: "Buy, sell or merge with strategy",
      name: "M&A — Mergers & Acquisitions",
      description: "We buy, sell and merge companies strategically to maximize returns.",
      includes: ["Buyer mapping", "Negotiation", "Due diligence", "Deal closing"],
      widgets: [
        { label: "Deals in progress", value: "3" },
        { label: "Current stage", value: "Due diligence" },
      ],
    },
    {
      slug: "captacao-de-recursos",
      shortLabel: "FUNDRAISING",
      tagline: "Connect with those who invest in your growth",
      name: "Fundraising",
      description: "Structuring and connecting you with investors, banks and funds to fuel growth.",
      includes: ["Round structuring", "Investor network", "Pitch deck", "Term negotiation"],
      widgets: [
        { label: "Investors in network", value: "120+" },
        { label: "Round", value: "Series A" },
      ],
    },
    {
      slug: "planejamento-tributario",
      shortLabel: "TAX",
      tagline: "Pay only the taxes you owe",
      name: "Tax Planning",
      description: "Stop paying more taxes than you owe. Legal, strategic reduction of your tax burden.",
      includes: ["Tax diagnosis", "Corporate restructuring", "Tax regime selection", "Compliance"],
      widgets: [
        { label: "Estimated savings", value: "-18%" },
        { label: "Regime", value: "Actual profit" },
      ],
    },
    {
      slug: "controladoria-financeira",
      shortLabel: "CONTROL",
      tagline: "Get your finances in order",
      name: "Financial Controllership",
      description:
        "Strategic financial management that turns numbers into decisions and revenue into real profit.",
      includes: ["Cash flow", "Management P&L", "Financial KPIs", "Month-end closing routine"],
      widgets: [
        { label: "Net margin", value: "18.4%" },
        { label: "Closing", value: "Monthly" },
      ],
    },
    {
      slug: "aceleracao-comercial",
      shortLabel: "SALES",
      tagline: "Sell more, with better margins",
      name: "Sales Acceleration",
      description:
        "We build your sales operation from the ground up: clear processes, data intelligence and a team focused on bringing in high-margin contracts.",
      includes: ["Sales funnel", "Sales playbook", "Data intelligence", "Team management"],
      widgets: [
        { label: "Funnel conversion", value: "+24%" },
        { label: "Average ticket", value: "+12%" },
      ],
    },
    {
      slug: "valuation",
      shortLabel: "VALUATION",
      tagline: "Know what your company is really worth",
      name: "Valuation",
      description: "Your company's true value, calculated with precision. You negotiate from a position of strength.",
      includes: ["Technical report", "Market multiples", "Discounted cash flow", "Negotiation report"],
      widgets: [
        { label: "Applied multiple", value: "4.8x" },
        { label: "Method", value: "Cash flow" },
      ],
    },
  ],

  about: {
    purpose:
      "Vispe exists to democratize access to capital markets for small and medium-sized businesses. We act as the strategic arm that maximizes operations, turning local businesses into high-value assets. Our goal is to be the compass that guides business owners toward liquidity and sustainable growth.",
    vision:
      "To be Brazil's leading platform for SME equity solutions, recognized for technical precision, unwavering integrity and results that impact generations of entrepreneurs.",
    values: [
      {
        name: "Sovereignty",
        description: "We master the technical knowledge that gives our clients confidence.",
      },
      {
        name: "Efficiency",
        description: "Relentless focus on maximizing operations and results.",
      },
      {
        name: "Transparency",
        description: "Complete clarity in complex equity and valuation processes.",
      },
      {
        name: "Impact",
        description: "We transform the financial reality of companies and their founders.",
      },
    ],
    positioning:
      "Vispe sits between traditional consulting and the large investment banks. We offer Wall Street know-how with the closeness of São Paulo's financial district, adapted to the reality of Brazilian SMEs.",
    audience:
      "We serve founders and successors of SMEs who have built solid businesses but need technical support to access the equity market. They are leaders seeking professionalization, succession or expansion, who value a partner that speaks the owner's language with the rigor of the financial market.",
  },

  clients: {
    title: "Our clients",
    subtitle: "They chose to break from tradition and truly scale value",
    logos: [
      "Company A",
      "Company B",
      "Company C",
      "Company D",
      "Company E",
      "Company F",
      "Company G",
      "Company H",
    ],
  },

  testimonialsSection: {
    title: "Business owners who grow with us",
    description: "Real feedback from business owners who trust Vispe Capital.",
  },

  testimonials: [
    {
      quote:
        "[Sample testimonial — replace] Vispe organized our finances in a few months and we could finally see where we were losing margin.",
      name: "Sample Client",
      handle: "@sampleclient",
      role: "Founder, Sample Company",
      rating: 5,
      source: undefined,
    },
    {
      quote:
        "[Sample testimonial — replace] The valuation process was decisive in our negotiation with investors. Today we can justify every number in our financials at the negotiating table, without relying on loose spreadsheets.",
      name: "Sample Client",
      handle: "@sampleclient",
      role: "CEO, Sample Company",
      rating: 5,
      source: "x",
    },
    {
      quote:
        "[Sample testimonial — replace] We gained real controllership without hiring a full-time CFO.",
      name: "Sample Client",
      handle: "@sampleclient",
      role: "Partner, Sample Company",
      rating: 5,
      source: undefined,
    },
    {
      quote:
        "[Sample testimonial — replace] The fundraising we structured with Vispe took the company to another level. The team followed every stage of the negotiation and brought clarity to decisions that used to stall for lack of reliable data — that made all the difference at closing.",
      name: "Sample Client",
      handle: "@sampleclient",
      role: "Founder, Sample Company",
      rating: 5,
      source: undefined,
      avatarPlaceholder: true,
    },
    {
      quote:
        "[Sample testimonial — replace] A close, technical team that truly understands the reality of running a business.",
      name: "Sample Client",
      handle: "@sampleclient",
      role: "Finance Director, Sample Company",
      rating: 5,
      source: "x",
      avatarPlaceholder: true,
      mediaPlaceholder: true,
    },
    {
      quote:
        "[Sample testimonial — replace] Within a few months we were able to reduce our tax burden legally and safely.",
      name: "Sample Client",
      handle: "@sampleclient",
      role: "Partner, Sample Company",
      rating: 5,
      source: undefined,
    },
  ],

  fin: {
    name: "24 Fin",
    title: "Your virtual CFO, available 24/7",
    description:
      "[Sample content — replace] Cash flow, KPIs and financial alerts organized by Vispe, keeping track of your company every day of the month.",
    ctaLabel: "Get 24 Fin",
    ctaHref: "/contato",
  },

  showcase: {
    title: "Organize your finances, multiply your profit",
    description:
      "Controllership, cash flow and management KPIs in one place — so you decide with clarity, not guesswork.",
    video: {
      title: "How Vispe organizes your finances",
      embedUrl: undefined,
    },
  },

  blog: {
    title: "Vispe Blog",
    subtitle:
      "Practical content on financial management, equity and growth for business owners. Articles are available in Portuguese.",
  },

  faqIntro: {
    title: "Frequently asked questions",
    subtitle: "Get answers on how Vispe organizes your finances and increases your profit.",
  },

  faq: [
    {
      question: "What is CFO as a Service?",
      answer:
        "It's the structuring of your business's financial intelligence — controllership, cash flow and management KPIs — without the need to hire a full-time finance director.",
    },
    {
      question: "Do I need an established finance department?",
      answer:
        "No. We work from the initial diagnosis, organizing your finances from scratch when needed, all the way to more advanced processes such as M&A and fundraising.",
    },
    {
      question: "How does the initial diagnosis work?",
      answer:
        "We analyze the company's current financial situation and point out where the main margin losses and structuring opportunities are, before any commitment.",
    },
    {
      question: "Do you work with companies of any size?",
      answer:
        "We serve small and medium-sized businesses that already generate revenue and want to professionalize financial management — whether to grow, prepare for succession or access capital markets.",
    },
    {
      question: "What other services do you offer?",
      answer:
        "M&A, fundraising, tax planning, sales acceleration and valuation — each structured according to the company's specific moment and needs.",
    },
    {
      question: "How does Finance BPO work?",
      answer:
        "We take over your company's financial routine — accounts payable and receivable, reconciliation and cash flow — so you have reliable information and free time to run the business.",
    },
    {
      question: "What is Valuation?",
      answer:
        "It's the assessment of your company's real value, based on results, prospects and risks. It's the benchmark for selling, bringing in partners, raising capital or planning succession.",
    },
    {
      question: "What is Due Diligence?",
      answer:
        "It's a detailed analysis of a company's finances, contracts and risks before an acquisition, merger or investment, so the decision is made with data and without surprises.",
    },
    {
      question: "When does it make sense to consider M&A?",
      answer:
        "When the company wants to grow by acquiring operations, join forces with a strategic partner or sell the business. We structure the process to maximize returns at every stage.",
    },
    {
      question: "What is a Financial Turnaround?",
      answer:
        "It's a recovery plan for companies with tight cash or falling margins: we reorganize costs, debt and processes to restore the business's financial health.",
    },
    {
      question: "How does fundraising work?",
      answer:
        "We prepare the company and its numbers to present to investors and institutions, and help choose the best source of capital for your moment.",
    },
    {
      question: "How does tax planning help?",
      answer:
        "We review the company's tax structure to identify the most efficient regime and reduce the tax burden within the law, freeing up margin for your profit.",
    },
  ],

  partners: {
    title: "Our partners",
    subtitle: "Partnering with Vispe means access to growth, commissions and recognition",
    cta: { label: "I want to become a partner", href: "/contato" },
  },

  education: {
    eyebrow: "Education & Equity",
    title: "What your revenue won't let you see",
    description:
      "Revenue is ego, profit is reality. In these short lessons, we reveal the structural mistakes that remain invisible even to the most experienced owners. Understand why selling more isn't solving your cash problem and how a financial diagnosis is the only tool that can stop the drain on your wealth.",
  },

  contact: {
    title: "Talk to Vispe",
    subtitle: "Ready to maximize your company's value?",
    description:
      "Fill out the form and a Vispe Capital specialist will get in touch, with the clarity of a team that has transformed hundreds of companies across Brazil.",
  },

  nav: [
    { label: "About", href: "/#solucoes" },
    { label: "Solutions", href: "/#servicos" },
    { label: "Testimonials", href: "/#depoimentos" },
    { label: "Equity", href: "/#equity" },
    { label: "FAQ", href: "/#faq" },
    { label: "Blog", href: "/#blog" },
  ],

  footer: {
    description:
      "We grow your cash position and maximize your profit margin — without hiring a full-time executive director.",
    cta: { label: "Book a diagnosis", href: "/contato" },
    socialLabel: "Follow Vispe",
    columns: {
      company: {
        title: "Company",
        links: [
          { label: "About us", href: "/sobre" },
          { label: "Testimonials", href: "/#depoimentos" },
          { label: "Equity", href: "/#equity" },
          { label: "Careers", href: "/trabalhe-conosco" },
          { label: "FAQ", href: "/#faq" },
        ],
      },
      services: {
        title: "Solutions",
        href: "/#servicos",
        labels: { ma: "Mergers & Acquisitions" },
      },
      content: { title: "Content", postsLimit: 3, moreLabel: "See all articles", moreHref: "/#blog" },
      contact: {
        title: "Get in touch",
        links: [
          { label: "Talk to Vispe", href: "/contato" },
          { label: "Book a diagnosis", href: "/contato" },
          { label: "24 Fin virtual CFO", href: "/#fin" },
        ],
      },
    },
    rights: "All rights reserved.",
    backToTop: "Back to top ↑",
  },

  ui: {
    mainNav: "Main navigation",
    headerCta: { label: "Book a diagnosis", href: "/contato" },
    openMenu: "Open menu",
    closeMenu: "Close menu",
    resultsLabel: "Vispe Capital results",
    solutionsLabel: "Solutions offered",
    pillarsLabel: "Vispe Capital solutions",
    galleryLabel: "Vispe Capital gallery",
    socialProfile: "Vispe Capital on {network}",
    includes: "Includes:",
    pillar: "Pillar {n}",
    rating: "Rated {rating} out of 5 stars",
    videoPlaceholder: "Video in production — placeholder",
    dashboardAlt:
      "Vispe Capital's CFO as a Service dashboard, showing recurring revenue, CAC, LTV/CAC, churn, sales funnel and revenue by product",
    home: "Home",
    readingTime: "{minutes} min read",
    blogPosts: "Blog articles",
    blogPages: "Blog pages",
    blogGoToPage: "Go to group {page} of {total}",
    backToBlog: "Back to blog",
    portugueseOnly: "This article is available in Portuguese only.",
  },

  pages: {
    about: { title: "About", heading: "About Vispe Capital" },
    contact: { title: "Contact" },
    careers: { title: "Careers" },
  },
};
