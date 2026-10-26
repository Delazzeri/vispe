import { AuthGuard } from "@/components/admin/auth-guard";
import { PopupList } from "@/components/admin/popup-list";

export const metadata = { title: "Pop-ups" };

export default function AdminPopupsPage() {
  return (
    <AuthGuard>
      <PopupList />
    </AuthGuard>
  );
}
