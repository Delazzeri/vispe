import { AuditLog } from "@/components/admin/audit-log";
import { AuthGuard } from "@/components/admin/auth-guard";

export const metadata = { title: "Registro de atividades" };

export default function AdminAuditPage() {
  return (
    <AuthGuard>
      <AuditLog />
    </AuthGuard>
  );
}
