import { setRequestLocale } from "next-intl/server";
import { ArrowRight, ChartNoAxesCombined, Check, Handshake, type LucideIcon } from "lucide-react";
import { resolveLocale } from "@/i18n/routing";
import { BrandPattern } from "@/components/ui/brand-pattern";
import { LocaleLink as Link } from "@/components/ui/locale-link";
import { franchiseModelPath, franchiseModels, getFranchise, type FranchiseModel } from "@/content/franchise";
import { getSite } from "@/content/site";
import { localizePath } from "@/i18n/href";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

const modelIcons: Record<FranchiseModel, LucideIcon> = {
  comercial: Handshake,
  financeira: ChartNoAxesCombined,
};

export async function generateMetadata({ params }: PageProps<"/[locale]/franquia">) {
  const locale = resolveLocale((await params).locale);
  return buildMetadata({
    title: getSite(locale).pages.franchise.title,
    description: getFranchise(locale).selector.description,
    locale,
    path: "/franquia",
  });
}

/** Porta de entrada da franquia: o visitante escolhe o modelo antes de ver detalhes e cadastro. */
export default async function FranquiaPage({ params }: PageProps<"/[locale]/franquia">) {
  const locale = resolveLocale((await params).locale);
  setRequestLocale(locale);
  const { selector } = getFranchise(locale);
  const { ui } = getSite(locale);

  return (
    <section
      aria-labelledby="franchise-heading"
      className="mx-auto flex min-h-svh max-w-6xl flex-col justify-center px-4 pt-28 pb-16 md:px-6 md:pt-32"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: ui.home, path: localizePath("/", locale) },
              { name: selector.eyebrow, path: localizePath("/franquia", locale) },
            ]),
          ),
        }}
      />

      <div className="mx-auto max-w-3xl px-2 text-center">
        <p className="text-sm font-bold text-brand-dark">{selector.eyebrow}</p>
        <h1
          id="franchise-heading"
          className="mt-4 text-balance text-4xl font-bold tracking-tight text-ink md:text-6xl"
          style={{ letterSpacing: "-0.05em" }}
        >
          {selector.title}
        </h1>
        <p className="mt-5 text-balance text-base leading-7 text-fg-muted md:text-lg">{selector.description}</p>
      </div>

      <ul className="mt-12 grid gap-4 md:grid-cols-2 md:gap-6">
        {franchiseModels.map((model, i) => {
          const option = selector.options[model];
          const Icon = modelIcons[model];
          const dark = i === 1;
          return (
            <li key={model}>
              <Link
                href={franchiseModelPath(model)}
                className={
                  dark
                    ? "group relative isolate flex h-full flex-col overflow-hidden rounded-3xl bg-ink p-8 text-paper transition-transform duration-300 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 md:p-10"
                    : "group relative isolate flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-surface p-8 text-fg transition-transform duration-300 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2 md:p-10"
                }
              >
                {dark && <BrandPattern className="absolute inset-0 -z-10 text-paper/5" />}
                <span
                  className={
                    dark
                      ? "flex h-14 w-14 items-center justify-center rounded-2xl bg-brand text-brand-fg"
                      : "flex h-14 w-14 items-center justify-center rounded-2xl bg-ink text-paper"
                  }
                >
                  <Icon className="h-7 w-7" aria-hidden />
                </span>
                <h2 className="mt-8 text-3xl font-bold tracking-tight md:text-4xl" style={{ letterSpacing: "-0.04em" }}>
                  {option.title}
                </h2>
                <p className={dark ? "mt-4 text-base leading-7 text-paper/70" : "mt-4 text-base leading-7 text-fg-muted"}>
                  {option.text}
                </p>
                <ul className="mt-6 flex-1 space-y-2.5">
                  {option.highlights.map((item) => (
                    <li key={item} className="flex gap-2.5 text-sm font-medium">
                      <Check
                        className={dark ? "mt-0.5 h-4 w-4 shrink-0 text-brand" : "mt-0.5 h-4 w-4 shrink-0 text-brand-dark"}
                        aria-hidden
                        strokeWidth={3}
                      />
                      {item}
                    </li>
                  ))}
                </ul>
                <span
                  className={
                    dark
                      ? "mt-10 inline-flex items-center gap-2 self-start rounded-xl bg-brand px-6 py-3.5 text-sm font-semibold text-brand-fg"
                      : "mt-10 inline-flex items-center gap-2 self-start rounded-xl bg-ink px-6 py-3.5 text-sm font-semibold text-paper"
                  }
                >
                  {selector.cta}
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
