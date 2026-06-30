create table if not exists public.admin_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  role text not null default 'admin',
  is_active boolean not null default true,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint admin_profiles_role_check check (
    role in ('admin', 'editor', 'reviewer')
  )
);

create index if not exists admin_profiles_user_id_idx
  on public.admin_profiles (user_id);

create index if not exists admin_profiles_role_idx
  on public.admin_profiles (role);

drop trigger if exists set_admin_profiles_updated_at on public.admin_profiles;

create trigger set_admin_profiles_updated_at
before update on public.admin_profiles
for each row
execute function public.set_updated_at();
