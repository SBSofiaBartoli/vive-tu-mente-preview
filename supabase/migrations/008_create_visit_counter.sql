create table if not exists public.page_visits (
  id uuid primary key default gen_random_uuid(),
  page_path text not null default '/',
  visitor_key text not null,
  visited_at timestamptz not null default now()
);

create index if not exists page_visits_page_path_idx
on public.page_visits (page_path);

create index if not exists page_visits_visitor_key_visited_at_idx
on public.page_visits (visitor_key, visited_at);
