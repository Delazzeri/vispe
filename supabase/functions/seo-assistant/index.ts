// Supabase Edge Function "seo-assistant" (Deno): sugere título para o Google,
// descrição, resumo, slug e uma diagramação do artigo com foco em SEO, usando o
// Gemini; com { task: "faq" }, gera as perguntas frequentes do artigo; com
// { kind: "material", filePath }, lê o arquivo do material (PDF, planilha, Word,
// PowerPoint) e escreve a página e o FAQ a partir dele; com
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
import { encodeBase64 } from "jsr:@std/encoding@1/base64";

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

// Materiais gratuitos (kind: "material"): a IA lê o ARQUIVO do material (PDF,
// planilha, Word, PowerPoint…, anexado ao pedido) e escreve a página a partir dele.
// A página apresenta o material, que a pessoa recebe por e-mail depois do formulário.
const MATERIAL_SYSTEM = `Você é editor de SEO das páginas de materiais gratuitos da Vispe Capital, consultoria financeira para pequenas e médias empresas no Brasil (controladoria, BPO financeiro, planejamento tributário, valuation, M&A, captação de recursos). Cada página apresenta um material para baixar (e-book, planilha, checklist, aula, prompt…) que a pessoa recebe por e-mail depois de preencher um formulário. Escreve em português do Brasil, tom profissional e direto.

Você recebe o ARQUIVO do material (anexo). Leia o documento inteiro e escreva tudo a partir dele: ele é a fonte principal. Título, formato e descrição já digitados no admin, se vierem, são só contexto extra.

Regras inegociáveis:
- Tudo precisa ser sustentado pelo documento: nunca invente números, capítulos, abas, ferramentas, clientes, resultados ou promessas que ele não tenha.
- A página apresenta o material para a pessoa querer baixar: mostre o que tem dentro e o valor de usar, sem entregar o conteúdo inteiro (não copie tabelas, fórmulas ou o passo a passo completo).
- Não use H1 (o título da página já é o H1). Use "## " para seções e "### " para subseções, sem pular níveis.

O que entregar:
- title: nome curto do material para o card do catálogo e o e-mail de envio (até 70 caracteres), fiel ao documento (ex.: o título da capa).
- headline: título mais completo para o topo da página (até 90 caracteres), com o benefício principal.
- focusKeyword: a palavra-chave principal que alguém buscaria para achar este material (2 a 4 palavras; ex.: "planilha de fluxo de caixa").
- metaTitle: até 60 caracteres, com a palavra-chave no início quando natural e o formato do material (ex.: "Planilha de DRE gratuita"), sem o nome da empresa.
- metaDescription: entre 140 e 155 caracteres, com a palavra-chave, o que a pessoa recebe e um convite para baixar grátis.
- excerpt: resumo de 1 frase (até 160 caracteres) para o card do catálogo: o benefício de ter o material.
- slug: minúsculas, sem acentos, palavras separadas por hífen, até 60 caracteres, sem palavras vazias (de, da, o, a, para…).
- contentMarkdown: a descrição da página (250 a 450 palavras), escrita a partir do documento: abertura que diz o que é o material e para quem é, com a palavra-chave nas primeiras linhas; "## O que você vai encontrar" com os tópicos, capítulos, abas ou seções reais do documento em lista; "## Para quem é"; "## Como usar" ou "## Por que usar" quando o documento sustentar; parágrafos curtos; **negrito** só em termos-chave (com moderação). Sem tabelas, imagens, links ou HTML.
- notes: de 2 a 5 observações curtas para o autor (ex.: partes do documento que ficaram de fora, ou o que conferir antes de publicar).`;

const MATERIAL_FAQ_SYSTEM = `Você é editor de SEO das páginas de materiais gratuitos da Vispe Capital (consultoria financeira para PMEs no Brasil). Leia o ARQUIVO do material (anexo) e escreva perguntas frequentes para a seção "Dúvidas" da página do material, que também viram dados estruturados FAQPage para o Google.

Regras:
- De 4 a 6 perguntas que um empresário faria antes de baixar: o que o material traz, para quem serve, como usar, e dúvidas sobre o tema que o documento responde.
- Cada resposta com 2 a 4 frases, direta, respondendo logo na primeira frase.
- O material é gratuito e enviado por e-mail depois do formulário; fora isso, use apenas informações do documento e nunca invente números, prazos, leis, clientes ou conteúdos.
- Não repita a mesma pergunta com outras palavras.
- Sem Markdown, links ou HTML nas respostas.`;

const materialSchema = {
  type: "OBJECT",
  properties: {
    title: { type: "STRING" },
    headline: { type: "STRING" },
    focusKeyword: { type: "STRING" },
    metaTitle: { type: "STRING" },
    metaDescription: { type: "STRING" },
    excerpt: { type: "STRING" },
    slug: { type: "STRING" },
    contentMarkdown: { type: "STRING" },
    notes: { type: "ARRAY", items: { type: "STRING" } },
  },
  required: ["title", "headline", "focusKeyword", "metaTitle", "metaDescription", "excerpt", "slug", "contentMarkdown", "notes"],
};

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
  user: string | GeminiPart[],
  responseSchema: unknown,
  temperature = 0.2,
) {
  const parts = typeof user === "string" ? [{ text: user }] : user;
  const attempts = [models[0], ...models];
  let lastStatus = 0;
  for (const [index, model] of attempts.entries()) {
    if (index > 0) await wait(index === 1 ? 1500 : 500);
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: system }] },
        contents: [{ role: "user", parts }],
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

type GeminiPart =
  | { text: string }
  | { inline_data: { mime_type: string; data: string } }
  | { file_data: { mime_type: string; file_uri: string } };

/** Erro com mensagem pronta para o admin (arquivo ausente, formato sem leitura…). */
class UserError extends Error {}

const MAX_DOC_TEXT = 200_000; // caracteres de texto extraído (planilhas e documentos)
// Acima disso, o PDF vai pela API de arquivos do Gemini. Dentro do pedido, o base64 +
// o JSON ocupam ~4–6× o tamanho do PDF na memória (o limite da função é 250 MB e é
// compartilhado com os pedidos seguintes do mesmo processo — erro 546).
const INLINE_PDF_BYTES = 4 * 1024 * 1024;

/** Texto dos elementos <tag> de um XML do Office, com quebra de linha a cada parágrafo. */
function officeText(xml: string, tag: string, paragraph: string) {
  const lines = xml
    .split(`</${paragraph}>`)
    .map((chunk) => [...chunk.matchAll(new RegExp(`<${tag}(?: [^>]*)?>([^<]*)</${tag}>`, "g"))].map((m) => m[1]).join(""))
    .filter((line) => line.trim())
    .join("\n");
  return xmlDecode(lines);
}

/**
 * Leitor mínimo de ZIP (xlsx, docx e pptx são ZIPs de XMLs) com o descompressor
 * nativo do runtime (DecompressionStream). Uma biblioteca em JavaScript gastava
 * CPU demais e estourava o limite da função (erro 546). `read` devolve no máximo
 * `maxBytes` do arquivo descompactado ("" se não existir).
 */
function openZip(bytes: Uint8Array) {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  // Fim do diretório central: assinatura 0x06054b50, nos últimos ~64 KB.
  let end = -1;
  for (let i = bytes.length - 22; i >= Math.max(0, bytes.length - 65_557); i--) {
    if (view.getUint32(i, true) === 0x06054b50) {
      end = i;
      break;
    }
  }
  if (end < 0) throw new UserError("Não consegui abrir o arquivo (ZIP inválido). Salve de novo e envie outra vez.");
  const entries = new Map<string, { method: number; size: number; offset: number }>();
  const decoder = new TextDecoder();
  let at = view.getUint32(end + 16, true);
  for (let n = view.getUint16(end + 10, true); n > 0 && view.getUint32(at, true) === 0x02014b50; n--) {
    const nameLength = view.getUint16(at + 28, true);
    const name = decoder.decode(bytes.subarray(at + 46, at + 46 + nameLength));
    entries.set(name, { method: view.getUint16(at + 10, true), size: view.getUint32(at + 20, true), offset: view.getUint32(at + 42, true) });
    at += 46 + nameLength + view.getUint16(at + 30, true) + view.getUint16(at + 32, true);
  }

  async function read(name: string, maxBytes: number): Promise<string> {
    const entry = entries.get(name);
    if (!entry) return "";
    const local = entry.offset;
    const start = local + 30 + view.getUint16(local + 26, true) + view.getUint16(local + 28, true);
    const data = bytes.subarray(start, start + entry.size);
    if (entry.method === 0) return decoder.decode(data.subarray(0, maxBytes));
    if (entry.method !== 8) return "";
    const reader = new Blob([data.slice()]).stream().pipeThrough(new DecompressionStream("deflate-raw")).getReader();
    const chunks: Uint8Array[] = [];
    let total = 0;
    while (total < maxBytes) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
      total += value.length;
    }
    await reader.cancel().catch(() => {});
    const out = new Uint8Array(Math.min(total, maxBytes));
    let offset = 0;
    for (const chunk of chunks) {
      const part = chunk.subarray(0, out.length - offset);
      out.set(part, offset);
      offset += part.length;
      if (offset >= out.length) break;
    }
    return decoder.decode(out);
  }

  return { names: [...entries.keys()], read };
}

/** Entidades do XML do Office (&amp; por último, para não decodificar duas vezes). */
function xmlDecode(value: string) {
  return value
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&");
}

/** PDF grande: envia pela API de arquivos do Gemini e devolve a referência (fica lá por 48 h). */
async function uploadToGemini(apiKey: string, file: Blob, mime: string, name: string): Promise<GeminiPart> {
  const start = await fetch("https://generativelanguage.googleapis.com/upload/v1beta/files", {
    method: "POST",
    headers: {
      "x-goog-api-key": apiKey,
      "X-Goog-Upload-Protocol": "resumable",
      "X-Goog-Upload-Command": "start",
      "X-Goog-Upload-Header-Content-Length": String(file.size),
      "X-Goog-Upload-Header-Content-Type": mime,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ file: { display_name: name } }),
  });
  const uploadUrl = start.headers.get("x-goog-upload-url");
  if (!start.ok || !uploadUrl) throw new Error(`gemini ${start.status}`);
  const upload = await fetch(uploadUrl, {
    method: "POST",
    headers: { "X-Goog-Upload-Offset": "0", "X-Goog-Upload-Command": "upload, finalize" },
    // O Blob vai como está (sem cópia nem base64): é o que mantém a memória baixa.
    body: file,
  });
  if (!upload.ok) throw new Error(`gemini ${upload.status}`);
  let stored = (await upload.json()).file;
  // O Gemini processa o arquivo antes de liberar o uso (PDF: segundos).
  for (let i = 0; stored?.state === "PROCESSING" && i < 30; i++) {
    await wait(2000);
    stored = await (await fetch(`https://generativelanguage.googleapis.com/v1beta/${stored.name}`, { headers: { "x-goog-api-key": apiKey } })).json();
  }
  if (stored?.state !== "ACTIVE") throw new UserError("O Gemini não conseguiu processar o PDF. Tente de novo ou envie um arquivo menor.");
  return { file_data: { mime_type: mime, file_uri: stored.uri } };
}

/**
 * Baixa o arquivo do material (bucket privado material-files, com a chave de
 * serviço) e devolve o pedaço da mensagem que o Gemini lê: PDF direto; planilha,
 * Word e PowerPoint como texto extraído.
 */
async function documentParts(apiKey: string, filePath: string): Promise<GeminiPart[]> {
  if (!/^[0-9a-f-]{36}\/[a-z0-9-]+\.[a-z0-9]+$/.test(filePath)) throw new UserError("Arquivo do material inválido.");
  const admin = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? Deno.env.get("SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } },
  );
  const { data: blob, error } = await admin.storage.from("material-files").download(filePath);
  if (error || !blob) throw new UserError("Não encontrei o arquivo do material. Envie o arquivo de novo.");
  const extension = filePath.split(".").pop() ?? "";
  const name = filePath.split("/").pop() ?? "material";
  const asText = (content: string) => [{ text: `Conteúdo do arquivo "${name}":\n\n${content.slice(0, MAX_DOC_TEXT)}` }];

  if (extension === "pdf") {
    // PDF pequeno vai dentro do pedido (base64); maior vai pela API de arquivos, sem cópias na memória.
    if (blob.size <= INLINE_PDF_BYTES)
      return [{ inline_data: { mime_type: "application/pdf", data: encodeBase64(new Uint8Array(await blob.arrayBuffer())) } }];
    return [await uploadToGemini(apiKey, blob, "application/pdf", name)];
  }
  const bytes = new Uint8Array(await blob.arrayBuffer());
  if (extension === "csv") return asText(new TextDecoder().decode(bytes));
  if (extension === "xls") throw new UserError("Planilha no formato antigo (.xls): salve como .xlsx e envie de novo para a IA ler.");
  if (extension === "xlsx") {
    // .xlsx é um ZIP de XMLs: lê os textos e valores direto, sem biblioteca de planilha.
    // Só o começo de cada aba (com formatação, a aba inteira pode ter vários MB).
    const zip = openZip(bytes);
    const shared = (await zip.read("xl/sharedStrings.xml", 2_000_000))
      .split("</si>")
      .map((item: string) => xmlDecode([...item.matchAll(/<t(?: [^>]*)?>([^<]*)<\/t>/g)].map((m) => m[1]).join("")));
    const names = [...(await zip.read("xl/workbook.xml", 200_000)).matchAll(/<sheet [^>]*name="([^"]*)"/g)].map((m) => xmlDecode(m[1]));
    const sheetFiles = zip.names
      .filter((path) => /^xl\/worksheets\/sheet\d+\.xml$/.test(path))
      .sort((a, b) => Number(a.match(/\d+/)?.[0]) - Number(b.match(/\d+/)?.[0]))
      .slice(0, 12);
    const sheets = await Promise.all(
      sheetFiles.map(async (path, i) => {
        const rows = (await zip.read(path, 400_000))
          .split("</row>")
          .slice(0, 300) // o começo de cada aba basta para entender a planilha
          .map((row: string) =>
            [...row.matchAll(/<c ([^>]*?)(?:\/>|>([\s\S]*?)<\/c>)/g)]
              .map(([, attrs, inner = ""]) => {
                const value = inner.match(/<v>([^<]*)<\/v>/)?.[1];
                if (/t="s"/.test(attrs)) return value !== undefined ? (shared[Number(value)] ?? "") : "";
                if (/t="inlineStr"/.test(attrs)) return xmlDecode([...inner.matchAll(/<t(?: [^>]*)?>([^<]*)<\/t>/g)].map((m) => m[1]).join(""));
                return value !== undefined ? xmlDecode(value) : "";
              })
              .filter(Boolean)
              .join(" | "),
          )
          .filter(Boolean);
        return `## Aba "${names[i] ?? `Planilha ${i + 1}`}"\n${rows.join("\n")}`;
      }),
    );
    return asText(sheets.join("\n\n"));
  }
  if (extension === "docx") {
    const xml = await openZip(bytes).read("word/document.xml", 3_000_000);
    return asText(officeText(xml, "w:t", "w:p"));
  }
  if (extension === "pptx") {
    const zip = openZip(bytes);
    const slides = zip.names
      .filter((path) => /^ppt\/slides\/slide\d+\.xml$/.test(path))
      .sort((a, b) => Number(a.match(/\d+/)?.[0]) - Number(b.match(/\d+/)?.[0]))
      .slice(0, 80);
    const texts = await Promise.all(slides.map(async (path, i) => `## Slide ${i + 1}\n${officeText(await zip.read(path, 300_000), "a:t", "a:p")}`));
    return asText(texts.join("\n\n"));
  }
  throw new UserError("A IA ainda não lê esse formato de arquivo (ZIP). Use PDF, planilha, Word ou PowerPoint.");
}

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
        // Schema só com as chaves enviadas, todas obrigatórias: sem "required", o Gemini
        // pode devolver o objeto vazio ou pela metade.
        const properties: Record<string, unknown> = {};
        for (const key of Object.keys(fields)) properties[key] = (translateSchema.properties as Record<string, unknown>)[key];
        const responseSchema = { type: "OBJECT", properties, required: Object.keys(fields) };
        const data = await askGemini(apiKey, models, TRANSLATE_SYSTEM, JSON.stringify(fields), responseSchema);
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
    // kind "material": a IA escreve a partir do arquivo do material (filePath no bucket privado).
    const material = body.kind === "material";
    const title = text(body.title);
    const content = text(body.content).slice(0, material ? 20_000 : undefined);
    const filePath = text(body.filePath);
    if (material && !filePath) return json({ error: "Envie o arquivo do material primeiro: a IA escreve a página a partir dele." }, 400);
    if (!material && (!title || content.length < 200))
      return json({ error: "Escreva o título e ao menos alguns parágrafos antes de usar o assistente." }, 400);
    if (content.length > MAX_CONTENT) return json({ error: "Artigo longo demais para o assistente (máx. ~60 mil caracteres)." }, 400);

    const articleContext = (
      material
        ? [
            "O arquivo do material vem anexado. Contexto já digitado no admin (pode estar vazio ou incompleto):",
            `Título atual: ${title || "(vazio)"}`,
            `Formato: ${text(body.category) || "(não informado)"}`,
            `Resumo atual: ${text(body.excerpt) || "(vazio)"}`,
            `Descrição atual: ${content || "(vazia)"}`,
          ]
        : [
            `Título do artigo: ${title}`,
            `Categoria: ${text(body.category) || "(não informada)"}`,
            `Serviços relacionados: ${Array.isArray(body.tags) && body.tags.length ? body.tags.join(", ") : "(nenhum)"}`,
            `Resumo atual: ${text(body.excerpt) || "(vazio)"}`,
            "",
            "Conteúdo atual (Markdown):",
            content,
          ]
    ).join("\n");

    // Tarefa "faq": só as perguntas frequentes; padrão: sugestões de SEO completas.
    const task = body.task === "faq" ? "faq" : "seo";
    let data;
    try {
      const system = task === "faq" ? (material ? MATERIAL_FAQ_SYSTEM : FAQ_SYSTEM) : material ? MATERIAL_SYSTEM : SYSTEM;
      const responseSchema = task === "faq" ? faqSchema : material ? materialSchema : schema;
      const user = material ? [...(await documentParts(apiKey, filePath)), { text: articleContext }] : articleContext;
      data = await askGemini(apiKey, models, system, user, responseSchema, 0.4);
    } catch (error) {
      if (error instanceof UserError) return json({ error: error.message }, 400);
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
      ...(material ? { title: text(data.title).slice(0, 90), headline: text(data.headline).slice(0, 120) } : {}),
      focusKeyword: text(data.focusKeyword),
      metaTitle: text(data.metaTitle).slice(0, 70),
      metaDescription: text(data.metaDescription).slice(0, 200),
      excerpt: text(data.excerpt).slice(0, 300),
      slug: slugify(text(data.slug)) || slugify(title || text(data.title)),
      contentMarkdown: text(data.contentMarkdown),
      notes: Array.isArray(data.notes) ? data.notes.map(text).filter(Boolean).slice(0, 6) : [],
    });
  } catch (error) {
    console.error(error);
    return json({ error: "Não foi possível gerar as sugestões agora." }, 500);
  }
});
