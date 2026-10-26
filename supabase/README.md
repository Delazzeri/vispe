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
   Se o modelo principal estiver sobrecarregado (erro 503), a função tenta de novo e passa
   para o reserva `GEMINI_FALLBACK_MODEL` (padrão `gemini-3.5-flash-lite`).
3. **Publicar a função:** Edge Functions → Deploy a new function → Via Editor →
   nome **`seo-assistant`** (exatamente assim) → apague o exemplo, cole todo o
   `supabase/functions/seo-assistant/index.ts` → Deploy function.
   Deixe ligada a opção de exigir JWT (Verify JWT / Enforce JWT), que é o padrão.
4. Pronto: no admin, abra um artigo com título e texto e clique em "Otimizar SEO com IA".
   No editor de materiais, o assistente lê o **arquivo do material** (PDF direto; planilha,
   Word e PowerPoint como texto) e escreve título, resumo, textos do Google, slug, descrição e
   FAQ a partir dele. Envie o arquivo antes; ZIP e planilha .xls antiga (salve como .xlsx) não são lidos. Republique a função se ela é
   anterior a isso.
   Erros da função aparecem em Edge Functions → seo-assistant → Logs.

## Materiais gratuitos no admin (arquivo privado + link que expira)

A área **Materiais** do admin publica os materiais de `/materiais` (capa, título,
resumo, descrição, arquivo). O arquivo fica num bucket **privado**; quem preenche o
formulário recebe por e-mail um link assinado que expira, gerado pela Edge Function
`material-link` e enviado pelo Apps Script da planilha.

Projeto que já tem o banco (0001–0005) — uma vez:

1. **Banco:** SQL Editor → New query → cole `supabase/migrations/0006_materials.sql` → Run.
   Depois, nova query com `supabase/migrations/0007_seed_materials.sql` → Run (os 8
   materiais atuais, publicados e sem arquivo). Projeto novo: o `setup-completo.sql`
   já inclui os dois.
2. **Segredo compartilhado:** gere uma senha longa e aleatória (ex.: no gerenciador de
   senhas, 40+ caracteres, só letras e números). Ela vai em dois lugares iguais:
   - Supabase → Edge Functions → Secrets → `MATERIAL_LINK_SECRET` = a senha.
     Opcional: `MATERIAL_LINK_DAYS` = validade do link em dias (padrão 7, máx. 30).
   - Apps Script (passo 4).
3. **Publicar a função:** Edge Functions → Deploy a new function → Via Editor → nome
   **`material-link`** → cole todo o `supabase/functions/material-link/index.ts` →
   **desligue "Verify JWT"** (quem chama é o Apps Script, sem login; a proteção é o
   segredo) → Deploy.
4. **Apps Script:** cole a versão nova de `integrations/google-sheets/Code.gs` e, em
   Configurações do projeto → Propriedades do script, adicione:
   `RESUME_FOLDER_ID` (o ID da pasta dos currículos, que antes ficava no código),
   `MATERIAL_LINK_URL` = `https://<projeto>.supabase.co/functions/v1/material-link` e
   `MATERIAL_LINK_SECRET` = a mesma senha do passo 2. Depois: Implantar → Gerenciar
   implantações → editar → **Nova versão** (autorize "conectar a serviço externo").
5. **Arquivos:** no admin → Materiais → cada material → "Enviar arquivo". Sem arquivo,
   o pedido fica na planilha com "sem arquivo no admin — enviar manualmente".

A aba `materiais` da planilha ganha as colunas "Título do material" e "Envio do link"
(link enviado, sem arquivo ou o erro), para acompanhar cada pedido.

## Versão em inglês (artigos e materiais)

Cada artigo e material pode ter uma versão em inglês para o site em `/en` (coluna `en`).
No admin, a tradução é automática (Gemini, pela função `seo-assistant`): alguns segundos
depois de mudar algo na aba Português, a aba **Inglês** é atualizada só no que mudou. O botão
"Traduzir com IA" traduz tudo de uma vez, e o automático pode ser desligado na aba Inglês.
Revise e salve. Sem tradução, a página em inglês mostra o português
com o aviso "disponível só em português" e o canonical aponta para o pt.

Projeto que já tem o banco (0001–0007) — uma vez:

1. SQL Editor → `supabase/migrations/0008_translations.sql` → Run.
2. Edge Functions → `seo-assistant` → Code → cole o `supabase/functions/seo-assistant/index.ts`
   atual → Deploy (traz o modo de tradução e o de FAQ).
3. Edge Functions → `material-link` → Code → cole o `supabase/functions/material-link/index.ts`
   atual → Deploy (manda o título em inglês para o e-mail de quem pediu pela /en).
4. Apps Script: cole o `integrations/google-sheets/Code.gs` atual → Nova versão.

Depois de traduzir, rode `pnpm release` e suba o pacote: a página em inglês vira HTML
estático com SEO próprio (canonical e hreflang nas duas versões).

## Formatos dos materiais (seletor no admin + filtro no site)

O formato de cada material (Aula, Planilha, E-book, Prompt, Checklist, Guia…) é escolhido
num seletor no editor. A lista fica em **Admin → Materiais → Formatos**: lá dá para criar
formatos novos, renomear e definir o nome em inglês e a ordem. O catálogo do site mostra um
filtro com os formatos que têm material publicado (link compartilhável: `/materiais/?formato=planilha`).

Projeto que já tem o banco (0001–0008) — uma vez: SQL Editor →
`supabase/migrations/0009_material_formats.sql` → Run. Ela cria os 6 formatos e converte o
formato dos materiais atuais ("Guia prático" vira "Guia"). Depois, `pnpm release`.

## Episódios do Equity Talks (carrossel da home)

O carrossel mostra os 15 episódios mais recentes da playlist Equity Talks do YouTube (id em
`content/episodes.ts`). O build já sai com os episódios da época; no navegador, a Edge
Function `youtube-episodes` entrega a playlist atual e o site inclui o que saiu depois, em
até ~30 minutos, sem novo release. Só entram vídeos com "EquityTalks 0XX" no fim do título;
a imagem é a thumbnail do próprio vídeo no YouTube.

Publicar (uma vez): Edge Functions → Deploy a new function → Via Editor → nome
**`youtube-episodes`** → cole todo o `supabase/functions/youtube-episodes/index.ts` →
**desligue "Verify JWT"** → Deploy. Não tem segredo. Se a função não estiver publicada, o
carrossel fica com a lista do último build.

## Landing pages (/lp/<endereço>/)

Criadas em **Admin → Landing pages** a partir de um modelo (captura de leads, vendas,
pré-lançamento, inscrição em evento, obrigado, upsell/cross-sell). Cada LP é uma lista de seções prontas com o visual do site;
no admin dá para editar textos, fotos, botões e o formulário, reordenar e acrescentar
seções. Publicada, abre na hora em `/lp/<endereço>/` (inglês em `/en/lp/<endereço>/`) e
vira página estática no próximo `pnpm release`. "Não indexar" deixa a LP fora do
Google e do sitemap (páginas só de anúncio).

Projeto que já tem o banco (0001–0009) — uma vez: SQL Editor →
`supabase/migrations/0010_landing_pages.sql` → Run e depois
`supabase/migrations/0011_landing_pages_whatsapp.sql` → Run (tabela, fotos no bucket
`lp-images` e a mensagem do WhatsApp de cada LP).

- **Formulário:** cada LP grava na aba `lp-<endereço>` da planilha, criada no primeiro
  envio (colunas: os campos da LP + UTMs + idioma + página). Precisa do
  `integrations/google-sheets/Code.gs` atual: cole no Apps Script e publique uma
  **nova versão** (Implantar → Gerenciar implantações → editar → Nova versão).
- **Inglês:** aba "Inglês" do editor, com tradução automática pela função
  `seo-assistant` (tarefa `translate-texts`): publique a versão atual de
  `supabase/functions/seo-assistant/index.ts` (Edge Functions → seo-assistant → Code).

## No dia a dia

- Publicar no admin já mostra o post no site (página única `/blog/post/`, lida no navegador).
- Para o post virar HTML estático (SEO completo e prévia própria no WhatsApp/LinkedIn),
  gere o build e suba `out/` de novo.
- Tirar alguém do admin: `delete from public.profiles where id = '<uuid>';` (e, se quiser,
  apague o usuário em Authentication → Users).

## Métricas do site no admin (Umami Cloud)

A área **Métricas** do admin (`/admin/metricas/`) mostra visitantes, visitas, páginas vistas,
taxa de rejeição, tempo por visita, quem está online, a série no tempo, páginas, origens
(canais, sites e UTM), país/estado/cidade, aparelhos e as conversões (formulários e cliques
no WhatsApp). Os números vêm do **Umami Cloud**, que conta as visitas de forma anônima e sem
cookies (por isso carrega para todos, sem depender do banner). A Edge Function
`site-analytics` lê a API do Umami com a chave guardada no Supabase e só atende staff.

1. **Conta no Umami:** crie a conta em umami.is (de preferência com um e-mail da empresa) →
   Add website → nome "Vispe Capital" e o domínio `vispecapital.com`.
2. **Website ID:** Websites → o site → Edit → copie o Website ID para
   `NEXT_PUBLIC_UMAMI_WEBSITE_ID` no `.env.local` (ver `.env.example`).
3. **Chave da API:** Settings → API keys → Create key → copie a chave.
4. **Segredos no Supabase:** Edge Functions → Secrets → `UMAMI_API_KEY` = a chave e
   `UMAMI_WEBSITE_ID` = o mesmo Website ID. (Opcional: `UMAMI_API_URL`, para um Umami
   próprio em vez do Cloud; padrão `https://api.umami.is/v1`.)
5. **Publicar a função:** Edge Functions → Deploy a new function → Via Editor → nome
   **`site-analytics`** → cole todo o `supabase/functions/site-analytics/index.ts` → Deploy.
   Deixe ligada a opção de exigir JWT (Verify JWT), que é o padrão.
6. Rode `pnpm release` e suba o pacote. As visitas começam a contar com o site no ar, só no
   domínio de produção (dev e `pnpm preview` não entram nos números).

As conversões chegam ao Umami como eventos `lead`, `registration`, `application` e `contact`,
com a origem (aba da planilha, `lp-<slug>` ou `whatsapp`) e nenhum dado do formulário.
O painel guarda cada período por 5 minutos; erros aparecem em Edge Functions → site-analytics → Logs.
