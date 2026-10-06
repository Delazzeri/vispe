import type { ReactNode } from "react";

export function HeaderChrome({ children }: { children: ReactNode }) {
  // No celular ocupa a largura toda (como a referência); no desktop, só o conteúdo.
  return (
    <header className="sticky top-3 z-50 mx-auto w-[calc(100%-32px)] md:top-4 md:w-fit md:max-w-[calc(100%-32px)]">
      <div className="rounded-2xl border border-border bg-bg/80 shadow-[0_1px_2px_rgba(38,38,38,0.04),0_12px_32px_-12px_rgba(38,38,38,0.18)] backdrop-blur-xl">
        {children}
      </div>
    </header>
  );
}
