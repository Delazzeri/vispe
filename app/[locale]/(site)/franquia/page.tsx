import { setRequestLocale } from "next-intl/server";
import { ArrowRight, Check, Compass, GraduationCap, Megaphone, MonitorSmartphone, type LucideIcon } from "lucide-react";
import { resolveLocale } from "@/i18n/routing";
import { Reveal } from "@/components/motion/reveal";
import { FranchiseForm } from "@/components/sections/franchise-form";
import { BrandPattern } from "@/components/ui/brand-pattern";
import { SocialLinks } from "@/components/ui/social-links";
import { getFranchise } from "@/content/franchise";
import { getSite } from "@/content/site";
import { localizePath } from "@/i18n/href";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

const formAnchor = "formulario";

const offerIcons: Record<string, LucideIcon> = {
  method: Compass,
  tech: MonitorSmartphone,
  brand: Megaphone,
  support: GraduationCap,
};

export async function generateMetadata({ params }: PageProps<"/[locale]/franquia">) {
  const locale = resolveLocale((await params).locale);
  return buildMetadata({
    title: getSite(locale).pages.franchise.title,
    description: getFranchise(locale).hero.description,
    locale,
    path: "/franquia",
  });
}

/** Apresentação da franquia (o que recebe, perfil, etapas) + formulário de interesse. */
export default async function FranquiaPage({ params }: PageProps<"/[locale]/franquia">) {
  const locale = resolveLocale((await params).locale);
  setRequestLocale(locale);
  const { hero, offer, profile, steps, investment, form, messages } = getFranchise(locale);
  const { ui } = getSite(locale);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: ui.home, path: localizePath("/", locale) },
              { name: hero.eyebrow, path: localizePath("/franquia", locale) },
            ]),
          ),
        }}
      />

      {/* Abertura */}
      <section aria-labelledby="franchise-heading" className="mx-auto max-w-6xl px-4 pt-28 md:px-6 md:pt-32">
        <div className="relative isolate overflow-hidden rounded-3xl bg-ink px-6 py-14 text-paper md:px-14 md:py-20">
          <BrandPattern className="absolute inset-0 -z-10 text-paper/5" />
          <div aria-hidden className="absolute -top-24 -right-24 -z-10 h-72 w-72 rounded-full bg-brand/20 blur-3xl" />
          <p className="text-sm font-bold text-brand">{hero.eyebrow}</p>
          <h1
            id="franchise-heading"
            className="mt-4 max-w-3xl text-balance text-4xl font-bold tracking-tight md:text-6xl"
            style={{ letterSpacing: "-0.05em" }}
          >
            {hero.title}
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-paper/70 md:text-lg">{hero.description}</p>
          <a
            href={`#${formAnchor}`}
            className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-7 py-4 text-sm font-semibold text-brand-fg transition-transform hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-paper md:w-auto"
          >
            {hero.cta}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </a>
        </div>
      </section>

      {/* O que o franqueado recebe */}
      <section aria-labelledby="franchise-offer" className="mx-auto max-w-6xl px-6 pt-24 md:pt-32">
        <Reveal className="max-w-2xl">
          <h2
            id="franchise-offer"
            className="text-balance text-3xl font-bold tracking-tight text-ink md:text-[48px] md:leading-[48px]"
            style={{ letterSpacing: "-0.05em" }}
          >
            {offer.title}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-fg-muted md:text-lg">{offer.description}</p>
        </Reveal>
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {offer.items.map((item) => {
            const Icon = offerIcons[item.icon] ?? Compass;
            return (
              <li key={item.title} className="rounded-3xl border border-border bg-surface p-6">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft/50">
                  <Icon className="h-5 w-5 text-brand-dark" aria-hidden />
                </span>
                <h3 className="mt-5 text-lg font-semibold text-fg">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-fg-muted">{item.text}</p>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Perfil + etapas */}
      <section aria-labelledby="franchise-steps" className="mx-auto max-w-6xl px-6 pt-24 md:pt-32">
        <div className="grid gap-12 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-5">
            <h2 className="text-2xl font-bold tracking-tight text-ink md:text-3xl" style={{ letterSpacing: "-0.04em" }}>
              {profile.title}
            </h2>
            <ul className="mt-6 space-y-3">
              {profile.items.map((item) => (
                <li key={item} className="flex gap-3 text-base leading-7 text-fg">
                  <Check className="mt-1.5 h-4 w-4 shrink-0 text-brand-dark" aria-hidden strokeWidth={3} />
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-10 rounded-3xl bg-accent-soft/40 p-6">
              <h3 className="text-base font-semibold text-fg">{investment.title}</h3>
              <p className="mt-2 text-sm leading-6 text-fg-muted">{investment.text}</p>
            </div>
          </div>

          <div className="md:col-span-7">
            <h2
              id="franchise-steps"
              className="text-2xl font-bold tracking-tight text-ink md:text-3xl"
              style={{ letterSpacing: "-0.04em" }}
            >
              {steps.title}
            </h2>
            <ol className="mt-6 divide-y divide-border border-y border-border">
              {steps.items.map((step, i) => (
                <li key={step.title} className="flex gap-5 py-5">
                  <span className="w-8 shrink-0 text-lg font-bold tabular-nums text-brand-dark">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="text-base font-semibold text-fg">{step.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-fg-muted">{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Formulário */}
      <section
        id={formAnchor}
        aria-labelledby="franchise-form-heading"
        className="mx-auto max-w-6xl scroll-mt-24 px-4 py-24 md:px-6 md:py-32"
      >
        <div className="rounded-3xl bg-surface p-6 shadow-[0_1px_2px_rgba(38,38,38,0.04),0_4px_12px_-4px_rgba(38,38,38,0.1)] md:p-12">
          <h2
            id="franchise-form-heading"
            className="text-3xl font-bold tracking-tight text-fg md:text-4xl"
            style={{ letterSpacing: "-0.04em" }}
          >
            {form.title}
          </h2>
          <p className="mt-3 max-w-xl text-base leading-7 text-fg-muted">{form.description}</p>
          <FranchiseForm locale={locale} copy={form} messages={messages} fallback={<SocialLinks />} />
        </div>
      </section>
    </>
  );
}
