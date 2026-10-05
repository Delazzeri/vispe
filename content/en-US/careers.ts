import type { CareersContent } from "../careers";
import { brand } from "../brand";
import { site } from "./site";

// "Careers" page — English version of content/pt-BR/careers.ts.
// TODO(content): review by a native English speaker.

export const careers: CareersContent = {
  hero: {
    eyebrow: "Careers",
    title: "Help us build the financial future of Brazilian SMEs",
    description:
      "We look for people with technical rigor, an owner's mindset and the drive to make a real difference in business owners' lives. If that's you, we'd love to hear your story.",
  },

  about: {
    title: `Why ${brand.name}`,
    positioning: site.about.positioning,
    valuesTitle: "What drives us",
    values: site.about.values,
    socialTitle: "Stay on top of everything about equity",
    socialDescription: "Content on valuation, M&A, financial management and life behind the scenes at Vispe on our social channels.",
  },

  form: {
    title: "Send your resume",
    description:
      "Fill in your details and attach your resume as a PDF. Our people team reviews every application and will reach out when there's an opportunity that matches your profile.",
    steps: { about: "About you", area: "Your area", resume: "Your resume" },
    fields: {
      name: "Full name",
      email: "Email",
      phone: "Phone / WhatsApp",
      city: "City / State",
      linkedin: "LinkedIn (optional)",
      area: "Area of interest",
      roles: "Roles of interest",
      rolesHint: "Select one or more.",
      roleOther: "Which role are you looking for?",
      message: "Tell us a bit about yourself (optional)",
      resume: "Resume (PDF)",
      resumeDrop: "Drag your PDF here or click to choose",
      resumeReplace: "Replace file",
      resumeHint: "PDF only, up to 4 MB. Prefer a file with selectable text (not scanned).",
      honeypot: "Company",
    },
    areas: [
      {
        name: "Controllership & Finance",
        roles: ["Finance Assistant", "Financial Analyst", "Controllership Analyst", "Controller", "Finance Coordinator"],
      },
      {
        name: "M&A & Valuation",
        roles: ["M&A Analyst", "Valuation Analyst", "Associate", "M&A Manager"],
      },
      {
        name: "Tax Planning",
        roles: ["Tax Assistant", "Tax Analyst", "Tax Consultant"],
      },
      {
        name: "Sales",
        roles: ["SDR / Pre-sales", "Account Executive", "Customer Success", "Sales Manager"],
      },
      {
        name: "Administrative",
        roles: ["Administrative Assistant", "Human Resources", "Front Desk"],
      },
      { name: "Other", roles: [] },
    ],
    internship: "Internship",
    consent:
      "I authorize Vispe Capital to store and process my personal data and resume solely for recruitment and selection purposes, in accordance with Brazil's General Data Protection Law (LGPD, Law No. 13,709/2018).",
    submit: "Submit application",
    submitting: "Submitting…",
  },

  messages: {
    success: "Application submitted! Thank you for your interest — we'll get in touch if there's an opening that matches your profile.",
    invalid: "Please review the highlighted fields and try again.",
    unavailable:
      "Submitting through the website is temporarily unavailable. Please send your resume directly to the email below:",
    errors: {
      required: "This field is required.",
      email: "Enter a valid email address.",
      phone: "Enter a phone number with area code.",
      linkedin: "Enter the full URL of your profile (linkedin.com/in/…).",
      area: "Select an area.",
      roles: "Select at least one role.",
      roleOther: "Tell us which role you're looking for.",
      resumeMissing: "Attach your resume.",
      resumeType: "Your resume must be a PDF.",
      resumeSize: "The file is larger than 4 MB.",
      consent: "You need to authorize data processing to submit.",
    },
  },
};
