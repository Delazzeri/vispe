import type { PrivacyContent } from "../privacy";

// Privacy Policy (/en/privacy) — same structure as content/pt-BR/privacy.ts.
// TODO(content): fill in the [bracketed] fields and have it reviewed by legal
// counsel and a native English speaker before publishing.

export const privacy: PrivacyContent = {
  title: "Privacy Policy",
  description:
    "How Vispe Capital collects, uses and protects your personal data on the website, in forms and in cookies, and how to exercise your rights under Brazil's LGPD.",
  breadcrumb: "Privacy Policy",
  updated: "Last updated: [publication date]",
  intro:
    "This policy explains which personal data Vispe Capital collects when you use this website, what it is used for, who it is shared with and how you can exercise your rights under Brazil's General Data Protection Law (Law No. 13,709/2018, LGPD).",
  cookiesButton: "Open cookie preferences",
  sections: [
    {
      id: "controller",
      title: "Who is responsible for your data",
      paragraphs: [
        "The data controller is [company legal name], registered under CNPJ No. [CNPJ], located at [full address] (\"Vispe Capital\").",
        "Data Protection Officer (DPO): [DPO name], at [DPO e-mail].",
      ],
    },
    {
      id: "data",
      title: "What data we collect",
      paragraphs: ["We only collect what each purpose requires:"],
      list: [
        "Data you provide in forms: name, e-mail, phone, company, role, revenue range, industry, message and, in the careers form, the résumé you send.",
        "Browsing data, with your consent: pages visited, where the visit came from (for example, an ad or a search), campaign parameters (UTM), device and browser type, and approximate location based on the IP address.",
        "Cookie and ad-click identifiers from the marketing platforms described below, also only with your consent.",
      ],
    },
    {
      id: "purposes",
      title: "What we use the data for",
      list: [
        "Replying to you, scheduling the assessment and presenting proposals (steps prior to a contract, at your request).",
        "Sending the free materials you request by e-mail.",
        "Assessing job applications.",
        "Understanding how the website is used and improving pages and content (analytics cookies, with consent).",
        "Measuring campaign results and showing Vispe Capital ads to people who have visited the website (marketing cookies, with consent).",
        "Complying with legal obligations and protecting the website against fraud and abuse (legitimate interest and legal obligation).",
      ],
    },
    {
      id: "cookies",
      title: "Cookies and similar technologies",
      paragraphs: [
        "Essential cookies are always on, because the website does not work properly without them. Analytics and marketing cookies are only enabled if you allow them, and you can change your choice at any time.",
      ],
      list: [
        "Essential: store your cookie choice (vispe_consent) and the language picked in the language selector (vispe_lang).",
        "Analytics: Google Analytics, for website usage statistics.",
        "Marketing: Meta Pixel (Facebook and Instagram), LinkedIn Insight Tag and Google Ads, to measure campaigns and build ad audiences. When you submit a form with marketing allowed, your e-mail, phone and name may also be sent to Meta in encrypted (hashed) form, only to match the submission to the ad that led to it.",
      ],
    },
    {
      id: "sharing",
      title: "Who we share data with",
      paragraphs: [
        "We do not sell personal data. We only share it with providers that help us run the website and our services, each for its own purpose:",
      ],
      list: [
        "Hostinger: website hosting.",
        "Google (Sheets, Drive and Gmail): form records, résumé storage and e-mail delivery.",
        "Supabase: website database and files (content, materials and images).",
        "Meta, LinkedIn and Google: analytics and advertising platforms, only with your consent.",
        "Public authorities, when required by law or court order.",
      ],
    },
    {
      id: "transfer",
      title: "International transfers",
      paragraphs: [
        "Some of these providers store data outside Brazil. In these cases, transfers follow LGPD requirements, with providers that adopt adequate safeguards.",
      ],
    },
    {
      id: "retention",
      title: "How long we keep data",
      paragraphs: [
        "We keep data for as long as each purpose requires: business contacts for [period], résumés for [period] and browsing data for each platform's retention period. After that, data is deleted or anonymized, unless the law requires us to keep it.",
      ],
    },
    {
      id: "rights",
      title: "Your rights",
      paragraphs: ["Under the LGPD, you may at any time:"],
      list: [
        "confirm whether we process your data and access it;",
        "correct incomplete, inaccurate or outdated data;",
        "request anonymization, blocking or deletion of unnecessary data or data processed unlawfully;",
        "request data portability;",
        "find out who we share your data with;",
        "withdraw consent and request deletion of data processed based on it.",
      ],
      after: "To exercise these rights, write to [DPO e-mail]. You may also file a complaint with Brazil's National Data Protection Authority (ANPD).",
    },
    {
      id: "security",
      title: "Security",
      paragraphs: [
        "We adopt technical and administrative measures to protect data, such as encrypted connections (HTTPS), access restricted to authorized staff and download links that expire.",
      ],
    },
    {
      id: "changes",
      title: "Changes to this policy",
      paragraphs: [
        "This policy may be updated. The date of the last update is shown at the top of the page, and relevant changes will be announced on the website.",
      ],
    },
  ],
};
