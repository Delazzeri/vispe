import type { Metadata } from "next";
import type { ReactNode } from "react";
import { brand } from "@/content/brand";
import { fontVariables } from "@/lib/fonts";
import "../globals.css";

// Painel do blog (/admin): root layout próprio, fora do i18n do site e fora do
// índice dos buscadores. Tudo roda no navegador; quem protege os dados é a RLS.

export const metadata: Metadata = {
  title: { default: `Admin | ${brand.name}`, template: `%s | Admin ${brand.name}` },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" className={`${fontVariables} h-full antialiased`}>
      <body className="min-h-full bg-bg font-sans text-fg">{children}</body>
    </html>
  );
}
