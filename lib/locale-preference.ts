import { localeCookie, type Locale } from "@/i18n/routing";

/**
 * Guarda a escolha do seletor de idioma por 1 ano. Com o cookie, o .htaccess
 * deixa de mandar o visitante para /en pelo idioma do navegador.
 */
export function rememberLocale(locale: Locale): void {
  const secure = location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${localeCookie}=${locale}; Max-Age=31536000; Path=/; SameSite=Lax${secure}`;
}
