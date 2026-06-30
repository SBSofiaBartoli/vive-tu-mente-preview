create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create table if not exists public.site_contents (
  id uuid primary key default gen_random_uuid(),
  section_key text not null unique,
  title text,
  subtitle text,
  body text,
  metadata jsonb default '{}'::jsonb,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists site_contents_section_key_idx
  on public.site_contents (section_key);

drop trigger if exists set_site_contents_updated_at on public.site_contents;

create trigger set_site_contents_updated_at
before update on public.site_contents
for each row
execute function public.set_updated_at();
