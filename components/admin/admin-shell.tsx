"use client";

import { History } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { getSupabase } from "@/lib/supabase/client";
import { AdminFeedbackProvider } from "./feedback";

export const adminButton =
  "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark disabled:opacity-50";
export const adminPrimary = `${adminButton} bg-ink text-paper hover:bg-fg`;
export const adminSecondary = `${adminButton} border border-border bg-surface text-fg hover:bg-bg`;
export const adminInput =
  "mt-1.5 block w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-fg placeholder:text-fg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark";

/** Moldura do painel: logo, navegação e sair. */
export function AdminShell({ email, children }: { email?: string; children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <Link href="/admin/" className="flex items-center gap-2 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark">
              <Image src="/media/brand/simbolo-vispe-preto-326.png" alt="" width={28} height={28} className="h-7 w-7" />
              <span className="whitespace-nowrap text-sm font-bold text-ink">Admin do site</span>
            </Link>
            <nav className="flex flex-wrap gap-x-4 gap-y-1 text-sm font-medium text-fg-muted">
              <Link href="/admin/" className="hover:text-fg">
                Artigos
              </Link>
              <Link href="/admin/materiais/" className="hover:text-fg">
                Materiais
              </Link>
              <Link href="/admin/landing-pages/" className="hover:text-fg">
                Landing pages
              </Link>
              <Link href="/admin/popups/" className="hover:text-fg">
                Pop-ups
              </Link>
              <Link href="/admin/metricas/" className="hover:text-fg">
                Métricas
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-3 text-sm text-fg-muted">
            <Link
              href="/admin/registro/"
              aria-label="Registro de atividades"
              className="group relative flex h-10 w-10 items-center justify-center rounded-xl text-fg-muted transition-colors hover:bg-bg hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark"
            >
              <History className="h-5 w-5" aria-hidden />
              <span
                aria-hidden
                className="pointer-events-none absolute top-full right-0 z-10 mt-2 whitespace-nowrap rounded-lg bg-ink px-2.5 py-1.5 text-xs font-medium text-paper opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
              >
                Registro de atividades
              </span>
            </Link>
            {email && <span className="hidden sm:inline">{email}</span>}
            <button type="button" onClick={() => getSupabase()?.auth.signOut()} className={adminSecondary}>
              Sair
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-10">
        <AdminFeedbackProvider>{children}</AdminFeedbackProvider>
      </main>
    </div>
  );
}
