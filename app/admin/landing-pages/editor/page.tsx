import { Suspense } from "react";
import { AuthGuard } from "@/components/admin/auth-guard";
import { LpEditor } from "@/components/admin/lp-editor";

export const metadata = { title: "Editor de landing page" };

// Página estática única: a LP vem de ?id= (ou ?modelo= para uma nova); uma rota
// dinâmica não existiria para LPs criadas depois do build.
export default function AdminLandingPageEditorPage() {
  return (
    <AuthGuard>
      <Suspense fallback={<p className="text-sm text-fg-muted">Carregando…</p>}>
        <LpEditor />
      </Suspense>
    </AuthGuard>
  );
}
