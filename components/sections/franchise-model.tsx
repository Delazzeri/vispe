import { ArrowLeft, ArrowRight, Check, Compass, GraduationCap, Megaphone, MonitorSmartphone, type LucideIcon } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { FranchiseForm } from "@/components/sections/franchise-form";
import { HeroScene } from "@/components/sections/hero-scene";
import { LocaleLink as Link } from "@/components/ui/locale-link";
import { SocialLinks } from "@/components/ui/social-links";
import { franchiseModelPath, franchiseModels, getFranchise, type FranchiseModel } from "@/content/franchise";
import { getSite } from "@/content/site";
import { format } from "@/content/types";
import { localizePath } from "@/i18n/href";
import type { Locale } from "@/i18n/routing";
import { breadcrumbJsonLd } from "@/lib/seo";

const formAnchor = "cadastro";

const offerIcons: Record<string, LucideIcon> = {
  method: Compass,
  tech: MonitorSmartphone,
  brand: Megaphone,
  support: GraduationCap,
};

const h2Class = "text-balance text-3xl font-bold tracking-tight text-ink md:text-[48px] md:leading-[48px]";
const h2Style = { letterSpacing: "-0.05em" };

/**
 * Página de um modelo de franquia (/franquia/comercial, /franquia/financeira):
 * apresentação, como funciona, número de franqueados, o que recebe, perfil,
 * etapas e formulário de cadastro.
 */
export function FranchiseModelPage({ locale, model }: { locale: Locale; model: FranchiseModel }) {
  const content = getFranchise(locale);
  const { selector, steps, investment, form, messages } = content;
  const page = content.models[model];
  const { ui } = getSite(locale);
  const other = franchiseModels.find((m) => m !== model) ?? model;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: ui.home, path: localizePath("/", locale) },
              { name: selector.eyebrow, path: localizePath("/franquia", locale) },
              { name: page.eyebrow, path: localizePath(franchiseModelPath(model), locale) },
            ]),
          ),
        }}
      />

      {/* Abertura no estilo da home: clara, centralizada, com a paisagem ao fundo. */}
      <section
        aria-labelledby="franchise-heading"
        className="relative isolate overflow-clip bg-bg px-6 pt-32 pb-80 md:pt-40 md:pb-[480px]"
      >
        <HeroScene
          preload="metadata"
          // Mesma altura do respiro inferior: a paisagem começa logo abaixo do CTA.
          className="absolute inset-x-0 bottom-0 -z-10 h-80 overflow-hidden md:h-[480px]"
        />
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          <Link
            href="/franquia"
            className="inline-flex items-center gap-1.5 rounded-sm text-sm font-medium text-fg-muted transition-colors hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            {selector.eyebrow}
          </Link>
          <h1
            id="franchise-heading"
            className="mt-6 text-balance text-4xl font-bold tracking-tight text-fg md:text-7xl"
            style={{ letterSpacing: "-0.03em" }}
          >
            {page.title}
          </h1>
          <p className="mt-5 max-w-2xl text-balance text-lg leading-relaxed text-fg-muted md:text-xl">
            {page.description}
          </p>
          <dl className="mt-8 flex flex-wrap justify-center gap-x-10 gap-y-4">
            {page.stats.map((stat) => (
              <div key={stat.label} className="flex flex-col items-center">
                <dt className="text-sm font-medium text-fg-muted">{stat.label}</dt>
                <dd className="order-first text-4xl font-bold tracking-tight text-ink tabular-nums md:text-5xl">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
          <a
            href={`#${formAnchor}`}
            className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-ink px-7 py-4 text-base font-semibold text-paper transition-transform hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark sm:inline-flex sm:w-auto sm:text-sm"
          >
            {page.cta}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </a>
        </div>
      </section>

      {/* Como funciona */}
      <section aria-labelledby="franchise-about" className="mx-auto max-w-6xl px-6 pt-8 md:pt-12">
        <Reveal className="max-w-3xl">
          <h2 id="franchise-about" className={h2Class} style={h2Style}>
            {page.about.title}
          </h2>
          <p className="mt-5 text-base leading-relaxed text-fg-muted md:text-lg">{page.about.text}</p>
        </Reveal>
        <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {page.about.items.map((item, i) => (
            <li key={item.title} className="rounded-3xl border border-border bg-surface p-6">
              <span className="text-sm font-bold tabular-nums text-brand-dark">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-3 text-lg font-semibold text-fg">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-fg-muted">{item.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* O que o franqueado recebe */}
      <section aria-labelledby="franchise-offer" className="mx-auto max-w-6xl px-6 pt-24 md:pt-32">
        <Reveal>
          <h2 id="franchise-offer" className={h2Class} style={h2Style}>
            {page.offer.title}
          </h2>
        </Reveal>
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {page.offer.items.map((item) => {
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
              {page.profile.title}
            </h2>
            <ul className="mt-6 space-y-3">
              {page.profile.items.map((item) => (
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

      {/* Cadastro */}
      <section
        id={formAnchor}
        aria-labelledby="franchise-form-heading"
        className="mx-auto max-w-6xl scroll-mt-24 px-4 pt-24 md:px-6 md:pt-32"
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
          <FranchiseForm locale={locale} model={model} copy={form} messages={messages} fallback={<SocialLinks />} />
        </div>
      </section>

      {/* Outro modelo */}
      <div className="mx-auto max-w-6xl px-6 pt-10 pb-24 md:pb-32">
        <Link
          href={franchiseModelPath(other)}
          className="inline-flex items-center gap-2 rounded-sm text-base font-semibold text-fg transition-colors hover:text-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark"
        >
          {format(content.otherModel, { model: selector.options[other].title })}
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>
    </>
  );
}
