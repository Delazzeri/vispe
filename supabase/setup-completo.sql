-- Configuração completa do banco do site da Vispe Capital (gerado por
-- scripts/supabase-setup-sql.mjs — não editar à mão).
-- Uso: projeto NOVO → SQL Editor → New query → colar tudo → Run. Rodar uma vez só.
-- Contém, em ordem: 0001_init.sql, 0002_storage.sql, 0003_private_is_staff.sql, 0004_articles_blog_fields.sql, 0005_seed_articles.sql, 0006_materials.sql, 0007_seed_materials.sql, 0008_translations.sql, 0009_material_formats.sql, 0010_landing_pages.sql, 0011_landing_pages_whatsapp.sql, 0012_popups.sql.

-- ═══ 0001_init.sql ═══

-- Vispe Capital — schema do blog.
-- Tabelas: articles (conteúdo) + profiles (quem pode publicar).

-- ─────────────────────────────────────────────────────────────
-- articles
-- ─────────────────────────────────────────────────────────────
create table public.articles (
  id               uuid primary key default gen_random_uuid(),
  slug             text unique not null,
  title            text not null,
  excerpt          text not null default '',
  content_md       text not null default '',          -- corpo em Markdown (renderizado no site)
  content_json     jsonb,                              -- documento do Tiptap (para reeditar)
  cover_image_url  text,
  cover_image_alt  text,                               -- alt descritivo da capa (SEO/a11y)
  category         text not null default 'Gestão financeira',
  author           text not null default 'Vispe Capital',
  meta_title       text,
  meta_description text,
  status           text not null default 'draft'
                     check (status in ('draft', 'scheduled', 'published')),
  published_at     timestamptz,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

comment on column public.articles.content_md is 'Markdown do corpo — fonte da verdade para renderizar no site.';
comment on column public.articles.content_json is 'Doc ProseMirror/Tiptap — usado só para reabrir no editor.';
comment on column public.articles.published_at is 'Quando o artigo fica/ficou público. Futuro = agendado.';

create index articles_status_published_at_idx
  on public.articles (status, published_at desc);

-- ─────────────────────────────────────────────────────────────
-- profiles — 1:1 com auth.users. Quem tem linha aqui é "staff".
-- Não há trigger de criação automática: o profile só é inserido à mão ao
-- promover alguém (ver supabase/README.md). Assim, mesmo que o signup
-- público fosse religado por engano, um usuário novo não vira staff.
-- ─────────────────────────────────────────────────────────────
create table public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  full_name  text,
  role       text not null default 'editor' check (role in ('admin', 'editor')),
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────
-- triggers
-- ─────────────────────────────────────────────────────────────
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger articles_touch_updated_at
  before update on public.articles
  for each row execute function public.touch_updated_at();

-- ─────────────────────────────────────────────────────────────
-- helper: o usuário atual é staff?
-- ─────────────────────────────────────────────────────────────
create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.profiles where id = auth.uid());
$$;

revoke execute on function public.is_staff() from public, anon;
grant execute on function public.is_staff() to authenticated;

-- ─────────────────────────────────────────────────────────────
-- RLS
-- ─────────────────────────────────────────────────────────────
alter table public.articles enable row level security;
alter table public.profiles enable row level security;

-- Leitura pública: publicado ou agendado, com a data já passada (um agendado
-- vira público sozinho quando published_at chega).
create policy articles_public_read
  on public.articles for select
  to anon, authenticated
  using (
    status in ('published', 'scheduled')
    and published_at is not null
    and published_at <= now()
  );

-- Staff lê tudo (rascunhos, agendados).
create policy articles_staff_read
  on public.articles for select
  to authenticated
  using (public.is_staff());

-- Staff cria / edita / apaga.
create policy articles_staff_insert
  on public.articles for insert
  to authenticated
  with check (public.is_staff());

create policy articles_staff_update
  on public.articles for update
  to authenticated
  using (public.is_staff())
  with check (public.is_staff());

create policy articles_staff_delete
  on public.articles for delete
  to authenticated
  using (public.is_staff());

-- Cada um lê o próprio profile.
create policy profiles_self_read
  on public.profiles for select
  to authenticated
  using (id = (select auth.uid()));

-- ═══ 0002_storage.sql ═══

-- Bucket das imagens de capa dos artigos.
-- Público: as imagens são servidas pela URL pública do Storage, sem policy de
-- select (que permitiria listar o bucket inteiro). Escrita só para staff.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'article-images',
  'article-images',
  true,
  3145728, -- 3 MB
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do nothing;

create policy "article-images staff insert"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'article-images' and public.is_staff());

create policy "article-images staff update"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'article-images' and public.is_staff())
  with check (bucket_id = 'article-images' and public.is_staff());

create policy "article-images staff delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'article-images' and public.is_staff());

-- ═══ 0003_private_is_staff.sql ═══

-- Move is_staff() para um schema fora da API (não exposto em /rest/v1/rpc).
-- As policies passam a usar private.is_staff(); a função em public é removida.

create schema if not exists private;
grant usage on schema private to authenticated;

create or replace function private.is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.profiles where id = (select auth.uid()));
$$;

revoke execute on function private.is_staff() from public, anon;
grant execute on function private.is_staff() to authenticated;

-- articles
alter policy articles_staff_read on public.articles using (private.is_staff());
alter policy articles_staff_insert on public.articles with check (private.is_staff());
alter policy articles_staff_update on public.articles
  using (private.is_staff()) with check (private.is_staff());
alter policy articles_staff_delete on public.articles using (private.is_staff());

-- storage
alter policy "article-images staff insert" on storage.objects
  with check (bucket_id = 'article-images' and private.is_staff());
alter policy "article-images staff update" on storage.objects
  using (bucket_id = 'article-images' and private.is_staff())
  with check (bucket_id = 'article-images' and private.is_staff());
alter policy "article-images staff delete" on storage.objects
  using (bucket_id = 'article-images' and private.is_staff());

drop function public.is_staff();

-- ═══ 0004_articles_blog_fields.sql ═══

-- Campos que o blog do site usa e o schema inicial não tinha.
--   tags: serviços relacionados (nomes dos pilares em pt-BR); definem em quais
--         filtros do blog (Organização, Margem, Crescimento) o artigo aparece.
--   faq:  perguntas frequentes do fim do artigo ([{ "question", "answer" }]),
--         também publicadas como JSON-LD FAQPage.
-- E uma regra de slug: só minúsculas, números e hífens, e "post" é reservado
-- (é a página que abre os artigos publicados depois do último build).

alter table public.articles
  add column tags text[] not null default '{}',
  add column faq jsonb;

comment on column public.articles.tags is 'Serviços relacionados (pilares em pt-BR): filtros do blog.';
comment on column public.articles.faq is 'Perguntas frequentes: [{"question": "...", "answer": "..."}].';

alter table public.articles
  add constraint articles_faq_is_array check (faq is null or jsonb_typeof(faq) = 'array'),
  add constraint articles_slug_format check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and slug <> 'post');

-- ═══ 0005_seed_articles.sql ═══

-- Gerado por scripts/blog-to-sql.mjs a partir de content/blog.ts — não editar à mão.
-- Os 6 artigos que já estavam no site, como publicados.

insert into public.articles
  (slug, title, excerpt, content_md, cover_image_url, cover_image_alt, category, author,
   meta_title, meta_description, status, published_at, tags, faq)
values
(
  $vispe$efeito-nintendo-ativos-intangiveis-valuation$vispe$,
  $vispe$O Efeito Nintendo: como a gestão de ativos intangíveis eleva o valuation da sua empresa$vispe$,
  $vispe$A estratégia da gigante dos games revela como proteger margens, blindar a propriedade intelectual e construir valor de mercado sustentável no longo prazo.$vispe$,
  $vispe$No mercado B2B e no ecossistema de investimentos, poucas empresas demonstram tanta resiliência financeira quanto a **Nintendo**. Enquanto concorrentes diretos enfrentam ciclos severos de depreciação de hardware e dependência de subsídios cruzados, a companhia japonesa mantém margens operacionais invejáveis e uma posição de caixa líquido extraordinária. O segredo dessa perenidade não está apenas na inovação de produto, mas na gestão milimétrica de seus **ativos intangíveis** e do seu **Valuation**.

Ao longo das últimas décadas, a Nintendo transformou suas propriedades intelectuais (IPs), marcas registradas e patentes nos principais direcionadores de valor do seu balanço patrimonial. Quando uma organização consegue desassociar a sua precificação do custo direto de produção ou das oscilações de commodities e insumos, ela atinge o ápice da diferenciação estratégica, o verdadeiro propulsor do valor da marca.

## A anatomia dos intangíveis: o que realmente constrói valor?

No ecossistema corporativo tradicional, gestores frequentemente cometem o erro de focar excessivamente no patrimônio líquido tangível (máquinas, imóveis, estoques e frota). Contudo, na economia moderna, a participação dos **ativos intangíveis** no valuation total de grandes empresas supera os 80%.

A Nintendo exemplifica como a governança sobre ativos não materiais blinda a empresa contra flutuações de mercado por meio de quatro pilares essenciais:

1. **Poder de Precificação (Pricing Power):** A recusa histórica em realizar descontos agressivos em seus títulos principais preserva a percepção de valor e garante margens brutas elevadas de forma consistente.
2. **Moat Competitivo (Barreira de Entrada):** A proteção rigorosa de suas marcas e patentes impede que concorrentes repliquem suas dinâmicas de consumo ou usufruam da sua reputação.
3. **Previsibilidade de Fluxo de Caixa:** Personagens e franquias consolidadas geram receitas recorrentes não apenas via produtos diretos, mas por meio de licenciamento, parques temáticos e produções audiovisuais.
4. **Governança de Marcas:** O rigor com que a empresa gerencia a exposição e a qualidade de seus ativos evita a diluição do valor da marca ao longo do tempo.

## O impacto direto no valuation de médias e grandes empresas

Para CEOs, CFOs e Founders de empresas em crescimento, o modelo da Nintendo traz uma lição crucial: **o valor real de um negócio não se resume ao múltiplo do EBITDA atual, mas à capacidade de perpetuar e proteger a geração de caixa futuro.**

Ao realizar uma avaliação corporativa, investidores e compradores estratégicos precificam rigorosamente a sustentabilidade dos ativos intangíveis. Empresas que possuem marca forte, processos proprietários, contratos de longo prazo e propriedade intelectual bem estruturada alcançam:

- **Múltiplos de transação expressivamente superiores** em rodadas de captação ou [processos de M&A](/#equity);
- **Menor custo de capital,** reduzindo a percepção de risco por parte dos credores e investidores;
- **Proteção contra volatilidades do setor,** garantindo resiliência de caixa mesmo sob pressão macroeconômica.

Se a sua empresa depende exclusivamente da disputa por preço ou da alocação de ativos físicos para crescer, seu valuation está vulnerável e subtraído da sua real capacidade de mercado.

## Descubra o real valor da sua empresa com a Vispe Capital

Mapear, precificar e maximizar os ativos tangíveis e intangíveis é o primeiro passo para garantir a longevidade do negócio e preparar a empresa para captar recursos, atrair sócios ou realizar transações estratégicas.

A **Vispe Capital** desenvolve estudos profundos de [Valuation de Precisão](/#servicos), alinhando metodologia financeira de ponta (Fluxo de Caixa Descontado, Múltiplos de Mercado e Avaliação de Intangíveis) às dinâmicas reais do seu setor.

> Sua empresa está pronta para [descobrir e expandir seu valor de mercado](/contato)?$vispe$,
  $vispe$/media/blog/nintendo-739.webp$vispe$,
  $vispe$Fachada da loja Nintendo Tokyo com o logotipo da Nintendo$vispe$,
  $vispe$Valuation$vispe$,
  $vispe$Vispe Capital$vispe$,
  $vispe$Efeito Nintendo: intangíveis que elevam o valuation$vispe$,
  $vispe$A estratégia da gigante dos games revela como proteger margens, blindar a propriedade intelectual e construir valor de mercado sustentável no longo prazo.$vispe$,
  'published',
  $vispe$2026-10-07T12:00:00-03:00$vispe$::timestamptz,
  array[$vispe$Valuation$vispe$]::text[],
  null
),
(
  $vispe$licao-nokia-governanca-controladoria-financeira$vispe$,
  $vispe$A lição de R$ 1,5 bilhão da Nokia: como a falta de governança e processos financeiros destrói empresas gigantes$vispe$,
  $vispe$Uma análise crítica sobre como a cegueira operacional, a falta de visibilidade sobre margens e a ausência de uma controladoria estratégica minaram o líder mundial da tecnologia.$vispe$,
  $vispe$Durante mais de uma década, a marca **Nokia** foi sinônimo incontestável de liderança global em telecomunicações e dispositivos móveis. Em seu pico de mercado, a gigante finlandesa detinha mais de 40% de participação de mercado global e gerava bilhões de Euros em caixa livre. No entanto, o colapso vertiginoso que culminou na venda da sua divisão de celulares por uma fração do seu valor histórico não foi causado apenas pela ascensão do iPhone ou do ecossistema Android.

Sob a ótica de M&A e [turnaround financeiro](/#equity), a queda da Nokia foi provocada por falhas profundas de **visibilidade de custos, rigidez operacional e ausência de uma controladoria financeira estratégica**. Quando os números de margem começam a ser mascarados por eficiências passadas, o conselho e a diretoria perdem o termômetro do negócio: um erro fatal para empresas de qualquer porte.

## A anatomia do colapso: o que os demonstrativos não mostravam

Enquanto a receita consolidada da Nokia ainda impressionava os analistas de mercado nos anos 2000, a estrutura interna de custos e a margem por unidade operacional já apresentavam sérios sinais de degradação.

Uma análise minuciosa da estratégia da Nokia revela três erros graves de gestão financeira e operacional:

1. **Ilusão do Volume vs. Margem de Contribuição:** A empresa focava em manter o volume de vendas global por meio de aparelhos de baixa margem em mercados emergentes, camuflando a erosão acelerada do EBITDA nos segmentos premium.
2. **Desconexão do DRE Gerencial:** A alocação de recursos em P&D (Pesquisa e Desenvolvimento) era bilionária, porém sem KPIs claros de retorno sobre o capital investido (ROIC). Bilhões de Euros foram queimados em software proprietário sem aderência de mercado.
3. **Ausência de Indicadores Antecedentes de Caixa:** O ciclo de conversão de caixa (CCC) da companhia se deteriorou à medida que estoques de componentes obsoletos se acumulavam nos centros de distribuição mundiais, destruindo o capital de giro.

## Do erro da gigante à realidade das médias e grandes empresas

No ecossistema corporativo médio e grande, a “Síndrome de Nokia” acontece com frequência assustadora. Empresas em fase de crescimento acelerado frequentemente negligenciam a [Controladoria Financeira](/#servicos) e a figura do [CFO as Service](/#faq), acreditando que o aumento do faturamento corrige qualquer desalinhamento interno.

Quando a governança de caixa falha, os sintomas surgem de forma silenciosa:

- Incapacidade de identificar a lucratividade real por produto, cliente ou canal;
- Descasamento entre o faturamento contábil e a liquidez real na conta bancária;
- Modelos orçamentários estáticos que impedem pivotagens estratégicas rápidas;
- Aumento da dependência de linhas de crédito de curto prazo para honrar capital de giro.

A Nokia demonstrou que o volume de caixa acumulado no passado não garante sobrevivência se os processos de gestão financeira do presente não forem ágeis, transparentes e orientados à tomada de decisão.

## Transforme a gestão do seu caixa com a Vispe Capital

Ter controle absoluto sobre DRE gerencial, margens de contribuição, [fluxo de caixa projetado](/#fin) e capital de giro é a diferença entre liderar o mercado ou ser engolido por ele.

A **Vispe Capital** oferece soluções completas de **Controladoria Financeira e CFO as Service**, estruturando governança de dados, relatórios executivos para conselho e [otimização de margens operacionais](/blog/efeito-nintendo-ativos-intangiveis-valuation) para médias e grandes empresas.

> Sua empresa possui [total visibilidade sobre as margens](/contato) e a geração real de caixa do seu negócio?$vispe$,
  $vispe$/media/blog/nokia-1280.webp$vispe$,
  $vispe$Entrada do Nokia Campus com o logotipo da empresa$vispe$,
  $vispe$Controladoria$vispe$,
  $vispe$Vispe Capital$vispe$,
  $vispe$Lição da Nokia: governança e controladoria financeira$vispe$,
  $vispe$Uma análise crítica sobre como a cegueira operacional, a falta de visibilidade sobre margens e a ausência de uma controladoria estratégica minaram o líder mundial da tecnologia.$vispe$,
  'published',
  $vispe$2026-10-07T12:00:00-03:00$vispe$::timestamptz,
  array[$vispe$Gestão Financeira$vispe$, $vispe$Turnaround Financeiro$vispe$]::text[],
  null
),
(
  $vispe$planejamento-tributario-estrategico-margem$vispe$,
  $vispe$O mito da eficiência operacional: por que cortar custos não salva empresas sem planejamento tributário estratégico$vispe$,
  $vispe$A recente onda de consolidações e reestruturações corporativas revela que a verdadeira blindagem de margem está na inteligência fiscal, não na tesoura operacional.$vispe$,
  $vispe$Noticiários financeiros como o InfoMoney e o Valor Econômico revelam um movimento claro no ecossistema corporativo brasileiro: enquanto o volume total de transações de M&A e reestruturações movimenta centenas de bilhões de reais, o número absoluto de operações diminuiu. O mercado tornou-se mais seletivo. Em um cenário de juros elevados e margens sob forte pressão, empresas capitalizadas e fundos estão adquirindo operações a múltiplos descontados, enquanto companhias com caixa estrangulado lutam para manter a liquidez diária.

Diante do aperto nas margens, a reação natural da maioria dos CEOs e diretores executivos é cortar despesas operacionais (OPEX): renegociar contratos com fornecedores, congelar contratações e enxugar estruturas de marketing.

Contudo, na realidade fiscal do Brasil, existe um ralo financeiro silencioso e expressivamente maior que costuma ser negligenciado nos comitês executivos: **a ineficiência tributária**.

## A assimetria tributária: o ralo oculto do DRE

No ambiente B2B, o impacto da carga tributária sobre o resultado operacional frequentemente supera o custo total da folha de pagamento ou da infraestrutura logística. Quando uma média ou grande empresa opera sob um modelo tributário desalinhado com sua real dinâmica de negócios, ela gera uma perda invisível de caixa mês a mês.

Existem três gargalos recorrentes que drenam a liquidez e corroem o valuation das empresas:

1. **Acúmulo de Créditos Tributários Inaproveitados:** Empresas industriais e distribuidoras frequentemente acumulam saldos credores de PIS/COFINS e ICMS sem um plano sistemático de ressarcimento ou compensação, transformando capital de giro líquido em patrimônio ilíquido e sem rentabilidade.
2. **Classificação Fiscal Incorreta e Segregação de Atividades:** A ausência de um planejamento tributário preventivo impede o uso de regimes mistos e incentivos fiscais regionais ou setoriais totalmente legais, que poderiam reduzir drasticamente a alíquota efetiva sobre o faturamento.
3. **Passivos Fiscais Contingentes:** Falhas no cumprimento de obrigações acessórias geram autuações que, além de comprometerem a certidão negativa de débitos (CND), destroem o valor da empresa em processos de [Due Diligence](/#faq) ou [captação de recursos](/#equity) junto a bancos.

## Como o planejamento tributário transforma a margem EBITDA

Enquanto a redução de custos operacionais possui um limite físico (sob pena de comprometer a entrega e a qualidade do produto), a otimização fiscal atua diretamente no topo e no meio do DRE, convertendo impostos indevidamente pagos em geração imediata de caixa livre.

Um planejamento tributário estratégico estruturado permite:

- **Recuperação de Indébitos:** Identificação e compensação de tributos pagos a maior nos últimos cinco anos, injetando caixa imediato na operação sem necessidade de endividamento bancário.
- **Readequação da Estrutura Societária e Operacional:** Reorganização de holdings, filiais e centros de distribuição para capturar incentivos fiscais e reduzir o custo logístico-tributário total.
- **Aumento do Valuation e do Atrativo para Investidores:** Empresas com compliance fiscal rigoroso e planejamento tributário ativo obtêm melhores classificações de risco (rating), reduzindo o custo de capital e elevando o [múltiplo de EBITDA](/blog/efeito-nintendo-ativos-intangiveis-valuation) em eventuais [negociações de M&A](/blog/ma-ibm-red-hat-sinergia-multiplos).

## Maximize a liquidez da sua empresa com a Vispe Capital

Cortar despesas essenciais pode sufocar o crescimento da sua empresa; otimizar a carga tributária, por outro lado, expande as margens e protege o caixa operacional sem impactar a rotina do negócio.

A **Vispe Capital** conta com uma equipe especializada em [Planejamento Tributário Corporativo](/#servicos) e Engenharia Fiscal, combinando auditoria diagnóstica, recuperação de créditos e reestruturação tributária para médias e grandes empresas.

> Sua empresa está [deixando dinheiro na mesa](/contato) por falta de eficiência fiscal?$vispe$,
  $vispe$/media/blog/eficiencia-tributaria-739.webp$vispe$,
  $vispe$Equipe reunida em uma mesa de trabalho analisando gráficos financeiros em um notebook$vispe$,
  $vispe$Tributário$vispe$,
  $vispe$Vispe Capital$vispe$,
  $vispe$Cortar custos não basta: planejamento tributário$vispe$,
  $vispe$A recente onda de consolidações e reestruturações corporativas revela que a verdadeira blindagem de margem está na inteligência fiscal, não na tesoura operacional.$vispe$,
  'published',
  $vispe$2026-10-07T12:00:00-03:00$vispe$::timestamptz,
  array[$vispe$Planejamento Tributário$vispe$]::text[],
  null
),
(
  $vispe$ma-ibm-red-hat-sinergia-multiplos$vispe$,
  $vispe$M&A no setor de TI: o que a maior aquisição da história da IBM ensina sobre incorporação de múltiplos$vispe$,
  $vispe$Entenda como a compra da Red Hat por US$ 34 bilhões exemplifica a estratégia de M&A focada em sinergia, diversificação de receita e consolidação de mercado.$vispe$,
  $vispe$Em 2019, a IBM concluiu a aquisição da Red Hat por impressionantes **US$ 34 bilhões**, o maior negócio da história da empresa e uma das maiores transações de tecnologia de todos os tempos. Na época, a IBM enfrentava uma estagnação em seus negócios tradicionais de infraestrutura e serviços de TI. A compra não foi apenas um movimento de expansão, mas uma virada estratégica deliberada para liderar o mercado de nuvem híbrida e software corporativo de margem alta.

O grande trunfo dessa transação esteve na capacidade da IBM de enxergar o valor de sinergia: ao integrar o portfólio de código aberto da Red Hat à sua massiva base global de clientes corporativos, a Big Blue conseguiu acelerar a transformação do seu próprio modelo de negócios. Para empresários, founders e diretores de PMEs e empresas de médio porte, a estratégia de [M&A (Fusões e Aquisições)](/#equity) da IBM traz lições valiosas sobre como preparar uma empresa para a venda ou como crescer via aquisições estratégicas.

## Lições críticas do caso IBM-Red Hat para o mercado de M&A

O sucesso dessa transação bilionária evidencia pilares fundamentais que determinam o valor de um negócio em qualquer negociação de M&A:

- **Sinergia Operacional e Comercial:** Uma aquisição estratégica não busca apenas somar o faturamento das duas empresas. O comprador busca multiplicar resultados ao cruzar bases de clientes, integrar canais de distribuição e otimizar custos operacionais.
- **Transição para Modelos de Receita Recorrente:** A Red Hat trouxe para a IBM uma receita previsível via assinaturas (SaaS/Subscription), reduzindo a volatilidade das vendas pontuais de hardware e consultoria. Negócios com alta receita recorrente alcançam [múltiplos de valuation](/blog/efeito-nintendo-ativos-intangiveis-valuation) expressivamente superiores.
- **Preservação da Cultura e Autonomia:** A IBM manteve a Red Hat operando como uma unidade independente para preservar sua neutralidade, cultura de inovação e confiança da comunidade de código aberto, protegendo o ativo mais valioso que havia acabado de comprar.
- **Preparo do Sell-Side para a Due Diligence:** A Red Hat só pôde capturar um prêmio de 63% sobre o valor de suas ações na época porque possuía governança impecável, contratos de IP (propriedade intelectual) blindados e contabilidade transparente.

## Como aplicar essa estratégia na preparação do seu negócio

Seja para atrair um comprador estratégico, um fundo de Private Equity, ou para realizar uma aquisição e consolidar seu setor, a preparação antecede a negociação em meses, ou até anos.

1. **Identifique sua Tese de Sinergia:** Mapeie quem seriam os compradores estratégicos da sua empresa e o que você possui que eles não conseguem construir rapidamente (tecnologia, canal de vendas, marca ou carteira B2B).
2. **Organize a Governança e o Data Room:** Processos de M&A falham com frequência na etapa de [auditoria (Due Diligence)](/#faq). Tenha DREs auditáveis, contratos sociais atualizados e [contingências tributárias](/blog/planejamento-tributario-estrategico-margem)/trabalhistas sob controle.
3. **Mantenha a Operação Forte Durante a Negociação:** O processo de venda consome energia da gestão. A operação não pode desacelerar enquanto a transação é negociada, sob pena de redução do valuation final.

## Prepare sua empresa para a transação mais importante da sua história

Uma transação de M&A bem-sucedida requer estratégia, [valuation preciso](/#servicos) e assessoria especializada na condução das negociações. Seja para vender seu negócio pelo valor máximo de mercado ou para estruturar uma tese de aquisição e expansão, a **Vispe Capital** apoia empresários e executivos em todas as etapas do processo.

Nossa equipe conduz desde o [diagnóstico de Readiness](/contato) (prontidão para negociação) e a busca de investidores estratégicos até a estruturação do Deal e encerramento do contrato.$vispe$,
  $vispe$/media/blog/ibm-1600.webp$vispe$,
  $vispe$Logotipo da IBM na fachada de um prédio$vispe$,
  $vispe$M&A$vispe$,
  $vispe$Vispe Capital$vispe$,
  $vispe$M&A em TI: as lições da compra da Red Hat pela IBM$vispe$,
  $vispe$Entenda como a compra da Red Hat por US$ 34 bilhões exemplifica a estratégia de M&A focada em sinergia, diversificação de receita e consolidação de mercado.$vispe$,
  'published',
  $vispe$2026-10-07T12:00:00-03:00$vispe$::timestamptz,
  array[$vispe$Fusões e Aquisições$vispe$, $vispe$Due Diligence$vispe$]::text[],
  null
),
(
  $vispe$netflix-controladoria-financeira-fluxo-de-caixa$vispe$,
  $vispe$A lição de R$ 3 mapeada pela Netflix: como a controladoria financeira evita a morte por “sangramento curto”$vispe$,
  $vispe$Entenda como a migração de modelo de negócios exige uma gestão rigorosa de margem e fluxo de caixa para transformar o crescimento em lucro líquido real.$vispe$,
  $vispe$A trajetória da **Netflix** é amplamente celebrada como o maior exemplo de disrupção digital do século XXI. No entanto, por trás da transição bem-sucedida do aluguel de DVDs para o streaming e, posteriormente, para a produção de conteúdo original, existe uma história menos contada: a constante batalha da empresa com o fluxo de caixa operacional durante sua fase de maior expansão.

Entre 2015 e 2019, enquanto o número de assinantes globais disparava, a Netflix operava com fluxo de caixa livre negativo em bilhões de dólares. O motivo? A necessidade de pagar adiantado pela produção de filmes e séries, enquanto a receita de assinaturas entrava em parcelas mensais diluídas. A empresa só conseguiu sobreviver a essa lacuna temporal e se tornar uma geradora de caixa sustentável porque estruturou uma engenharia financeira cirúrgica, acompanhando de perto o custo de aquisição de clientes (CAC), a margem de contribuição por usuário e o burn rate.

Para pequenas e médias empresas (PMEs) em fase de crescimento ou mudança de modelo de negócios, o caso da Netflix traz um alerta vital: **faturamento e crescimento de receita não significam liquidez**. Sem uma controladoria financeira ativa, a expansão acelerada pode esgotar o caixa do negócio antes que o retorno do investimento se materialize.

## Os 3 erros de controle financeiro que matam empresas em expansão

A falta de visibilidade sobre os números internos é a principal causa de mortalidade corporativa no Brasil. Quando uma empresa decide acelerar vendas ou mudar seu portfólio de produtos/serviços sem o suporte do [CFO as a Service](/#faq) ou de uma [controladoria estruturada](/#servicos), ela costuma tropeçar em três gargalos críticos:

1. **Confusão entre Lucro Contábil e Fluxo de Caixa:** A DRE pode apontar lucro no papel, mas se os prazos médios de recebimento forem incompatíveis com os prazos de pagamento a fornecedores e folha, a empresa entra em colapso de liquidez.
2. **Ignorância da Margem de Contribuição Real:** Aumentar o volume de vendas de produtos ou serviços com margens negativas ou mal calculadas apenas acelera o prejuízo. Cada linha de produto precisa ter seu custo direto e indireto rigorosamente mapeado.
3. **Falta de Projeção de Cenários (Budgeting e Forecast):** Decisões de contratação, investimento em marketing ou compra de equipamentos não podem ser tomadas com base no saldo bancário de hoje, mas sim no [fluxo de caixa projetado](/blog/licao-nokia-governanca-controladoria-financeira) para os próximos 6 a 12 meses.

## Da intuição aos dados: o papel da controladoria financeira modernizada

Implementar uma rotina de controladoria não significa burocratizar a empresa com planilhas estáticas. Significa criar um [painel de bordo (dashboard) financeiro](/#fin) focado em tomada de decisão estratégica:

- **Mapeamento de Indicadores de Desempenho (KPIs):** Acompanhamento quinzenal de margem EBITDA, Runway, necessidade de capital de giro (NCG) e ponto de equilíbrio.
- **Planejamento Orçamentário Dinâmico:** Revisão periódica de metas de custos e despesas operacionais para alinhar os gastos da empresa à realidade de receita do mercado.
- **Gestão Rigorosa do Capital de Giro:** Reestruturação de prazos de recebimento e negociação com fornecedores para otimizar o ciclo financeiro da operação.

## Assuma o controle total das finanças e da margem do seu negócio

Crescer com segurança exige números confiáveis na mesa do tomador de decisão. Se a sua empresa enfrenta desafios na gestão de caixa, previsibilidade de receita ou margens de lucro espremidas, o modelo de [Controladoria Financeira / CFO as a Service](/contato) da **Vispe Capital** entrega a inteligência executiva necessária sem os custos fixos de um CFO em tempo integral.

Nossa equipe atua diretamente na estruturação de rotinas financeiras, controle de DRE, gestão de caixa e projeção orçamentária para garantir a perenidade e a lucratividade do seu negócio.$vispe$,
  $vispe$/media/blog/netflix-1300.webp$vispe$,
  $vispe$Logotipo da Netflix sobre um gráfico de linha em queda$vispe$,
  $vispe$Controladoria$vispe$,
  $vispe$Vispe Capital$vispe$,
  $vispe$Netflix e a controladoria financeira no crescimento$vispe$,
  $vispe$Entenda como a migração de modelo de negócios exige uma gestão rigorosa de margem e fluxo de caixa para transformar o crescimento em lucro líquido real.$vispe$,
  'published',
  $vispe$2026-10-07T12:00:00-03:00$vispe$::timestamptz,
  array[$vispe$Gestão Financeira$vispe$]::text[],
  null
),
(
  $vispe$kongsberg-turnaround-reestruturacao-margem$vispe$,
  $vispe$A ilusão da escala sem eficiência: o que o caso Kongsberg ensina sobre reestruturação e foco em margem$vispe$,
  $vispe$Entenda como a gigante norueguesa de tecnologia e defesa reestruturou seu portfólio para estancar perdas operacionais e recuperar a liquidez corporativa.$vispe$,
  $vispe$Fundada há mais de dois séculos na Noruega, a **Kongsberg Gruppen** é amplamente reconhecida como um símbolo de inovação em tecnologia de defesa, sistemas marítimos e energia offshore. No entanto, sua longa trajetória não foi isenta de solavancos severos. Em meados da última década, diante da retração global no setor de petróleo e gás e de uma desaceleração em suas divisões marítimas tradicionais, a empresa viu suas margens operacionais serem corroídas rapidamente. A combinação de custos fixos elevados, investimentos dispersos em linhas de negócios não essenciais (non-core) e queda na demanda colocou em xeque a liquidez da operação.

A resposta do grupo não foi tentar “vender para sair da crise” aumentando o faturamento a qualquer custo. Em vez disso, a liderança executiva da Kongsberg iniciou um plano robusto de [Turnaround Financeiro e Reestruturação Operacional](/#equity). O foco foi redirecionado para a alienação de ativos secundários, corte drástico de ineficiências operacionais, renegociação de passivos bancários e concentração absoluta em segmentos de alta margem e tecnologia proprietária. O resultado? A empresa recuperou a rentabilidade corporativa, multiplicou sua margem EBITDA e consolidou-se como uma das operadoras mais eficientes da Europa.

Para diretores, Founders e CEOs de PMEs brasileiras, o caso da Kongsberg oferece uma reflexão indispensável: **em momentos de estresse de caixa ou mudança de ciclo econômico, buscar o crescimento cego de receita sem ajustar a estrutura de custos é o caminho mais rápido para o colapso financeiro.**

## Os 3 sinais de alerta de que sua empresa precisa de turnaround

Muitas empresas entram em estado crítico de liquidez não por falta de produto ou mercado, mas por atrasar a tomada de decisões estruturais. Os sinais de que a operação precisa de uma reestruturação imediata incluem:

1. **Queima Contínua de Caixa Apesar do Aumento de Vendas:** O faturamento cresce, mas o saldo bancário ao final do mês diminui progressivamente. Isso indica descontrole na [Margem de Contribuição](/blog/licao-nokia-governanca-controladoria-financeira), custos variáveis mal precificados ou prazos médios de recebimento estrangulados.
2. **Dependência Excessiva de Capital de Giro de Curto Prazo:** A utilização constante de rolagem de dívidas, linhas bancárias caras ou antecipação de recebíveis para cobrir despesas operacionais correntes revela uma estrutura de capital disfuncional.
3. **Imobilização de Capital em Linhas Ineficientes:** Manter filiais, produtos ou unidades de negócio deficitárias na esperança de que “um dia deem lucro”, drenando o caixa gerado pelas divisões saudáveis da empresa.

## O roteiro de recuperação: 4 passos para reorganizar a liquidez

A reestruturação de um negócio exige pragmatismo financeiro e execução cirúrgica. O processo de Turnaround estruturado baseia-se em quatro etapas fundamentais:

1. **Estancamento Imediato do “Sangramento” (Gestão de Crise de Caixa):** Centralização absoluta da gestão de pagamentos, criação de comitê de caixa semanal e corte imediato de despesas não essenciais para preservar a liquidez mínima operacional.
2. **Mapeamento da Rentabilidade Real por Linha de Negócio:** Auditoria profunda da [DRE por produto/serviço](/blog/netflix-controladoria-financeira-fluxo-de-caixa) para identificar e eliminar os gargalos operacionais que corroem a margem EBITDA.
3. **Renegociação e Reprofilamento do Passivo:** Reestruturação do perfil das dívidas junto a bancos e fornecedores estratégicos, alongando prazos de vencimento e reduzindo o custo médio do capital.
4. **Redesenho do Modelo Operacional e Foco no Core Business:** Reorganização do quadro funcional, revisão de processos produtivos e concentração total dos recursos nas soluções de maior margem e menor ciclo de recebimento.

## Proteja o futuro e a liquidez da sua empresa com a Vispe Capital

Superar um cenário de crise de margem ou reestruturar a engenharia financeira do negócio exige neutralidade, expertise técnica e negociação firme com credores e agentes de mercado.

A **Vispe Capital** atua diretamente em [processos de Turnaround Financeiro e Reestruturação](/contato), auxiliando empresários e executivos na recuperação da rentabilidade, renegociação de dívidas corporativas e [otimização do fluxo de caixa](/#fin). Transformamos momentos de incerteza em uma plataforma sólida para o crescimento sustentável da sua operação.$vispe$,
  $vispe$/media/blog/kongsberg-v2-1600.webp$vispe$,
  $vispe$Cerimônia da Kongsberg com executivos cortando a fita diante de um painel com veículo militar$vispe$,
  $vispe$Turnaround$vispe$,
  $vispe$Vispe Capital$vispe$,
  $vispe$Caso Kongsberg: turnaround e foco em margem$vispe$,
  $vispe$Entenda como a gigante norueguesa de tecnologia e defesa reestruturou seu portfólio para estancar perdas operacionais e recuperar a liquidez corporativa.$vispe$,
  'published',
  $vispe$2026-10-07T12:00:00-03:00$vispe$::timestamptz,
  array[$vispe$Turnaround Financeiro$vispe$]::text[],
  null
)
on conflict (slug) do nothing;

-- ═══ 0006_materials.sql ═══

-- Materiais gratuitos gerenciados pelo admin (/admin/materiais).
--   materials:        catálogo + página de cada material (/materiais/<slug>).
--   material-images:  capas e imagens de destaque (bucket público).
--   material-files:   os arquivos baixáveis (bucket PRIVADO). O link de download
--                     só existe por e-mail: a Edge Function material-link gera um
--                     link assinado que expira, chamada pelo Apps Script.

-- ─────────────────────────────────────────────────────────────
-- materials
-- ─────────────────────────────────────────────────────────────
create table public.materials (
  id               uuid primary key default gen_random_uuid(),
  slug             text unique not null,
  type             text not null default 'E-book',          -- formato: E-book, Planilha, Checklist…
  title            text not null,
  tagline          text not null default '',                -- resumo do card e da abertura da página
  headline         text,                                    -- h1 da página (vazio: usa o título)
  description_md   text not null default '',                -- descrição em Markdown (renderizada no site)
  description_json jsonb,                                   -- documento do Tiptap (só para reabrir no editor)
  cover_image_url  text,
  cover_image_alt  text,
  image_url        text,                                    -- imagem de destaque da página (mockup)
  file_path        text,                                    -- caminho em material-files (privado)
  file_name        text,                                    -- nome do arquivo no download
  file_size        bigint,
  meta_title       text,
  meta_description text,
  faq              jsonb,
  status           text not null default 'draft' check (status in ('draft', 'published')),
  sort_order       integer not null default 0,              -- ordem no catálogo (menor primeiro)
  published_at     timestamptz,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  -- "item" é a página que abre os materiais publicados depois do último build.
  constraint materials_slug_format check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and slug <> 'item'),
  constraint materials_faq_is_array check (faq is null or jsonb_typeof(faq) = 'array')
);

comment on column public.materials.file_path is 'Caminho no bucket privado material-files. Nunca exposto ao público.';

create index materials_status_order_idx on public.materials (status, sort_order, published_at desc);

create trigger materials_touch_updated_at
  before update on public.materials
  for each row execute function public.touch_updated_at();

-- ─────────────────────────────────────────────────────────────
-- RLS + colunas visíveis ao público
-- ─────────────────────────────────────────────────────────────
alter table public.materials enable row level security;

create policy materials_public_read
  on public.materials for select
  to anon, authenticated
  using (status = 'published');

create policy materials_staff_read
  on public.materials for select
  to authenticated
  using (private.is_staff());

create policy materials_staff_insert
  on public.materials for insert
  to authenticated
  with check (private.is_staff());

create policy materials_staff_update
  on public.materials for update
  to authenticated
  using (private.is_staff())
  with check (private.is_staff());

create policy materials_staff_delete
  on public.materials for delete
  to authenticated
  using (private.is_staff());

-- Admin logado (as policies acima limitam a staff).
grant select, insert, update, delete on public.materials to authenticated;

-- O público (anon) lê só estas colunas: sem file_path/file_name/file_size e sem
-- o JSON do editor. Assim, nem quem conhece a API descobre onde está o arquivo.
revoke select on public.materials from anon;
grant select (
  id, slug, type, title, tagline, headline, description_md, cover_image_url, cover_image_alt,
  image_url, meta_title, meta_description, faq, status, sort_order, published_at, created_at, updated_at
) on public.materials to anon;

-- ─────────────────────────────────────────────────────────────
-- Storage
-- ─────────────────────────────────────────────────────────────
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('material-images', 'material-images', true, 5242880, -- 5 MB
   array['image/jpeg', 'image/png', 'image/webp']),
  ('material-files', 'material-files', false, 52428800, -- 50 MB
   array[
     'application/pdf',
     'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', -- xlsx
     'application/vnd.ms-excel',                                          -- xls
     'application/vnd.openxmlformats-officedocument.wordprocessingml.document', -- docx
     'application/vnd.openxmlformats-officedocument.presentationml.presentation', -- pptx
     'application/zip',
     'text/csv'
   ])
on conflict (id) do nothing;

-- Imagens: leitura pela URL pública do bucket (sem policy de select, que deixaria
-- listar tudo); escrita só staff.
create policy "material-images staff insert"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'material-images' and private.is_staff());
create policy "material-images staff update"
  on storage.objects for update to authenticated
  using (bucket_id = 'material-images' and private.is_staff())
  with check (bucket_id = 'material-images' and private.is_staff());
create policy "material-images staff delete"
  on storage.objects for delete to authenticated
  using (bucket_id = 'material-images' and private.is_staff());

-- Arquivos: privado. Só staff lê (para conferir no admin) e escreve; o público
-- recebe um link assinado que expira, gerado pela Edge Function material-link.
create policy "material-files staff select"
  on storage.objects for select to authenticated
  using (bucket_id = 'material-files' and private.is_staff());
create policy "material-files staff insert"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'material-files' and private.is_staff());
create policy "material-files staff update"
  on storage.objects for update to authenticated
  using (bucket_id = 'material-files' and private.is_staff())
  with check (bucket_id = 'material-files' and private.is_staff());
create policy "material-files staff delete"
  on storage.objects for delete to authenticated
  using (bucket_id = 'material-files' and private.is_staff());

-- ═══ 0007_seed_materials.sql ═══

-- Gerado por scripts/materials-to-sql.mjs a partir de content/materials-legacy.ts — não editar à mão.
-- Os 8 materiais que já estavam no site, publicados e sem arquivo
-- (o PDF/planilha de cada um é enviado pelo admin).

insert into public.materials
  (slug, type, title, tagline, headline, description_md, cover_image_url, cover_image_alt,
   image_url, meta_description, faq, status, sort_order, published_at)
values
(
  $vispe$checklist-reforma-tributaria$vispe$,
  $vispe$Checklist$vispe$,
  $vispe$Checklist de transição para a Reforma Tributária$vispe$,
  $vispe$Roteiro prático e estratégico para proteger seu caixa e garantir a conformidade.$vispe$,
  $vispe$Roteiro prático e estratégico para proteger seu caixa e garantir a conformidade na Reforma Tributária$vispe$,
  $vispe$Entender a teoria da nova legislação não garante que sua empresa continuará lucrativa. O desafio real é preparar seus sistemas, rever preços, adaptar o fluxo financeiro ao Split Payment e escolher o regime tributário certo antes dos prazos fatais. O Checklist de Transição resolve isso.

## O que você vai encontrar

- **Auditoria do Ano-Teste**: Como validar emissão de IBS/CBS e cadastro mestre no ERP
- **Prazos Legais Críticos**: Matriz de tomada de decisão para o Simples Híbrido
- **Modelagem de Caixa & Split Payment**: Preparação financeira para a retenção na fonte da CBS
- **Ajustes em Contratos e Precificação**: Como repassar a nova carga B2B/B2C sem perder margem
- **Sistemas, Compliance & KPIs**: Checklist de virada de chave para equipe fiscal e TI

## Desenhado para ser o seu guia operacional contínuo, não uma leitura teórica

Cada pilar do guia traz checklists acionáveis com etapas passo a passo organizadas em ordem cronológica. A transição tributária não acontece do dia para a noite, requer ajustes contínuos de sistemas, contratos e modelagem financeira para manter sua empresa saudável e capitalizada.

- **Auditoria de Cadastro & ERP**: Frequência: Mensal / Trimestral · Prioridade: Alta · Foco da ação: Eliminação de erros de IBS/CBS e NCM
- **Opção pelo Simples Híbrido**: Frequência: Prazo Fixo (Setembro) · Prioridade: Crítica (Legal) · Foco da ação: Simulação de competitividade B2B
- **Impacto do Split Payment no Caixa**: Frequência: Mensal · Prioridade: Crítica · Foco da ação: Projeção de retenção imediata em PIX/Cartão
- **Repaginação de Contratos Longos**: Frequência: Semestral · Prioridade: Média · Foco da ação: Inclusão de cláusulas de IBS, CBS e IS$vispe$,
  $vispe$/media/materials/checklist-reforma-tributaria-cover-842.webp$vispe$,
  $vispe$Capa: Checklist de transição para a Reforma Tributária$vispe$,
  $vispe$/media/materials/checklist-reforma-tributaria-mockup-1200.webp$vispe$,
  $vispe$Entender a teoria da nova legislação não garante que sua empresa continuará lucrativa. O desafio real é preparar seus sistemas, rever preços, adaptar o fluxo financeiro ao Split Payment e escolher o regime tributário certo antes dos prazos fatais. O Checklist de Transição resolve isso.$vispe$,
  $vispe$[{"question":"Este checklist é indicado para qual porte de empresa?","answer":"O material foi desenhado especificamente para CEOs, CFOs, diretores e gestores fiscais de Pequenas e Médias Empresas (PMEs) dos segmentos de Indústria, Comércio, Serviços, E-commerce e Tecnologia. Se a sua empresa emite notas fiscais e precisa se adequar às novas regras de IBS/CBS, este guia é essencial."},{"question":"Minha contabilidade externa já não cuida da Reforma Tributária?","answer":"A contabilidade externa cuida do cumprimento das obrigações fiscais. No entanto, decisões estratégicas sobre margem de lucro, precificação de produtos, alteração de contratos B2B e impacto do Split Payment no caixa são de responsabilidade da gestão interna e da controladoria do negócio."},{"question":"Por que a decisão do Simples Híbrido precisa ser tomada até setembro?","answer":"A legislação exige que a opção pelo modelo Híbrido (no qual a empresa recolhe o IBS/CBS por fora para transferir créditos integrais a clientes B2B) seja formalizada com antecedência. A escolha é irretratável e exige simulação numérica prévia para não destruir sua margem."},{"question":"O e-book é realmente gratuito? Terei que pagar algo depois?","answer":"Sim, 100% gratuito. A Vispe Capital disponibiliza este manual operacional em PDF como parte do nosso compromisso de entregar inteligência financeira e planejamento tributário estratégico para PMEs brasileiras."},{"question":"Como a Vispe Capital pode ajudar minha empresa além do e-book?","answer":"Atuamos na modelagem financeira para a Reforma Tributária, simulação do Simples Híbrido vs. Regular, reestruturação de controladoria e CFO as a Service. Ajudamos seu negócio a antecipar cenários e blindar a lucratividade durante toda a transição."}]$vispe$::jsonb,
  'published',
  10,
  now()
),
(
  $vispe$dre-caixa$vispe$,
  $vispe$Planilha$vispe$,
  $vispe$Demonstrativo de Resultados do Exercício (DRE)$vispe$,
  $vispe$Execute a análise dos dados agora!$vispe$,
  $vispe$Descubra para onde seu dinheiro realmente vai com a Planilha Prática de DRE CAIXA$vispe$,
  $vispe$Vender muito no papel não paga as contas do fim do mês. O segredo de uma empresa saudável é controlar a entrada e saída efetiva de dinheiro no momento exato em que ocorrem. A DRE CAIXA organiza suas finanças pelo Princípio de Caixa, revelando a sobra real e eliminando o sangramento financeiro oculto.

## O que você vai encontrar

- **Estrutura Pronta pelo Princípio de Caixa**: Acompanhe o dinheiro real que entrou e saiu mês a mês
- **Totalizadores Automatizados**: Fórmulas pré-configuradas para Receita Líquida, Lucro Bruto, Margem de Contribuição e EBITDA
- **Separação Rígida de Gastos**: Classificação transparente entre Custos Diretos, Despesas de Vendas/Marketing e G&A
- **Ajustes de CAPEX & Passivos**: Visão clara de amortização de empréstimos, dividendos e investimentos patrimoniais
- **Indicadores de Saúde Financeira**: Cálculo instantâneo da Margem de Caixa Operacional e Caixa Final

## Desenhada para uso diário e tomada de decisão rápida, sem complicações

O modelo é 100% editável e personalizável para a realidade do seu negócio. Basta renomear as linhas de acordo com suas receitas e despesas, preencher os lançamentos mensais e deixar que os totalizadores automáticos façam o cálculo das suas margens em tempo real.

- **Receita Líquida Real**: Frequência: Mensal · Prioridade: Alta · Objetivo na planilha: Entradas operacionais deduzidas de impostos diretos e descontos
- **Margem de Contribuição**: Frequência: Mensal · Prioridade: Alta · Objetivo na planilha: Mede quanto sobrou para cobrir a estrutura fixa após custos e vendas
- **EBITDA Operacional**: Frequência: Mensal · Prioridade: Alta · Objetivo na planilha: Mede a capacidade de geração de caixa das operações principais
- **Fluxo de Caixa Operacional**: Frequência: Semanal / Mensal · Prioridade: Crítica · Objetivo na planilha: Resultado após despesas financeiras, CAPEX e dívidas
- **Caixa Final & Margem Final**: Frequência: Semanal / Mensal · Prioridade: Crítica · Objetivo na planilha: Saldo líquido real disponível para investimento ou distribuição$vispe$,
  $vispe$/media/materials/dre-caixa-cover-842.webp$vispe$,
  $vispe$Capa: Demonstrativo de Resultados do Exercício (DRE)$vispe$,
  $vispe$/media/materials/dre-caixa-mockup-1200.webp$vispe$,
  $vispe$Vender muito no papel não paga as contas do fim do mês. O segredo de uma empresa saudável é controlar a entrada e saída efetiva de dinheiro no momento exato em que ocorrem. A DRE CAIXA organiza suas finanças pelo Princípio de Caixa, revelando a sobra real e eliminando o sangramento financeiro oculto.$vispe$,
  $vispe$[{"question":"Qual a diferença entre DRE Contábil e DRE CAIXA?","answer":"A DRE Contábil funciona por regime de competência (data em que a venda foi realizada ou a nota emitida). A DRE CAIXA opera por regime de caixa, considerando estritamente o dinheiro que efetivamente entrou na conta ou foi pago no mês, refletindo a sobra real da tesouraria."},{"question":"Preciso ter conhecimentos avançados de Excel para usar a planilha?","answer":"Não. A planilha conta com explicações passo a passo em cada linha, estrutura visual clara e fórmulas pré-programadas. Você só precisa preencher os dados do seu negócio e adaptar as categorias."},{"question":"A planilha serve para o meu tipo de empresa?","answer":"Sim. O modelo é versátil e atende empresas de Serviços, Comércio, E-commerce, Tecnologia e Pequenas Indústrias. Como o plano de contas é customizável, você adapta os nomes à sua realidade."},{"question":"O material é realmente gratuito? Terei que pagar algo depois?","answer":"Sim, 100% gratuito. A Vispe Capital disponibiliza este modelo pré-programado em Excel para apoiar empreendedores na estruturação de uma controladoria profissional e previsível."},{"question":"Como a Vispe Capital pode ajudar minha empresa além do modelo DRE?","answer":"Atuamos na reestruturação de controladoria, parametrização de ERPs, planejamento orçamentário e gestão de CFO as a Service para PMEs que desejam aumentar a lucratividade e o valuation do negócio."}]$vispe$::jsonb,
  'published',
  20,
  now()
),
(
  $vispe$como-aumentar-o-valor-da-empresa$vispe$,
  $vispe$Guia prático$vispe$,
  $vispe$Como aumentar o valor da sua empresa$vispe$,
  $vispe$Guia prático para PMEs.$vispe$,
  null,
  '',
  $vispe$/media/materials/como-aumentar-o-valor-da-empresa-cover-842.webp$vispe$,
  $vispe$Capa: Como aumentar o valor da sua empresa$vispe$,
  null,
  null,
  null,
  'published',
  30,
  now()
),
(
  $vispe$devo-tomar-divida$vispe$,
  $vispe$Planilha$vispe$,
  $vispe$Devo tomar dívida?$vispe$,
  $vispe$Otimize seu controle financeiro!$vispe$,
  null,
  '',
  $vispe$/media/materials/devo-tomar-divida-cover-842.webp$vispe$,
  $vispe$Capa: Devo tomar dívida?$vispe$,
  null,
  null,
  null,
  'published',
  40,
  now()
),
(
  $vispe$caixa-preta-do-equity$vispe$,
  $vispe$E-book$vispe$,
  $vispe$A caixa preta do Equity$vispe$,
  $vispe$Tenha acesso às principais estratégias de Equity e M&A.$vispe$,
  null,
  '',
  $vispe$/media/materials/caixa-preta-do-equity-cover-842.webp$vispe$,
  $vispe$Capa: A caixa preta do Equity$vispe$,
  null,
  null,
  null,
  'published',
  50,
  now()
),
(
  $vispe$cemiterio-de-empresas$vispe$,
  $vispe$E-book$vispe$,
  $vispe$O cemitério de empresas$vispe$,
  $vispe$Leia se você não quer que a sua empresa esteja aqui.$vispe$,
  null,
  '',
  $vispe$/media/materials/cemiterio-de-empresas-cover-842.webp$vispe$,
  $vispe$Capa: O cemitério de empresas$vispe$,
  null,
  null,
  null,
  'published',
  60,
  now()
),
(
  $vispe$arquitetura-do-lucro-real$vispe$,
  $vispe$E-book$vispe$,
  $vispe$A Arquitetura do Lucro Real$vispe$,
  $vispe$O mapa completo para uma gestão por margem que funciona.$vispe$,
  $vispe$O mapa completo para uma gestão por margem que funciona$vispe$,
  $vispe$Saber que o DRE contábil não serve para decidir não é o problema. O problema é saber onde o caixa está sangrando primeiro, como separar custos de despesas e como transformar sua DRE num motor de Equity. A Arquitetura do Lucro Real resolve isso.

## O que você vai encontrar

- **Cascata Gerencial de 20 passos**
- **Diagnóstico de DRE Contábil vs. Gerencial**
- **Separação de Custos, Vendas e G&A**
- **Cálculo real de EBITDA e Valuation**
- **Reconciliação com o Fluxo de Caixa Final**
- **Protocolo de leitura em 5 minutos**

## Desenhado para uso contínuo, não como leitura única

Cada capítulo traz uma visão clara de diagnóstico para acompanhar o progresso e uma estrutura passo a passo com checklists para aplicar à sua rotina. As prioridades financeiras não são feitas em linha reta — você pode ajustar seu DRE gerencial conforme o momento e o porte do seu negócio.

A distinção entre margem econômica e saldo de tesouraria é o aspecto mais importante: algumas métricas avaliam a eficiência das vendas, enquanto outras exigem revisão de caixa para manter a empresa saudável e capitalizada.

- **Margem Bruta (CPV/CMV)**: Frequência: Mensal · Prioridade: Alta
- **Linha de Contribuição & CAC**: Frequência: Trimestral / Mensal · Prioridade: Alta
- **Margem EBITDA Operacional**: Frequência: Mensal · Prioridade: Alta
- **Resultado Financeiro & Taxas**: Frequência: Mensal · Prioridade: Média
- **Variável de Caixa Final (CAPEX)**: Frequência: Semanal / Mensal · Prioridade: Crítica$vispe$,
  $vispe$/media/materials/arquitetura-do-lucro-real-cover-842.webp$vispe$,
  $vispe$Capa: A Arquitetura do Lucro Real$vispe$,
  $vispe$/media/materials/arquitetura-do-lucro-real-mockup-1200.webp$vispe$,
  $vispe$Saber que o DRE contábil não serve para decidir não é o problema. O problema é saber onde o caixa está sangrando primeiro, como separar custos de despesas e como transformar sua DRE num motor de Equity. A Arquitetura do Lucro Real resolve isso.$vispe$,
  $vispe$[{"question":"Este e-book é indicado para qual porte ou segmento de empresa?","answer":"O material foi desenvolvido especificamente para fundadores, diretores e gestores financeiros de PMEs (Pequenas e Médias Empresas) de qualquer segmento — indústrias, comércio, e-commerce, tecnologia (SaaS) ou empresas de serviços. Se a sua operação possui faturamento ativo e você busca clareza sobre suas margens e controle do caixa, este guia é para você."},{"question":"Por que o DRE que recebo do meu contador não serve para a gestão do dia a dia?","answer":"O DRE Contábil Tradicional cumpre uma obrigação técnica perante a Receita Federal (foco fiscal e tributário). Ele agrupa custos e despesas em blocos genéricos e opera por regime de competência pura, ocultando a geração real de caixa, o custo de aquisição de clientes (CAC) e o EBITDA da operação. O DRE Gerencial reorganiza esses dados para revelar onde a empresa ganha ou perde margem na prática."},{"question":"O e-book é realmente gratuito? Terei que pagar algo depois?","answer":"Sim, 100% gratuito. A Vispe Capital disponibiliza este manual prático em PDF como parte do nosso compromisso de democratizar a controladoria de alta performance e a cultura de Equity para PMEs no Brasil. Você não precisa cadastrar cartão de crédito para acessar."},{"question":"Preciso trocar de software de gestão (ERP) para aplicar a DRE Gerencial?","answer":"Não. O DRE Gerencial é uma estrutura metodológica de análise, e não um software específico. O e-book ensina a lógica de parametrização e o plano de contas gerencial que você pode aplicar no seu ERP atual, em planilhas ou em ferramentas de Business Intelligence (BI)."},{"question":"O que é o “Protocolo de 5 Minutos” abordado no livro?","answer":"É um método de escaneamento executivo desenvolvido pela Vispe para que o CEO/CFO consiga diagnosticar a saúde financeira do negócio no início do mês sem perder horas analisando planilhas. Ele foca em 5 indicadores-chave de margem percentual que revelam instantaneamente qualquer vazamento de caixa."},{"question":"Como receberei o e-book após preencher o formulário?","answer":"O acesso é imediato. Assim que você preencher o formulário, enviaremos o link de download direto para o seu e-mail cadastrado em formato PDF otimizado para leitura em computador, tablet ou e-reader."},{"question":"Como a Vispe Capital pode ajudar minha empresa além do e-book?","answer":"Além de materiais educativos, a Vispe Capital atua na reestruturação de controladoria, parametrização financeira e gestão estratégica de margem (CFO as a Service) para empresas que buscam gerar previsibilidade de caixa e multiplicar seu valor de mercado (Valuation/Equity). Você pode agendar uma sessão de diagnóstico direto com nossos especialistas após o download do e-book."}]$vispe$::jsonb,
  'published',
  70,
  now()
),
(
  $vispe$checklist-preparacao-ma$vispe$,
  $vispe$Checklist$vispe$,
  $vispe$Checklist de preparação para M&A$vispe$,
  $vispe$Venda sua empresa pelo preço máximo!$vispe$,
  $vispe$O guia definitivo para preparar sua empresa, maximizar o Valuation e atrair os melhores compradores$vispe$,
  $vispe$Preparar uma empresa para Fusões e Aquisições (M&A) é como treinar um atleta para uma final de campeonato: a vitória é decidida muito antes de entrar em campo. Um negócio bem preparado reduz riscos de Due Diligence, acelera a negociação e impede que descontos severos destruam o valor da sua transação. A Vispe Capital estruturou o roteiro definitivo de “arrumação da casa”.

## O que você vai encontrar

- **Governança e Estrutura Jurídica**: Auditoria de acordos de sócios (drag/tag along), marcas e contratos-chave
- **Cálculo do EBITDA Normalizado**: Como expurgar despesas pessoais e não recorrentes para defender seu Valuation
- **Capital de Giro & Projeções**: Definição do alvo de NCG e construção da história de crescimento (Equity Story)
- **Risco Operacional & Pessoas**: Redução da dependência de sócios e mapeamento de passivos trabalhistas
- **Dicas Práticas Imediatas**: Guia direto para o empresário pensar como comprador e montar seu “Conselho de Guerra”

## O roteiro para transformar sua empresa em um ativo altamente líquido

O checklist foi desenhado para ser executado em etapas estratégicas antes do primeiro contato com fundos de investimento ou compradores estratégicos. Organizar dados contábeis, societários e trabalhistas previamente evita a perda de tempo e o insucesso do processo de venda.

- **Governança & Contratos Societários**: Frequência: Etapa Inicial · Prioridade: Crítica · Objetivo no processo de M&A: Mapear drag along, tag along, certidões e marcas em nome da empresa
- **EBITDA Normalizado & DRE**: Frequência: Mensal / Histórico · Prioridade: Alta · Objetivo no processo de M&A: Eliminar despesas pessoais de sócios e defender a margem real negociada
- **Business Plan & Projeções (3-5 anos)**: Frequência: Anual · Prioridade: Alta · Objetivo no processo de M&A: Consolidar a tese de crescimento e retorno financeiro para o investidor
- **Mapeamento de Passivos Trabalhistas**: Frequência: Trimestral · Prioridade: Média · Objetivo no processo de M&A: Eliminar riscos ocultos e acordos verbais com equipe e fornecedores$vispe$,
  $vispe$/media/materials/checklist-preparacao-ma-cover-842.webp$vispe$,
  $vispe$Capa: Checklist de preparação para M&A$vispe$,
  $vispe$/media/materials/checklist-preparacao-ma-mockup-1200.webp$vispe$,
  $vispe$Preparar uma empresa para Fusões e Aquisições (M&A) é como treinar um atleta para uma final de campeonato: a vitória é decidida muito antes de entrar em campo. Um negócio bem preparado reduz riscos de Due Diligence, acelera a negociação e impede que descontos severos destruam o valor da sua transação. A Vispe Capital estruturou o roteiro definitivo de “arrumação da casa”.$vispe$,
  $vispe$[{"question":"O que é Vendor Readiness e por que é fundamental em M&A?","answer":"Vendor Readiness é a preparação prévia do vendedor antes de ir ao mercado. Consiste na auditoria interna de finanças, contratos e governança para identificar e corrigir falhas com antecedência, evitando que o comprador exija descontos expressivos no valuation durante a Due Diligence."},{"question":"O que é EBITDA Normalizado e por que ele é central na venda?","answer":"É o EBITDA operacional limpo de despesas e receitas não recorrentes (como despesas pessoais dos sócios ou venda pontual de um imóvel). Como o preço final da transação costuma ser um múltiplo do EBITDA, quanto mais organizado e defendível for esse número, maior o valor de venda."},{"question":"Quando devo começar a preparar minha empresa para uma venda?","answer":"O ideal é iniciar o processo de “arrumação da casa” de 12 a 24 meses antes do momento desejado para a venda. Isso garante tempo suficiente para normalizar balanços, profissionalizar a equipe e construir uma história de crescimento sólida."},{"question":"O e-book é gratuito? Terei custos posteriores?","answer":"Sim, 100% gratuito. A Vispe Capital disponibiliza este guia como parte do compromisso com a cultura de Equity e preparação executiva no Brasil."},{"question":"Como a Vispe Capital assessora meu processo de M&A?","answer":"Atuamos como seu Advisor financeiro e estratégico, conduzindo a avaliação de Valuation, preparação do Data Room, prospecção de compradores elegíveis, condução de Due Diligence e negociação final dos termos da transação."}]$vispe$::jsonb,
  'published',
  80,
  now()
)
on conflict (slug) do nothing;

-- ═══ 0008_translations.sql ═══

-- Versão em inglês dos artigos e dos materiais (site em /en).
-- Uma coluna "en" (jsonb) por tabela guarda os textos traduzidos, preenchidos no
-- admin (aba "Inglês", com tradução por IA e revisão). Sem tradução (null), a
-- página em inglês mostra o conteúdo em português com o aviso, como antes.
--
-- articles.en:  { title, excerpt, bodyMd, bodyJson, metaTitle, metaDescription, coverAlt, faq }
-- materials.en: { type, title, tagline, headline, descriptionMd, descriptionJson,
--                 metaTitle, metaDescription, coverAlt, faq }

alter table public.articles add column en jsonb;
alter table public.materials add column en jsonb;

comment on column public.articles.en is 'Tradução para o inglês (null: sem tradução, /en mostra o português).';
comment on column public.materials.en is 'Tradução para o inglês (null: sem tradução, /en mostra o português).';

alter table public.articles
  add constraint articles_en_is_object check (en is null or jsonb_typeof(en) = 'object');
alter table public.materials
  add constraint materials_en_is_object check (en is null or jsonb_typeof(en) = 'object');

-- O público lê materiais por coluna (0006): libera a nova.
grant select (en) on public.materials to anon;

-- ═══ 0009_material_formats.sql ═══

-- Formatos dos materiais (Aula, Planilha, E-book…) gerenciados no admin
-- (/admin/materiais/formatos/). Cada material aponta para um formato: o admin
-- escolhe num seletor e o catálogo do site filtra por ele (pt e en).

create table public.material_formats (
  slug       text primary key,                          -- chave estável (filtro do site: ?formato=planilha)
  name       text not null,                             -- nome em português (card, filtro, admin)
  name_en    text not null default '',                  -- nome em inglês (site em /en; vazio: usa o português)
  sort_order integer not null default 0,                -- ordem no seletor e no filtro (menor primeiro)
  created_at timestamptz not null default now(),
  constraint material_formats_slug_format check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  constraint material_formats_name_filled check (length(btrim(name)) > 0)
);

alter table public.material_formats enable row level security;

create policy material_formats_public_read
  on public.material_formats for select
  to anon, authenticated
  using (true);

create policy material_formats_staff_insert
  on public.material_formats for insert
  to authenticated
  with check (private.is_staff());

create policy material_formats_staff_update
  on public.material_formats for update
  to authenticated
  using (private.is_staff())
  with check (private.is_staff());

create policy material_formats_staff_delete
  on public.material_formats for delete
  to authenticated
  using (private.is_staff());

grant select on public.material_formats to anon;
grant select, insert, update, delete on public.material_formats to authenticated;

insert into public.material_formats (slug, name, name_en, sort_order) values
  ('aula',      'Aula',      'Lesson',      10),
  ('planilha',  'Planilha',  'Spreadsheet', 20),
  ('ebook',     'E-book',    'E-book',      30),
  ('prompt',    'Prompt',    'Prompt',      40),
  ('checklist', 'Checklist', 'Checklist',   50),
  ('guia',      'Guia',      'Guide',       60)
on conflict (slug) do nothing;

-- Material → formato. Formato em uso não pode ser apagado (restrict); trocar o
-- slug de um formato acompanha nos materiais (cascade).
alter table public.materials
  add column format text references public.material_formats (slug) on update cascade on delete restrict;

create index materials_format_idx on public.materials (format);

-- Converte o formato em texto livre (coluna type) para o novo cadastro.
update public.materials m
set format = f.slug
from public.material_formats f
where m.format is null
  and (lower(m.type) = lower(f.name) or (m.type = 'Guia prático' and f.slug = 'guia'));

-- type continua existindo com o nome em português do formato (o admin mantém em dia).
update public.materials m
set type = f.name
from public.material_formats f
where m.format = f.slug;

-- O público lê materiais por coluna (0006): libera a nova.
grant select (format) on public.materials to anon;

-- ═══ 0010_landing_pages.sql ═══

-- Landing pages montadas no admin (/admin/landing-pages) e publicadas em
-- /lp/<slug>/ (inglês em /en/lp/<slug>/).
--   landing_pages:  cada LP é uma lista de seções prontas (sections, jsonb) com o
--                   conteúdo editável; o visual vem dos componentes do site.
--   lp-images:      fotos das LPs (bucket público).
--
-- Projeto que já tem o banco (0001–0009): SQL Editor → cole este arquivo → Run.

-- ─────────────────────────────────────────────────────────────
-- landing_pages
-- ─────────────────────────────────────────────────────────────
create table public.landing_pages (
  id               uuid primary key default gen_random_uuid(),
  slug             text unique not null,
  template         text not null,                           -- modelo de origem: diagnostico, workshop, ma, superaula
  name             text not null,                           -- nome interno (lista do admin e aba da planilha)
  sections         jsonb not null default '[]'::jsonb,      -- [{ id, type, data }] — ver lib/lp/types.ts
  meta_title       text,
  meta_description text,
  og_image_url     text,                                    -- imagem de compartilhamento (vazio: a do site)
  noindex          boolean not null default false,          -- página de anúncio: fora do Google e do sitemap
  en               jsonb,                                   -- textos em inglês por seção — ver lib/lp/localize.ts
  status           text not null default 'draft' check (status in ('draft', 'published')),
  published_at     timestamptz,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  -- "pagina" é a página que abre as LPs publicadas depois do último build.
  constraint landing_pages_slug_format check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and slug <> 'pagina'),
  constraint landing_pages_sections_is_array check (jsonb_typeof(sections) = 'array'),
  constraint landing_pages_en_is_object check (en is null or jsonb_typeof(en) = 'object')
);

create index landing_pages_status_idx on public.landing_pages (status, published_at desc);

create trigger landing_pages_touch_updated_at
  before update on public.landing_pages
  for each row execute function public.touch_updated_at();

-- ─────────────────────────────────────────────────────────────
-- RLS: o público lê as publicadas; só staff vê rascunhos e escreve.
-- ─────────────────────────────────────────────────────────────
alter table public.landing_pages enable row level security;

create policy landing_pages_public_read
  on public.landing_pages for select
  to anon, authenticated
  using (status = 'published');

create policy landing_pages_staff_read
  on public.landing_pages for select
  to authenticated
  using ((select private.is_staff()));

create policy landing_pages_staff_insert
  on public.landing_pages for insert
  to authenticated
  with check ((select private.is_staff()));

create policy landing_pages_staff_update
  on public.landing_pages for update
  to authenticated
  using ((select private.is_staff()))
  with check ((select private.is_staff()));

create policy landing_pages_staff_delete
  on public.landing_pages for delete
  to authenticated
  using ((select private.is_staff()));

grant select on public.landing_pages to anon;
grant select, insert, update, delete on public.landing_pages to authenticated;

-- ─────────────────────────────────────────────────────────────
-- Storage: fotos das LPs (leitura pela URL pública; escrita só staff)
-- ─────────────────────────────────────────────────────────────
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('lp-images', 'lp-images', true, 5242880, array['image/jpeg', 'image/png', 'image/webp']) -- 5 MB
on conflict (id) do nothing;

create policy "lp-images staff insert"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'lp-images' and (select private.is_staff()));
create policy "lp-images staff update"
  on storage.objects for update to authenticated
  using (bucket_id = 'lp-images' and (select private.is_staff()))
  with check (bucket_id = 'lp-images' and (select private.is_staff()));
create policy "lp-images staff delete"
  on storage.objects for delete to authenticated
  using (bucket_id = 'lp-images' and (select private.is_staff()));

-- ═══ 0011_landing_pages_whatsapp.sql ═══

-- Mensagem do botão de WhatsApp de cada landing page
-- ("Olá, gostaria de mais informações sobre o workshop."). Vazia: a mensagem
-- padrão do site. A versão em inglês fica em landing_pages.en->>'whatsappMessage'.
--
-- Projeto que já tem o banco (0001–0010): SQL Editor → cole este arquivo → Run.

alter table public.landing_pages add column if not exists whatsapp_message text;

-- ═══ 0012_popups.sql ═══

-- Pop-ups do site, gerenciados no admin (/admin/popups).
--   popups:             cada pop-up (imagem, texto, botão), em quais páginas e idioma
--                       aparece, quando (tempo, rolagem ou saída), para quais aparelhos,
--                       quantas vezes por visitante e em que período.
--   popup_daily_stats:  exibições, cliques e fechamentos por dia (só staff lê).
--   track_popup():      única porta de escrita do público: soma +1 no dia de hoje.
--   popup-images:       imagens dos pop-ups (bucket público).
--
-- O controle de "quantas vezes por visitante" fica no navegador de cada pessoa
-- (sem identificar ninguém); o banco só guarda os totais.
--
-- Projeto que já tem o banco (0001–0011): SQL Editor → cole este arquivo → Run.

-- ─────────────────────────────────────────────────────────────
-- popups
-- ─────────────────────────────────────────────────────────────
create table public.popups (
  id              uuid primary key default gen_random_uuid(),
  name            text not null,                                -- nome interno (lista do admin)
  active          boolean not null default false,               -- ligado/desligado (o período abaixo também limita)
  starts_at       timestamptz,                                  -- vazio: desde já
  ends_at         timestamptz,                                  -- vazio: sem fim
  priority        integer not null default 0,                   -- mais de um pop-up na mesma página: vale o maior

  -- Conteúdo (imagem, texto ou os dois)
  layout          text not null default 'modal' check (layout in ('modal', 'corner')),
  image_url       text,
  image_alt       text not null default '',
  image_width     integer check (image_width is null or image_width > 0),
  image_height    integer check (image_height is null or image_height > 0),
  title           text not null default '',
  body            text not null default '',
  cta_label       text not null default '',
  cta_url         text not null default '',
  cta_new_tab     boolean not null default false,

  -- Onde
  locale          text not null default 'pt-BR' check (locale in ('pt-BR', 'en-US', 'all')),
  page_rule       text not null default 'all' check (page_rule in ('all', 'include', 'exclude')),
  page_paths      text[] not null default '{}',                 -- caminhos públicos; "*" no fim inclui as subpáginas
  devices         text not null default 'all' check (devices in ('all', 'desktop', 'mobile')),

  -- Quando
  trigger_type    text not null default 'delay' check (trigger_type in ('delay', 'scroll', 'exit')),
  trigger_value   integer not null default 5 check (trigger_value between 0 and 600), -- segundos ou % da página

  -- Quantas vezes (por visitante, contado no navegador)
  max_views       integer check (max_views is null or max_views > 0), -- vazio: sem limite
  cooldown_hours  integer not null default 24 check (cooldown_hours between 0 and 8760),
  hide_after_click boolean not null default true,

  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  constraint popups_has_content check (image_url is not null or title <> '' or body <> ''),
  constraint popups_period check (starts_at is null or ends_at is null or starts_at < ends_at),
  -- Botão com texto precisa de link; link sem texto vale para pop-up só de imagem (a imagem vira o link).
  constraint popups_cta_needs_url check (cta_label = '' or cta_url <> '')
);

create index popups_active_idx on public.popups (active, priority desc) where active;

create trigger popups_touch_updated_at
  before update on public.popups
  for each row execute function public.touch_updated_at();

-- RLS: o público só lê os ligados e dentro do período; staff vê e edita todos.
alter table public.popups enable row level security;

create policy popups_public_read
  on public.popups for select
  to anon, authenticated
  using (active and (starts_at is null or starts_at <= now()) and (ends_at is null or ends_at > now()));

create policy popups_staff_read
  on public.popups for select
  to authenticated
  using ((select private.is_staff()));

create policy popups_staff_insert
  on public.popups for insert
  to authenticated
  with check ((select private.is_staff()));

create policy popups_staff_update
  on public.popups for update
  to authenticated
  using ((select private.is_staff()))
  with check ((select private.is_staff()));

create policy popups_staff_delete
  on public.popups for delete
  to authenticated
  using ((select private.is_staff()));

grant select on public.popups to anon;
grant select, insert, update, delete on public.popups to authenticated;

-- ─────────────────────────────────────────────────────────────
-- popup_daily_stats: totais por dia (fuso de São Paulo)
-- ─────────────────────────────────────────────────────────────
create table public.popup_daily_stats (
  popup_id  uuid not null references public.popups (id) on delete cascade,
  day       date not null,
  views     integer not null default 0,
  clicks    integer not null default 0,
  closes    integer not null default 0,
  primary key (popup_id, day)
);

alter table public.popup_daily_stats enable row level security;

create policy popup_daily_stats_staff_read
  on public.popup_daily_stats for select
  to authenticated
  using ((select private.is_staff()));

grant select on public.popup_daily_stats to authenticated;

-- Escrita pública só por aqui: valida o evento e o pop-up (ligado e no período)
-- e soma +1 no dia. Sem dado nenhum de quem viu.
create or replace function public.track_popup(p_popup uuid, p_event text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  today date := (now() at time zone 'America/Sao_Paulo')::date;
begin
  if p_event not in ('view', 'click', 'close') then
    raise exception 'evento inválido: %', p_event using errcode = '22023';
  end if;
  if not exists (
    select 1 from public.popups p
    where p.id = p_popup
      and p.active
      and (p.starts_at is null or p.starts_at <= now())
      and (p.ends_at is null or p.ends_at > now())
  ) then
    return;
  end if;
  insert into public.popup_daily_stats as s (popup_id, day, views, clicks, closes)
  values (
    p_popup,
    today,
    (p_event = 'view')::int,
    (p_event = 'click')::int,
    (p_event = 'close')::int
  )
  on conflict (popup_id, day) do update set
    views  = s.views  + excluded.views,
    clicks = s.clicks + excluded.clicks,
    closes = s.closes + excluded.closes;
end;
$$;

revoke execute on function public.track_popup(uuid, text) from public;
grant execute on function public.track_popup(uuid, text) to anon, authenticated;

-- ─────────────────────────────────────────────────────────────
-- Storage: imagens dos pop-ups (leitura pela URL pública; escrita só staff)
-- ─────────────────────────────────────────────────────────────
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('popup-images', 'popup-images', true, 5242880, array['image/jpeg', 'image/png', 'image/webp']) -- 5 MB
on conflict (id) do nothing;

create policy "popup-images staff insert"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'popup-images' and (select private.is_staff()));
create policy "popup-images staff update"
  on storage.objects for update to authenticated
  using (bucket_id = 'popup-images' and (select private.is_staff()))
  with check (bucket_id = 'popup-images' and (select private.is_staff()));
create policy "popup-images staff delete"
  on storage.objects for delete to authenticated
  using (bucket_id = 'popup-images' and (select private.is_staff()));
