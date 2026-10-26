import type { PrivacyContent } from "../privacy";

// Privacy Policy (/en/privacy-policy) — same structure as content/pt-BR/privacy.ts.
// TODO(content): fill in the [bracketed] fields and have it reviewed by legal
// counsel and a native English speaker before publishing.

export const privacy: PrivacyContent = {
  title: "Privacy Policy",
  description:
    "How Vispe Capital collects, uses and protects your personal data on the website, in forms and in cookies, and how to exercise your rights under Brazil's LGPD.",
  breadcrumb: "Privacy Policy",
  updated: "Last updated: [publication date]",
  intro:
    "This Privacy Policy explains which personal data is collected on this website (vispecapital.com), owned by [company legal name], registered under CNPJ No. [CNPJ], located at [full address] (\"Vispe Capital\"). It also explains what the data is used for, who it is shared with and how you can exercise your rights under Brazil's General Data Protection Law (Law No. 13,709/2018, LGPD). Please read it carefully.",
  cookiesButton: "Open cookie preferences",
  sections: [
    {
      id: "controller",
      title: "Who is responsible for your data",
      paragraphs: [
        "Vispe Capital is the controller of the personal data processed on this website. The Data Protection Officer (DPO) is [DPO name], who can be reached at [DPO e-mail].",
      ],
    },
    {
      id: "data",
      title: "What data we collect",
      paragraphs: ["We only collect what each purpose requires:"],
      items: [
        {
          label: "Forms",
          text: "name, e-mail, phone, company, role, revenue range, industry, message and, in the careers form, the résumé you send.",
        },
        {
          label: "Browsing",
          text: "with your consent, pages visited, where the visit came from (for example, an ad or a search), campaign parameters (UTM), device and browser type, and approximate location based on the IP address.",
        },
        { label: "Identifiers", text: "cookie and ad-click codes from the marketing platforms described below, also only with your consent." },
      ],
    },
    {
      id: "purposes",
      title: "What we use the data for",
      items: [
        { label: "Customer service", text: "replying to you, scheduling the assessment and presenting proposals, at your request." },
        { label: "Free materials", text: "sending the materials you request by e-mail." },
        { label: "Careers", text: "assessing job applications." },
        { label: "Analytics", text: "understanding how the website is used and improving pages and content (analytics cookies, with consent)." },
        {
          label: "Marketing",
          text: "measuring campaign results and showing Vispe Capital ads to people who have visited the website (marketing cookies, with consent).",
        },
        { label: "Legal obligations and security", text: "complying with the law and protecting the website against fraud and abuse." },
      ],
    },
    {
      id: "cookies",
      title: "Use of cookies",
      paragraphs: [
        "Cookies are small files stored in your browser. Essential cookies are always on, because the website does not work properly without them; analytics and marketing cookies are only enabled if you allow them, and you can change your choice at any time.",
      ],
      items: [
        { label: "Essential", text: "store your cookie choice (vispe_consent) and the language picked in the language selector (vispe_lang)." },
        { label: "Analytics", text: "Google Analytics, for website usage statistics." },
        {
          label: "Marketing",
          text: "Meta Pixel (Facebook and Instagram), LinkedIn Insight Tag and Google Ads, to measure campaigns and build ad audiences. When you submit a form with marketing allowed, your e-mail, phone and name may also be sent to Meta in encrypted (hashed) form, only to match the submission to the ad that led to it.",
        },
      ],
    },
    {
      id: "media",
      title: "Embedded media",
      paragraphs: [
        "Some videos on the website are played from YouTube in privacy-enhanced mode. They only load when they appear on screen or when you press play, and they follow Google's privacy policy.",
      ],
    },
    {
      id: "sharing",
      title: "Data sharing",
      paragraphs: [
        "We do not sell personal data. We only share it with providers that help us run the website and our services, each for its own purpose:",
      ],
      items: [
        { label: "Hostinger", text: "website hosting." },
        { label: "Google (Sheets, Drive and Gmail)", text: "form records, résumé storage and e-mail delivery." },
        { label: "Supabase", text: "website database and files (content, materials and images)." },
        { label: "Meta, LinkedIn and Google", text: "analytics and advertising platforms, only with your consent." },
        { label: "Public authorities", text: "when required by law or court order." },
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
      id: "security",
      title: "Access and security",
      paragraphs: [
        "Only authorized Vispe Capital staff have access to your personal data. We adopt technical and administrative measures to protect it against unauthorized access and accidental or unlawful situations, such as encrypted connections (HTTPS), restricted access and download links that expire.",
      ],
    },
    {
      id: "rights",
      title: "What your rights are",
      items: [
        { label: "Confirmation and access", text: "find out whether we process your data and access it." },
        { label: "Correction", text: "correct incomplete, inaccurate or outdated data." },
        { label: "Anonymization, blocking or deletion", text: "of unnecessary or excessive data, or data processed unlawfully." },
        { label: "Portability", text: "take your data to another service provider." },
        { label: "Information", text: "find out who we share your data with." },
        { label: "Withdrawal of consent", text: "withdraw consent at any time and request deletion of data processed based on it." },
      ],
      after:
        "To exercise any of these rights, write to [DPO e-mail], stating clearly what you need. For your security, we may confirm your identity before handling the request. You may also file a complaint with Brazil's National Data Protection Authority (ANPD).",
    },
    {
      id: "changes",
      title: "Changes to this policy",
      paragraphs: [
        "This policy may be updated. The date of the last update is shown at the end of the page, and relevant changes will be announced on the website.",
      ],
    },
    {
      id: "law",
      title: "Governing law",
      paragraphs: [
        "This policy is governed by the laws of the Federative Republic of Brazil. The courts of [city/state] shall have jurisdiction over any matter related to it.",
      ],
    },
  ],
  closing:
    "Questions, disagreements or suggestions about this Privacy Policy can be sent to [DPO e-mail]. We are located at [full address].",
};
