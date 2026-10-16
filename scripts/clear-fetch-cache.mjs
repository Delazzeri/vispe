// Apaga o cache de fetch do Next antes do build (pnpm build).
//
// O Next guarda em .next/cache/fetch-cache as respostas das consultas feitas no
// build (artigos e materiais do Supabase) e as reaproveita nos builds seguintes.
// Assim, um build podia sair com dados de dias atrás — e cada processo do build
// com uma lista diferente (material novo virando página "não encontrada").
// Sem o cache, todo build lê o conteúdo atual do banco.

import { rmSync } from "node:fs";

rmSync(".next/cache/fetch-cache", { recursive: true, force: true });
