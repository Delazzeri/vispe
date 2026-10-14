# Supabase — blog e admin da Vispe Capital

O site estático (Hostinger) e o admin (`/admin`) falam direto com o Supabase pelo
navegador, com a chave publicável. Quem protege os dados é a RLS destas migrations:

- o público só lê artigos publicados (ou agendados com a data já passada);
- só quem tem linha em `public.profiles` (staff) cria, edita, apaga e envia capas;
- o bucket `article-images` é público para leitura e só staff escreve.

## Configurar (uma vez)

1. **Criar o projeto** em supabase.com (região São Paulo).
2. **Criar o banco:** SQL Editor → New query → cole todo o `supabase/setup-completo.sql`
   → Run (uma vez só). Ele junta as migrations em ordem: `0001_init` → `0002_storage` →
   `0003_private_is_staff` → `0004_articles_blog_fields` → `0005_seed_articles` (os 6
   artigos atuais). Mudou alguma migration? `pnpm supabase:setup` gera o arquivo de novo.
3. **Desligar o cadastro público:** Authentication → Sign In / Providers → desmarque
   "Allow new users to sign up". O admin não tem tela de cadastro.
4. **Criar o usuário do admin:** Authentication → Users → Add user → e-mail e senha
   (marque "Auto Confirm User").
5. **Liberar como staff** (sem isto o login entra, mas não publica). No SQL Editor:

   ```sql
   insert into public.profiles (id, full_name, role)
   select id, 'Nome da pessoa', 'admin' from auth.users where email = 'pessoa@vispe.com.br';
   ```

6. **Variáveis do site:** Project Settings → API → copie a URL do projeto e a chave
   publicável (`sb_publishable_…`) para `.env.local` (ver `.env.example`) e gere o build.
7. **Tipos (opcional):** `supabase gen types typescript --project-id <ref> > lib/supabase/types.ts`
   substitui os tipos escritos à mão.

## Assistente de SEO do admin (Gemini)

O botão "Otimizar SEO com IA" do editor chama a Edge Function `seo-assistant`
(`supabase/functions/seo-assistant/index.ts`). Ela roda no servidor do Supabase para a
chave do Gemini nunca ir para o site, e só atende quem está logado e é staff.

1. **Chave do Gemini:** em aistudio.google.com/apikey → Create API key (de preferência
   numa conta Google da empresa). Guarde a chave.
2. **Segredo no Supabase:** Edge Functions → Secrets → Add new secret:
   nome `GEMINI_API_KEY`, valor = a chave. Opcional: `GEMINI_MODEL` para trocar o modelo
   (padrão `gemini-3.8-flash`; o mais barato é `gemini-3.5-flash-lite`).
3. **Publicar a função:** Edge Functions → Deploy a new function → Via Editor →
   nome **`seo-assistant`** (exatamente assim) → apague o exemplo, cole todo o
   `supabase/functions/seo-assistant/index.ts` → Deploy function.
   Deixe ligada a opção de exigir JWT (Verify JWT / Enforce JWT), que é o padrão.
4. Pronto: no admin, abra um artigo com título e texto e clique em "Otimizar SEO com IA".
   Erros da função aparecem em Edge Functions → seo-assistant → Logs.

## No dia a dia

- Publicar no admin já mostra o post no site (página única `/blog/post/`, lida no navegador).
- Para o post virar HTML estático (SEO completo e prévia própria no WhatsApp/LinkedIn),
  gere o build e suba `out/` de novo.
- Tirar alguém do admin: `delete from public.profiles where id = '<uuid>';` (e, se quiser,
  apague o usuário em Authentication → Users).
