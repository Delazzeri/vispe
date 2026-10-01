import Link from "next/link";
import Image from "next/image";
import { site } from "@/content/site";

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <Image
              src="/media/brand/simbolo-vispe-preto-326.png"
              alt={site.name}
              width={326}
              height={326}
              className="h-9 w-9"
            />
            <p className="mt-3 max-w-xs text-sm text-fg-muted">{site.tagline}</p>
          </div>
          <nav aria-label="Links institucionais">
            <p className="text-sm font-semibold text-fg">Institucional</p>
            <ul className="mt-3 space-y-2">
              {site.nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-fg-muted transition-colors hover:text-fg"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label="Soluções">
            <p className="text-sm font-semibold text-fg">Soluções</p>
            <ul className="mt-3 space-y-2">
              {site.services.map((service) => (
                <li key={service.slug}>
                  <Link
                    href={`/produtos/${service.slug}`}
                    className="text-sm text-fg-muted transition-colors hover:text-fg"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label="Contato">
            <p className="text-sm font-semibold text-fg">Contato</p>
            <ul className="mt-3 space-y-2">
              <li>
                <Link
                  href="/contato"
                  className="text-sm text-fg-muted transition-colors hover:text-fg"
                >
                  Fale com a Vispe
                </Link>
              </li>
              <li>
                <Link
                  href="/contato"
                  className="text-sm text-fg-muted transition-colors hover:text-fg"
                >
                  Seja um parceiro
                </Link>
              </li>
            </ul>
            {/* TODO(content): redes sociais (Instagram, WhatsApp, YouTube,
                Spotify) — pendentes de confirmação (ver content/site.ts:social). */}
          </nav>
        </div>
        <p className="mt-12 text-xs text-fg-muted">
          Copyright ©{new Date().getFullYear()} {site.name}. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
