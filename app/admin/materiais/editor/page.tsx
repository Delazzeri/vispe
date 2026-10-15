import { Suspense } from "react";
import { AuthGuard } from "@/components/admin/auth-guard";
import { MaterialEditor } from "@/components/admin/material-editor";

export const metadata = { title: "Editor de material" };

// Página estática única: o material vem de ?id= (uma rota dinâmica não existiria
// para materiais criados depois do build).
export default function AdminMaterialEditorPage() {
  return (
    <AuthGuard>
      <Suspense fallback={<p className="text-sm text-fg-muted">Carregando…</p>}>
        <MaterialEditor />
      </Suspense>
    </AuthGuard>
  );
}
