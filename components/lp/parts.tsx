import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { LocaleLink } from "@/components/ui/locale-link";
import { cn } from "@/lib/cn";
import { lpFormAnchor, type LpCta } from "@/lib/lp/types";

// Peças comuns das seções da LP: moldura, título e botão. Mesma tipografia e
// espaçamento das seções do site (docs/design-system.md).

/** Lista de cards em até 3 colunas, centralizada quando há menos itens que colunas. */
export const lpCardListClass = "flex flex-wrap justify-center gap-5";
export const lpCardItemClass = "w-full sm:w-[calc(50%-10px)] lg:w-[calc(33.333%-14px)]";

export const lpCardClass =
  "rounded-3xl bg-surface shadow-[0_1px_2px_rgba(38,38,38,0.04),0_4px_12px_-4px_rgba(38,38,38,0.1)]";

export function LpSectionShell({
  id,
  title,
  subtitle,
  cta,
  className,
  children,
}: {
  id: string;
  title?: string;
  subtitle?: string;
  /** Botão abaixo do conteúdo (leva ao formulário por padrão). */
  cta?: LpCta;
  className?: string;
  children: ReactNode;
}) {
  const headingId = `${id}-heading`;
  return (
    <section id={id} aria-labelledby={title ? headingId : undefined} className={cn("bg-bg py-20 md:py-28", className)}>
      <div className="mx-auto max-w-6xl px-6">
        {(title || subtitle) && (
          <Reveal className="mx-auto max-w-3xl text-center">
            {title && (
              <h2
                id={headingId}
                className="text-balance text-3xl font-bold tracking-tight text-ink md:text-[48px] md:leading-[48px]"
                style={{ letterSpacing: "-0.05em" }}
              >
                {title}
              </h2>
            )}
            {subtitle && <p className="mt-5 text-balance text-lg text-fg-muted">{subtitle}</p>}
          </Reveal>
        )}
        <div className={title || subtitle ? "mt-12 md:mt-14" : undefined}>{children}</div>
        {cta?.label && (
          <div className="mt-10 flex justify-center">
            <LpButton cta={cta} className="w-full sm:w-auto" />
          </div>
        )}
      </div>
    </section>
  );
}

const buttonClass =
  "inline-flex items-center justify-center gap-2 rounded-xl bg-ink px-7 py-4 text-base font-semibold text-paper transition-transform hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark md:text-sm";

/**
 * Botão de CTA da LP. Sem link (ou "#formulario") rola até o formulário;
 * caminho do site ("/contato") usa o idioma atual; externo abre em nova aba.
 */
export function LpButton({ cta, className }: { cta: LpCta; className?: string }) {
  if (!cta.label) return null;
  const href = cta.href.trim() || `#${lpFormAnchor}`;
  const content = (
    <>
      {cta.label}
      <ArrowRight className="h-4 w-4" aria-hidden />
    </>
  );
  if (href.startsWith("#")) {
    return (
      <a href={href} className={cn(buttonClass, className)}>
        {content}
      </a>
    );
  }
  if (href.startsWith("/")) {
    return (
      <LocaleLink href={href} className={cn(buttonClass, className)}>
        {content}
      </LocaleLink>
    );
  }
  return (
    <a href={href} target="_blank" rel="noopener" className={cn(buttonClass, className)}>
      {content}
    </a>
  );
}
