"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

type IconActionProps = {
  /** Nome da ação: vira o aria-label e a dica que aparece no hover/foco. */
  label: string;
  icon: LucideIcon;
  /** danger: excluir (fica vermelho no hover). */
  tone?: "default" | "danger";
  disabled?: boolean;
  /** Dica no lugar do label quando desabilitado (ex.: por que não dá para excluir). */
  disabledHint?: string;
} & ({ href: string; external?: boolean; onClick?: never } | { onClick: () => void; href?: never; external?: never });

const base =
  "group relative inline-flex h-9 w-9 items-center justify-center rounded-xl text-fg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark";

/** Ação de lista do admin em ícone (editar, ver, duplicar, excluir…), com dica no hover e no foco do teclado. */
export function IconAction({ label, icon: Icon, tone = "default", disabled, disabledHint, ...action }: IconActionProps) {
  const hint = disabled && disabledHint ? disabledHint : label;
  const className = cn(
    base,
    disabled
      ? "cursor-not-allowed opacity-40"
      : tone === "danger"
        ? "hover:bg-danger/10 hover:text-danger"
        : "hover:bg-bg hover:text-fg",
  );
  const inner = (
    <>
      <Icon aria-hidden className="h-4.5 w-4.5" strokeWidth={1.75} />
      <span
        aria-hidden
        className="pointer-events-none absolute right-0 bottom-full z-10 mb-1.5 whitespace-nowrap rounded-lg bg-ink px-2 py-1 text-xs font-medium text-paper opacity-0 shadow-sm transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
      >
        {hint}
      </span>
    </>
  );

  if (action.href !== undefined && !disabled) {
    return action.external ? (
      <a href={action.href} target="_blank" rel="noopener" aria-label={`${label} (abre em nova aba)`} className={className}>
        {inner}
      </a>
    ) : (
      <Link href={action.href} aria-label={label} className={className}>
        {inner}
      </Link>
    );
  }
  return (
    // aria-disabled (e não disabled) para a dica continuar aparecendo no hover e no foco.
    <button type="button" aria-label={hint} aria-disabled={disabled || undefined} onClick={disabled ? undefined : action.onClick} className={className}>
      {inner}
    </button>
  );
}

/** Linha de ações (à direita da tabela). */
export function IconActions({ children }: { children: React.ReactNode }) {
  return <div className="flex justify-end gap-1">{children}</div>;
}
