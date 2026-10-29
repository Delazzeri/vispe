// pnpm dev: next dev numa porta interna + proxy na porta pública que monta as
// URLs como o out/.htaccess faz na Hostinger (sem o proxy do next-intl, o
// next dev sozinho só abre /pt-BR/... e /en-US/...):
//   /sobre/     → /pt-BR/sobre/
//   /en/about/  → /en-US/sobre/   (caminhos traduzidos de i18n/routing.ts)
// Sem o redirecionamento pelo idioma do navegador: isso só existe no .htaccess
// (conferir com pnpm build && pnpm preview). Uso: node --no-warnings scripts/dev.mjs [porta]

import { spawn } from "node:child_process";
import { createServer, request } from "node:http";
import { connect } from "node:net";
import { localePrefixes, routing } from "../i18n/routing.ts";

const port = Number(process.argv[2] ?? 3000);
const nextPort = port + 1;
const enPrefix = localePrefixes["en-US"]; // "/en"
const strip = (path) => path.replace(/^\/|\/$/g, "");

// Caminho em inglês → pasta interna, do mais longo para o mais curto.
const translated = Object.entries(routing.pathnames)
  .map(([internal, target]) => ({
    internal: strip(internal.replace("/[slug]", "")),
    en: strip((typeof target === "string" ? target : target["en-US"]).replace("/[slug]", "")),
  }))
  .filter(({ internal, en }) => internal !== en)
  .sort((a, b) => b.en.length - a.en.length);

// Arquivos e rotas do Next que não passam pelo idioma (como o passthrough do .htaccess).
const passthrough = /^\/(__nextjs[^/]*|pt-BR|en-US|_next|admin|media|fonts|favicon\.ico|robots\.txt|sitemap\.xml|og[^/]*\.png)(\/|$)/;

function internalPath(pathname) {
  if (passthrough.test(pathname)) return pathname;
  if (pathname === enPrefix || pathname.startsWith(`${enPrefix}/`)) {
    let rest = strip(pathname.slice(enPrefix.length));
    const hit = translated.find(({ en }) => rest === en || rest.startsWith(`${en}/`));
    if (hit) rest = hit.internal + rest.slice(hit.en.length);
    return `/en-US/${rest}${rest && pathname.endsWith("/") ? "/" : ""}`;
  }
  return `/pt-BR${pathname}`;
}

function target(url) {
  const parsed = new URL(url, "http://localhost");
  return internalPath(parsed.pathname) + parsed.search;
}

const server = createServer((req, res) => {
  const upstream = request(
    { host: "localhost", port: nextPort, method: req.method, path: target(req.url), headers: { ...req.headers, host: `localhost:${nextPort}` } },
    (response) => {
      res.writeHead(response.statusCode ?? 502, response.headers);
      response.pipe(res);
    },
  );
  upstream.on("error", () => {
    if (!res.headersSent) res.writeHead(503, { "Content-Type": "text/plain; charset=utf-8", "Retry-After": "3" });
    res.end("O next dev ainda está subindo. Recarregue em alguns segundos.");
  });
  req.pipe(upstream);
});

// WebSocket do hot reload: repassa a conexão crua.
server.on("upgrade", (req, socket, head) => {
  const upstream = connect(nextPort, "localhost", () => {
    const headers = Object.entries(req.headers).map(([key, value]) => `${key}: ${key === "host" ? `localhost:${nextPort}` : value}`);
    upstream.write([`${req.method} ${req.url} HTTP/1.1`, ...headers, "", ""].join("\r\n"));
    upstream.write(head);
    socket.pipe(upstream).pipe(socket);
  });
  upstream.on("error", () => socket.destroy());
  socket.on("error", () => upstream.destroy());
});

// O next dev só sobe depois que a porta pública está livre (senão sobraria um next órfão).
server.on("error", (problem) => {
  if (problem.code !== "EADDRINUSE") throw problem;
  console.error(`\n  A porta ${port} já está em uso: o dev provavelmente já está rodando em http://localhost:${port}\n`);
  process.exit(1);
});
server.listen(port, () => {
  console.log(`\n  Site com as URLs públicas: http://localhost:${port}  (next dev interno na ${nextPort})\n`);
  const next = spawn(process.execPath, ["node_modules/next/dist/bin/next", "dev", "-p", String(nextPort)], { stdio: "inherit" });
  next.on("exit", (code) => process.exit(code ?? 0));
  for (const signal of ["SIGINT", "SIGTERM"]) process.on(signal, () => next.kill(signal));
});
