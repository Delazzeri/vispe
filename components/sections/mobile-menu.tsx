"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Menu, X } from "lucide-react";
import { spring } from "@/components/motion/presets";
import { site } from "@/content/site";

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="mobile-nav"
        aria-label={open ? "Fechar menu" : "Abrir menu"}
        className="flex h-10 w-10 items-center justify-center rounded-full text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
      >
        {open ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-nav"
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -12 }}
            animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -12 }}
            transition={shouldReduceMotion ? { duration: 0.15 } : spring.smooth}
            className="absolute inset-x-0 top-full border-b border-border bg-bg/95 backdrop-blur-xl"
          >
            <nav aria-label="Navegação principal" className="flex flex-col px-6 py-6">
              {site.nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="border-b border-border py-3 text-base font-medium text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand last:border-none"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/contato"
                onClick={() => setOpen(false)}
                className="mt-6 rounded-full bg-ink px-5 py-3 text-center text-sm font-semibold text-paper focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              >
                Agendar diagnóstico
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
