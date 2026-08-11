create table if not exists public.donation_reports (
  id uuid primary key default gen_random_uuid(),
  donor_name text not null,
  donor_email text not null,
  amount numeric(12, 2) not null check (amount > 0),
  receipt_media_file_id uuid references public.media_files(id) on delete set null,
  status text not null default 'pending' check (
    status in ('pending', 'confirmed', 'rejected', 'archived')
  ),
  review_notes text,
  rejection_reason text,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_donation_reports_updated_at on public.donation_reports;

create trigger set_donation_reports_updated_at
before update on public.donation_reports
for each row
execute function public.set_updated_at();
