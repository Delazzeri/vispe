import { Reveal } from "@/components/motion/reveal";
import { Marquee } from "@/components/motion/marquee";
import { site } from "@/content/site";

export function LogoWall({ id }: { id?: string }) {
  const { title, subtitle, logos } = site.clients;

  return (
    <section id={id} aria-labelledby="logo-wall-heading" className="bg-bg py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6 text-center">
        <Reveal>
          <h2
            id="logo-wall-heading"
            className="text-balance text-3xl font-bold tracking-tight text-fg md:text-5xl"
            style={{ letterSpacing: "-0.02em" }}
          >
            {title}
          </h2>
          <p className="mt-4 text-balance text-lg text-fg-muted">{subtitle}</p>
        </Reveal>
      </div>

      <Reveal delay={0.1} className="mt-14">
        <Marquee speed={28}>
          {logos.map((logo) => (
            <span
              key={logo}
              className="flex h-16 w-44 shrink-0 items-center justify-center rounded-2xl border border-border bg-surface text-sm font-semibold text-fg-muted"
            >
              {logo}
            </span>
          ))}
        </Marquee>
        <p className="mt-4 text-center text-xs text-fg-muted">
          Nomes ilustrativos — logos reais de clientes pendentes de autorização.
        </p>
      </Reveal>
    </section>
  );
}
