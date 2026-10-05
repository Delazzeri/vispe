import { setRequestLocale } from "next-intl/server";
import { getSite } from "@/content/site";
import { resolveLocale } from "@/i18n/routing";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/contato">) {
  const locale = resolveLocale((await params).locale);
  const site = getSite(locale);
  return buildMetadata({
    title: site.pages.contact.title,
    description: site.contact.description,
    locale,
    path: "/contato",
  });
}

export default async function ContatoPage({ params }: PageProps<"/[locale]/contato">) {
  const locale = resolveLocale((await params).locale);
  setRequestLocale(locale);
  const { contact } = getSite(locale);

  return (
    <section aria-labelledby="contato-heading" className="mx-auto max-w-6xl px-6 py-24 md:py-32">
      <h1 id="contato-heading" className="text-fg text-4xl font-bold tracking-tight md:text-5xl">
        {contact.title}
      </h1>
      <p className="mt-6 max-w-2xl text-lg text-fg-muted">{contact.description}</p>
      {/* TODO: construir formulário real (nome, whatsapp, e-mail, empresa, segmento, faturamento, serviço) */}
    </section>
  );
}
