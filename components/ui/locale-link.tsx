import Link from "next/link";
import { useLocale } from "next-intl";
import type { ComponentProps } from "react";
import { localizeHref } from "@/i18n/href";
import { resolveLocale } from "@/i18n/routing";

type LocaleLinkProps = Omit<ComponentProps<typeof Link>, "href"> & { href: string };

/**
 * next/link que traduz hrefs internos para o idioma atual
 * ("/contato" → "/en/contact"). Externos e mailto: passam intactos.
 */
export function LocaleLink({ href, ...props }: LocaleLinkProps) {
  const locale = resolveLocale(useLocale());
  return <Link href={localizeHref(href, locale)} {...props} />;
}
