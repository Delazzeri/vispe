import { AuthGuard } from "@/components/admin/auth-guard";
import { LpList } from "@/components/admin/lp-list";

export const metadata = { title: "Landing pages" };

export default function AdminLandingPagesPage() {
  return (
    <AuthGuard>
      <LpList />
    </AuthGuard>
  );
}
