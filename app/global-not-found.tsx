import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { brand } from "@/content/brand";
import { fontVariables } from "@/lib/fonts";
import "./globals.css";

// 404 de qualquer URL que não existe (out/404.html, servido pelo .htaccess).
// Fora dos layouts do site: em português, com link para a home e o blog.

export const metadata: Metadata = {
  title: `Página não encontrada | ${brand.name}`,
  description: "O endereço que você acessou não existe ou mudou.",
};

export default function GlobalNotFound() {
  return (
    <html lang="pt-BR" className={`${fontVariables} h-full antialiased`}>
      <body className="flex min-h-full flex-col items-center justify-center bg-bg px-6 font-sans text-fg">
        <main className="flex max-w-xl flex-col items-center text-center">
          <Image src="/media/brand/simbolo-vispe-preto-326.png" alt={brand.name} width={48} height={48} className="h-12 w-12" />
          <p className="mt-8 text-sm font-semibold text-fg-muted">Erro 404</p>
          <h1 className="mt-3 text-balance text-4xl font-bold tracking-tight text-ink md:text-5xl" style={{ letterSpacing: "-0.04em" }}>
            Página não encontrada
          </h1>
          <p className="mt-5 text-lg text-fg-muted">
            O endereço que você acessou não existe ou mudou. Volte para a página inicial ou veja nossos conteúdos.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/"
              className="rounded-xl bg-ink px-6 py-3.5 text-sm font-semibold text-paper focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark"
            >
              Ir para a página inicial
            </Link>
            <Link
              href="/blog/"
              className="rounded-xl border border-border bg-surface px-6 py-3.5 text-sm font-semibold text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark"
            >
              Ver conteúdos
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}
