create table if not exists public.faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  category text not null default 'general',
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_faqs_updated_at on public.faqs;

create trigger set_faqs_updated_at
before update on public.faqs
for each row
execute function public.set_updated_at();
