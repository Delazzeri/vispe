# Vispe Capital — Site institucional

Site institucional da Vispe Capital, construído com Next.js (App Router) + Tailwind CSS v4 + Motion, exportado como site estático para a Hostinger.

Ver [CLAUDE.md](./CLAUDE.md) para o contrato completo de arquitetura, stack e regras do projeto, e `docs/` para o manual de marca e a análise de referência visual.

## Comandos

```bash
pnpm dev          # desenvolvimento
pnpm build        # build de produção → out/ (com out/.htaccess)
pnpm preview      # serve out/ com as regras do .htaccess em http://localhost:4100
pnpm lint         # ESLint
pnpm typecheck    # tsc --noEmit
pnpm blog:seed    # regenera o seed dos artigos (supabase/migrations/0005)
pnpm release      # confere a configuração, gera o build e o .zip para a Hostinger
```

Antes de declarar qualquer tarefa concluída: `pnpm typecheck && pnpm lint && pnpm build`.

## Variáveis de ambiente

Copie `.env.example` para `.env.local` e preencha. São lidas **no build** (o site é estático): mudou, gere o build de novo.

## Publicar na Hostinger (plano Single)

A Hostinger não roda o projeto: ela só serve o site já gerado. Quem sobe é o **pacote** criado por `pnpm release`, não o repositório.

1. `pnpm release`: confere o `.env.local` (domínio, Supabase, formulários), gera o build e cria `release/vispe-site-<data>.zip`, já com o `.htaccess`.
2. hPanel → Arquivos → Gerenciador de Arquivos → `public_html`: apague o conteúdo antigo, envie o .zip e use **Extrair** ali mesmo. Depois apague o .zip do servidor.
3. Na primeira vez: ative o SSL do domínio no hPanel.

Para conferir antes de subir: `pnpm preview` serve `out/` com as mesmas regras do `.htaccess`.

Posts publicados no admin aparecem no site na hora. Para que virem página estática (prévia própria no WhatsApp/LinkedIn e indexação mais rápida), rode `pnpm release` e suba o pacote de novo.

## Originais de mídia

Fotos e artes em alta, vídeos e ícones grandes ficam em `originais/` (fora do Git e fora de `public/`, para não irem no build). O site usa só as versões otimizadas de `public/media`.

## Serviços externos

- **Supabase** (blog e admin): ver [supabase/README.md](./supabase/README.md).
- **Google Sheets** (formulários): instruções no topo de [integrations/google-sheets/Code.gs](./integrations/google-sheets/Code.gs).
