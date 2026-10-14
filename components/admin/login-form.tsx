"use client";

import Image from "next/image";
import { useEffect, useState, type FormEvent } from "react";
import { getSupabase } from "@/lib/supabase/client";
import { adminInput, adminPrimary } from "./admin-shell";

/** E-mail e senha (Supabase Auth). Sem cadastro: usuários são criados no painel do Supabase. */
export function LoginForm() {
  const [error, setError] = useState<string>();
  const [pending, setPending] = useState(false);

  // Já logado: vai direto para a lista.
  useEffect(() => {
    getSupabase()
      ?.auth.getSession()
      .then(({ data }) => {
        if (data.session) window.location.replace("/admin/");
      });
  }, []);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const supabase = getSupabase();
    if (!supabase) return setError("Supabase não configurado (ver .env.example).");
    const form = new FormData(event.currentTarget);
    setPending(true);
    setError(undefined);
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: String(form.get("email") ?? ""),
      password: String(form.get("password") ?? ""),
    });
    setPending(false);
    if (authError) {
      // Sem resposta do Supabase (rede, projeto pausado) é diferente de senha errada.
      const offline = authError.status === undefined || authError.status === 0 || /fetch/i.test(authError.message);
      return setError(offline ? "Sem conexão com o Supabase. Tente de novo em instantes." : "E-mail ou senha incorretos.");
    }
    window.location.replace("/admin/");
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <form onSubmit={onSubmit} className="w-full max-w-sm rounded-3xl bg-surface p-8 shadow-[0_1px_2px_rgba(38,38,38,0.04),0_4px_12px_-4px_rgba(38,38,38,0.1)]">
        <Image src="/media/brand/simbolo-vispe-preto-326.png" alt="" width={36} height={36} className="h-9 w-9" />
        <h1 className="mt-6 text-2xl font-bold tracking-tight text-ink">Admin do blog</h1>
        <p className="mt-1 text-sm text-fg-muted">Entre com a conta criada pela Vispe.</p>
        <label className="mt-6 block text-sm font-medium text-fg">
          E-mail
          <input name="email" type="email" autoComplete="email" required className={adminInput} />
        </label>
        <label className="mt-4 block text-sm font-medium text-fg">
          Senha
          <input name="password" type="password" autoComplete="current-password" required className={adminInput} />
        </label>
        {error && (
          <p role="alert" className="mt-4 text-sm font-medium text-brand-dark">
            {error}
          </p>
        )}
        <button type="submit" disabled={pending} className={`${adminPrimary} mt-6 w-full`}>
          {pending ? "Entrando…" : "Entrar"}
        </button>
      </form>
    </main>
  );
}
