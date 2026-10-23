import { setRequestLocale } from "next-intl/server";
import { resolveLocale } from "@/i18n/routing";

// Landing pages: sem cabeçalho e sem rodapé do site, para não tirar a pessoa da
// página. O WhatsApp flutuante vem da própria LP (mensagem de cada uma, em
// components/lp/lp-page.tsx); o banner de cookies, do layout de idioma.
export default async function LandingLayout({ children, params }: LayoutProps<"/[locale]">) {
  setRequestLocale(resolveLocale((await params).locale));
  return (
    <main id="main-content" className="flex-1">
      {children}
    </main>
  );
}
