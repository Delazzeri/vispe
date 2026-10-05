import Link from "next/link";
import Image from "next/image";
import { HeroScene } from "@/components/sections/hero-scene";
import { site } from "@/content/site";

const linkClass = "text-base text-ink";
const headingClass = "text-base font-bold text-ink";

export function Footer() {
  return (
    <footer className="overflow-hidden bg-bg">
      <div className="relative z-10 mx-auto max-w-6xl px-6 pt-16 md:pt-20">
        <div className="grid gap-12 lg:grid-cols-[306px_repeat(3,minmax(0,1fr))]">
          <div>
            <div className="flex items-center gap-3">
              <Image
                src="/media/brand/simbolo-vispe-preto-326.png"
                alt=""
                width={326}
                height={326}
                className="h-8 w-8"
              />
              <span className="text-base font-semibold text-ink">{site.name}</span>
            </div>
            <p
              className="mt-4 max-w-xs text-balance text-xl font-bold text-ink"
              style={{ letterSpacing: "-0.04em" }}
            >
              Organizamos o seu financeiro e aumentamos o seu lucro
            </p>
            <p className="mt-3 max-w-xs text-sm leading-5 text-ink">
              Controladoria, margem e crescimento em um só parceiro: do caixa do dia a dia aos
              eventos de liquidez da sua empresa.
            </p>
            <Link
              href="/contato"
              className="mt-6 inline-flex rounded-xl bg-ink px-4 py-2 text-[13px] font-semibold leading-4 text-paper transition-transform hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              Agendar diagnóstico
            </Link>
            <p className="mt-5 text-xs text-ink">
              © {new Date().getFullYear()} {site.name}. Todos os direitos reservados.
            </p>
          </div>

          <nav aria-label="Links institucionais">
            <p className={headingClass}>Institucional</p>
            <ul className="mt-4 space-y-3">
              {site.nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={linkClass}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Soluções">
            <p className={headingClass}>Soluções</p>
            <ul className="mt-4 space-y-3">
              {site.services.map((service) => (
                <li key={service.slug}>
                  <Link href={`/produtos/${service.slug}`} className={linkClass}>
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Contato">
            <p className={headingClass}>Fale conosco</p>
            <ul className="mt-4 space-y-3">
              <li>
                <Link href="/contato" className={linkClass}>
                  Fale com a Vispe
                </Link>
              </li>
              <li>
                <Link href="/contato" className={linkClass}>
                  Seja um parceiro
                </Link>
              </li>
            </ul>
            {/* TODO(content): redes sociais (Instagram, WhatsApp, YouTube,
                Spotify) — pendentes de confirmação (ver content/site.ts:social). */}
          </nav>
        </div>
      </div>

      {/* Cena com o vídeo só abaixo dos menus; o wordmark decorativo aparece
          inteiro na base, e o tamanho acompanha a largura (cqw). */}
      <div className="relative isolate -mt-16 h-[420px] md:-mt-40 md:h-[640px]">
        <HeroScene
          className="absolute inset-0 -z-10 overflow-hidden"
          src="/media/hero/scene-footer2.mp4"
          preload="metadata"
        />
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 mx-auto max-w-[1700px] select-none px-6 pb-6"
          style={{ containerType: "inline-size" }}
        >
          <p
            className="whitespace-nowrap text-center font-bold text-bg"
            style={{ fontSize: "22cqw", lineHeight: 0.8, letterSpacing: "-0.05em" }}
          >
            Vispe
          </p>
        </div>
      </div>
    </footer>
  );
}
