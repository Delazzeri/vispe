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
