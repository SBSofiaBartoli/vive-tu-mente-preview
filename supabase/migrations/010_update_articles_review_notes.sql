alter table public.articles
add column if not exists review_notes text;

alter table public.articles
drop constraint if exists articles_status_check;

alter table public.articles
add constraint articles_status_check
check (status in (
  'draft',
  'pending_review',
  'changes_requested',
  'published',
  'rejected',
  'archived'
));