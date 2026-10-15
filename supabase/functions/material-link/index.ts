// Supabase Edge Function "material-link" (Deno): devolve um link de download
// temporário (assinado, expira) do arquivo de um material publicado. Quem chama
// é o Apps Script da planilha (integrations/google-sheets/Code.gs), depois que
// alguém preenche o formulário do material — o link vai por e-mail.
//
// Segurança: o bucket material-files é privado; esta função lê com a chave de
// serviço (que fica só no Supabase) e só atende quem manda o segredo
// compartilhado MATERIAL_LINK_SECRET no cabeçalho x-material-secret. O Apps
// Script guarda o mesmo segredo nas propriedades do script.
//
// Publicar (painel do Supabase): Edge Functions → Deploy a new function → Via
// Editor → nome "material-link" → cole este arquivo → DESLIGUE "Verify JWT"
// (o Apps Script não tem login; a proteção é o segredo) → Deploy.
// Segredos: MATERIAL_LINK_SECRET (obrigatório) e MATERIAL_LINK_DAYS (opcional,
// validade do link em dias; padrão 7). Ver supabase/README.md.

import { createClient } from "jsr:@supabase/supabase-js@2";

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

/** Comparação em tempo constante (não revela o segredo pelo tempo de resposta). */
function sameSecret(a: string, b: string): boolean {
  const left = new TextEncoder().encode(a);
  const right = new TextEncoder().encode(b);
  if (left.length !== right.length) return false;
  let diff = 0;
  for (let i = 0; i < left.length; i++) diff |= left[i] ^ right[i];
  return diff === 0;
}

Deno.serve(async (req) => {
  if (req.method !== "POST") return json({ error: "Método não permitido." }, 405);

  const secret = Deno.env.get("MATERIAL_LINK_SECRET");
  if (!secret) return json({ error: "Função não configurada: falta o segredo MATERIAL_LINK_SECRET." }, 500);
  if (!sameSecret(req.headers.get("x-material-secret") ?? "", secret)) return json({ error: "Não autorizado." }, 401);

  try {
    const { slug } = await req.json();
    if (typeof slug !== "string" || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) return json({ error: "Material inválido." }, 400);

    const admin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? Deno.env.get("SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } },
    );
    const { data: material, error } = await admin
      .from("materials")
      .select("title, file_path, file_name")
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle();
    if (error) throw error;
    if (!material) return json({ error: "Material não encontrado ou não publicado." }, 404);
    // Publicado sem arquivo: a planilha registra e o time envia manualmente.
    if (!material.file_path) return json({ title: material.title, url: null });

    const days = Math.min(Math.max(Number(Deno.env.get("MATERIAL_LINK_DAYS") ?? 7) || 7, 1), 30);
    const { data: signed, error: signError } = await admin.storage
      .from("material-files")
      .createSignedUrl(material.file_path, days * 24 * 60 * 60, { download: material.file_name ?? true });
    if (signError) throw signError;

    return json({ title: material.title, url: signed.signedUrl, expiresInDays: days });
  } catch (error) {
    console.error(error);
    return json({ error: "Não foi possível gerar o link agora." }, 500);
  }
});
