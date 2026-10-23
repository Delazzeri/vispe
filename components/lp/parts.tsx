import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { LocaleLink } from "@/components/ui/locale-link";
import { cn } from "@/lib/cn";
import { lpFormAnchor, type LpCta } from "@/lib/lp/types";

// Peças comuns das seções da LP. Direção: títulos alinhados à esquerda, com o
// conteúdo ao lado (split) ou abaixo (stacked); faixas pretas só no topo, no
// formulário e na chamada final; dourado reservado ao botão principal.

export const lpCardClass =
  "rounded-3xl bg-surface shadow-[0_1px_2px_rgba(38,38,38,0.04),0_4px_12px_-4px_rgba(38,38,38,0.1)]";

/** Título de seção (h2): grande, peso forte, tracking negativo. */
export function LpHeading({ id, children, tone = "light", className }: { id: string; children: ReactNode; tone?: "light" | "dark"; className?: string }) {
  return (
    <h2
      id={id}
      className={cn(
        "text-balance text-3xl font-bold leading-[1.05] md:text-5xl",
        tone === "dark" ? "text-paper" : "text-ink",
        className,
      )}
      style={{ letterSpacing: "-0.04em" }}
    >
      {children}
    </h2>
  );
}

export function LpSectionShell({
  id,
  title,
  subtitle,
  cta,
  layout = "split",
  className,
  children,
}: {
  id: string;
  title?: string;
  subtitle?: string;
  /** Botão abaixo do conteúdo (leva ao formulário por padrão). */
  cta?: LpCta;
  /** split: título à esquerda e conteúdo à direita no desktop; stacked: título acima. */
  layout?: "split" | "stacked";
  className?: string;
  children: ReactNode;
}) {
  const headingId = `${id}-heading`;
  const head = (title || subtitle) && (
    <div className={layout === "split" ? "md:col-span-5" : "max-w-2xl"}>
      {title && <LpHeading id={headingId}>{title}</LpHeading>}
      {subtitle && <p className="mt-4 max-w-xl text-lg leading-relaxed text-fg-muted">{subtitle}</p>}
    </div>
  );
  const button = cta?.label && (
    <div className="mt-10">
      <LpButton cta={cta} className="w-full sm:w-auto" />
    </div>
  );

  return (
    <section id={id} aria-labelledby={title ? headingId : undefined} className={cn("bg-bg py-20 md:py-28", className)}>
      <div className="mx-auto max-w-6xl px-6">
        {layout === "split" && head ? (
          <div className="grid gap-10 md:grid-cols-12 md:gap-12">
            {head}
            <div className="md:col-span-7">
              {children}
              {button}
            </div>
          </div>
        ) : (
          <>
            {head}
            <div className={head ? "mt-12" : undefined}>{children}</div>
            {button}
          </>
        )}
      </div>
    </section>
  );
}

const buttonBase =
  "inline-flex items-center justify-center gap-2 rounded-xl px-7 py-4 text-base font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 md:text-sm";
const buttonTone = {
  gold: "bg-brand text-brand-fg hover:bg-accent-soft focus-visible:ring-brand-dark",
  ink: "bg-ink text-paper hover:bg-fg focus-visible:ring-brand-dark",
} as const;

/**
 * Botão de CTA da LP. Sem link (ou "#formulario") rola até o formulário;
 * caminho do site ("/contato") usa o idioma atual; externo abre em nova aba.
 */
export function LpButton({ cta, tone = "gold", className }: { cta: LpCta; tone?: keyof typeof buttonTone; className?: string }) {
  if (!cta.label) return null;
  const href = cta.href.trim() || `#${lpFormAnchor}`;
  const classes = cn(buttonBase, buttonTone[tone], className);
  const content = (
    <>
      {cta.label}
      <ArrowRight className="h-4 w-4" aria-hidden />
    </>
  );
  if (href.startsWith("#")) {
    return (
      <a href={href} className={classes}>
        {content}
      </a>
    );
  }
  if (href.startsWith("/")) {
    return (
      <LocaleLink href={href} className={classes}>
        {content}
      </LocaleLink>
    );
  }
  return (
    <a href={href} target="_blank" rel="noopener" className={classes}>
      {content}
    </a>
  );
}
