import { setRequestLocale } from "next-intl/server";
import { CookiePreferencesButton } from "@/components/ui/cookie-consent";
import { getPrivacy } from "@/content/privacy";
import { getSite } from "@/content/site";
import { localizePath } from "@/i18n/href";
import { resolveLocale } from "@/i18n/routing";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/privacidade">) {
  const locale = resolveLocale((await params).locale);
  const privacy = getPrivacy(locale);
  return buildMetadata({ title: privacy.title, description: privacy.description, locale, path: "/privacidade" });
}

export default async function PrivacidadePage({ params }: PageProps<"/[locale]/privacidade">) {
  const locale = resolveLocale((await params).locale);
  setRequestLocale(locale);
  const privacy = getPrivacy(locale);
  const { ui } = getSite(locale);

  return (
    <article aria-labelledby="privacy-heading" className="mx-auto max-w-3xl px-6 pt-32 pb-24 md:pt-40 md:pb-32">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: ui.home, path: localizePath("/", locale) },
              { name: privacy.breadcrumb, path: localizePath("/privacidade", locale) },
            ]),
          ),
        }}
      />
      <h1
        id="privacy-heading"
        className="text-balance text-4xl font-bold tracking-tight text-ink md:text-5xl"
        style={{ letterSpacing: "-0.05em" }}
      >
        {privacy.title}
      </h1>
      <p className="mt-4 text-sm text-fg-muted">{privacy.updated}</p>
      <p className="mt-8 text-lg leading-8 text-fg">{privacy.intro}</p>

      {privacy.sections.map((section) => (
        <section key={section.id} aria-labelledby={`privacy-${section.id}`} className="mt-12">
          <h2 id={`privacy-${section.id}`} className="text-2xl font-bold tracking-tight text-ink">
            {section.title}
          </h2>
          {section.paragraphs?.map((paragraph) => (
            <p key={paragraph} className="mt-4 leading-7 text-fg">
              {paragraph}
            </p>
          ))}
          {section.list && (
            <ul className="mt-4 list-disc space-y-2 pl-6 leading-7 text-fg marker:text-brand-dark">
              {section.list.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )}
          {section.after && <p className="mt-4 leading-7 text-fg">{section.after}</p>}
          {section.id === "cookies" && (
            <CookiePreferencesButton
              label={privacy.cookiesButton}
              className="mt-6 rounded-xl bg-ink px-5 py-3 text-sm font-semibold text-paper transition-colors hover:bg-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
            />
          )}
        </section>
      ))}
    </article>
  );
}
