-- supabase/migrations/002_add_profile_fields.sql

-- 1. Add avatar_url column to profiles
alter table public.profiles
  add column if not exists avatar_url text;

-- 2. Add preferences column to store user preferences
alter table public.profiles
  add column if not exists preferences jsonb default '{}' not null;

-- 3. Update updated_at timestamp on record changes
create or replace function public.set_updated_at()
  returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_updated_at on public.profiles;
create trigger set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at(); 