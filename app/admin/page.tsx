import { ArticleList } from "@/components/admin/article-list";
import { AuthGuard } from "@/components/admin/auth-guard";

export const metadata = { title: "Artigos" };

export default function AdminHomePage() {
  return (
    <AuthGuard>
      <ArticleList />
    </AuthGuard>
  );
}
