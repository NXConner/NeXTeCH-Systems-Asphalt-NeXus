-- supabase/migrations/001_create_profiles_and_policies.sql

-- 1. Create a profiles table linked to auth.users
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  username text,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

-- 2. Enable Row Level Security on profiles
alter table public.profiles enable row level security;

-- 3. Create RLS policies for profiles
-- Allow users to select their own profile
create policy "Select own profile" on public.profiles
  for select using (auth.uid() = id);

-- Allow users to insert their own profile
create policy "Insert own profile" on public.profiles
  for insert with check (auth.uid() = id);

-- Allow users to update their own profile
create policy "Update own profile" on public.profiles
  for update using (auth.uid() = id)
  with check (auth.uid() = id);

-- Allow users to delete their own profile
create policy "Delete own profile" on public.profiles
  for delete using (auth.uid() = id);

-- 4. Seed admin profile directly if the auth user exists
insert into public.profiles (id, email, username)
select id, email, 'Administrator'
from auth.users
where email = 'admin@asphaltpro.com'
on conflict (id) do update set
  email = excluded.email,
  username = excluded.username; 