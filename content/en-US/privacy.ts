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
    "Vispe Capital, the trade name of [company legal name], registered under CNPJ No. [CNPJ], located at [full address], is committed to protecting the privacy of everyone who visits vispecapital.com and gets in touch with us. This Privacy Policy explains, in plain terms, which personal data we collect, what it is used for, who it may be shared with and how you can exercise the rights guaranteed by Brazil's General Data Protection Law (Law No. 13,709/2018, LGPD). By browsing the website or submitting any form, you acknowledge that you have read and understood this document.",
  cookiesButton: "Open cookie preferences",
  sections: [
    {
      id: "controller",
      title: "Data controller",
      paragraphs: [
        "Vispe Capital is the controller of the personal data processed on this website, meaning it decides how and why that data is used. For any matter related to your data, you can reach our Data Protection Officer (DPO), [DPO name], at [DPO e-mail].",
      ],
    },
    {
      id: "data",
      title: "Data we collect",
      paragraphs: [
        "We only collect the data each purpose requires. When you fill in a form on the website, whether to request an assessment, download a free material, ask about franchising or apply for a job, we receive the information you provide, such as your name, e-mail, phone, company, role, revenue range, industry and message. In the careers form, we also receive the attached résumé.",
        "If you allow analytics and marketing cookies, we also collect information about your browsing, such as pages visited, where the visit came from (for example, an ad or a search), campaign parameters in the link, device and browser type and approximate location based on your IP address, as well as cookie and ad-click identifiers from the platforms described in this policy. Without your consent, this data is not collected.",
        "Regardless of that choice, the website counts visits anonymously with Umami, an analytics tool that does not use cookies. It only records aggregate numbers, such as pages viewed, where the visit came from, approximate country and city, device type, browser and operating system, plus the number of forms submitted and WhatsApp clicks, without their content and without identifying who visited.",
      ],
    },
    {
      id: "purposes",
      title: "How we use the data",
      paragraphs: [
        "Data submitted through forms is used to reply to you, schedule the assessment, present business proposals, e-mail the materials you requested and assess job applications. This processing happens at your request and is limited to what is needed to fulfil it.",
        "Browsing data, when allowed, helps us understand how the website is used, improve pages and content, measure our campaigns and show Vispe Capital ads to people who have visited the website. We may also process data to comply with legal and regulatory obligations, exercise rights in legal proceedings and protect the website against fraud and abuse.",
      ],
    },
    {
      id: "cookies",
      title: "Use of cookies",
      paragraphs: [
        "Cookies are small files stored in your browser that let the website remember information about your visit. We use essential cookies, which are always on because the website does not work properly without them: they store your cookie choice, the selected language and which notices (pop-ups) you have already seen or closed, so they are not repeated too often. Umami's anonymous visit count does not use cookies.",
        "Analytics cookies (Google Analytics) and marketing cookies (Meta Pixel, for Facebook and Instagram, LinkedIn Insight Tag and Google Ads) are only enabled if you allow them in the notice shown on your first visit. When marketing is allowed and you submit a form, your e-mail, phone and name may also be sent to Meta in encrypted (hashed) form, only to match the submission to the ad that led to it. You can review your choice at any time using the button below or the link in the website footer.",
      ],
    },
    {
      id: "media",
      title: "Embedded media",
      paragraphs: [
        "Some videos on the website are played from YouTube in privacy-enhanced mode. They only load when they appear on screen or when you press play and, from then on, follow Google's privacy policy.",
      ],
    },
    {
      id: "sharing",
      title: "Data sharing",
      paragraphs: [
        "Vispe Capital does not sell personal data. We only share data with providers that help us run the website and our services, always to the extent each one needs: Hostinger, which hosts the website; Google, whose tools (Sheets, Drive and Gmail) we use to record forms, store résumés and send e-mails; Supabase, which runs the website's database and files; and Umami, which counts visits anonymously. Analytics and advertising platforms (Meta, LinkedIn and Google) only receive data with your consent.",
        "We may also share data with public authorities when required by law or court order.",
      ],
    },
    {
      id: "transfer",
      title: "International transfers",
      paragraphs: [
        "Some of the providers mentioned store data on servers outside Brazil. In these cases, international transfers follow the grounds set out in the LGPD, with providers that adopt adequate safeguards.",
      ],
    },
    {
      id: "retention",
      title: "How long we keep data",
      paragraphs: [
        "We keep personal data only for as long as needed to fulfil the purposes described in this policy. Business contacts are kept for [period], résumés for [period] and browsing data for the period set by each platform. After that, data is deleted or anonymized, unless the law requires or allows us to keep it.",
      ],
    },
    {
      id: "security",
      title: "Access and security",
      paragraphs: [
        "Only authorized Vispe Capital staff have access to your personal data, and only to the extent their work requires. We adopt technical and administrative measures to protect it against unauthorized access and against accidental or unlawful destruction, loss, alteration or disclosure, such as encrypted connections (HTTPS), access control and download links that expire. Still, no system is entirely free of risk, which is why we review these measures continuously.",
      ],
    },
    {
      id: "rights",
      title: "Your rights",
      paragraphs: [
        "The LGPD gives you the right, at any time, to confirm whether we process your data and to access it; to correct incomplete, inaccurate or outdated data; to request the anonymization, blocking or deletion of unnecessary or excessive data, or data processed unlawfully; to request portability of your data to another provider; to know who your data has been shared with; and to withdraw consent, requesting deletion of data processed based on it.",
        "To exercise any of these rights, simply write to [DPO e-mail] describing your request. For your security, we may ask for information that confirms your identity before handling it. You may also file a complaint with Brazil's National Data Protection Authority (ANPD).",
      ],
    },
    {
      id: "changes",
      title: "Changes to this policy",
      paragraphs: [
        "This Privacy Policy may be updated to reflect changes to the website, our services or the law. The date of the last update is shown at the end of this page, and relevant changes will be announced on the website.",
      ],
    },
    {
      id: "law",
      title: "Governing law and jurisdiction",
      paragraphs: [
        "This policy is governed by the laws of the Federative Republic of Brazil. The courts of [city/state] shall have jurisdiction over any matter related to it.",
      ],
    },
  ],
  closing:
    "If you have questions, disagreements or suggestions about this Privacy Policy, contact us at [DPO e-mail]. We are located at [full address].",
};
