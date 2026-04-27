-- Guitar Ranked — mise à jour édition + tablatures
-- À exécuter dans Supabase > SQL Editor si l'édition ou l'upload PDF/PNG ne fonctionne pas.

create extension if not exists pgcrypto;

alter table public.songs add column if not exists title text;
alter table public.songs add column if not exists artist text default '';
alter table public.songs add column if not exists level text default 'bronze-1';
alter table public.songs add column if not exists youtube text default '';
alter table public.songs add column if not exists description text default '';
alter table public.songs add column if not exists tab_name text default '';
alter table public.songs add column if not exists tab_url text default '';
alter table public.songs add column if not exists tab_type text default '';
alter table public.songs add column if not exists created_at timestamptz not null default now();

alter table public.songs enable row level security;

drop policy if exists "Public can read songs" on public.songs;
create policy "Public can read songs"
  on public.songs for select
  using (true);

drop policy if exists "Authenticated admins can insert songs" on public.songs;
create policy "Authenticated admins can insert songs"
  on public.songs for insert
  to authenticated
  with check (true);

drop policy if exists "Authenticated admins can update songs" on public.songs;
create policy "Authenticated admins can update songs"
  on public.songs for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Authenticated admins can delete songs" on public.songs;
create policy "Authenticated admins can delete songs"
  on public.songs for delete
  to authenticated
  using (true);

insert into storage.buckets (id, name, public)
values ('tabs', 'tabs', true)
on conflict (id) do update set public = true;

drop policy if exists "Public can read tabs" on storage.objects;
create policy "Public can read tabs"
  on storage.objects for select
  using (bucket_id = 'tabs');

drop policy if exists "Authenticated admins can upload tabs" on storage.objects;
create policy "Authenticated admins can upload tabs"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'tabs');

drop policy if exists "Authenticated admins can update tabs" on storage.objects;
create policy "Authenticated admins can update tabs"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'tabs')
  with check (bucket_id = 'tabs');

drop policy if exists "Authenticated admins can delete tabs" on storage.objects;
create policy "Authenticated admins can delete tabs"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'tabs');
