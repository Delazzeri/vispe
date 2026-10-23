import { setRequestLocale } from "next-intl/server";
import { Header } from "@/components/sections/header";
import { Footer } from "@/components/sections/footer";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { WhatsAppButton } from "@/components/ui/whatsapp-button";
import { getSite } from "@/content/site";
import { resolveLocale } from "@/i18n/routing";
import { localizeArticle } from "@/lib/blog/localize";
import { listArticles } from "@/lib/blog/source";

// Moldura das páginas do site: cabeçalho, rodapé, seletor de idioma e WhatsApp.
// As landing pages (app/[locale]/(lp)) ficam fora dela, sem cabeçalho e rodapé.
export default async function SiteLayout({ children, params }: LayoutProps<"/[locale]">) {
  const locale = resolveLocale((await params).locale);
  setRequestLocale(locale);

  return (
    <>
      {/* Só no topo: absoluto (rola com a página), ao contrário do header sticky.
          No celular o header ocupa a largura toda, então o seletor vai para o menu. */}
      <LanguageSwitcher className="absolute top-6 right-6 z-40 hidden md:flex" />
      <Header />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer posts={(await listArticles()).map((article) => localizeArticle(article, locale))} />
      <WhatsAppButton labels={getSite(locale).ui.whatsappFloat} />
    </>
  );
}
