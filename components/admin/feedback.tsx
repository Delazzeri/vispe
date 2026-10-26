"use client";

import { AlertTriangle, CheckCircle2, X, XCircle } from "lucide-react";
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { adminButton, adminSecondary } from "./admin-shell";

// Confirmação e avisos do admin: confirm() abre uma caixa de diálogo (no lugar
// do window.confirm do navegador) e notify() mostra um aviso no canto da tela.

type ConfirmOptions = {
  title: string;
  description?: ReactNode;
  confirmLabel?: string;
  /** danger: ação que apaga algo (botão vermelho). */
  tone?: "danger" | "default";
};

type Toast = { id: number; message: string; tone: "success" | "error" };

type Feedback = {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
  notify: (message: string, tone?: Toast["tone"]) => void;
};

const FeedbackContext = createContext<Feedback | null>(null);

/** confirm() e notify() de qualquer tela dentro do AdminShell. */
export function useAdminFeedback(): Feedback {
  const context = useContext(FeedbackContext);
  if (!context) throw new Error("useAdminFeedback fora do AdminFeedbackProvider (AdminShell).");
  return context;
}

export function AdminFeedbackProvider({ children }: { children: ReactNode }) {
  const [pending, setPending] = useState<(ConfirmOptions & { resolve: (ok: boolean) => void }) | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const nextId = useRef(0);

  const confirm = useCallback(
    (options: ConfirmOptions) => new Promise<boolean>((resolve) => setPending({ ...options, resolve })),
    [],
  );

  const notify = useCallback((message: string, tone: Toast["tone"] = "success") => {
    const id = ++nextId.current;
    setToasts((list) => [...list, { id, message, tone }]);
    setTimeout(() => setToasts((list) => list.filter((toast) => toast.id !== id)), tone === "error" ? 7000 : 4000);
  }, []);

  // <dialog> nativo: showModal prende o foco dentro dele, Esc fecha e o resto da página fica inerte.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (pending && dialog && !dialog.open) dialog.showModal();
  }, [pending]);

  function answer(ok: boolean) {
    if (!pending) return;
    pending.resolve(ok);
    setPending(null);
    dialogRef.current?.close();
  }

  const danger = pending?.tone !== "default";

  return (
    <FeedbackContext.Provider value={{ confirm, notify }}>
      {children}

      <dialog
        ref={dialogRef}
        aria-labelledby="admin-confirm-title"
        aria-describedby={pending?.description ? "admin-confirm-description" : undefined}
        onCancel={(event) => {
          event.preventDefault();
          answer(false);
        }}
        onClick={(event) => {
          // Clique no fundo escurecido (fora da caixa) cancela.
          if (event.target === event.currentTarget) answer(false);
        }}
        className="m-auto w-[min(28rem,calc(100vw-2rem))] rounded-3xl border border-border bg-surface p-0 text-fg shadow-[0_24px_64px_-16px_rgba(38,38,38,0.45)] backdrop:bg-ink/50"
      >
        {pending && (
          <div className="p-6">
            <div className="flex items-start gap-4">
              <span
                aria-hidden
                className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-full", danger ? "bg-danger/10 text-danger" : "bg-bg text-fg")}
              >
                <AlertTriangle className="h-5 w-5" strokeWidth={1.75} />
              </span>
              <div className="min-w-0">
                <h2 id="admin-confirm-title" className="text-lg font-semibold text-ink">
                  {pending.title}
                </h2>
                {pending.description && (
                  <div id="admin-confirm-description" className="mt-1.5 text-sm leading-relaxed text-fg-muted">
                    {pending.description}
                  </div>
                )}
              </div>
            </div>
            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              {/* Foco começa no Cancelar: Enter sem querer não apaga nada. */}
              <button type="button" autoFocus onClick={() => answer(false)} className={adminSecondary}>
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => answer(true)}
                className={cn(adminButton, danger ? "bg-danger text-paper hover:bg-danger/90" : "bg-ink text-paper hover:bg-fg")}
              >
                {pending.confirmLabel ?? (danger ? "Excluir" : "Confirmar")}
              </button>
            </div>
          </div>
        )}
      </dialog>

      <div aria-live="polite" className="pointer-events-none fixed right-4 bottom-4 z-60 flex w-[min(24rem,calc(100vw-2rem))] flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role={toast.tone === "error" ? "alert" : "status"}
            className="pointer-events-auto flex items-start gap-3 rounded-2xl border border-border bg-surface px-4 py-3 text-sm text-fg shadow-[0_12px_32px_-12px_rgba(38,38,38,0.35)]"
          >
            {toast.tone === "error" ? (
              <XCircle aria-hidden className="mt-0.5 h-4.5 w-4.5 shrink-0 text-danger" strokeWidth={1.75} />
            ) : (
              <CheckCircle2 aria-hidden className="mt-0.5 h-4.5 w-4.5 shrink-0 text-fg" strokeWidth={1.75} />
            )}
            <p className="min-w-0 flex-1">{toast.message}</p>
            <button
              type="button"
              onClick={() => setToasts((list) => list.filter((item) => item.id !== toast.id))}
              aria-label="Fechar aviso"
              className="-m-1 rounded-lg p-1 text-fg-muted hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark"
            >
              <X aria-hidden className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </FeedbackContext.Provider>
  );
}
