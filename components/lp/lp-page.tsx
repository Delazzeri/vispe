import { getLpUi } from "@/content/lp-ui";
import { getSite } from "@/content/site";
import type { Locale } from "@/i18n/routing";
import type { LandingPage, LocalizedLandingPage, LpSection } from "@/lib/lp/types";
import { LpAgenda } from "./lp-agenda";
import { LpAudience } from "./lp-audience";
import { LpBenefits } from "./lp-benefits";
import { LpComparison } from "./lp-comparison";
import { LpCountdown } from "./lp-countdown";
import { LpCtaBlock } from "./lp-cta-block";
import { LpFaq } from "./lp-faq";
import { LpFloating } from "./lp-floating";
import { LpFollow } from "./lp-follow";
import { LpFormCard } from "./lp-form";
import { LpFormSection } from "./lp-form-section";
import { LpGallery } from "./lp-gallery";
import { LpHero } from "./lp-hero";
import { LpOffer } from "./lp-offer";
import { LpProblem } from "./lp-problem";
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
  const hero = page.sections.find((section) => section.type === "hero");
  const formSection = page.sections.find((section) => section.type === "form");
  const faqs = page.sections.flatMap((section) => (section.type === "faq" ? section.data.items : []));
  // Hero "com formulário": a seção Formulário aparece dentro do topo, não no fim.
  const formInHero = hero?.type === "hero" && hero.data.variant === "form" && formSection?.type === "form";

  function formCard(section: LpSection, headingId?: string) {
    if (section.type !== "form") return null;
    const original = source.sections.find((item) => item.id === section.id);
    const columns: [string, string][] = (original?.type === "form" ? original.data.fields : section.data.fields).map((field) => [field.id, field.label]);
    return (
      <LpFormCard
        data={section.data}
        page={{ slug: page.slug, name: page.name, template: page.template }}
        columns={columns}
        locale={locale}
        ui={ui}
        headingId={headingId}
        preview={preview}
      />
    );
  }

  function render(section: LpSection) {
    switch (section.type) {
      case "hero":
        return <LpHero id={section.id} data={section.data} form={formInHero && formSection ? formCard(formSection, `${section.id}-heading`) : undefined} />;
      case "stats":
        return <LpStats id={section.id} data={section.data} />;
      case "benefits":
        return <LpBenefits id={section.id} data={section.data} />;
      case "audience":
        return <LpAudience id={section.id} data={section.data} />;
      case "steps":
        return <LpSteps id={section.id} data={section.data} />;
      case "problem":
        return <LpProblem id={section.id} data={section.data} />;
      case "agenda":
        return <LpAgenda id={section.id} data={section.data} ui={ui} />;
      case "speakers":
        return <LpSpeakers id={section.id} data={section.data} />;
      case "testimonials":
        return <LpTestimonials id={section.id} data={section.data} />;
      case "gallery":
        return <LpGallery id={section.id} data={section.data} />;
      case "video":
        return <LpVideo id={section.id} data={section.data} ui={ui} />;
      case "countdown":
        return <LpCountdown id={section.id} data={section.data} ui={ui} />;
      case "offer":
        return <LpOffer id={section.id} data={section.data} ui={ui} />;
      case "comparison":
        return <LpComparison id={section.id} data={section.data} ui={ui} />;
      case "faq":
        return <LpFaq id={section.id} data={section.data} />;
      case "form":
        if (formInHero) return null;
        return (
          <LpFormSection id={section.id} data={section.data}>
            {formCard(section, `${section.id}-heading`)}
          </LpFormSection>
        );
      case "follow":
        return <LpFollow id={section.id} data={section.data} ui={ui} />;
      case "cta":
        return <LpCtaBlock id={section.id} data={section.data} />;
    }
  }

  // Barra fixa do celular: o texto do botão do topo (ou o do formulário).
  const ctaLabel =
    formSection?.type === "form" ? (hero?.type === "hero" && hero.data.cta.label) || formSection.data.submitLabel : undefined;

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
      {!hero && <h1 className="sr-only">{page.name}</h1>}
      {page.sections.map((section) => {
        const node = render(section);
        return node ? <div key={section.id}>{node}</div> : null;
      })}
      {/* WhatsApp com a mensagem da LP ("…sobre o evento"); sem ela, a do site. */}
      <LpFloating ctaLabel={ctaLabel || undefined} whatsapp={{ label: whatsappFloat.label, message: page.whatsappMessage || whatsappFloat.message }} />
    </div>
  );
}
