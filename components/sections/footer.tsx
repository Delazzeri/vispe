import { LocaleLink as Link } from "@/components/ui/locale-link";
import Image from "next/image";
import { HeroScene } from "@/components/sections/hero-scene";
import { SocialLinks } from "@/components/ui/social-links";
import { blogPosts } from "@/content/blog";
import { brand, useSite } from "@/content/site";

const linkClass =
  "text-sm text-ink transition-colors hover:text-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark rounded-sm";
const headingClass = "text-base font-bold text-ink";

/** `lang` marca links cujo texto está em outro idioma (títulos do blog, só pt-BR). */
type FooterLink = { label: string; href: string; lang?: string };

function FooterColumn({ title, links }: { title: string; links: readonly FooterLink[] }) {
  return (
    <nav aria-label={title}>
      <p className={headingClass}>{title}</p>
      <ul className="mt-4 space-y-3">
        {links.map((link) => (
          <li key={link.label}>
            {link.href.startsWith("/") ? (
              <Link href={link.href} lang={link.lang} className={linkClass}>
                {link.label}
              </Link>
            ) : (
              <a href={link.href} className={linkClass}>
                {link.label}
              </a>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}

function FooterSocial() {
  const site = useSite();
  return (
    <div className="mt-6">
      <p className="text-xs font-semibold text-fg-muted">{site.footer.socialLabel}</p>
      <SocialLinks className="mt-3" />
    </div>
  );
}

export function Footer() {
  const site = useSite();
  const { footer } = site;
  const { company, services, content, contact } = footer.columns;
  const year = new Date().getFullYear();

  return (
    <footer className="overflow-hidden bg-bg">
      <div className="relative z-10 mx-auto max-w-6xl px-6 pt-16 md:pt-20">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[306px_repeat(4,minmax(0,1fr))] lg:gap-10">
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3">
              <Image
                src="/media/brand/simbolo-vispe-preto-326.png"
                alt=""
                width={326}
                height={326}
                className="h-8 w-8"
              />
              <span className="text-base font-semibold text-ink">{brand.name}</span>
            </div>
            <p
              className="mt-4 max-w-xs text-balance text-xl font-bold text-ink first-letter:uppercase"
              style={{ letterSpacing: "-0.04em" }}
            >
              {site.tagline.toLowerCase()}
            </p>
            <p className="mt-3 max-w-xs text-sm leading-5 text-fg-muted">{footer.description}</p>
            <Link
              href={footer.cta.href}
              className="mt-6 inline-flex rounded-lg bg-ink px-4 py-2 text-[13px] font-semibold leading-4 text-paper transition-transform hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              {footer.cta.label}
            </Link>
            <FooterSocial />
          </div>

          <FooterColumn title={company.title} links={company.links} />
          <FooterColumn
            title={services.title}
            links={site.services.map((service) => ({
              label: services.labels[service.slug] ?? service.name,
              href: services.href,
            }))}
          />
          <FooterColumn
            title={content.title}
            links={[
              // Mais recentes primeiro; posts novos entram sozinhos.
              ...[...blogPosts]
                .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
                .slice(0, content.postsLimit)
                .map((post) => ({ label: post.title, href: `/blog/${post.slug}`, lang: "pt-BR" })),
              { label: content.moreLabel, href: content.moreHref },
            ]}
          />
          <FooterColumn title={contact.title} links={contact.links} />
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-border pt-6 text-xs text-fg-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {brand.name}. {footer.rights}
          </p>
          <a href="#main-content" className="rounded-sm transition-colors hover:text-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark">
            {footer.backToTop}
          </a>
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
