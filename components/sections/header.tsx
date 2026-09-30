import Link from "next/link";
import Image from "next/image";
import { site } from "@/content/site";
import { HeaderChrome } from "@/components/sections/header-chrome";
import { MobileMenu } from "@/components/sections/mobile-menu";

export function Header() {
  return (
    <HeaderChrome>
      <div className="relative flex items-center justify-between gap-3 px-4 py-2 md:justify-center md:gap-6 md:px-5 md:py-2.5">
        <Link href="/" className="shrink-0">
          <Image
            src="/media/brand/logo-vispe-preto-2204.png"
            alt={site.name}
            width={2204}
            height={434}
            priority
            className="h-5 w-auto md:h-6"
          />
        </Link>

        <nav aria-label="Navegação principal" className="hidden gap-5 md:flex">
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
          href="/contato"
          className="hidden rounded-full bg-ink px-4 py-2 text-sm font-semibold text-paper transition-transform hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand md:inline-block"
        >
          Agendar diagnóstico
        </Link>

        <MobileMenu />
      </div>
    </HeaderChrome>
  );
}
