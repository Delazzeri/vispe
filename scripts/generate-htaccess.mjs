// Gera out/.htaccess depois do build (pnpm build → postbuild).
//
// O site é exportado estático com as páginas em out/pt-BR/ e out/en-US/
// (pastas internas, nomes em português). Sem o proxy do next-intl, quem monta
// as URLs públicas é o Apache/LiteSpeed da Hostinger:
//   /sobre/            → out/pt-BR/sobre/index.html  (pt na raiz)
//   /en/about/         → out/en-US/sobre/index.html  (inglês em /en, caminhos traduzidos)
//   /blog/<novo>/      → out/pt-BR/blog/post/index.html (post publicado depois do build)
// e manda para /en quem chega com o navegador em outro idioma.
//
// As rotas vêm de i18n/routing.ts (mesma fonte do site), então uma página nova
// entra aqui sozinha. Uso: node --no-warnings scripts/generate-htaccess.mjs

import { writeFileSync } from "node:fs";
import { localeCookie, localePrefixes, routing } from "../i18n/routing.ts";

const enPrefix = localePrefixes["en-US"].replace(/^\//, ""); // "en"

/** Caminho sem as barras das pontas, escapado para regex ("franquia/comercial"). */
const re = (path) => path.replace(/^\/|\/$/g, "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const strip = (path) => path.replace(/^\/|\/$/g, "");

// Rotas com caminho em inglês diferente do interno, do mais longo para o mais
// curto (franquia/comercial antes de franquia).
const translated = Object.entries(routing.pathnames)
  .map(([internal, target]) => ({ internal, en: typeof target === "string" ? target : target["en-US"] }))
  .filter(({ internal, en }) => internal !== "/" && internal !== en)
  .map(({ internal, en }) => ({
    dynamic: internal.endsWith("/[slug]"),
    internal: strip(internal.replace("/[slug]", "")),
    en: strip(en.replace("/[slug]", "")),
  }))
  .sort((a, b) => b.en.length - a.en.length);

const bots = "bot|crawl|spider|slurp|facebookexternalhit|whatsapp|linkedin|embedly|preview|lighthouse|chrome-lighthouse";
const passthrough = "pt-BR|en-US|_next|admin|media|fonts|og\\.png|og-en\\.png|favicon\\.ico|robots\\.txt|sitemap\\.xml|404";

const lines = [];
const add = (...block) => lines.push(...block, "");

add(
  "# Gerado por scripts/generate-htaccess.mjs no build — não editar à mão.",
  "Options -Indexes -MultiViews",
  "DirectoryIndex index.html",
  "AddDefaultCharset utf-8",
  "ErrorDocument 404 /404.html",
);

add(
  "<IfModule mod_rewrite.c>",
  "RewriteEngine On",
  "RewriteBase /",
);

add(
  "# HTTPS sempre.",
  "RewriteCond %{HTTPS} off",
  "RewriteCond %{HTTP:X-Forwarded-Proto} !https",
  "RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]",
);

add(
  "# Pastas internas acessadas direto pelo visitante: volta para a URL pública.",
  "RewriteCond %{THE_REQUEST} \\s/pt-BR/",
  "RewriteRule ^pt-BR/(.*)$ /$1 [L,R=301]",
  ...translated.flatMap(({ internal, en, dynamic }) =>
    dynamic
      ? ["RewriteCond %{THE_REQUEST} \\s/en-US/", `RewriteRule ^en-US/${re(internal)}/(.*)$ /${enPrefix}/${en}/$1 [L,R=301]`]
      : ["RewriteCond %{THE_REQUEST} \\s/en-US/", `RewriteRule ^en-US/${re(internal)}/?$ /${enPrefix}/${en}/ [L,R=301]`],
  ),
  "RewriteCond %{THE_REQUEST} \\s/en-US/",
  `RewriteRule ^en-US/(.*)$ /${enPrefix}/$1 [L,R=301]`,
);

// O cliente do Next pede o payload de cada página como um nome com pontos
// (__next.$d$locale.!KHNpdGUp.sobre.__PAGE__.txt), mas o export grava em pastas
// (__next.$d$locale/!KHNpdGUp/sobre/__PAGE__.txt). Sem isto, a navegação ainda
// funciona (cai no payload completo), mas cada pré-carregamento vira um 404.
add(
  "# Payloads por segmento da navegação: nome com pontos → pastas, como o export grava.",
  ...[5, 4, 3, 2, 1].map((depth) => {
    const parts = Array.from({ length: depth }, () => "([^./]+)");
    const target = Array.from({ length: depth }, (_, i) => `$${i + 2}`).join("/");
    return `RewriteRule ^(.*/)?__next\\.${parts.join("\\.")}\\.__PAGE__\\.txt$ $1__next.${target}/__PAGE__.txt`;
  }),
);

add(
  "# Arquivo real ou pasta com index.html: serve direto (assets, admin, páginas internas).",
  "RewriteCond %{REQUEST_FILENAME} -f",
  "RewriteRule ^ - [L]",
  "RewriteCond %{REQUEST_FILENAME}/index.html -f",
  "RewriteRule ^ - [L]",
);

add(
  "# Página sem a barra final (/sobre → /sobre/), como o export gera.",
  "RewriteCond %{REQUEST_URI} !\\.[A-Za-z0-9]+$",
  "RewriteCond %{REQUEST_URI} !/$",
  "RewriteRule ^(.*)$ /$1/ [L,R=301]",
);

add(
  "# Idioma: navegador com idioma principal diferente de português, sem escolha salva (cookie do seletor) e",
  "# que não seja robô de busca/prévia → versão em inglês. 302: depende do visitante.",
  `RewriteCond %{HTTP_COOKIE} !${localeCookie}=`,
  "RewriteCond %{HTTP:Accept-Language} .",
  // Só o idioma principal (o primeiro da lista): sistema em inglês com pt em segundo vai para /en.
  "RewriteCond %{HTTP:Accept-Language} !^\\s*pt [NC]",
  "RewriteCond %{HTTP:Accept} text/html",
  `RewriteCond %{HTTP_USER_AGENT} !(${bots}) [NC]`,
  `RewriteCond %{REQUEST_URI} !^/(${enPrefix}|${passthrough})(/|$)`,
  "RewriteRule ^ - [E=TO_EN:1]",
  "RewriteCond %{ENV:TO_EN} 1",
  `RewriteRule ^$ /${enPrefix}/ [L,R=302]`,
  ...translated.flatMap(({ internal, en, dynamic }) => [
    "RewriteCond %{ENV:TO_EN} 1",
    dynamic
      ? `RewriteRule ^${re(internal)}/(.*)$ /${enPrefix}/${en}/$1 [L,R=302]`
      : `RewriteRule ^${re(internal)}/$ /${enPrefix}/${en}/ [L,R=302]`,
  ]),
  "RewriteCond %{ENV:TO_EN} 1",
  `RewriteRule ^(.+)$ /${enPrefix}/$1 [L,R=302]`,
);

for (const [prefix, folder, label] of [
  [`${enPrefix}/`, "en-US", "Inglês"],
  ["", "pt-BR", "Português (raiz)"],
]) {
  const routes =
    folder === "en-US"
      ? // Set: a página e a rota [slug] dela (materiais e materiais/[slug]) dão a mesma regra.
        [...new Set(translated.map(({ internal, en }) => `RewriteRule ^${enPrefix}/${re(en)}(/.*)?$ en-US/${internal}$1 [L]`))]
      : [];
  add(
    `# ${label}: posts do blog — HTML do build se existir; senão, a página única que busca no Supabase.`,
    `RewriteCond %{DOCUMENT_ROOT}/${folder}/blog/$1/index.html -f`,
    `RewriteRule ^${prefix}blog/([^/]+)/$ ${folder}/blog/$1/index.html [L]`,
    `RewriteCond %{DOCUMENT_ROOT}/${folder}/blog/$1/index.html !-f`,
    `RewriteRule ^${prefix}blog/(?!post/)([^/]+)/$ ${folder}/blog/post/index.html [L]`,
    ...(routes.length ? [`# ${label}: caminhos traduzidos → pastas internas.`, ...routes] : []),
    `# ${label}: demais caminhos (iguais nos dois idiomas, inclusive os payloads da navegação).`,
    folder === "en-US" ? `RewriteRule ^${enPrefix}/?$ en-US/ [L]` : "RewriteRule ^$ pt-BR/ [L]",
    `RewriteCond %{REQUEST_URI} !^/(pt-BR|en-US)/`,
    folder === "en-US" ? `RewriteRule ^${enPrefix}/(.*)$ en-US/$1 [L]` : "RewriteRule ^(.*)$ pt-BR/$1 [L]",
  );
}

add("</IfModule>");

add(
  "<IfModule mod_headers.c>",
  "Header append Vary Accept-Language",
  "# Arquivos com hash no nome (Next) e fontes: cache longo.",
  '<FilesMatch "\\.(js|css|woff2)$">',
  '  Header set Cache-Control "public, max-age=31536000, immutable"',
  "</FilesMatch>",
  "# Imagens: uma semana.",
  '<FilesMatch "\\.(webp|png|jpg|jpeg|svg|ico|mp4)$">',
  '  Header set Cache-Control "public, max-age=604800"',
  "</FilesMatch>",
  "# HTML e payloads da navegação: sempre revalidar (deploy aparece na hora).",
  '<FilesMatch "\\.(html|txt)$">',
  '  Header set Cache-Control "no-cache"',
  "</FilesMatch>",
  "</IfModule>",
);

add(
  "<IfModule mod_deflate.c>",
  "AddOutputFilterByType DEFLATE text/html text/plain text/css application/javascript application/json image/svg+xml application/xml",
  "</IfModule>",
);

const target = process.argv[2] ?? "out/.htaccess";
writeFileSync(target, lines.join("\n"));
console.log(`.htaccess gerado em ${target} (${translated.length} rotas traduzidas).`);
