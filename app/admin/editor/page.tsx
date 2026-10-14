import { Suspense } from "react";
import { ArticleEditor } from "@/components/admin/article-editor";
import { AuthGuard } from "@/components/admin/auth-guard";

export const metadata = { title: "Editor" };

// Página estática única: o artigo vem de ?id= (uma rota /admin/editor/[id] não
// existiria para artigos criados depois do build).
export default function AdminEditorPage() {
  return (
    <AuthGuard>
      <Suspense fallback={<p className="text-sm text-fg-muted">Carregando…</p>}>
        <ArticleEditor />
      </Suspense>
    </AuthGuard>
  );
}
