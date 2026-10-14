import { LocaleLink as Link } from "@/components/ui/locale-link";
import Image from "next/image";
import { Download } from "lucide-react";
import { brand, useSite } from "@/content/site";
import { HeaderChrome } from "@/components/sections/header-chrome";
import { MobileMenu } from "@/components/sections/mobile-menu";

export function Header() {
  const site = useSite();
  return (
    <HeaderChrome>
      <div className="relative flex items-center justify-between gap-3 py-2.5 pr-2.5 pl-5 md:justify-center md:gap-6 md:px-5">
        <Link href="/" className="shrink-0">
          <Image
            src="/media/brand/logo-vispe-preto-2204.png"
            alt={brand.name}
            width={122}
            height={24}
            priority
            className="h-6 w-auto"
          />
        </Link>

        <nav aria-label={site.ui.mainNav} className="hidden gap-5 md:flex">
          {site.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-fg-muted transition-colors hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark rounded-sm"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden shrink-0 items-center gap-2 md:flex">
          <Link
            href={site.ui.materialsCta.href}
            // Só a partir de lg: entre md e lg não cabe ao lado do menu (fica no menu mobile e no footer).
            className="hidden items-center gap-1.5 rounded-lg border border-border bg-surface px-3.5 py-2 text-sm font-semibold text-fg transition-transform hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark lg:inline-flex"
          >
            <Download className="h-4 w-4" aria-hidden />
            {site.ui.materialsCta.label}
          </Link>
          <Link
            href={site.ui.headerCta.href}
            className="rounded-lg bg-ink px-4 py-2 text-sm font-semibold text-paper transition-transform hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark"
          >
            {site.ui.headerCta.label}
          </Link>
        </div>

        <MobileMenu />
      </div>
    </HeaderChrome>
  );
}
