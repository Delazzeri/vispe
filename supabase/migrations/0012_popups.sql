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
