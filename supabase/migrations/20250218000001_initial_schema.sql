-- Initial schema: profiles, notes, progress, groups, group_members
-- RLS enabled on all tables. Policies added in separate migration for clarity.

-- Profiles (1:1 with auth.users)
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  created_at timestamptz not null default now(),
  last_sign_in_at timestamptz,
  last_active_at timestamptz
);

-- Private notes (per user, per block)
create table public.notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  block_id text not null,
  body text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, block_id)
);

create index notes_user_block_idx on public.notes (user_id, block_id);

-- Private progress (per user, per section)
create table public.progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  section_id text not null,
  completed_at timestamptz,
  last_block_id text,
  updated_at timestamptz not null default now(),
  unique (user_id, section_id)
);

create index progress_user_section_idx on public.progress (user_id, section_id);

-- Groups
create table public.groups (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  invite_code text not null unique,
  start_date date,
  shared_notes text not null default '',
  created_by uuid not null references auth.users (id) on delete restrict,
  created_at timestamptz not null default now()
);

create index groups_invite_code_idx on public.groups (invite_code);

-- Group membership
create type public.group_member_role as enum ('member', 'owner');

create table public.group_members (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.groups (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  role public.group_member_role not null default 'member',
  joined_at timestamptz not null default now(),
  unique (group_id, user_id)
);

create index group_members_group_user_idx on public.group_members (group_id, user_id);

-- Trigger: create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, last_sign_in_at)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'email', new.email),
    new.last_sign_in_at
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
