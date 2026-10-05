import { setRequestLocale } from "next-intl/server";
import { resolveLocale } from "@/i18n/routing";
import { SocialLinks } from "@/components/ui/social-links";
import { CareersForm } from "@/components/sections/careers-form";
import { BrandPattern } from "@/components/ui/brand-pattern";
import { getCareers, hrEmail, resumeMaxBytes } from "@/content/careers";
import { getSite } from "@/content/site";
import { localizePath } from "@/i18n/href";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/trabalhe-conosco">) {
  const locale = resolveLocale((await params).locale);
  return buildMetadata({
    title: getSite(locale).pages.careers.title,
    description: getCareers(locale).hero.description,
    locale,
    path: "/trabalhe-conosco",
  });
}

/**
 * Página de candidatura em composição única: painel institucional escuro
 * (sticky no desktop) ao lado do formulário em etapas.
 */
export default async function TrabalheConoscoPage({ params }: PageProps<"/[locale]/trabalhe-conosco">) {
  const locale = resolveLocale((await params).locale);
  setRequestLocale(locale);
  const { hero, about, form, messages } = getCareers(locale);
  const { ui } = getSite(locale);

  return (
    <section aria-labelledby="careers-heading" className="mx-auto max-w-7xl px-4 pt-28 pb-24 md:px-6 md:pt-32 md:pb-32">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: ui.home, path: localizePath("/", locale) },
              { name: hero.eyebrow, path: localizePath("/trabalhe-conosco", locale) },
            ]),
          ),
        }}
      />

      <div className="grid gap-4 lg:grid-cols-12 lg:gap-6">
        {/* Painel institucional */}
        <aside className="relative isolate overflow-hidden rounded-3xl bg-ink p-8 text-paper md:p-12 lg:sticky lg:top-28 lg:col-span-5 lg:self-start">
          <BrandPattern className="absolute inset-0 -z-10 text-paper/5" />
          <div
            aria-hidden
            className="absolute -top-24 -right-24 -z-10 h-72 w-72 rounded-full bg-brand/20 blur-3xl"
          />

          <p className="text-sm font-bold text-brand">{hero.eyebrow}</p>
          <h1
            id="careers-heading"
            className="mt-4 text-balance text-4xl font-bold tracking-tight md:text-5xl"
            style={{ letterSpacing: "-0.05em" }}
          >
            {hero.title}
          </h1>
          <p className="mt-6 text-base leading-7 text-paper/70">{hero.description}</p>

          <h2 className="mt-10 text-sm font-bold text-paper">{about.title}</h2>
          <p className="mt-3 text-sm leading-6 text-paper/70">{about.positioning}</p>

          <h2 className="mt-10 text-sm font-bold text-paper">{about.valuesTitle}</h2>
          <ol className="mt-4 divide-y divide-paper/10 border-y border-paper/10">
            {about.values.map((value, i) => (
              <li key={value.name} className="flex gap-4 py-4">
                <span className="w-6 shrink-0 text-sm font-bold tabular-nums text-brand">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-sm leading-6 text-paper/70">
                  <span className="font-semibold text-paper">{value.name}.</span> {value.description}
                </p>
              </li>
            ))}
          </ol>

          <h2 className="mt-10 text-sm font-bold text-paper">{about.socialTitle}</h2>
          <p className="mt-2 text-sm leading-6 text-paper/70">{about.socialDescription}</p>
          <SocialLinks tone="dark" className="mt-4" />
        </aside>

        {/* Candidatura */}
        <div id="candidatura" className="rounded-3xl border border-border bg-surface p-6 md:p-10 lg:col-span-7 lg:p-12">
          <h2
            className="text-3xl font-bold tracking-tight text-fg md:text-4xl"
            style={{ letterSpacing: "-0.04em" }}
          >
            {form.title}
          </h2>
          <p className="mt-3 max-w-xl text-base leading-7 text-fg-muted">{form.description}</p>
          <CareersForm
            locale={locale}
            copy={form}
            messages={messages}
            hrEmail={hrEmail}
            maxBytes={resumeMaxBytes}
          />
        </div>
      </div>
    </section>
  );
}
