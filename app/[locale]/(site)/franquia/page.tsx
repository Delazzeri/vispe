import { setRequestLocale } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { resolveLocale } from "@/i18n/routing";
import { LocaleLink as Link } from "@/components/ui/locale-link";
import { franchiseModelPath, franchiseModels, getFranchise } from "@/content/franchise";
import { getSite } from "@/content/site";
import { localizePath } from "@/i18n/href";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

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
      className="mx-auto flex min-h-svh max-w-5xl flex-col justify-center px-4 pt-28 pb-16 md:px-6 md:pt-32"
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
        <h1
          id="franchise-heading"
          className="text-balance text-4xl font-bold tracking-tight text-ink md:text-6xl"
          style={{ letterSpacing: "-0.05em" }}
        >
          {selector.title}
        </h1>
        <p className="mt-5 text-balance text-base leading-7 text-fg-muted md:text-lg">{selector.description}</p>
      </div>

      <ul className="mt-12 grid gap-4 md:grid-cols-2">
        {franchiseModels.map((model) => {
          const option = selector.options[model];
          return (
            <li key={model}>
              {/* Card simples: no hover/foco ele inverte para o preto da marca. */}
              <Link
                href={franchiseModelPath(model)}
                className="group flex h-full flex-col rounded-3xl border border-border bg-surface p-8 text-fg transition-colors duration-300 hover:border-ink hover:bg-ink hover:text-paper focus-visible:border-ink focus-visible:bg-ink focus-visible:text-paper focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2 md:p-10"
              >
                <h2 className="text-3xl font-bold tracking-tight md:text-4xl" style={{ letterSpacing: "-0.04em" }}>
                  {option.title}
                </h2>
                <p className="mt-4 flex-1 text-base leading-7 text-fg-muted transition-colors duration-300 group-hover:text-paper/70 group-focus-visible:text-paper/70">
                  {option.text}
                </p>
                <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-fg transition-colors duration-300 group-hover:text-brand group-focus-visible:text-brand">
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
