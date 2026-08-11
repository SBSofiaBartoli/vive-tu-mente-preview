create table if not exists public.education_tips (
  id uuid primary key default gen_random_uuid(),
  segment_key text not null,
  title text not null,
  content text not null,
  resource_url text,
  is_active boolean not null default true,
  starts_at date,
  ends_at date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_education_tips_updated_at on public.education_tips;

create trigger set_education_tips_updated_at
before update on public.education_tips
for each row
execute function public.set_updated_at();
