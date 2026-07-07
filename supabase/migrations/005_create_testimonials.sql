create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  role text not null,
  workshop_name text,
  comment text not null,
  status text not null default 'pending',
  is_featured boolean not null default false,
  rejection_reason text,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint testimonials_status_check
    check (status in ('pending', 'approved', 'rejected')),

  constraint testimonials_role_check
    check (role in (
      'participant',
      'professional',
      'alliance',
      'company',
      'institution',
      'organization'
    ))
);

drop trigger if exists set_testimonials_updated_at on public.testimonials;

create trigger set_testimonials_updated_at
before update on public.testimonials
for each row
execute function public.set_updated_at();
