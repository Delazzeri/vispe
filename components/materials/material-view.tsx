import Image from "next/image";
import { ArrowDown, ArrowLeft, Plus } from "lucide-react";
import { MaterialForm } from "@/components/sections/material-form";
import { LocaleLink as Link } from "@/components/ui/locale-link";
import { MaterialCard } from "@/components/ui/material-card";
import { SocialLinks } from "@/components/ui/social-links";
import { brand } from "@/content/brand";
import { getMaterialsUi } from "@/content/materials";
import { localizeHref } from "@/i18n/href";
import type { Locale } from "@/i18n/routing";
import { renderMarkdown } from "@/lib/blog/markdown";
import type { MaterialItem } from "@/lib/materials/types";

const formAnchor = "receber";

type MaterialViewProps = {
  material: MaterialItem;
  locale: Locale;
  /** "Outros materiais" no fim da página (vazio: a seção não aparece). */
  others?: readonly MaterialItem[];
};

/**
 * Página de um material gratuito, igual na versão pré-renderizada no build e na
 * página única dos materiais publicados depois do build (MaterialLoader):
 * descrição à esquerda, formulário de captura à direita, dúvidas e outros
 * materiais. Os JSON-LD ficam com a página.
 */
export function MaterialView({ material, locale, others = [] }: MaterialViewProps) {
  const { page, form, messages, card } = getMaterialsUi(locale);
  const image = material.image ?? material.cover;

  return (
    <>
      <section aria-labelledby="material-heading" className="mx-auto max-w-6xl px-6 pt-32 md:pt-40">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <Link
              href="/materiais"
              className="inline-flex items-center gap-1.5 rounded-sm text-sm font-medium text-fg-muted transition-colors hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden />
              {page.back}
            </Link>
            {page.portugueseOnly && (
              <p lang={locale} className="mt-4 rounded-xl bg-accent-soft/40 px-4 py-2 text-sm text-fg">
                {page.portugueseOnly}
              </p>
            )}

            <div lang="pt-BR">
              <p className="mt-8 text-sm font-semibold text-fg-muted">{material.type}</p>
              <h1
                id="material-heading"
                className="mt-3 text-balance text-4xl font-bold tracking-tight text-ink md:text-5xl"
                style={{ letterSpacing: "-0.04em" }}
              >
                {material.headline ?? material.title}
              </h1>
              <p className="mt-6 text-lg leading-8 text-fg-muted">{material.tagline}</p>

              {image &&
                (material.image ? (
                  <div className="relative mx-auto mt-10 aspect-square w-full max-w-md">
                    <Image src={image.src} alt={image.alt} fill priority sizes="(min-width: 1024px) 448px, 100vw" className="object-contain" />
                  </div>
                ) : (
                  <div className="relative mt-10 aspect-[842/595] w-full overflow-hidden rounded-3xl border border-border">
                    <Image src={image.src} alt={image.alt} fill priority sizes="(min-width: 1024px) 640px, 100vw" className="object-cover" />
                  </div>
                ))}

              {material.descriptionMd && (
                <div
                  className="article-body mt-10"
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(material.descriptionMd, locale) }}
                />
              )}
            </div>

            <a
              href={`#${formAnchor}`}
              className="mt-10 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-ink px-7 py-4 text-base font-semibold text-paper focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark lg:hidden"
            >
              {page.cta}
              <ArrowDown className="h-4 w-4" aria-hidden />
            </a>
          </div>

          <div id={formAnchor} className="scroll-mt-24 lg:col-span-5">
            <div className="rounded-3xl bg-surface p-6 shadow-[0_1px_2px_rgba(38,38,38,0.04),0_4px_12px_-4px_rgba(38,38,38,0.1)] md:p-8">
              <h2 className="text-2xl font-bold tracking-tight text-ink" style={{ letterSpacing: "-0.03em" }}>
                {form.title}
              </h2>
              <p className="mt-2 text-sm text-fg-muted">{form.call}</p>
              <div className="mt-6">
                <MaterialForm
                  locale={locale}
                  material={material.slug}
                  copy={form}
                  messages={messages}
                  fallback={<SocialLinks />}
                  contact={
                    brand.social.whatsapp
                      ? { href: brand.social.whatsapp, label: messages.contactWhatsapp, external: true }
                      : { href: localizeHref("/contato", locale), label: messages.contactFallback, external: false }
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {material.faq && (
        <section aria-labelledby="material-faq" lang="pt-BR" className="mx-auto max-w-5xl px-6 pt-24 md:pt-32">
          <h2
            id="material-faq"
            className="text-balance text-center text-3xl font-bold tracking-tight text-ink md:text-[48px] md:leading-[48px]"
            style={{ letterSpacing: "-0.05em" }}
          >
            {page.faqTitle}
          </h2>
          <div className="mt-12 grid gap-4">
            {material.faq.map((item) => (
              <details
                key={item.question}
                className="group rounded-xl bg-surface p-6 shadow-[0_1px_2px_rgba(38,38,38,0.04),0_4px_12px_-4px_rgba(38,38,38,0.1)]"
              >
                <summary className="flex cursor-pointer list-none items-start gap-4 text-left text-sm font-semibold text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark">
                  <Plus className="mt-0.5 h-5 w-5 shrink-0 text-brand-dark transition-transform group-open:rotate-45" aria-hidden />
                  {item.question}
                </summary>
                <p className="mt-3 pl-9 text-sm leading-relaxed text-fg-muted">{item.answer}</p>
              </details>
            ))}
          </div>
        </section>
      )}

      {others.length > 0 && (
        <section aria-labelledby="material-more" className="mx-auto max-w-6xl px-6 pt-24 md:pt-32">
          <h2 id="material-more" className="text-2xl font-bold tracking-tight text-ink md:text-3xl" style={{ letterSpacing: "-0.04em" }}>
            {page.moreTitle}
          </h2>
          <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((other) => (
              <li key={other.slug}>
                <MaterialCard material={other} cta={card.cta} headingLevel="h3" />
              </li>
            ))}
          </ul>
        </section>
      )}
      <div className="pb-24 md:pb-32" />
    </>
  );
}
