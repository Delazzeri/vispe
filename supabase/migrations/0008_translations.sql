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
