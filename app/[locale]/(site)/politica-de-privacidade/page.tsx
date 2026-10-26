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
 * Política de Privacidade em formato de documento: fundo preto, coluna estreita,
 * texto corrido em tamanho de leitura e subtítulos em negrito (sem marcadores).
 */
export default async function PoliticaDePrivacidadePage({ params }: PageProps<"/[locale]/politica-de-privacidade">) {
  const locale = resolveLocale((await params).locale);
  setRequestLocale(locale);
  const privacy = getPrivacy(locale);
  const { ui } = getSite(locale);

  return (
    <div className="bg-ink text-paper">
      <article aria-labelledby="privacy-heading" className="mx-auto max-w-3xl px-6 pt-36 pb-24 text-sm leading-relaxed md:pt-44 md:pb-32">
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
        <p className="mt-6 text-paper/85">{privacy.intro}</p>

        {privacy.sections.map((section) => (
          <section key={section.id} aria-labelledby={`privacy-${section.id}`} className="mt-7">
            <h2 id={`privacy-${section.id}`} className="font-bold">
              {section.title}
            </h2>
            {section.paragraphs?.map((paragraph) => (
              <p key={paragraph} className="mt-1 text-paper/85">
                {paragraph}
              </p>
            ))}
            {section.items && (
              <div className="mt-3 space-y-3 text-paper/85">
                {section.items.map((item) => (
                  <p key={item.label}>
                    <strong className="font-bold text-paper">{item.label}:</strong> {item.text}
                  </p>
                ))}
              </div>
            )}
            {section.after && <p className="mt-3 text-paper/85">{section.after}</p>}
            {section.id === "cookies" && (
              <CookiePreferencesButton
                label={privacy.cookiesButton}
                className="mt-4 rounded-xl border border-paper/30 px-4 py-2 text-sm font-semibold transition-colors hover:border-brand hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              />
            )}
          </section>
        ))}

        <p className="mt-10 font-bold">{privacy.closing}</p>
        <p className="mt-6 text-xs text-paper/60">{privacy.updated}</p>
      </article>
    </div>
  );
}
