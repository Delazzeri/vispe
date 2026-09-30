import type { ReactNode } from "react";

export function HeaderChrome({ children }: { children: ReactNode }) {
  return (
    <header className="sticky top-4 z-50 mx-auto w-[min(calc(100%-32px),1100px)] md:top-6">
      <div className="rounded-full border border-border bg-bg/80 shadow-[0_1px_2px_rgba(38,38,38,0.04),0_12px_32px_-12px_rgba(38,38,38,0.18)] backdrop-blur-xl">
        {children}
      </div>
    </header>
  );
}
