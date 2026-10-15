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
