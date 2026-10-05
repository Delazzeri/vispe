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
