import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { MotionProvider } from "@/components/motion/motion-provider";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { isLocale, locales, resolveLocale, type Locale } from "@/i18n/routing";
import { fontVariables } from "@/lib/fonts";
import { buildMetadata, organizationJsonLd, websiteJsonLd } from "@/lib/seo";
import { motionInitScript } from "@/lib/motion-preference";
import { CookieConsent } from "@/components/ui/cookie-consent";
import { Trackers } from "@/components/tracking/trackers";
import { trackingConfig } from "@/lib/tracking/config";
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
    // Verificação do domínio no Business Manager da Meta (alternativa ao registro DNS).
    ...(trackingConfig.meta.domainVerification && {
      other: { "facebook-domain-verification": trackingConfig.meta.domainVerification },
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
          <MotionProvider>
            {/* Cabeçalho, rodapé e <main>: (site)/layout.tsx no site; as LPs têm layout próprio, sem eles. */}
            {children}
            <CookieConsent labels={getSite(locale).ui.cookies} />
            <Trackers />
          </MotionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
