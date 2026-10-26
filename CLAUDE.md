# CLAUDE.md — Site institucional Vispe Capital

> Contrato entre planejamento e implementação. Regras aqui são obrigatórias.
> Em caso de conflito entre um pedido pontual e este arquivo, pergunte antes de agir.

@docs/reference-analysis.md
@docs/design-system.md

## 1. Contexto

- **Empresa:** Vispe Capital — ORGANIZAMOS O SEU FINANCEIRO E AUMENTAMOS O SEU LUCRO
- **Objetivo:** site institucional com foco em (1) modernidade visual e motion, (2) SEO técnico impecável, (3) base reutilizável para landing pages de produtos futuros.
- **Referência visual:** estrutura, ritmo e motion de https://cooldock.app — ver `docs/reference-analysis.md`.
- **Regra de originalidade:** replicamos *padrões* (layout, hierarquia, tipo de animação). NUNCA copiar textos, imagens, ícones, nomes ou assets do CoolDock. Todo conteúdo é da marca Vispe Capital.
- **Idioma do conteúdo:** pt-BR. Código, nomes de arquivos e commits em inglês.

## 2. Stack (não trocar sem aprovação)

- Next.js (App Router, versão estável mais recente) + React Server Components por padrão
- TypeScript `strict: true` — proibido `any`; use `unknown` + narrowing
- Tailwind CSS v4 (config CSS-first com `@theme` em `app/globals.css`)
- Motion (`motion/react`) para animações; CSS puro para loops simples (marquee)
- Ícones: `lucide-react`
- Conteúdo das LPs: arquivos tipados em `content/` (TS ou MDX) — sem CMS por enquanto
- {{i18n: next-intl, se bilíngue}}
- Deploy: Hostinger, plano Single (só arquivos estáticos, Apache/LiteSpeed, sem Node) — export estático; regras na seção 12
- Blog e admin: Supabase (Auth, Postgres com RLS, Storage) via supabase-js no navegador; formulários: Google Sheets via Apps Script
- Gerenciador: pnpm

## 3. Comandos

```bash
pnpm dev          # desenvolvimento
pnpm build        # build de produção — deve passar sem warnings
pnpm lint         # ESLint
pnpm typecheck    # tsc --noEmit
pnpm preview      # serve out/ aplicando as regras do out/.htaccess (teste local do deploy)
pnpm blog:seed    # regenera supabase/migrations/0005_seed_articles.sql a partir de content/blog.ts
pnpm materials:seed  # regenera supabase/migrations/0007_seed_materials.sql a partir de content/materials-legacy.ts
pnpm supabase:setup  # junta as migrations em supabase/setup-completo.sql (projeto novo)
pnpm release      # confere .env.local, gera o build e release/vispe-site-<data>.zip para a Hostinger
```

Antes de declarar qualquer tarefa concluída: `pnpm typecheck && pnpm lint && pnpm build`.

## 4. Estrutura de pastas

```
app/
  (site)/                  # páginas institucionais
    page.tsx               # home
    sobre/  contato/  ...
  [locale]/(lp)/lp/[slug]/ # landing pages do admin (sem cabeçalho/rodapé; ver seção 12)
  sitemap.ts  robots.ts  opengraph-image.tsx  layout.tsx  globals.css
components/
  sections/                # seções de página (Hero, FeatureGrid, Pricing, FAQ...)
  ui/                      # primitivos (Button, Card, Badge, Container...)
  motion/                  # wrappers de animação reutilizáveis (Reveal, Parallax, Marquee)
  showcase/                # mockups HTML vivos do produto (equivalente ao "dock" do hero)
content/
  site.ts                  # dados globais (nome, redes, contatos)
  products/<slug>.ts       # dados de cada LP
lib/
  seo.ts                   # helpers de metadata e JSON-LD
public/media/              # imagens otimizadas (ver regras de mídia)
docs/                      # documentação de referência (importada acima)
```

**Princípio das LPs:** as landing pages são montadas no admin (tabela `landing_pages`) a partir de seções de `components/lp/`, que recebem todo o conteúdo por props. Seções novas: tipo em `lib/lp/types.ts`, campos em `lib/lp/schema.ts` (o editor e a tradução saem daí) e componente em `components/lp/` ligado em `lp-page.tsx`. Os arquivos da home (`components/sections/`, `content/*/site.ts`) não são usados nem alterados pelas LPs.

## 5. Regras de componentes

- Server Component por padrão. `"use client"` só no menor componente que precisa de interatividade ou motion.
- Uma seção por arquivo, exportação nomeada, props tipadas com `type` (não `interface`, salvo extensão).
- Todo componente de seção aceita `id` (para âncoras da nav) e usa `<section aria-labelledby>`.
- Composição > configuração: prefira `children` e slots a dezenas de props booleanas.
- Classes Tailwind: use `cn()` (clsx + tailwind-merge). Sem valores arbitrários (`[#123456]`) — use tokens do design system.

## 6. SEO (requisito, não extra)

- Cada rota exporta `metadata` ou `generateMetadata` via helper `lib/seo.ts`: title, description, canonical, openGraph (imagem 1200×630 + alt), twitter `summary_large_image`, `robots` com `max-image-preview:large`.
- `sitemap.ts` e `robots.ts` gerados a partir de `content/` (LPs novas entram automaticamente).
- JSON-LD: `Organization` + `WebSite` no layout raiz; `Product`/`SoftwareApplication` nas LPs; `FAQPage` onde houver FAQ; `BreadcrumbList` nas páginas internas.
- Exatamente um `<h1>` por página; hierarquia de headings sem pular níveis.
- HTML semântico: `header`, `nav`, `main#main-content`, `footer`, skip link "Pular para o conteúdo".
- Toda imagem com `alt` descritivo (decorativas: `alt=""`). Mídias relevantes com `<figcaption>`.
- Links internos com `next/link`; externos com `rel="noopener"`.
- Metas de Core Web Vitals (mobile): LCP < 2.5s, CLS < 0.1, INP < 200ms. Lighthouse ≥ 95 em Performance, SEO, Acessibilidade e Boas Práticas.

## 7. Mídia

- Sempre `next/image` com `width`/`height` ou `fill` + `sizes`. Hero: `priority`.
- Formatos: AVIF/WebP. Nomear arquivo com a largura: `hero-scene-1600.webp`.
- Vídeos: nunca autoplay com som; `muted playsInline loop`, `poster` obrigatório, `preload="none"` fora da primeira dobra. Vídeos longos → embed lazy (thumbnail + clique carrega o player).
- Mockups de produto preferencialmente em **HTML/CSS vivo** (`components/showcase/`), não em vídeo — mais leve, nítido e indexável.

## 8. Motion (regras duras)

- Animar apenas `transform` e `opacity` (e `filter` com parcimônia). Nunca `width`, `height`, `top`, `left`.
- Springs como padrão (ver presets em `docs/design-system.md`). Durações fixas só para fades.
- Reveal no scroll: `whileInView` com `viewport={{ once: true, amount: 0.3 }}`.
- Respeitar `prefers-reduced-motion`: usar `useReducedMotion()` e degradar para fade simples ou nenhum movimento.
- Sem scroll-jacking. Sem animação que bloqueie leitura ou atrase o LCP (o `<h1>` do hero aparece imediatamente).
- Nada de animação de entrada no conteúdo acima da dobra que cause CLS.
- Dados "vivos" no mockup (relógio etc.): renderizar valor estático no servidor e atualizar só após o mount, para evitar hydration mismatch.

## 9. Acessibilidade

- Contraste AA mínimo, inclusive texto sobre vidro/blur.
- Foco visível em todo elemento interativo (`focus-visible:ring`).
- Navegação completa por teclado (menu mobile, FAQ, seletores de plano).
- FAQ com `<details>/<summary>` ou padrão disclosure acessível.

## 10. Fluxo de trabalho

1. **Planejar antes de codar:** para cada tarefa, use plan mode, liste arquivos a criar/alterar e aguarde aprovação.
2. **Uma seção por vez**, na ordem de `docs/reference-analysis.md`. Não avance sem validação visual.
3. Ao terminar uma seção: rodar checks (seção 3), descrever o que foi feito e o que falta em até 5 linhas.
4. Commits pequenos, Conventional Commits em inglês (`feat(hero): add parallax scene layers`).
5. Não instalar dependências novas sem justificar e pedir aprovação.
6. Placeholders `{{...}}` e textos provisórios marcados com `// TODO(content):` — nunca inventar dados da empresa (números, clientes, depoimentos, prêmios).

## 11. Não fazer

- Não copiar assets, textos ou marca do CoolDock.
- Não usar `localStorage` para nada essencial ao conteúdo.
- Não adicionar bibliotecas de animação além de Motion sem aprovação (GSAP só se um caso concreto exigir).
- Não criar páginas sem metadata.
- Não usar `"use client"` em layouts ou páginas inteiras.
## 12. Hospedagem estática (Hostinger Single) — regras do projeto

O site é gerado com `output: 'export'` em `out/` e sobe no `public_html`. Não há servidor Node em produção.

- `next.config.ts`: `output: 'export'`, `trailingSlash: true`, imagens com o loader de `lib/image-loader.ts` (escolhe a versão por largura já gerada em `public/`, ver `scripts/image-manifest.mjs`). Imagem nova grande → gerar as larguras com sharp, nomes `-<largura>`.
- **Proibido:** Server Actions, proxy/middleware, `rewrites`/`redirects` do next.config, intercepting routes, ISR/`revalidate`, `cookies()`/`headers()`, rota dinâmica sem `generateStaticParams` (+ `dynamicParams = false`).
- Route Handlers só `GET` com `export const dynamic = "force-static"` (imagens OG, sitemap, robots). Arquivos gerados por rota levam extensão no nome da pasta (`og.png/route.tsx`).
- Idiomas e URLs públicas ficam no `out/.htaccess`, gerado no build por `scripts/generate-htaccess.mjs` a partir de `i18n/routing.ts` (pt na raiz, inglês em `/en` com caminhos traduzidos, redirecionamento pelo idioma do navegador, cookie `vispe_lang` do seletor vence). Página nova: só registrar em `routing.pathnames`.
- Dados: tudo pelo navegador. Blog/admin via supabase-js com a chave publicável; **a segurança real é a RLS** (`supabase/migrations`), nunca só o front. Formulários: `lib/forms/*` validam no navegador e enviam para o Apps Script (`integrations/google-sheets/Code.gs`), que valida de novo.
- Blog híbrido: `lib/blog/source.ts` lê os publicados no build (páginas estáticas com SEO completo); post publicado depois do build abre por `/blog/post/` (o `.htaccess` manda para lá) até o próximo build. Slug `post` é reservado.
- Materiais gratuitos seguem o mesmo modelo: `lib/materials/source.ts` no build, `/materiais/item/` para os publicados depois (slug `item` reservado). O arquivo fica no bucket privado `material-files`; o download só sai por e-mail, com link que expira gerado pela Edge Function `material-link` (chamada pelo Apps Script com segredo compartilhado). O público não tem permissão na coluna `file_path`.
- Formatos dos materiais: tabela `material_formats` (0009), cadastrada no admin (`/admin/materiais/formatos/`); `materials.format` aponta para o slug e `materials.type` é só espelho do nome em pt. O catálogo filtra por formato (`?formato=`), com os nomes de `format_info` (pt/en).
- Conteúdo do admin em inglês: coluna `en` (jsonb) em articles/materials; `lib/blog/localize.ts` e `lib/materials/localize.ts` trocam para o inglês em /en quando há tradução (senão, português + aviso e canonical pt). Componentes recebem o item já localizado (`contentLocale` diz o idioma real do texto).
- Episódios do Equity Talks (carrossel da home): playlist do YouTube lida no build (`lib/episodes/youtube.ts`, feed público, derruba o build se falhar) e atualizada no navegador pela Edge Function `youtube-episodes`. Thumbnails vêm do `i.ytimg.com`; nada de imagem local de episódio.
- Landing pages: tabela `landing_pages` (0010, 0011) e bucket `lp-images`; `lib/lp/source.ts` no build, `/lp/pagina/` para as publicadas depois (slug `pagina` reservado). Ficam em `app/[locale]/(lp)` sem cabeçalho e rodapé (esses estão em `(site)/layout.tsx`); WhatsApp com a mensagem de cada LP. Formulário de cada LP → aba `lp-<slug>` (colunas ligadas ao id do campo pela nota do cabeçalho). Inglês em `landing_pages.en` (textos por seção + `source` para saber o que mudou), traduzido pela tarefa `translate-texts` do `seo-assistant`.
- Anúncios (Meta Pixel, LinkedIn Insight Tag, Google Ads/GA4): `lib/tracking/` + `components/tracking/trackers.tsx`, só depois do consentimento do banner (`lib/consent.ts`), IDs no `.env.local` (vazio = desligado). Conversões saem de `submitToSheet` (formulários) e dos cliques em links do WhatsApp; nada de dado de formulário nos pixels. Conversions API da Meta pelo Apps Script, com hash e o mesmo event_id. Guia: `docs/marketing-tracking.md`. Ferramenta nova → atualizar `content/*/privacy.ts`.
- Admin em `/admin` (fora de `[locale]`, root layout próprio, `noindex`): rotas estáticas, ids por query string (`/admin/editor/?id=`).
- Publicar: `pnpm release` (confere a configuração, gera `out/` + `.htaccess` e o .zip); conferir com `pnpm preview`. Originais de mídia ficam em `originais/` (fora de `public/` e do Git).
