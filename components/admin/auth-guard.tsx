"use client";

import type { User } from "@supabase/supabase-js";
import { useEffect, useState, type ReactNode } from "react";
import { getSupabase } from "@/lib/supabase/client";
import { AdminShell } from "./admin-shell";

type GuardState =
  | { status: "checking" }
  | { status: "unconfigured" }
  | { status: "forbidden"; user: User }
  | { status: "ready"; user: User };

async function check(): Promise<GuardState | "login"> {
  const supabase = getSupabase();
  if (!supabase) return { status: "unconfigured" };
  const { data } = await supabase.auth.getSession();
  const user = data.session?.user;
  if (!user) return "login";
  // Staff = tem linha em profiles (a RLS das escritas usa a mesma regra).
  const { data: profile } = await supabase.from("profiles").select("id").eq("id", user.id).maybeSingle();
  return profile ? { status: "ready", user } : { status: "forbidden", user };
}

/** Sem sessão → /admin/login/. Sessão sem profile (não é staff) → aviso. */
export function AuthGuard({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GuardState>({ status: "checking" });

  useEffect(() => {
    let active = true;
    check().then((next) => {
      if (!active) return;
      if (next === "login") window.location.replace("/admin/login/");
      else setState(next);
    });
    const supabase = getSupabase();
    const subscription = supabase?.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") window.location.replace("/admin/login/");
    }).data.subscription;
    return () => {
      active = false;
      subscription?.unsubscribe();
    };
  }, []);

  if (state.status === "checking") {
    return <p className="p-10 text-sm text-fg-muted">Verificando acesso…</p>;
  }
  if (state.status === "unconfigured") {
    return (
      <div className="mx-auto max-w-xl p-10">
        <h1 className="text-2xl font-bold text-ink">Supabase não configurado</h1>
        <p className="mt-3 text-sm text-fg-muted">
          Preencha NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (ver .env.example) e gere o build de novo.
        </p>
      </div>
    );
  }
  if (state.status === "forbidden") {
    return (
      <AdminShell email={state.user.email}>
        <h1 className="text-2xl font-bold text-ink">Sem permissão</h1>
        <p className="mt-3 max-w-xl text-sm text-fg-muted">
          Esta conta entrou, mas não está liberada para publicar. Peça para um administrador incluir o seu usuário na
          tabela profiles (ver supabase/README.md).
        </p>
      </AdminShell>
    );
  }
  return <AdminShell email={state.user.email}>{children}</AdminShell>;
}
