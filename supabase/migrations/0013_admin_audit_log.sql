-- Registro de atividades do admin: quem criou, editou ou excluiu o quê, e quando.
--
-- Quem grava são triggers no banco (não o navegador), então toda mudança entra,
-- venha do admin, de uma Edge Function ou do SQL Editor. O admin só lê: não há
-- policy nem permissão de insert/update/delete para anon/authenticated. Apagar
-- linhas só pelo banco (SQL Editor, como postgres).

create table public.admin_audit_log (
  id             bigint generated always as identity primary key,
  at             timestamptz not null default now(),
  actor_id       uuid,                                -- auth.uid(); vazio = banco/sistema. Sem FK: o registro fica mesmo se a conta for apagada
  actor_email    text,                                -- e-mail na hora da ação
  action         text not null check (action in ('insert', 'update', 'delete')),
  entity         text not null,                       -- tabela (articles, materials…)
  record_id      text not null,                       -- id (ou slug, em material_formats)
  record_label   text not null default '',            -- título/nome na hora da ação
  changed_fields text[] not null default '{}',        -- update: colunas que mudaram (sem updated_at)
  before         jsonb                                -- update/delete: a linha antes da mudança (dá para recuperar o que foi apagado)
);

comment on table public.admin_audit_log is 'Registro de atividades do admin, gravado por triggers. Somente leitura para staff; apagar só pelo banco.';

create index admin_audit_log_at_idx on public.admin_audit_log (at desc);
create index admin_audit_log_entity_at_idx on public.admin_audit_log (entity, at desc);

alter table public.admin_audit_log enable row level security;

create policy admin_audit_log_staff_read
  on public.admin_audit_log for select
  to authenticated
  using ((select private.is_staff()));

revoke all on public.admin_audit_log from public, anon, authenticated;
grant select on public.admin_audit_log to authenticated;

-- Trigger genérico (AFTER, por linha). security definer: grava mesmo sem o
-- usuário ter permissão de escrita na tabela de registro.
create or replace function private.audit_row()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_old jsonb := case when tg_op in ('UPDATE', 'DELETE') then to_jsonb(old) end;
  v_new jsonb := case when tg_op in ('INSERT', 'UPDATE') then to_jsonb(new) end;
  v_row jsonb := coalesce(v_new, v_old);
  v_actor uuid := auth.uid();
  v_changed text[] := '{}';
  v_label text;
begin
  if tg_op = 'UPDATE' then
    select coalesce(array_agg(n.key order by n.key), '{}')
      into v_changed
      from jsonb_each(v_new) as n
     where n.key <> 'updated_at'
       and n.value is distinct from v_old -> n.key;
    -- Só o updated_at mudou: nada a registrar.
    if cardinality(v_changed) = 0 then
      return null;
    end if;
  end if;

  v_label := coalesce(v_row ->> 'title', v_row ->> 'name', v_row ->> 'full_name', '');
  if tg_table_name = 'profiles' then
    v_label := concat_ws(' · ', nullif(v_label, ''), (select u.email from auth.users u where u.id = (v_row ->> 'id')::uuid));
  end if;

  insert into public.admin_audit_log (actor_id, actor_email, action, entity, record_id, record_label, changed_fields, before)
  values (
    v_actor,
    (select u.email from auth.users u where u.id = v_actor),
    lower(tg_op),
    tg_table_name,
    coalesce(v_row ->> 'id', v_row ->> 'slug', ''),
    coalesce(v_label, ''),
    v_changed,
    v_old
  );
  return null;
end;
$$;

revoke execute on function private.audit_row() from public, anon, authenticated;

create trigger articles_audit after insert or update or delete on public.articles
  for each row execute function private.audit_row();
create trigger materials_audit after insert or update or delete on public.materials
  for each row execute function private.audit_row();
create trigger material_formats_audit after insert or update or delete on public.material_formats
  for each row execute function private.audit_row();
create trigger landing_pages_audit after insert or update or delete on public.landing_pages
  for each row execute function private.audit_row();
create trigger popups_audit after insert or update or delete on public.popups
  for each row execute function private.audit_row();
create trigger profiles_audit after insert or update or delete on public.profiles
  for each row execute function private.audit_row();
