import { LocaleLink as Link } from "@/components/ui/locale-link";
import Image from "next/image";
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
            width={2204}
            height={434}
            priority
            className="h-6 w-auto"
          />
        </Link>

        <nav aria-label={site.ui.mainNav} className="hidden gap-5 md:flex">
          {site.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-fg-muted transition-colors hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link
          href={site.ui.headerCta.href}
          className="hidden rounded-lg bg-ink px-4 py-2 text-sm font-semibold text-paper transition-transform hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand md:inline-block"
        >
          {site.ui.headerCta.label}
        </Link>

        <MobileMenu />
      </div>
    </HeaderChrome>
  );
}
