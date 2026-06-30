create table if not exists public.participation_messages (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  phone text,
  interest_area text,
  message text not null,
  is_read boolean not null default false,
  is_starred boolean not null default false,
  is_contacted boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists participation_messages_is_read_idx
  on public.participation_messages (is_read);

create index if not exists participation_messages_is_starred_idx
  on public.participation_messages (is_starred);

create index if not exists participation_messages_is_contacted_idx
  on public.participation_messages (is_contacted);

create index if not exists participation_messages_created_at_idx
  on public.participation_messages (created_at desc);

drop trigger if exists set_participation_messages_updated_at
  on public.participation_messages;

create trigger set_participation_messages_updated_at
before update on public.participation_messages
for each row
execute function public.set_updated_at();
