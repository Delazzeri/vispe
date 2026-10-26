import { setRequestLocale } from "next-intl/server";
import { CookiePreferencesButton } from "@/components/ui/cookie-consent";
import { getPrivacy } from "@/content/privacy";
import { getSite } from "@/content/site";
import { localizePath } from "@/i18n/href";
import { resolveLocale } from "@/i18n/routing";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/politica-de-privacidade">) {
  const locale = resolveLocale((await params).locale);
  const privacy = getPrivacy(locale);
  return buildMetadata({ title: privacy.title, description: privacy.description, locale, path: "/politica-de-privacidade" });
}

/**
 * Política de Privacidade em formato de documento: fundo branco, coluna estreita,
 * só parágrafos corridos em tamanho de leitura e subtítulos em negrito.
 */
export default async function PoliticaDePrivacidadePage({ params }: PageProps<"/[locale]/politica-de-privacidade">) {
  const locale = resolveLocale((await params).locale);
  setRequestLocale(locale);
  const privacy = getPrivacy(locale);
  const { ui } = getSite(locale);

  return (
    <div className="bg-surface text-fg">
      {/* Branco também na faixa atrás do menu, que fica acima do <main>. */}
      <div aria-hidden className="absolute inset-x-0 top-0 -z-10 h-40 bg-surface" />
      <article aria-labelledby="privacy-heading" className="mx-auto max-w-3xl px-6 pt-36 pb-12 text-sm leading-relaxed md:pt-44 md:pb-16">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              breadcrumbJsonLd([
                { name: ui.home, path: localizePath("/", locale) },
                { name: privacy.breadcrumb, path: localizePath("/politica-de-privacidade", locale) },
              ]),
            ),
          }}
        />
        <h1 id="privacy-heading" className="text-4xl font-bold tracking-tight md:text-5xl">
          {privacy.title}
        </h1>
        <p className="mt-6">{privacy.intro}</p>

        {privacy.sections.map((section) => (
          <section key={section.id} aria-labelledby={`privacy-${section.id}`} className="mt-7">
            <h2 id={`privacy-${section.id}`} className="font-bold">
              {section.title}
            </h2>
            {section.paragraphs.map((paragraph, index) => (
              <p key={paragraph} className={index === 0 ? "mt-1" : "mt-3"}>
                {paragraph}
              </p>
            ))}
            {section.id === "cookies" && (
              <CookiePreferencesButton
                label={privacy.cookiesButton}
                className="mt-4 rounded-xl border border-border px-4 py-2 text-sm font-semibold transition-colors hover:border-brand-dark hover:text-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              />
            )}
          </section>
        ))}

        <p className="mt-10 font-bold">{privacy.closing}</p>
        <p className="mt-6 text-xs text-fg-muted">{privacy.updated}</p>
      </article>
      {/* Degradê do branco para o fundo do rodapé. */}
      <div aria-hidden className="h-24 bg-linear-to-b from-surface to-bg md:h-32" />
    </div>
  );
}
