import Link from "next/link";
import { ArrowRight, ShieldCheck, TrendingUp, Handshake, LineChart } from "lucide-react";
import { site } from "@/content/site";
import { BrandPattern } from "@/components/ui/brand-pattern";
import { FinancialDashboard } from "@/components/showcase/financial-dashboard";

const bullets = [
  { icon: TrendingUp, label: "Aumento real de margem" },
  { icon: ShieldCheck, label: "Controladoria estratégica" },
  { icon: Handshake, label: "Sem contratar em tempo integral" },
  { icon: LineChart, label: "Pronto para eventos de liquidez" },
];

export function Hero({ id }: { id?: string }) {
  return (
    <section id={id} aria-labelledby="hero-heading" className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-surface to-bg" />
      <BrandPattern className="absolute inset-x-0 top-0 -z-10 h-64 text-ink/[0.03]" />

      <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 md:grid-cols-2 md:py-32">
        <div>
          <h1
            id="hero-heading"
            className="text-fg text-4xl font-bold tracking-tight md:text-6xl"
            style={{ letterSpacing: "-0.02em" }}
          >
            {site.hero.h1}
          </h1>
          <p className="mt-6 max-w-xl text-lg text-fg-muted">{site.hero.description}</p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href={site.hero.ctaPrimary.href}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-semibold text-paper transition-transform hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              {site.hero.ctaPrimary.label}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link
              href={site.hero.ctaSecondary.href}
              className="inline-flex items-center justify-center rounded-full border border-border px-6 py-3.5 text-sm font-semibold text-fg transition-colors hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              {site.hero.ctaSecondary.label}
            </Link>
          </div>

          <ul className="mt-10 grid grid-cols-2 gap-x-6 gap-y-4">
            {bullets.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-2.5 text-sm text-fg-muted">
                <Icon className="h-4 w-4 shrink-0 text-brand-dark" aria-hidden />
                {label}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex justify-center md:justify-end">
          <FinancialDashboard />
        </div>
      </div>
    </section>
  );
}
