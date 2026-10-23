import { Check, ShieldCheck } from "lucide-react";
import type { LpUi } from "@/content/lp-ui";
import { LocaleLink } from "@/components/ui/locale-link";
import type { LpOffer as LpOfferData } from "@/lib/lp/types";
import { LpButton, LpHeading } from "./parts";

/** Link de recusa do upsell ("Não, obrigado"): discreto, sem cara de botão. */
function Decline({ label, href }: { label: string; href: string }) {
  const className = "text-sm font-medium text-fg-muted underline underline-offset-4 hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark";
  const target = href.trim();
  if (!target) return null;
  if (target.startsWith("/")) {
    return (
      <LocaleLink href={target} className={className}>
        {label}
      </LocaleLink>
    );
  }
  if (!/^https?:\/\//i.test(target)) {
    // Endereço de outra LP (ex.: "obrigado-workshop").
    return (
      <LocaleLink href={`/lp/${target.replace(/^\/?(lp\/)?/, "").replace(/\/$/, "")}`} className={className}>
        {label}
      </LocaleLink>
    );
  }
  return (
    <a href={target} className={className}>
      {label}
    </a>
  );
}

/**
 * Oferta (vendas e upsell): à esquerda o que é e o que inclui; à direita o
 * valor ("de/por"), a condição, o botão (leva ao formulário) e a garantia.
 */
export function LpOffer({ id, data, ui }: { id: string; data: LpOfferData; ui: LpUi }) {
  const headingId = `${id}-heading`;
  return (
    <section id={id} aria-labelledby={headingId} className="bg-bg py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <LpHeading id={headingId}>{data.title}</LpHeading>
        <div className="mt-12 grid overflow-hidden rounded-3xl border-2 border-brand bg-surface md:grid-cols-12">
          <div className="p-8 md:col-span-7 md:p-10">
            {data.name && (
              <h3 className="text-2xl font-bold text-ink md:text-3xl" style={{ letterSpacing: "-0.03em" }}>
                {data.name}
              </h3>
            )}
            {data.description && <p className="mt-3 text-lg leading-relaxed text-fg-muted">{data.description}</p>}
            {data.includes.length > 0 && (
              <>
                <p className="mt-8 text-sm font-semibold text-fg">{ui.offer.includes}</p>
                <ul className="mt-4 space-y-3">
                  {data.includes.map((item) => (
                    <li key={item} className="flex gap-3 text-base text-fg">
                      <Check className="mt-0.5 h-5 w-5 shrink-0 text-brand-dark" aria-hidden />
                      {item}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
          <div className="flex flex-col justify-center gap-5 bg-bg/70 p-8 md:col-span-5 md:p-10">
            {(data.oldPrice || data.price) && (
              <p>
                {data.oldPrice && (
                  <span className="block text-base text-fg-muted">
                    <span className="sr-only">{ui.offer.from} </span>
                    <s>{data.oldPrice}</s>
                  </span>
                )}
                {data.price && (
                  <span className="mt-1 block text-4xl font-bold tabular-nums text-ink md:text-5xl" style={{ letterSpacing: "-0.04em" }}>
                    {data.oldPrice && <span className="sr-only">{ui.offer.to} </span>}
                    {data.price}
                  </span>
                )}
                {data.terms && <span className="mt-1 block text-base text-fg-muted">{data.terms}</span>}
              </p>
            )}
            <LpButton cta={data.cta} className="w-full" />
            {data.decline.label && (
              <p className="text-center">
                <Decline label={data.decline.label} href={data.decline.href} />
              </p>
            )}
            {data.guarantee && (
              <p className="flex gap-3 text-sm leading-relaxed text-fg-muted">
                <ShieldCheck className="h-5 w-5 shrink-0 text-brand-dark" aria-hidden />
                {data.guarantee}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
