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
