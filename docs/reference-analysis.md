# Análise da referência — cooldock.app → {{NOME_EMPRESA}}

Mapa da estrutura real da página de referência, traduzido para o nosso site.
Replicar o padrão e o motion; o conteúdo é sempre nosso.

## Ordem de construção

| # | Seção na referência | O que ela faz | Nossa versão | Motion |
|---|---|---|---|---|
| 0 | Base | Layout, fontes, tokens, skip link, metadata global | `app/layout.tsx`, `globals.css`, `lib/seo.ts` | — |
| 1 | Nav sticky | Logo + âncoras (Features, Widgets, Pricing, FAQ) + link externo + CTA | `Header` com âncoras das seções da home + CTA principal | Fundo ganha blur/borda após scroll; menu mobile com spring |
| 2 | Hero com cena | Imagem de paisagem de fundo + camadas de pedra (esq./dir.) em primeiro plano + mockup vivo do dock no centro + H1 curto + CTA + 4 bullets de benefício | `Hero` com cena da marca em camadas + `showcase/` (mockup HTML do nosso produto/serviço) | Parallax nas camadas (`useScroll` + `useTransform`); mockup entra com spring leve; widgets internos com microestados |
| 3 | Faixa de prêmios | Selos de reconhecimento linkados | `TrustBar` — clientes, selos, parceiros (só dados reais) | Fade escalonado; opcional marquee |
| 4 | Features em chips | H2 + parágrafo + lista longa de chips curtos + vídeo overview (poster → YouTube) + depoimento destacado | `FeatureChips` + `VideoEmbed` (lazy) + `Quote` | Chips com stagger; poster com hover scale |
| 5 | Categorias | 5 blocos (H3 + texto + "Inclui:" + fileira de miniaturas de widgets) | `CategoryBlocks` — serviços ou linhas de produto | Fileiras de miniaturas em marquee lento ou reveal horizontal |
| 6 | Customização | Parceiro destacado + H2 + texto + vídeo | `Showcase` / "Como trabalhamos" | Reveal + parallax sutil na mídia |
| 7 | Depoimentos | Grid/masonry com foto, nome, @, texto; um com screenshot | `Testimonials` (dados reais em `content/`) | Cards com stagger no scroll |
| 8 | Parede de widgets | Dezenas de miniaturas em linhas contínuas | `LogoWall` / `WorkWall` — portfólio ou peças | Marquees em CSS, direções alternadas, pausa no hover, desligado em reduced-motion |
| 9 | CTA final | Ícone + H2 + texto + botão + pilha de screenshots | `FinalCTA` | Pilha de imagens com leve rotação/offset no hover |
| 10 | Pricing | 3 planos, seletor de quantidade com preço dinâmico, preço riscado, garantia | `Pricing` — só nas LPs de produto que tiverem preço | Troca de valor com `AnimatePresence` / número animado |
| 11 | FAQ | Perguntas diretas em lista | `FAQ` + JSON-LD `FAQPage` | Abrir/fechar com altura animada via `layout` |
| 12 | Footer | Repete o mockup, colunas (links, recursos, outros apps, parceiros, contato), selo | `Footer` — colunas + links para LPs de produto | Nenhum ou mínimo |

## O que a referência faz bem em SEO (copiar o padrão)

- Title descritivo com benefício: "Produto — O que faz em uma frase".
- Meta description idêntica em meta, OG e Twitter, listando o que o produto entrega.
- OG image 1200×630 em WebP com `alt`, `width`, `height` e `type` declarados.
- Canonical explícito e `robots: index, follow, max-image-preview:large`.
- Skip link e legendas descritivas em cada mídia (texto indexável sobre o que a imagem/vídeo mostra).
- Nomes de arquivo de imagem com a largura (`-1600`, `-1000`, `-180`) → tamanhos certos para cada uso.
- Páginas secundárias para cauda longa: updates, docs, roadmap, privacidade, termos.

## Notas de interpretação

- O mockup do hero é HTML (hora, clima, apps, player são elementos reais), não vídeo. Construir em `components/showcase/`.
- Vídeos longos ficam fora da página (YouTube) com poster local; na página só entra o poster até o clique.
- A adaptação para nós: onde a referência mostra "widgets", mostramos {{serviços / produtos / cases}}.
