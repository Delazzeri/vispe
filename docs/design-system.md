# Design system — Vispe Capital

> Tokens definidos em `app/globals.css` via `@theme` (Tailwind v4).
> Fonte: Brand Guidelines Book — Vispe Capital, 2026 (`docs/brand/`).
> Logo e símbolo: **sempre P&B puro** (versões oficiais); dourado nunca entra no lockup da marca — é reservado para UI (botões, ícones, links, destaques).

## Cores (tokens semânticos)

```css
@theme {
  --color-bg:          #ffffff;   /* fundo base — tema claro fixo */
  --color-surface:     #f2f2f2;   /* cards, seções alternadas — cor de apoio oficial */
  --color-glass:       rgba(255, 255, 255, 0.6); /* superfícies translúcidas sobre imagem/vídeo */
  --color-border:      rgba(38, 38, 38, 0.12);
  --color-fg:          #262626;   /* texto principal — cor de apoio oficial (não preto puro) */
  --color-fg-muted:    #595959;   /* texto secundário — mesma família, mais clara, AA em branco */
  --color-brand:       #d6b256;   /* dourado institucional primário — CTAs, ícones, destaques de UI */
  --color-brand-fg:    #262626;   /* texto sobre a primária (dourado é claro demais para branco) */
  --color-brand-dark:  #9e6b15;   /* dourado escuro — hover/active de CTA, texto sobre dourado claro */
  --color-accent:      #fad643;   /* amarelo vivo — glows e micro-destaques, uso pontual */
  --color-accent-soft: #eed881;   /* dourado claro — fundos sutis, badges, hover leve */
  --color-ink:         #000000;   /* preto puro — reservado ao lockup da logo */
  --color-paper:       #ffffff;   /* branco puro — reservado ao lockup da logo */
}
```

Componentes usam apenas tokens semânticos (`bg-surface`, `text-fg-muted`), nunca hex.

**Tema:** claro fixo (sem `prefers-color-scheme` — decisão de produto, não pendência).

**Regra de contraste dourado:** `--color-brand` (#D6B256) sobre `--color-bg` (#FFFFFF) não atinge AA para texto pequeno — usar `--color-brand-dark` (#9E6B15) para texto/ícones dourados sobre fundo claro, e reservar `--color-brand` para preenchimentos sólidos (botões) com `--color-brand-fg` por cima.

## Tipografia

- Fonte única (display + texto): **Geist** (open-source, geometria grotesk próxima a interfaces de produto moderno) via `next/font/google`, `display: swap`.
- Decisão de marca: o manual da Vispe especifica Montserrat/Barlow/Gotham; por pedido explícito do time, o site institucional usa Geist como substituição moderna — aplica-se apenas a este projeto web, não sobrescreve o manual para outras peças (impressos, apresentações, social).
- Pesos: 400 (texto), 500 (destaques), 600 (subtítulos), 700 (H1/H2).
- Escala fluida com `clamp()`: H1 hero ~ `clamp(2.5rem, 6vw, 4.5rem)`, tracking levemente negativo em títulos grandes.
- Largura de leitura: parágrafos até ~65ch.

## Superfícies "vidro"

- Card de vidro (tema claro): `bg-glass backdrop-blur-xl border border-border rounded-3xl` — `--color-glass` é branco semitransparente, não escuro.
- Sombra em camadas: uma curta e nítida + uma longa e difusa, ambas discretas (o manual pede sobriedade, não profundidade dramática).
- Blur tem custo: no máximo 1 camada de `backdrop-blur` sobreposta por vez na viewport.
- Sempre testar contraste do texto sobre o vidro com o fundo real — em tema claro, texto `--color-fg` sobre `--color-glass` tende a precisar de peso maior (500+) para manter AA.

## Padrão gráfico da marca

- Ativo oficial do manual: motivo repetido de "escamas"/ondas derivado do ângulo do símbolo (ver `docs/brand/` — Termos de Uso do Padrão, pág. 032).
- Uso: decorativo e sutil — fundo de seção, textura de divisor, nunca como base de leitura de texto corrido.
- Cor: apenas `--color-ink` (preto) sobre `--color-bg`/`--color-surface`, ou monocromático sobre fundos neutros da paleta de apoio. Nunca sobre gradiente vibrante, nunca colorido.
- Nunca rotacionar fora da orientação horizontal; sem contornos ou sombras nos elementos do padrão.
- Implementar como SVG/CSS (não imagem rasterizada) para nitidez em qualquer resolução — candidato a `components/motion/` ou `components/ui/` como `<BrandPattern>`.

## Raio, espaçamento e grid

- Raios: `rounded-xl` (controles), `rounded-3xl` (cards), `rounded-full` (chips, botões pill).
- Seções: `py-24 md:py-32`; container `max-w-6xl px-6`.
- Grid de 12 colunas no desktop; empilhamento simples no mobile.

## Presets de motion (`components/motion/presets.ts`)

```ts
export const spring = {
  snappy: { type: "spring", stiffness: 400, damping: 30 },   // hover, botões
  smooth: { type: "spring", stiffness: 200, damping: 26 },   // cards, reveals
  gentle: { type: "spring", stiffness: 120, damping: 20 },   // hero, grandes blocos
} as const;

export const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.3 },
  transition: spring.smooth,
} as const;

export const stagger = 0.06; // segundos entre filhos
```

Valores são ponto de partida: ajustar no navegador até o "peso" ficar certo e atualizar aqui.

### Exceção aprovada: intro animada do Hero

O Hero (`components/sections/hero.tsx` + `hero-intro.tsx`) replica fielmente a
animação de entrada do cooldock.app, incluindo o `<h1>` com fade+translate em
stagger — isso diverge da regra geral do CLAUDE.md §8 ("o H1 do hero aparece
imediatamente", para proteger LCP). Decisão explícita do time, não descuido:
fidelidade visual à referência teve prioridade sobre a fração de LCP perdida
nesse ponto específico. Não replicar esse padrão em outras seções acima da
dobra sem a mesma aprovação.

## Componentes de motion reutilizáveis

- `<Reveal>` — fade + translateY no scroll, respeita reduced motion
- `<Stagger>` — aplica delay escalonado aos filhos
- `<Parallax speed={n}>` — deslocamento ligado ao scroll (`useScroll` + `useTransform`)
- `<Marquee direction speed pauseOnHover>` — loop CSS com conteúdo duplicado, `aria-hidden` na cópia
- `<HoverLift>` — scale 1.02 + sombra no hover com `spring.snappy`
