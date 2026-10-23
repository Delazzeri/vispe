import { WhatsAppButton } from "@/components/ui/whatsapp-button";
import { getLpUi } from "@/content/lp-ui";
import { getSite } from "@/content/site";
import type { Locale } from "@/i18n/routing";
import type { LandingPage, LocalizedLandingPage, LpSection } from "@/lib/lp/types";
import { LpAgenda } from "./lp-agenda";
import { LpAudience } from "./lp-audience";
import { LpBenefits } from "./lp-benefits";
import { LpCtaBlock } from "./lp-cta-block";
import { LpFaq } from "./lp-faq";
import { LpFormSection } from "./lp-form";
import { LpHero } from "./lp-hero";
import { LpSpeakers } from "./lp-speakers";
import { LpStats } from "./lp-stats";
import { LpSteps } from "./lp-steps";
import { LpTestimonials } from "./lp-testimonials";
import { LpVideo } from "./lp-video";

/**
 * Monta a LP a partir das seções do admin. Usado na página pré-renderizada, na
 * página única das LPs publicadas depois do build e na pré-visualização do admin.
 * `source` é a LP em português: as colunas da planilha usam os rótulos dela.
 */
export function LpPage({
  page,
  source,
  locale,
  preview = false,
}: {
  page: LocalizedLandingPage;
  source: LandingPage;
  locale: Locale;
  /** Pré-visualização do admin: o formulário não envia. */
  preview?: boolean;
}) {
  const ui = getLpUi(locale);
  const { whatsappFloat } = getSite(locale).ui;
  const hasHero = page.sections.some((section) => section.type === "hero");
  const faqs = page.sections.flatMap((section) => (section.type === "faq" ? section.data.items : []));

  function render(section: LpSection) {
    switch (section.type) {
      case "hero":
        return <LpHero id={section.id} data={section.data} />;
      case "stats":
        return <LpStats id={section.id} data={section.data} />;
      case "benefits":
        return <LpBenefits id={section.id} data={section.data} />;
      case "audience":
        return <LpAudience id={section.id} data={section.data} />;
      case "steps":
        return <LpSteps id={section.id} data={section.data} />;
      case "agenda":
        return <LpAgenda id={section.id} data={section.data} ui={ui} />;
      case "speakers":
        return <LpSpeakers id={section.id} data={section.data} />;
      case "testimonials":
        return <LpTestimonials id={section.id} data={section.data} />;
      case "video":
        return <LpVideo id={section.id} data={section.data} ui={ui} />;
      case "faq":
        return <LpFaq id={section.id} data={section.data} />;
      case "form": {
        const original = source.sections.find((item) => item.id === section.id);
        const columns: [string, string][] = (original?.type === "form" ? original.data.fields : section.data.fields).map(
          (field) => [field.id, field.label],
        );
        return (
          <LpFormSection
            id={section.id}
            data={section.data}
            page={{ slug: page.slug, name: page.name }}
            columns={columns}
            locale={locale}
            ui={ui}
            preview={preview}
          />
        );
      }
      case "cta":
        return <LpCtaBlock id={section.id} data={section.data} />;
    }
  }

  return (
    <div lang={page.contentLocale}>
      {faqs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: faqs.map((item) => ({
                "@type": "Question",
                name: item.question,
                acceptedAnswer: { "@type": "Answer", text: item.answer },
              })),
            }),
          }}
        />
      )}
      {locale === "en-US" && page.contentLocale !== "en-US" && (
        <p lang="en" className="bg-accent-soft/50 px-6 py-3 text-center text-sm font-medium text-fg">
          {ui.untranslated}
        </p>
      )}
      {/* Exatamente um h1 por página: sem hero, o nome da LP vira o h1 (só para leitores de tela). */}
      {!hasHero && <h1 className="sr-only">{page.name}</h1>}
      {page.sections.map((section) => (
        <div key={section.id}>{render(section)}</div>
      ))}
      {/* Mensagem da LP ("…sobre o workshop"); sem ela, a do site. */}
      <WhatsAppButton labels={{ label: whatsappFloat.label, message: page.whatsappMessage || whatsappFloat.message }} />
    </div>
  );
}
