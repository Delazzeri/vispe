"use client";

import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { WhatsAppButton } from "@/components/ui/whatsapp-button";
import { cn } from "@/lib/cn";
import { lpFormAnchor } from "@/lib/lp/types";

/**
 * Elementos fixos da LP: no celular, uma barra com o CTA que leva ao formulário
 * (aparece depois do topo e some quando o formulário está na tela); o botão do
 * WhatsApp sobe enquanto a barra está visível, para os dois não se sobreporem.
 */
export function LpFloating({ ctaLabel, whatsapp }: { ctaLabel?: string; whatsapp: { label: string; message: string } }) {
  const [heroVisible, setHeroVisible] = useState(true);
  const [formVisible, setFormVisible] = useState(false);

  useEffect(() => {
    if (!ctaLabel) return;
    const hero = document.querySelector("main section");
    const form = document.getElementById(lpFormAnchor);
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === hero) setHeroVisible(entry.isIntersecting);
        if (entry.target === form) setFormVisible(entry.isIntersecting);
      }
    });
    if (hero) observer.observe(hero);
    if (form) observer.observe(form);
    return () => observer.disconnect();
  }, [ctaLabel]);

  const showBar = Boolean(ctaLabel) && !heroVisible && !formVisible;

  return (
    <>
      {ctaLabel && (
        <div
          aria-hidden={!showBar}
          inert={!showBar}
          className={cn(
            "fixed inset-x-0 bottom-0 z-30 border-t border-paper/10 bg-ink/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur transition-transform duration-300 md:hidden",
            showBar ? "translate-y-0" : "translate-y-full",
          )}
        >
          <a
            href={`#${lpFormAnchor}`}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3.5 text-base font-semibold text-brand-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-paper"
          >
            {ctaLabel}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </a>
        </div>
      )}
      {/* O botão do site é fixo em bottom-4; com a barra visível, sobe acima dela. */}
      <div className={cn("[&>a]:transition-[bottom] [&>a]:duration-300", showBar && "max-md:[&>a]:bottom-24!")}>
        <WhatsAppButton labels={whatsapp} />
      </div>
    </>
  );
}
