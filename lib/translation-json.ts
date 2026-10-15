import type { Json } from "@/lib/supabase/types";

// Leitura defensiva das colunas jsonb de tradução (articles.en, materials.en):
// o banco aceita qualquer objeto, então cada campo é conferido aqui.

type JsonObject = { [key: string]: Json | undefined };

export function asObject(value: Json | null | undefined): JsonObject | undefined {
  return value && typeof value === "object" && !Array.isArray(value) ? value : undefined;
}

export function str(object: JsonObject, key: string): string | undefined {
  const value = object[key];
  return typeof value === "string" && value.trim() ? value : undefined;
}

export function faqList(value: Json | undefined): { question: string; answer: string }[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const items = value.flatMap((item) => {
    const entry = asObject(item);
    const question = entry && str(entry, "question");
    const answer = entry && str(entry, "answer");
    return question && answer ? [{ question, answer }] : [];
  });
  return items.length ? items : undefined;
}
