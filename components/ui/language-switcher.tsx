"use client";

import { useParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useTransition } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { locales, type Locale } from "@/i18n/routing";
import { cn } from "@/lib/cn";

// Bandeiras em SVG próprio: emoji de bandeira não renderiza no Windows.
function FlagBR() {
  return (
    <svg viewBox="0 0 28 20" className="h-full w-full" aria-hidden>
      <rect width="28" height="20" fill="#009c3b" />
      <path d="M14 2.5 25.5 10 14 17.5 2.5 10z" fill="#ffdf00" />
      <circle cx="14" cy="10" r="4.4" fill="#002776" />
      <path d="M9.8 9.1c2.9-.5 5.8.1 8.3 1.6" stroke="#fff" strokeWidth="0.9" fill="none" />
    </svg>
  );
}

function FlagUS() {
  return (
    <svg viewBox="0 0 28 20" className="h-full w-full" aria-hidden>
      <rect width="28" height="20" fill="#b22234" />
      {[1, 3, 5, 7, 9, 11].map((i) => (
        <rect key={i} y={(i * 20) / 13} width="28" height={20 / 13} fill="#fff" />
      ))}
      <rect width="12" height={(7 * 20) / 13} fill="#3c3b6e" />
    </svg>
  );
}

const flags: Record<Locale, () => React.JSX.Element> = { "pt-BR": FlagBR, "en-US": FlagUS };
const short: Record<Locale, string> = { "pt-BR": "PT", "en-US": "EN" };

/**
 * Troca o idioma mantendo a página atual (o caminho é traduzido pelo
 * next-intl: /sobre ↔ /en/about) e a posição de scroll.
 */
export function LanguageSwitcher({ className }: { className?: string }) {
  const t = useTranslations("LanguageSwitcher");
  const current = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const [pending, startTransition] = useTransition();

  function switchTo(locale: Locale) {
    startTransition(() => {
      // pathname é a rota interna (ex.: "/blog/[slug]"); params traz o slug.
      router.replace(
        // @ts-expect-error -- params dinâmicos sempre correspondem à rota atual.
        { pathname, params },
        { locale, scroll: false },
      );
    });
  }

  return (
    <div
      role="group"
      aria-label={t("label")}
      className={cn(
        "flex items-center gap-1 rounded-full border border-border bg-bg/80 p-1 shadow-xs",
        pending && "opacity-70",
        className,
      )}
    >
      {locales.map((locale) => {
        const Flag = flags[locale];
        const active = locale === current;
        const language = t(locale);
        return (
          <button
            key={locale}
            type="button"
            lang={locale}
            onClick={() => !active && switchTo(locale)}
            aria-pressed={active}
            aria-label={active ? language : t("switchTo", { language })}
            title={language}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-1.5 py-1 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark md:px-2.5",
              active ? "bg-surface text-fg shadow-sm" : "text-fg-muted hover:text-fg",
            )}
          >
            <span className="block h-3.5 w-5 overflow-hidden rounded-sm ring-1 ring-border">
              <Flag />
            </span>
            <span aria-hidden className="hidden md:inline">
              {short[locale]}
            </span>
          </button>
        );
      })}
    </div>
  );
}
