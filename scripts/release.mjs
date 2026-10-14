// Prepara o pacote para subir na Hostinger (plano Single):
//   1. confere a configuração (.env.local): domínio, Supabase, formulários;
//   2. roda o build (pnpm build → out/ + out/.htaccess);
//   3. compacta out/ em release/vispe-site-<data>.zip (com o .htaccess).
// Na Hostinger: Gerenciador de Arquivos → public_html → enviar o .zip → Extrair.
// Uso: pnpm release        (pnpm release --strict falha se faltar configuração)

import { execSync, spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, statSync } from "node:fs";

const strict = process.argv.includes("--strict");
const ok = (text) => console.log(`  ✔ ${text}`);
const warnings = [];
const warn = (text) => {
  warnings.push(text);
  console.log(`  ⚠ ${text}`);
};

function readEnv() {
  const env = { ...process.env };
  for (const file of [".env", ".env.production", ".env.local", ".env.production.local"]) {
    if (!existsSync(file)) continue;
    for (const line of readFileSync(file, "utf8").split(/\r?\n/)) {
      const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
      if (match && !line.trim().startsWith("#")) env[match[1]] = match[2].replace(/^["']|["']$/g, "");
    }
  }
  return env;
}

console.log("\n1. Configuração (.env.local)");
const env = readEnv();

if (env.NEXT_PUBLIC_SITE_URL) ok(`Domínio: ${env.NEXT_PUBLIC_SITE_URL}`);
else warn("NEXT_PUBLIC_SITE_URL vazio: canonical e sitemap vão usar https://www.vispe.com.br.");

if (env.NEXT_PUBLIC_FORMS_ENDPOINT) ok("Formulários: endpoint do Google Sheets configurado.");
else warn("NEXT_PUBLIC_FORMS_ENDPOINT vazio: os formulários vão mostrar 'envio sendo configurado'.");

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
if (!supabaseUrl || !supabaseKey) {
  warn("Supabase não configurado: blog com os artigos de content/blog.ts e admin desativado.");
} else {
  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/articles?select=slug&limit=1`, {
      headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` },
      signal: AbortSignal.timeout(10_000),
    });
    if (response.ok) ok("Supabase: conectado, tabela articles acessível.");
    else warn(`Supabase respondeu ${response.status}: rode as migrations (supabase/README.md). O build usará os artigos locais.`);
  } catch {
    warn("Supabase não responde (projeto inexistente ou pausado?): o build usará os artigos de content/blog.ts.");
  }
}

if (strict && warnings.length) {
  console.error(`\n✖ ${warnings.length} pendência(s) de configuração (modo --strict). Nada foi gerado.\n`);
  process.exit(1);
}

console.log("\n2. Build");
const build = spawnSync("pnpm build", { stdio: "inherit", shell: true });
if (build.status !== 0) {
  console.error("\n✖ O build falhou. Corrija o erro acima e rode pnpm release de novo.\n");
  process.exit(1);
}
if (!existsSync("out/.htaccess")) {
  console.error("\n✖ out/.htaccess não foi gerado.\n");
  process.exit(1);
}

console.log("\n3. Pacote");
mkdirSync("release", { recursive: true });
const now = new Date();
const pad = (n) => String(n).padStart(2, "0");
const stamp = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}`;
const zip = `release/vispe-site-${stamp}.zip`;
// tar do Windows 10+ (bsdtar) gera .zip com -a; inclui arquivos ocultos como o .htaccess.
execSync(`tar -a -c -f "${zip}" -C out .`, { stdio: "inherit" });
const listing = execSync(`tar -t -f "${zip}"`).toString();
if (!/(^|\/)\.htaccess$/m.test(listing)) {
  console.error("\n✖ O .htaccess ficou fora do .zip.\n");
  process.exit(1);
}
const megabytes = (statSync(zip).size / 1024 / 1024).toFixed(1);
ok(`${zip} (${megabytes} MB, ${listing.trim().split("\n").length} itens, com .htaccess)`);

console.log(`
Pronto. Para publicar na Hostinger:
  1. hPanel → Arquivos → Gerenciador de Arquivos → public_html
  2. Apague o conteúdo antigo de public_html (faça backup antes, se quiser)
  3. Envie ${zip} → clique com o botão direito → Extrair (direto em public_html)
  4. Apague o .zip do servidor e abra o site (Ctrl+F5)
${warnings.length ? `\nAtenção: ${warnings.length} pendência(s) de configuração acima (⚠).` : ""}`);
