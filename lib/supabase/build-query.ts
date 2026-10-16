// Consulta ao Supabase durante o build (páginas pré-renderizadas). O build roda
// em vários processos em paralelo e cada um consulta o banco: uma falha passageira
// num deles não pode virar página "não encontrada" ou conteúdo antigo em silêncio.
// Tenta de novo e, se continuar falhando, derruba o build com a causa (o
// pnpm release para antes de gerar o .zip).

const attempts = 4;
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

type QueryResult<T> = { data: T | null; error: { message: string } | null };

export async function buildQuery<T>(label: string, run: () => PromiseLike<QueryResult<T>>): Promise<T> {
  let lastError = "";
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      const { data, error } = await run();
      if (!error && data) return data;
      lastError = error?.message ?? "resposta vazia";
    } catch (problem) {
      lastError = problem instanceof Error ? problem.message : String(problem);
    }
    if (attempt < attempts) await wait(attempt * 1500);
  }
  throw new Error(
    `[${label}] O Supabase não respondeu no build depois de ${attempts} tentativas (${lastError.split("\n")[0]}). ` +
      "Confira a internet e o projeto no Supabase e rode o build de novo.",
  );
}
