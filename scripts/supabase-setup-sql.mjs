// Junta as migrations de supabase/migrations em supabase/setup-completo.sql,
// para configurar um projeto novo colando um único arquivo no SQL Editor.
// Mudou ou criou uma migration? Rode de novo: pnpm supabase:setup

import { readdirSync, readFileSync, writeFileSync } from "node:fs";

const dir = "supabase/migrations";
const files = readdirSync(dir).filter((name) => name.endsWith(".sql")).sort();
const body = files.map((name) => `-- ═══ ${name} ═══\n\n${readFileSync(`${dir}/${name}`, "utf8").trim()}\n`).join("\n");

writeFileSync(
  "supabase/setup-completo.sql",
  `-- Configuração completa do banco do site da Vispe Capital (gerado por
-- scripts/supabase-setup-sql.mjs — não editar à mão).
-- Uso: projeto NOVO → SQL Editor → New query → colar tudo → Run. Rodar uma vez só.
-- Contém, em ordem: ${files.join(", ")}.

${body}`,
);
console.log(`supabase/setup-completo.sql com ${files.length} migrations.`);
