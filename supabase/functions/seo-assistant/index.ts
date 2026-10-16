// Supabase Edge Function "seo-assistant" (Deno): sugere título para o Google,
// descrição, resumo, slug e uma diagramação do artigo com foco em SEO, usando o
// Gemini; com { task: "faq" }, gera as perguntas frequentes do artigo; com
// { task: "translate" }, traduz um artigo ou material para o inglês (site /en).
// Roda no servidor do Supabase para a chave do Gemini nunca ir para o
// site (que é estático); só atende quem está logado no admin E é staff.
//
// Publicar (painel do Supabase, sem CLI): Edge Functions → Deploy a new function
// → Via Editor → nome "seo-assistant" → cole este arquivo → Deploy.
// Segredos (Edge Functions → Secrets): GEMINI_API_KEY (obrigatório) e, opcional,
// GEMINI_MODEL (padrão: gemini-3.8-flash) e GEMINI_FALLBACK_MODEL (reserva quando o
// principal está sobrecarregado; padrão: gemini-3.5-flash-lite). Ver supabase/README.md.

import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

const MAX_CONTENT = 60_000;

const SYSTEM = `Você é editor de SEO do blog da Vispe Capital, consultoria financeira para pequenas e médias empresas no Brasil (controladoria, BPO financeiro, planejamento tributário, valuation, M&A, captação de recursos). Escreve em português do Brasil, tom profissional e direto.

Regras inegociáveis:
- Nunca invente fatos, números, clientes, cases ou dados que não estejam no texto original.
- Preserve o sentido, os argumentos e TODOS os links existentes no formato [texto](endereço), sem alterar os endereços.
- Não use H1 (o título do artigo já é o H1). Use "## " para seções e "### " para subseções, sem pular níveis.

O que entregar:
- focusKeyword: a palavra-chave principal que o artigo realmente trata (2 a 4 palavras).
- metaTitle: até 60 caracteres, com a palavra-chave no início quando natural, sem o nome da empresa.
- metaDescription: entre 140 e 155 caracteres, com a palavra-chave e um benefício claro para o leitor.
- excerpt: resumo de 1 ou 2 frases (até 200 caracteres) para o card do blog.
- slug: minúsculas, sem acentos, palavras separadas por hífen, até 60 caracteres, sem palavras vazias (de, da, o, a, para…).
- contentMarkdown: o mesmo conteúdo, rediagramado para leitura e SEO: abertura que apresenta o tema e a palavra-chave nas primeiras linhas; seções com subtítulos descritivos (## / ###) que usem variações da palavra-chave; parágrafos curtos (até 3–4 frases); listas (- ou 1.) quando houver enumerações; **negrito** só em termos-chave (com moderação); frase de destaque com "> " quando houver uma ideia central. Sem tabelas, imagens ou HTML.
- notes: de 2 a 5 observações curtas sobre o que foi melhorado ou o que o autor pode acrescentar (ex.: falta um link interno para um serviço).`;

const schema = {
  type: "OBJECT",
  properties: {
    focusKeyword: { type: "STRING" },
    metaTitle: { type: "STRING" },
    metaDescription: { type: "STRING" },
    excerpt: { type: "STRING" },
    slug: { type: "STRING" },
    contentMarkdown: { type: "STRING" },
    notes: { type: "ARRAY", items: { type: "STRING" } },
  },
  required: ["focusKeyword", "metaTitle", "metaDescription", "excerpt", "slug", "contentMarkdown", "notes"],
};

const FAQ_SYSTEM = `Você é editor de SEO do blog da Vispe Capital (consultoria financeira para PMEs no Brasil). Com base SOMENTE no artigo enviado, escreva perguntas frequentes para o fim do artigo, que também viram dados estruturados FAQPage para o Google.

Regras:
- De 4 a 6 perguntas que um empresário faria sobre o tema, em português do Brasil, como as do "As pessoas também perguntam" do Google.
- Cada resposta com 2 a 4 frases, direta, respondendo logo na primeira frase.
- Use apenas informações que estão no artigo; nunca invente números, prazos, leis, clientes ou dados.
- Não repita a mesma pergunta com outras palavras; cubra pontos diferentes do texto.
- Sem Markdown, links ou HTML nas respostas.`;

const faqSchema = {
  type: "OBJECT",
  properties: {
    faq: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: { question: { type: "STRING" }, answer: { type: "STRING" } },
        required: ["question", "answer"],
      },
    },
  },
  required: ["faq"],
};

const TRANSLATE_SYSTEM = `Você traduz conteúdo do site da Vispe Capital (consultoria financeira para PMEs no Brasil) do português do Brasil para o inglês dos Estados Unidos, para a versão em inglês do site.

Regras:
- Tradução fiel e natural, tom profissional de negócios; não resuma, não acrescente e não omita nada.
- Preserve exatamente a estrutura Markdown: "## " e "### ", listas ("- " e "1. "), **negrito**, "> " de destaque e as quebras de linha/parágrafos.
- Links [texto](endereço): traduza só o texto; o endereço fica idêntico.
- Não traduza nomes próprios e marcas: Vispe Capital, Fin 24/7, Equity Talks, nomes de pessoas e empresas.
- Mantenha números, datas e valores como estão (ex.: R$ 1,5 milhão → R$ 1.5 million é permitido só na forma de escrita; nunca mude o valor).
- Termos técnicos com equivalente consagrado em inglês: use o termo em inglês (DRE → income statement, fluxo de caixa → cash flow, BPO Financeiro → financial BPO).
- metaTitle até 60 caracteres e metaDescription até 155, se vierem.
- Devolva somente as chaves que vieram na entrada, com os mesmos nomes.`;

const translateSchema = {
  type: "OBJECT",
  properties: {
    type: { type: "STRING" },
    title: { type: "STRING" },
    excerpt: { type: "STRING" },
    tagline: { type: "STRING" },
    headline: { type: "STRING" },
    category: { type: "STRING" },
    bodyMd: { type: "STRING" },
    descriptionMd: { type: "STRING" },
    metaTitle: { type: "STRING" },
    metaDescription: { type: "STRING" },
    coverAlt: { type: "STRING" },
    faq: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: { question: { type: "STRING" }, answer: { type: "STRING" } },
        required: ["question", "answer"],
      },
    },
  },
};

const TRANSLATABLE = [
  "type",
  "title",
  "excerpt",
  "tagline",
  "headline",
  "category",
  "bodyMd",
  "descriptionMd",
  "metaTitle",
  "metaDescription",
  "coverAlt",
] as const;

// Erros passageiros do Gemini (sobrecarga, limite por minuto, instabilidade): vale tentar de novo.
const RETRYABLE = new Set([429, 500, 502, 503, 504]);
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Chama o Gemini pedindo JSON no formato do schema e devolve o objeto.
 * Erro passageiro: tenta o mesmo modelo mais uma vez e depois os modelos reserva,
 * em ordem (o 503 "modelo sobrecarregado" costuma afetar um modelo por vez).
 */
async function askGemini(
  apiKey: string,
  models: readonly string[],
  system: string,
  userText: string,
  responseSchema: unknown,
  temperature = 0.2,
) {
  const attempts = [models[0], ...models];
  let lastStatus = 0;
  for (const [index, model] of attempts.entries()) {
    if (index > 0) await wait(index === 1 ? 1500 : 500);
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: system }] },
        contents: [{ role: "user", parts: [{ text: userText }] }],
        generationConfig: { responseMimeType: "application/json", responseSchema, temperature },
      }),
    });
    if (response.ok) {
      const result = await response.json();
      const raw = (result.candidates?.[0]?.content?.parts ?? []).map((part: { text?: string }) => part.text ?? "").join("");
      return JSON.parse(raw);
    }
    lastStatus = response.status;
    console.error("Gemini", model, response.status, await response.text());
    if (!RETRYABLE.has(response.status)) break;
  }
  throw new Error(`gemini ${lastStatus}`);
}

/** Mensagem para o admin a partir do erro do Gemini. */
function geminiError(error: unknown) {
  const status = error instanceof Error ? error.message.replace("gemini ", "") : "";
  if (status === "503" || status === "500" || status === "502" || status === "504")
    return "O Gemini está sobrecarregado agora (erro " + status + "), mesmo depois de tentar outro modelo. Tente de novo em alguns minutos.";
  if (status === "429") return "Limite de uso do Gemini atingido (erro 429). Espere um minuto ou confira a cota da chave no AI Studio.";
  if (status === "400" || status === "404")
    return "O Gemini recusou o pedido (erro " + status + "). Confira o segredo GEMINI_MODEL no Supabase.";
  return "O Gemini não respondeu (" + (status || "erro") + "). Tente de novo em instantes.";
}

const slugify = (text: string) =>
  text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60)
    .replace(/-+$/, "");

const text = (value: unknown) => (typeof value === "string" ? value.trim() : "");

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Método não permitido." }, 405);

  try {
    // Quem chama: usuário logado no admin e com linha em profiles (mesma regra da RLS).
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? Deno.env.get("SUPABASE_PUBLISHABLE_KEY") ?? "",
      { global: { headers: { Authorization: req.headers.get("Authorization") ?? "" } } },
    );
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) return json({ error: "Entre no admin para usar o assistente." }, 401);
    const { data: profile } = await supabase.from("profiles").select("id").eq("id", auth.user.id).maybeSingle();
    if (!profile) return json({ error: "Sua conta não está liberada para publicar." }, 403);

    const apiKey = Deno.env.get("GEMINI_API_KEY");
    if (!apiKey) return json({ error: "Assistente não configurado: falta o segredo GEMINI_API_KEY no Supabase." }, 500);
    // Modelo principal + reserva para quando ele estiver sobrecarregado (GEMINI_FALLBACK_MODEL, opcional).
    const primary = Deno.env.get("GEMINI_MODEL") ?? "gemini-3.8-flash";
    const fallback = Deno.env.get("GEMINI_FALLBACK_MODEL") ?? "gemini-3.5-flash-lite";
    const models = fallback && fallback !== primary ? [primary, fallback] : [primary];

    const body = await req.json();

    if (body.task === "translate") {
      const input = body.fields && typeof body.fields === "object" ? body.fields : {};
      const fields: Record<string, unknown> = {};
      for (const key of TRANSLATABLE) if (text(input[key])) fields[key] = text(input[key]);
      if (Array.isArray(input.faq) && input.faq.length) fields.faq = input.faq;
      if (!fields.title) return json({ error: "Preencha o título em português antes de traduzir." }, 400);
      if (JSON.stringify(fields).length > 90_000) return json({ error: "Conteúdo longo demais para traduzir de uma vez." }, 400);
      try {
        const data = await askGemini(apiKey, models, TRANSLATE_SYSTEM, JSON.stringify(fields), translateSchema);
        const translated: Record<string, unknown> = {};
        for (const key of TRANSLATABLE) if (fields[key] && text(data[key])) translated[key] = text(data[key]);
        if (fields.faq && Array.isArray(data.faq)) {
          translated.faq = data.faq
            .map((item: { question?: unknown; answer?: unknown }) => ({ question: text(item.question), answer: text(item.answer) }))
            .filter((item: { question: string; answer: string }) => item.question && item.answer);
        }
        return json(translated);
      } catch (error) {
        return json({ error: geminiError(error) }, 502);
      }
    }
    const title = text(body.title);
    const content = text(body.content);
    if (!title || content.length < 200) return json({ error: "Escreva o título e ao menos alguns parágrafos antes de usar o assistente." }, 400);
    if (content.length > MAX_CONTENT) return json({ error: "Artigo longo demais para o assistente (máx. ~60 mil caracteres)." }, 400);

    const articleContext = [
      `Título do artigo: ${title}`,
      `Categoria: ${text(body.category) || "(não informada)"}`,
      `Serviços relacionados: ${Array.isArray(body.tags) && body.tags.length ? body.tags.join(", ") : "(nenhum)"}`,
      `Resumo atual: ${text(body.excerpt) || "(vazio)"}`,
      "",
      "Conteúdo atual (Markdown):",
      content,
    ].join("\n");

    // Tarefa "faq": só as perguntas frequentes; padrão: sugestões de SEO completas.
    const task = body.task === "faq" ? "faq" : "seo";
    let data;
    try {
      data = await askGemini(apiKey, models, task === "faq" ? FAQ_SYSTEM : SYSTEM, articleContext, task === "faq" ? faqSchema : schema, 0.4);
    } catch (error) {
      return json({ error: geminiError(error) }, 502);
    }

    if (task === "faq") {
      const faq = Array.isArray(data.faq)
        ? data.faq
            .map((item: { question?: unknown; answer?: unknown }) => ({ question: text(item.question), answer: text(item.answer) }))
            .filter((item: { question: string; answer: string }) => item.question && item.answer)
            .slice(0, 8)
        : [];
      return json({ faq });
    }

    return json({
      focusKeyword: text(data.focusKeyword),
      metaTitle: text(data.metaTitle).slice(0, 70),
      metaDescription: text(data.metaDescription).slice(0, 200),
      excerpt: text(data.excerpt).slice(0, 300),
      slug: slugify(text(data.slug)) || slugify(title),
      contentMarkdown: text(data.contentMarkdown),
      notes: Array.isArray(data.notes) ? data.notes.map(text).filter(Boolean).slice(0, 6) : [],
    });
  } catch (error) {
    console.error(error);
    return json({ error: "Não foi possível gerar as sugestões agora." }, 500);
  }
});
