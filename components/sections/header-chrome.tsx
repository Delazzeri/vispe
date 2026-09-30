import type { ReactNode } from "react";

export function HeaderChrome({ children }: { children: ReactNode }) {
  return (
    <header className="sticky top-3 z-50 mx-auto w-fit max-w-[calc(100%-32px)] md:top-4">
      <div className="rounded-full border border-border bg-bg/80 shadow-[0_1px_2px_rgba(38,38,38,0.04),0_12px_32px_-12px_rgba(38,38,38,0.18)] backdrop-blur-xl">
        {children}
      </div>
    </header>
  );
}
