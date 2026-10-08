import type { ReactNode } from "react";
import { CircleAlert } from "lucide-react";

// Primitivos dos formulários do site (diagnóstico, franquia, materiais).

export const inputClass =
  "mt-2 block w-full rounded-xl border border-border bg-bg/60 px-4 py-3 text-base text-fg placeholder:text-fg-muted transition-colors focus:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark aria-invalid:border-brand-dark";

export function ErrorText({ id, children }: { id: string; children: ReactNode }) {
  return (
    <p id={id} className="mt-1.5 flex items-center gap-1.5 text-sm font-medium text-brand-dark">
      <CircleAlert className="h-4 w-4 shrink-0" aria-hidden />
      {children}
    </p>
  );
}

/** Rótulo + controle + erro. O erro usa o id `${id}-error` (ligue com aria-describedby). */
export function Field({
  id,
  label,
  error,
  className,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="text-sm font-medium text-fg">
        {label}
      </label>
      {children}
      {error && <ErrorText id={`${id}-error`}>{error}</ErrorText>}
    </div>
  );
}

/** a11y de um campo com erro: aria-invalid + aria-describedby apontando para o ErrorText. */
export function fieldA11y(id: string, error: string | undefined) {
  return {
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? `${id}-error` : undefined,
  } as const;
}

/** Campo anti-spam fora da tela e do Tab: só robôs preenchem. */
export function Honeypot() {
  return (
    <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label>
        Website
        <input type="text" name="website" tabIndex={-1} autoComplete="off" />
      </label>
    </div>
  );
}

/** Checkbox de consentimento LGPD. */
export function ConsentField({ id, label, error }: { id: string; label: string; error?: string }) {
  return (
    <div>
      <label className="flex cursor-pointer items-start gap-3 text-sm text-fg-muted">
        <input
          id={id}
          type="checkbox"
          name="consent"
          required
          className="mt-0.5 h-4 w-4 shrink-0 accent-ink"
          {...fieldA11y(id, error)}
        />
        <span>{label}</span>
      </label>
      {error && <ErrorText id={`${id}-error`}>{error}</ErrorText>}
    </div>
  );
}
