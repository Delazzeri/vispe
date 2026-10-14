import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { isLocale, locales, resolveLocale, type Locale } from "@/i18n/routing";
import { fontVariables } from "@/lib/fonts";
import { buildMetadata, organizationJsonLd, websiteJsonLd } from "@/lib/seo";
import { motionInitScript } from "@/lib/motion-preference";
import { Header } from "@/components/sections/header";
import { Footer } from "@/components/sections/footer";
import { listArticles } from "@/lib/blog/source";
import { CookieConsent } from "@/components/ui/cookie-consent";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { brand, getSite } from "@/content/site";
import "../globals.css";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  return {
    metadataBase: new URL(brand.url),
    ...buildMetadata({
      // Home: "Inteligência financeira estratégica | Vispe Capital".
      title: getSite(resolveLocale(locale)).hero.h1,
      description: getSite(resolveLocale(locale)).hero.description,
      locale: resolveLocale(locale),
    }),
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale: requested } = await params;
  if (!isLocale(requested)) notFound();
  const locale: Locale = requested;
  // Habilita renderização estática por idioma.
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "Layout" });

  return (
    <html
      lang={locale}
      className={`${fontVariables} h-full antialiased`}
      // data-motion é aplicado pelo script abaixo antes da hidratação.
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col font-sans">
        <script dangerouslySetInnerHTML={{ __html: motionInitScript }} />
        <a href="#main-content" className="skip-link">
          {t("skipLink")}
        </a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd(locale)) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd(locale)) }}
        />
        <NextIntlClientProvider>
          {/* Só no topo: absoluto (rola com a página), ao contrário do header sticky.
              No celular o header ocupa a largura toda, então o seletor vai para o menu. */}
          <LanguageSwitcher className="absolute top-6 right-6 z-40 hidden md:flex" />
          <Header />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <Footer posts={await listArticles()} />
          <CookieConsent labels={getSite(locale).ui.cookies} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
