"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { spring } from "@/components/motion/presets";
import type { SiteContent } from "@/content/site";
import { openPreferencesEvent, readConsent, saveConsent, type ConsentCategory } from "@/lib/consent";
import { cn } from "@/lib/cn";

type CookieLabels = SiteContent["ui"]["cookies"];
type View = "closed" | "banner" | "preferences";

const optional: readonly ConsentCategory[] = ["analytics", "marketing"];

const buttonBase =
  "w-full rounded-xl px-5 py-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-ink";
// Aceitar e rejeitar com o mesmo peso visual (boa prática da LGPD/ANPD).
const primary = `${buttonBase} bg-paper text-ink hover:bg-accent-soft`;
const secondary = `${buttonBase} bg-paper/10 text-paper hover:bg-paper/20`;

function Toggle({
  label,
  description,
  checked,
  disabled,
  alwaysOnLabel,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  alwaysOnLabel?: string;
  onChange?: (value: boolean) => void;
}) {
  const id = useId();
  return (
    <div className="flex items-start justify-between gap-4 border-t border-paper/10 py-4 first:border-none first:pt-0">
      <div>
        <label htmlFor={id} className="text-sm font-semibold">
          {label}
        </label>
        <p className="mt-1 text-xs text-paper/60" style={{ lineHeight: 1.5 }}>
          {description}
        </p>
      </div>
      {disabled ? (
        <span className="shrink-0 pt-0.5 text-xs font-semibold text-brand">{alwaysOnLabel}</span>
      ) : (
        <span className="relative mt-0.5 inline-flex shrink-0">
          <input
            id={id}
            type="checkbox"
            role="switch"
            checked={checked}
            onChange={(event) => onChange?.(event.target.checked)}
            className="peer h-6 w-11 cursor-pointer appearance-none rounded-full bg-paper/20 transition-colors checked:bg-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute top-1 left-1 h-4 w-4 rounded-full bg-paper transition-transform peer-checked:translate-x-5"
          />
        </span>
      )}
    </div>
  );
}

/**
 * Aviso de cookies: aparece na primeira visita e some depois da escolha,
 * guardada no cookie `vispe_consent` (ver lib/consent.ts). Pode ser reaberto
 * pelo link "Preferências de cookies" do footer.
 */
export function CookieConsent({ labels }: { labels: CookieLabels }) {
  const [view, setView] = useState<View>("closed");
  const [choice, setChoice] = useState<Record<ConsentCategory, boolean>>({ analytics: false, marketing: false });
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    // Só no cliente, depois do mount: o servidor não sabe se o cookie existe.
    const timer = window.setTimeout(() => {
      if (!readConsent()) setView("banner");
    }, 600);

    function openPreferences() {
      const saved = readConsent();
      setChoice({ analytics: saved?.analytics ?? false, marketing: saved?.marketing ?? false });
      setView("preferences");
      requestAnimationFrame(() => panelRef.current?.focus());
    }

    window.addEventListener(openPreferencesEvent, openPreferences);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener(openPreferencesEvent, openPreferences);
    };
  }, []);

  function decide(next: Record<ConsentCategory, boolean>) {
    saveConsent(next);
    setView("closed");
  }

  const acceptAll = () => decide({ analytics: true, marketing: true });

  return (
    <AnimatePresence>
      {view !== "closed" && (
        <motion.div
          ref={panelRef}
          role="dialog"
          aria-modal="false"
          aria-labelledby={titleId}
          tabIndex={-1}
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 }}
          animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 }}
          transition={shouldReduceMotion ? { duration: 0.15 } : spring.smooth}
          className="fixed inset-x-4 bottom-4 z-60 max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-3xl bg-ink text-paper shadow-[0_24px_64px_-16px_rgba(0,0,0,0.5)] focus:outline-none md:inset-x-auto md:bottom-6 md:left-6 md:w-md"
        >
          <div className="p-6">
            <p id={titleId} className="text-lg font-semibold">
              {view === "banner" ? labels.title : labels.preferencesTitle}
            </p>

            {view === "banner" ? (
              <p className="mt-3 text-sm text-paper/70" style={{ lineHeight: 1.6 }}>
                {labels.description}
              </p>
            ) : (
              <div className="mt-4">
                <Toggle
                  label={labels.categories.necessary.label}
                  description={labels.categories.necessary.description}
                  checked
                  disabled
                  alwaysOnLabel={labels.alwaysOn}
                />
                {optional.map((category) => (
                  <Toggle
                    key={category}
                    label={labels.categories[category].label}
                    description={labels.categories[category].description}
                    checked={choice[category]}
                    onChange={(value) => setChoice((prev) => ({ ...prev, [category]: value }))}
                  />
                ))}
              </div>
            )}
          </div>

          <div className={cn("flex flex-col gap-2 border-t border-paper/10 p-6", view === "banner" && "pt-5")}>
            {view === "banner" ? (
              <>
                <button type="button" className={primary} onClick={acceptAll}>
                  {labels.acceptAll}
                </button>
                <button type="button" className={primary} onClick={() => decide({ analytics: false, marketing: false })}>
                  {labels.rejectAll}
                </button>
                <button type="button" className={secondary} onClick={() => setView("preferences")}>
                  {labels.manage}
                </button>
              </>
            ) : (
              <>
                <button type="button" className={primary} onClick={() => decide(choice)}>
                  {labels.save}
                </button>
                <button type="button" className={secondary} onClick={acceptAll}>
                  {labels.acceptAll}
                </button>
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Link do footer que reabre o painel de preferências. */
export function CookiePreferencesButton({ label, className }: { label: string; className?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(openPreferencesEvent))}
      className={className}
    >
      {label}
    </button>
  );
}
