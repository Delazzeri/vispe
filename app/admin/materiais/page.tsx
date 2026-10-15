import { AuthGuard } from "@/components/admin/auth-guard";
import { MaterialList } from "@/components/admin/material-list";

export const metadata = { title: "Materiais" };

export default function AdminMaterialsPage() {
  return (
    <AuthGuard>
      <MaterialList />
    </AuthGuard>
  );
}
