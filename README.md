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
```

Antes de declarar qualquer tarefa concluída: `pnpm typecheck && pnpm lint && pnpm build`.

## Variáveis de ambiente

Copie `.env.example` para `.env.local` e preencha. São lidas **no build** (o site é estático): mudou, gere o build de novo.

## Publicar na Hostinger (plano Single)

1. `pnpm build`
2. No Gerenciador de Arquivos (ou FTP), apague o conteúdo antigo de `public_html` e envie **todo o conteúdo de `out/`**, inclusive o arquivo oculto `.htaccess`.
3. Ative o SSL do domínio no painel da Hostinger.

Posts publicados no admin aparecem no site na hora. Para que virem página estática (prévia própria no WhatsApp/LinkedIn e indexação mais rápida), gere o build e suba de novo.

## Serviços externos

- **Supabase** (blog e admin): ver [supabase/README.md](./supabase/README.md).
- **Google Sheets** (formulários): instruções no topo de [integrations/google-sheets/Code.gs](./integrations/google-sheets/Code.gs).
