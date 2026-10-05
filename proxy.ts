import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Tudo menos API, internos do Next, rotas de imagem OG/arquivos estáticos
  // (qualquer caminho com extensão) e os metadados sitemap/robots.
  matcher: ["/((?!api|_next|_vercel|og|.*\\..*).*)"],
};
