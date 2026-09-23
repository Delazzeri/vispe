import Link from "next/link";
import Image from "next/image";
import { site } from "@/content/site";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/0 bg-bg/80 backdrop-blur-xl transition-colors">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="shrink-0">
          <Image
            src="/media/brand/logo-vispe-preto-2204.png"
            alt={site.name}
            width={2204}
            height={434}
            priority
            className="h-6 w-auto md:h-7"
          />
        </Link>
        <nav aria-label="Navegação principal" className="hidden gap-8 md:flex">
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
          className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-paper transition-transform hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        >
          Agendar diagnóstico
        </Link>
      </div>
    </header>
  );
}
