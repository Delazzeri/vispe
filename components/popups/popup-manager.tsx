"use client";

import { useLocale } from "next-intl";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import * as m from "motion/react-m";
import { AnimatePresence, useReducedMotion } from "motion/react";
import { spring } from "@/components/motion/presets";
import { consentChangeEvent, readConsent } from "@/lib/consent";
import { loadPopups, readHistory, rememberClick, rememberView, trackPopup } from "@/lib/popups/client";
import { pickPopup, publicPath, type Popup } from "@/lib/popups/rules";
import { PopupCard } from "./popup-card";

const closeLabels: Record<string, string> = { "pt-BR": "Fechar", "en-US": "Close" };

/** Arma o gatilho do pop-up (tempo, rolagem ou intenção de saída); devolve a função que desarma. */
function arm(popup: Popup, fire: () => void): () => void {
  const touch = window.matchMedia("(hover: none)").matches;
  // Saída só existe com mouse; no celular vira "rolou metade da página".
  const trigger = popup.trigger_type === "exit" && touch ? "scroll" : popup.trigger_type;
  const value = popup.trigger_type === "exit" && touch ? 50 : popup.trigger_value;

  if (trigger === "delay") {
    const timer = setTimeout(fire, value * 1000);
    return () => clearTimeout(timer);
  }
  if (trigger === "scroll") {
    const check = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const percent = scrollable <= 0 ? 100 : (window.scrollY / scrollable) * 100;
      if (percent >= value) {
        window.removeEventListener("scroll", check);
        fire();
      }
    };
    window.addEventListener("scroll", check, { passive: true });
    return () => window.removeEventListener("scroll", check);
  }
  const leave = (event: MouseEvent) => {
    if (event.clientY <= 0 && !event.relatedTarget) {
      document.removeEventListener("mouseout", leave);
      fire();
    }
  };
  document.addEventListener("mouseout", leave);
  return () => document.removeEventListener("mouseout", leave);
}

/**
 * Pop-ups do admin no site e nas LPs: um por página, no máximo. Começa depois
 * que a página carregou e que a pessoa respondeu ao banner de cookies (para não
 * empilhar os dois); respeita páginas, idioma, aparelho, período e quantas
 * vezes cada pessoa já viu (guardado só no navegador dela).
 */
export function PopupManager() {
  const pathname = usePathname();
  const locale = useLocale();
  const reduceMotion = useReducedMotion();
  const headingId = useId();
  const [popups, setPopups] = useState<Popup[] | null>(null);
  const [open, setOpen] = useState<Popup | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const returnFocus = useRef<Element | null>(null);

  // Carrega depois do load + ociosidade e só com o banner já respondido.
  useEffect(() => {
    let cancelled = false;
    const start = () => {
      const run = () => loadPopups().then((list) => !cancelled && setPopups(list));
      if ("requestIdleCallback" in window) window.requestIdleCallback(run, { timeout: 4000 });
      else setTimeout(run, 2000);
    };
    const whenLoaded = () => (document.readyState === "complete" ? start() : window.addEventListener("load", start, { once: true }));
    if (readConsent()) whenLoaded();
    else window.addEventListener(consentChangeEvent, whenLoaded, { once: true });
    return () => {
      cancelled = true;
      window.removeEventListener("load", start);
      window.removeEventListener(consentChangeEvent, whenLoaded);
    };
  }, []);

  // A cada página: escolhe o pop-up dela e arma o gatilho.
  useEffect(() => {
    if (!popups?.length) return;
    const popup = pickPopup(popups, {
      path: publicPath(pathname),
      locale,
      desktop: window.matchMedia("(min-width: 768px)").matches,
      now: Date.now(),
      history: readHistory(),
    });
    if (!popup) return;
    return arm(popup, () => {
      returnFocus.current = document.activeElement;
      rememberView(popup.id);
      trackPopup(popup.id, "view");
      setOpen(popup);
    });
  }, [popups, pathname, locale]);

  // Mudou de página: o pop-up aberto sai junto.
  const [shownPath, setShownPath] = useState(pathname);
  if (shownPath !== pathname) {
    setShownPath(pathname);
    if (open) setOpen(null);
  }

  // Modal: foco no pop-up, Esc fecha, Tab circula dentro dele.
  useEffect(() => {
    if (!open) return;
    const modal = open.layout === "modal";
    if (modal) requestAnimationFrame(() => dialogRef.current?.focus());
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (!modal || event.key !== "Tab" || !dialogRef.current) return;
      const items = dialogRef.current.querySelectorAll<HTMLElement>("a[href], button");
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && (document.activeElement === first || document.activeElement === dialogRef.current)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
    // close só muda junto com open.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function close() {
    if (!open) return;
    trackPopup(open.id, "close");
    setOpen(null);
    if (returnFocus.current instanceof HTMLElement) returnFocus.current.focus();
  }

  function clicked() {
    if (!open) return;
    rememberClick(open.id);
    trackPopup(open.id, "click");
    setOpen(null);
  }

  const modal = open?.layout === "modal";
  const motionProps = reduceMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.15 } }
    : {
        initial: { opacity: 0, y: modal ? 16 : 24, scale: modal ? 0.97 : 1 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: modal ? 8 : 24, scale: modal ? 0.98 : 1 },
        transition: spring.smooth,
      };

  return (
    <AnimatePresence>
      {open && modal && (
        <m.div
          key={`backdrop-${open.id}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={close}
          aria-hidden
          className="fixed inset-0 z-60 bg-ink/50"
        />
      )}
      {open && (
        <div
          key={`frame-${open.id}`}
          className={
            modal
              ? "pointer-events-none fixed inset-0 z-60 flex items-center justify-center p-4"
              : "pointer-events-none fixed inset-x-4 bottom-4 z-60 flex md:inset-x-auto md:bottom-6 md:left-6"
          }
        >
          <m.div
            ref={dialogRef}
            role="dialog"
            aria-modal={modal}
            aria-labelledby={open.title ? headingId : undefined}
            aria-label={open.title ? undefined : open.image_alt || open.name}
            tabIndex={-1}
            {...motionProps}
            className="pointer-events-auto flex max-h-[calc(100dvh-2rem)] w-full justify-center overflow-y-auto rounded-3xl focus:outline-none md:w-auto"
          >
            <PopupCard popup={open} headingId={headingId} closeLabel={closeLabels[locale] ?? closeLabels["pt-BR"]} onClose={close} onCta={clicked} />
          </m.div>
        </div>
      )}
    </AnimatePresence>
  );
}
