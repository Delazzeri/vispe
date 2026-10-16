// Servidor local para testar out/ como na Hostinger: lê out/.htaccess e aplica
// as mesmas regras de mod_rewrite (subconjunto usado pelo generate-htaccess:
// RewriteCond com -f/!-f e regex, RewriteRule com $N/%{VAR}, flags L, R, E, NC, OR).
// Sem dependências. Uso: node scripts/serve-out.mjs [porta]   (padrão 4100)

import { createServer } from "node:http";
import { existsSync, readFileSync, statSync } from "node:fs";
import { networkInterfaces } from "node:os";
import { extname, join, resolve } from "node:path";

const root = resolve("out");
const port = Number(process.argv[2] ?? 4100);

const types = {
  ".html": "text/html; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".js": "application/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".xml": "application/xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".mp4": "video/mp4",
};

/** Regras do bloco mod_rewrite: [{ conds: [{test, pattern, negate, nc, or}], pattern, target, flags }]. */
function parseRules() {
  const text = readFileSync(join(root, ".htaccess"), "utf8");
  const block = text.slice(text.indexOf("<IfModule mod_rewrite.c>"), text.indexOf("</IfModule>"));
  const rules = [];
  let conds = [];
  const flagsOf = (s) => (s ? s.slice(1, -1).split(",") : []);
  for (const raw of block.split("\n")) {
    const line = raw.trim();
    if (line.startsWith("RewriteCond ")) {
      const [, test, pattern, flags] = line.match(/^RewriteCond\s+(\S+)\s+(\S+)(?:\s+(\[[^\]]+\]))?$/);
      const f = flagsOf(flags);
      const negate = pattern.startsWith("!");
      conds.push({ test, pattern: negate ? pattern.slice(1) : pattern, negate, nc: f.includes("NC"), or: f.includes("OR") });
    } else if (line.startsWith("RewriteRule ")) {
      const [, pattern, target, flags] = line.match(/^RewriteRule\s+(\S+)\s+(\S+)(?:\s+(\[[^\]]+\]))?$/);
      rules.push({ conds, pattern, target, flags: flagsOf(flags) });
      conds = [];
    }
  }
  return rules;
}

function rewrite(req, rules) {
  const original = new URL(req.url, "http://localhost");
  let path = decodeURIComponent(original.pathname).replace(/^\//, "");
  const query = original.search;
  const env = {};

  for (let pass = 0; pass < 10; pass++) {
    const vars = (name) => {
      if (name.startsWith("HTTP:")) return req.headers[name.slice(5).toLowerCase()] ?? "";
      if (name.startsWith("ENV:")) return env[name.slice(4)] ?? "";
      return {
        HTTPS: "on",
        HTTP_HOST: req.headers.host ?? "",
        HTTP_COOKIE: req.headers.cookie ?? "",
        HTTP_USER_AGENT: req.headers["user-agent"] ?? "",
        REQUEST_URI: `/${path}`,
        THE_REQUEST: `${req.method} ${original.pathname} HTTP/1.1`,
        DOCUMENT_ROOT: root,
        REQUEST_FILENAME: join(root, path),
      }[name] ?? "";
    };
    const expand = (s, m) => s.replace(/\$(\d)/g, (_, n) => m?.[n] ?? "").replace(/%\{([^}]+)\}/g, (_, v) => vars(v));
    const isFile = (p) => existsSync(p) && statSync(p).isFile();

    let changed = false;
    for (const rule of rules) {
      const nc = rule.flags.includes("NC");
      const match = path.match(new RegExp(rule.pattern, nc ? "i" : ""));
      if (!match) continue;
      let ok = true;
      for (const [i, c] of rule.conds.entries()) {
        const subject = expand(c.test, match);
        let result = c.pattern === "-f" ? isFile(subject) : new RegExp(c.pattern, c.nc ? "i" : "").test(subject);
        if (c.negate) result = !result;
        const prevOr = i > 0 && rule.conds[i - 1].or;
        ok = prevOr ? ok || result : i === 0 ? result : ok && result;
        if (!ok && !c.or) break;
      }
      if (!ok) continue;

      for (const f of rule.flags) {
        const e = f.match(/^E=([^:]+):(.*)$/);
        if (e) env[e[1]] = e[2];
      }
      const redirect = rule.flags.find((f) => f.startsWith("R"));
      if (rule.target !== "-") {
        const target = expand(rule.target, match);
        if (redirect) return { redirect: target + query, status: Number(redirect.split("=")[1] ?? 302) };
        const next = target.replace(/^\//, "");
        if (next !== path) {
          path = next;
          changed = true;
        }
      }
      if (rule.flags.includes("L")) break;
    }
    if (!changed) break;
  }
  return { path };
}

createServer((req, res) => {
  const rules = parseRules(); // relê a cada requisição: rebuild sem reiniciar
  const result = rewrite(req, rules);
  if (result.redirect) {
    res.writeHead(result.status, { Location: result.redirect, Vary: "Accept-Language" });
    return res.end();
  }
  let file = join(root, result.path);
  if (existsSync(file) && statSync(file).isDirectory()) file = join(file, "index.html");
  if (!existsSync(file)) {
    res.writeHead(404, { "Content-Type": types[".html"] });
    return res.end(readFileSync(join(root, "404.html")));
  }
  res.writeHead(200, { "Content-Type": types[extname(file)] ?? "application/octet-stream" });
  res.end(readFileSync(file));
}).listen(port, () => {
  console.log(`out/ com as regras do .htaccess em http://localhost:${port}`);
  // Escuta em todas as interfaces: celular/outro PC na mesma rede Wi-Fi abre pelo IP local.
  const lan = Object.values(networkInterfaces())
    .flat()
    .filter((net) => net && net.family === "IPv4" && !net.internal)
    .map((net) => `http://${net.address}:${port}`);
  if (lan.length) console.log(`Na rede: ${lan.join("  ")}`);
});
