import { LeadForm } from "@/components/sections/lead-form";
import { Reveal } from "@/components/motion/reveal";
import { SocialLinks } from "@/components/ui/social-links";
import { useSite } from "@/content/site";
import { resolveLocale } from "@/i18n/routing";
import { leadAnchor, notSureInterest } from "@/lib/lead";
import { useLocale } from "next-intl";

/**
 * Formulário de diagnóstico (todos os CTAs levam para cá). Na home é uma
 * seção com h2; na página /contato, o título vira o h1 da página.
 */
export function LeadSection({ id = leadAnchor, headingLevel = "h2" }: { id?: string; headingLevel?: "h1" | "h2" }) {
  const site = useSite();
  const locale = resolveLocale(useLocale());
  const { contact } = site;
  const Heading = headingLevel;
  const interests = [
    ...site.servicePillars.map((pillar) => ({ value: pillar.slug, label: pillar.name })),
    { value: notSureInterest, label: contact.form.notSure },
  ];

  return (
    <section id={id} aria-labelledby="lead-heading" className="relative bg-bg py-24 md:py-32">
      {/* Âncoras "#diagnostico-<pilar>": os CTAs dos pilares rolam até aqui já com o interesse marcado. */}
      {site.servicePillars.map((pillar) => (
        <span key={pillar.slug} id={`${leadAnchor}-${pillar.slug}`} className="absolute top-0 scroll-mt-24" aria-hidden />
      ))}

      <div className="mx-auto grid max-w-6xl gap-12 px-6 md:grid-cols-12 md:gap-10">
        {/* Texto acompanha o formulário na rolagem (desktop). */}
        <Reveal className="md:sticky md:top-28 md:col-span-5 md:self-start">
          <Heading
            id="lead-heading"
            className="text-balance text-3xl font-bold tracking-tight text-ink md:text-[48px] md:leading-[48px]"
            style={{ letterSpacing: "-0.05em" }}
          >
            {contact.title}
          </Heading>
          <p className="mt-5 text-balance text-lg font-medium text-fg">{contact.subtitle}</p>
          <p className="mt-3 text-base leading-relaxed text-fg-muted">{contact.description}</p>
        </Reveal>

        <div className="relative rounded-3xl bg-surface p-6 shadow-[0_1px_2px_rgba(38,38,38,0.04),0_4px_12px_-4px_rgba(38,38,38,0.1)] md:col-span-7 md:p-8">
          <LeadForm
            locale={locale}
            copy={contact.form}
            messages={contact.messages}
            interests={interests}
            fallback={<SocialLinks />}
          />
        </div>
      </div>
    </section>
  );
}
