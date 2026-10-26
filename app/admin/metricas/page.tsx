import { AuthGuard } from "@/components/admin/auth-guard";
import { MetricsDashboard } from "@/components/admin/metrics-dashboard";

export const metadata = { title: "Métricas" };

export default function AdminMetricsPage() {
  return (
    <AuthGuard>
      <MetricsDashboard />
    </AuthGuard>
  );
}
