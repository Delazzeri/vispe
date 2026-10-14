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
