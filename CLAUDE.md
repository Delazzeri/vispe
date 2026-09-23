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
- Deploy: Vercel
- Gerenciador: pnpm

## 3. Comandos

```bash
pnpm dev          # desenvolvimento
pnpm build        # build de produção — deve passar sem warnings
pnpm lint         # ESLint
pnpm typecheck    # tsc --noEmit
```

Antes de declarar qualquer tarefa concluída: `pnpm typecheck && pnpm lint && pnpm build`.

## 4. Estrutura de pastas

```
app/
  (site)/                  # páginas institucionais
    page.tsx               # home
    sobre/  contato/  ...
  (lp)/produtos/[slug]/    # landing pages de produto (template único)
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

**Princípio das LPs:** uma LP de produto = um arquivo em `content/products/` + template em `(lp)/produtos/[slug]`. Seções são componentes reutilizáveis que recebem dados por props. Nenhum texto hardcoded dentro de `components/sections/`.

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