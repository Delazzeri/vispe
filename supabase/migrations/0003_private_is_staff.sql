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
