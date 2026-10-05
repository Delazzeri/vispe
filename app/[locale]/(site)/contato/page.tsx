import { setRequestLocale } from "next-intl/server";
import { resolveLocale } from "@/i18n/routing";
import { buildMetadata } from "@/lib/seo";
import { site } from "@/content/site";

export async function generateMetadata({ params }: PageProps<"/[locale]/contato">) {
  const { locale } = await params;
  return buildMetadata({
    title: "Contato",
    description: site.contact.description,
    locale: resolveLocale(locale),
    path: "/contato",
  });
}

export default async function ContatoPage({ params }: PageProps<"/[locale]/contato">) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <section aria-labelledby="contato-heading" className="mx-auto max-w-6xl px-6 py-24 md:py-32">
      <h1 id="contato-heading" className="text-fg text-4xl font-bold tracking-tight md:text-5xl">
        {site.contact.title}
      </h1>
      <p className="mt-6 max-w-2xl text-lg text-fg-muted">{site.contact.description}</p>
      {/* TODO: construir formulário real (nome, whatsapp, e-mail, empresa, segmento, faturamento, serviço) */}
    </section>
  );
}
