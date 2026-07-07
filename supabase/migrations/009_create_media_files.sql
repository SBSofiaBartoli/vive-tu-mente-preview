create table if not exists public.media_files (
  id uuid primary key default gen_random_uuid(),
  original_name text not null,
  storage_path text not null,
  public_url text,
  mime_type text not null,
  file_size integer not null,
  section text not null default 'general',
  status text not null default 'pending',
  uploaded_by_name text,
  uploaded_by_email text,
  review_notes text,
  rejection_reason text,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint media_files_status_check
    check (status in ('pending', 'changes_requested', 'approved', 'rejected', 'archived'))
);

create index if not exists media_files_section_idx
on public.media_files (section);

create index if not exists media_files_status_idx
on public.media_files (status);

drop trigger if exists set_media_files_updated_at on public.media_files;

create trigger set_media_files_updated_at
before update on public.media_files
for each row
execute function public.set_updated_at();