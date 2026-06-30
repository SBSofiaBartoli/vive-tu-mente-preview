create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text,
  content text not null,
  cover_image_url text,
  cover_image_alt text,
  author_name text,
  category text,
  status text not null default 'draft',
  is_featured boolean not null default false,
  submitted_by_name text,
  submitted_by_email text,
  rejection_reason text,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint articles_status_check check (
    status in ('draft', 'pending_review', 'published', 'rejected', 'archived')
  )
);

create index if not exists articles_status_idx
  on public.articles (status);

create index if not exists articles_is_featured_idx
  on public.articles (is_featured);

create index if not exists articles_published_at_idx
  on public.articles (published_at desc);

drop trigger if exists set_articles_updated_at on public.articles;

create trigger set_articles_updated_at
before update on public.articles
for each row
execute function public.set_updated_at();
