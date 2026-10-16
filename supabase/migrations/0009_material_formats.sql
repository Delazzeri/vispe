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
