import { Reveal } from "@/components/motion/reveal";
import { Marquee } from "@/components/motion/marquee";
import { useSite } from "@/content/site";

export function LogoWall({ id }: { id?: string }) {
  const site = useSite();
  const { title, subtitle, logos } = site.clients;

  return (
    <section id={id} aria-labelledby="logo-wall-heading" className="bg-bg py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6 text-center">
        <Reveal>
          <h2
            id="logo-wall-heading"
            className="text-balance text-3xl font-bold tracking-tight text-ink md:text-[48px] md:leading-[48px]"
            style={{ letterSpacing: "-0.05em" }}
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
              className="flex h-16 w-44 shrink-0 items-center justify-center rounded-2xl bg-surface text-sm font-semibold text-fg-muted shadow-[0_1px_2px_rgba(38,38,38,0.04),0_4px_12px_-4px_rgba(38,38,38,0.1)]"
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
