import { Suspense } from "react";
import { AuthGuard } from "@/components/admin/auth-guard";
import { PopupEditor } from "@/components/admin/popup-editor";

export const metadata = { title: "Editor de pop-up" };

// Página estática única: o pop-up vem de ?id= (sem ?id=, um novo).
export default function AdminPopupEditorPage() {
  return (
    <AuthGuard>
      <Suspense fallback={<p className="text-sm text-fg-muted">Carregando…</p>}>
        <PopupEditor />
      </Suspense>
    </AuthGuard>
  );
}
