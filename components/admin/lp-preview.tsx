"use client";

import { NextIntlClientProvider } from "next-intl";
import { LpPage } from "@/components/lp/lp-page";
import { MotionProvider } from "@/components/motion/motion-provider";
import type { Locale } from "@/i18n/routing";
import { localizeLandingPage } from "@/lib/lp/localize";
import type { LandingPage } from "@/lib/lp/types";

/**
 * Pré-visualização no admin com os mesmos componentes do site. O admin fica
 * fora do i18n e da Motion do site, então os provedores entram aqui. O
 * transform cria um bloco de contenção: o WhatsApp "fixo" fica dentro da prévia.
 */
export function LpPreview({ page, locale }: { page: LandingPage; locale: Locale }) {
  return (
    <div className="transform-gpu overflow-hidden rounded-3xl border border-border bg-bg">
      <NextIntlClientProvider locale={locale} messages={{}}>
        <MotionProvider>
          <LpPage page={localizeLandingPage(page, locale)} source={page} locale={locale} preview />
        </MotionProvider>
      </NextIntlClientProvider>
    </div>
  );
}
