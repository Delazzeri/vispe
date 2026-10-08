import Image from "next/image";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { ArrowDown, ArrowLeft, Check, Plus } from "lucide-react";
import { resolveLocale } from "@/i18n/routing";
import { Reveal } from "@/components/motion/reveal";
import { MaterialForm } from "@/components/sections/material-form";
import { LocaleLink as Link } from "@/components/ui/locale-link";
import { MaterialCard } from "@/components/ui/material-card";
import { SocialLinks } from "@/components/ui/social-links";
import { getMaterial, getMaterialsUi, materials, type Material } from "@/content/materials";
import { getSite } from "@/content/site";
import { localizePath } from "@/i18n/href";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

const formAnchor = "receber";

export function generateStaticParams() {
  return materials.map((material) => ({ slug: material.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/materiais/[slug]">) {
  const { locale: raw, slug } = await params;
  const locale = resolveLocale(raw);
  const material = getMaterial(slug);
  if (!material) return {};
  return buildMetadata({
    title: material.title,
    description: material.intro ?? `${material.title}: ${material.tagline}`,
    locale,
    // Conteúdo só em português: a URL canônica é sempre a pt-BR.
    contentLocale: "pt-BR",
    path: `/materiais/${material.slug}`,
  });
}

function faqJsonLd(faq: NonNullable<Material["faq"]>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

/** LP de um material gratuito: descritivo à esquerda, formulário de captura à direita. */
export default async function MaterialPage({ params }: PageProps<"/[locale]/materiais/[slug]">) {
  const { locale: raw, slug } = await params;
  const locale = resolveLocale(raw);
  setRequestLocale(locale);
  const material = getMaterial(slug);
  if (!material) notFound();

  const { page, form, messages, card } = getMaterialsUi(locale);
  const { ui } = getSite(locale);
  const image = material.mockup ?? material.cover;
  const others = materials.filter((m) => m.slug !== material.slug).slice(0, 3);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: ui.home, path: localizePath("/", locale) },
              { name: page.back, path: localizePath("/materiais", locale) },
              { name: material.title, path: localizePath(`/materiais/${material.slug}`, locale) },
            ]),
          ),
        }}
      />
      {material.faq && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(material.faq)) }} />
      )}

      {/* Abertura + formulário */}
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
              <p className="mt-8 text-sm font-semibold text-fg-muted">{material.eyebrow ?? material.type}</p>
              <h1
                id="material-heading"
                className="mt-3 text-balance text-4xl font-bold tracking-tight text-ink md:text-5xl"
                style={{ letterSpacing: "-0.04em" }}
              >
                {material.headline ?? material.title}
              </h1>
              <p className="mt-6 text-base leading-7 text-fg-muted md:text-lg">{material.intro ?? material.tagline}</p>

              <Image
                src={image.src}
                alt={`${material.type}: ${material.title}`}
                width={image.width}
                height={image.height}
                priority
                sizes="(min-width: 1024px) 640px, 100vw"
                className={
                  material.mockup
                    ? "mx-auto mt-10 h-auto w-full max-w-md"
                    : "mt-10 h-auto w-full rounded-3xl border border-border"
                }
              />

              {material.features && (
                <>
                  <h2 className="mt-10 text-xl font-bold tracking-tight text-ink md:text-2xl">{page.featuresTitle}</h2>
                  <ul className="mt-5 space-y-3">
                    {material.features.map((feature) => (
                      <li key={feature.title} className="flex gap-3 text-base leading-7 text-fg">
                        <Check className="mt-1.5 h-4 w-4 shrink-0 text-brand-dark" aria-hidden strokeWidth={3} />
                        <span>
                          <strong className="font-semibold text-ink">{feature.title}</strong>
                          {feature.text && <span className="text-fg-muted">: {feature.text}</span>}
                        </span>
                      </li>
                    ))}
                  </ul>
                </>
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
              {material.formCall && (
                <p lang="pt-BR" className="mt-2 text-sm text-fg-muted">
                  {material.formCall}
                </p>
              )}
              <div className="mt-6">
                <MaterialForm
                  locale={locale}
                  material={material.slug}
                  copy={form}
                  messages={messages}
                  fallback={<SocialLinks />}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Como usar */}
      {material.usage && (
        <section aria-labelledby="material-usage" lang="pt-BR" className="mx-auto max-w-6xl px-6 pt-24 md:pt-32">
          <Reveal className="max-w-3xl">
            <p className="text-sm font-semibold text-fg-muted">{page.usageEyebrow}</p>
            <h2
              id="material-usage"
              className="mt-3 text-balance text-3xl font-bold tracking-tight text-ink md:text-[48px] md:leading-[48px]"
              style={{ letterSpacing: "-0.05em" }}
            >
              {material.usage.title}
            </h2>
            {material.usage.paragraphs.map((paragraph) => (
              <p key={paragraph} className="mt-5 text-base leading-relaxed text-fg-muted md:text-lg">
                {paragraph}
              </p>
            ))}
          </Reveal>

          <div className="mt-10 overflow-x-auto rounded-3xl border border-border bg-surface">
            <table className="w-full min-w-xl text-left text-sm">
              <thead>
                <tr className="border-b border-border">
                  {material.usage.table.columns.map((column) => (
                    <th key={column} scope="col" className="px-6 py-4 font-semibold text-ink">
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {material.usage.table.rows.map((row) => (
                  <tr key={row[0]}>
                    {row.map((cell, i) =>
                      i === 0 ? (
                        <th key={cell} scope="row" className="px-6 py-4 font-semibold text-fg">
                          {cell}
                        </th>
                      ) : (
                        <td key={`${row[0]}-${i}`} className="px-6 py-4 text-fg-muted">
                          {cell}
                        </td>
                      ),
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Dúvidas */}
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
                  <Plus
                    className="mt-0.5 h-5 w-5 shrink-0 text-brand-dark transition-transform group-open:rotate-45"
                    aria-hidden
                  />
                  {item.question}
                </summary>
                <p className="mt-3 pl-9 text-sm leading-relaxed text-fg-muted">{item.answer}</p>
              </details>
            ))}
          </div>
        </section>
      )}

      {/* Outros materiais */}
      <section aria-labelledby="material-more" className="mx-auto max-w-6xl px-6 py-24 md:py-32">
        <h2
          id="material-more"
          className="text-2xl font-bold tracking-tight text-ink md:text-3xl"
          style={{ letterSpacing: "-0.04em" }}
        >
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
    </>
  );
}
