import { AuthGuard } from "@/components/admin/auth-guard";
import { FormatManager } from "@/components/admin/format-manager";

export const metadata = { title: "Formatos dos materiais" };

export default function AdminMaterialFormatsPage() {
  return (
    <AuthGuard>
      <FormatManager />
    </AuthGuard>
  );
}
