create table if not exists public.education_cards (
  id uuid primary key default gen_random_uuid(),
  segment_key text not null unique,
  title text not null,
  description text not null,
  icon_name text not null,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists education_cards_is_active_idx
on public.education_cards (is_active);

create index if not exists education_cards_sort_order_idx
on public.education_cards (sort_order);

drop trigger if exists set_education_cards_updated_at on public.education_cards;

create trigger set_education_cards_updated_at
before update on public.education_cards
for each row
execute function public.set_updated_at();