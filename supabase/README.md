# Supabase — blog e admin da Vispe Capital

O site estático (Hostinger) e o admin (`/admin`) falam direto com o Supabase pelo
navegador, com a chave publicável. Quem protege os dados é a RLS destas migrations:

- o público só lê artigos publicados (ou agendados com a data já passada);
- só quem tem linha em `public.profiles` (staff) cria, edita, apaga e envia capas;
- o bucket `article-images` é público para leitura e só staff escreve.

## Configurar (uma vez)

1. **Criar o projeto** em supabase.com (região São Paulo).
2. **Rodar as migrations, em ordem**, no SQL Editor (ou `supabase db push` com a CLI):
   `0001_init.sql` → `0002_storage.sql` → `0003_private_is_staff.sql` →
   `0004_articles_blog_fields.sql` → `0005_seed_articles.sql` (os 6 artigos atuais).
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

## No dia a dia

- Publicar no admin já mostra o post no site (página única `/blog/post/`, lida no navegador).
- Para o post virar HTML estático (SEO completo e prévia própria no WhatsApp/LinkedIn),
  gere o build e suba `out/` de novo.
- Tirar alguém do admin: `delete from public.profiles where id = '<uuid>';` (e, se quiser,
  apague o usuário em Authentication → Users).
