-- RLS policies for all user-data tables.
-- Notes and progress: private to auth.uid().
-- Groups and group_members: read/write only by members.

alter table public.profiles enable row level security;
alter table public.notes enable row level security;
alter table public.progress enable row level security;
alter table public.groups enable row level security;
alter table public.group_members enable row level security;

-- Profiles: user can read and update own row only
create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Notes: full CRUD only for own rows
create policy "Users can read own notes"
  on public.notes for select
  using (auth.uid() = user_id);

create policy "Users can insert own notes"
  on public.notes for insert
  with check (auth.uid() = user_id);

create policy "Users can update own notes"
  on public.notes for update
  using (auth.uid() = user_id);

create policy "Users can delete own notes"
  on public.notes for delete
  using (auth.uid() = user_id);

-- Progress: full CRUD only for own rows
create policy "Users can read own progress"
  on public.progress for select
  using (auth.uid() = user_id);

create policy "Users can insert own progress"
  on public.progress for insert
  with check (auth.uid() = user_id);

create policy "Users can update own progress"
  on public.progress for update
  using (auth.uid() = user_id);

create policy "Users can delete own progress"
  on public.progress for delete
  using (auth.uid() = user_id);

-- Helper: user is member of a group
create or replace function public.user_is_group_member(gid uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.group_members
    where group_id = gid and user_id = auth.uid()
  );
$$;

-- Groups: select/update only if member (shared_notes editable by any member)
create policy "Members can read group"
  on public.groups for select
  using (public.user_is_group_member(id));

create policy "Members can update group"
  on public.groups for update
  using (public.user_is_group_member(id));

create policy "Authenticated users can create groups"
  on public.groups for insert
  with check (auth.uid() = created_by and auth.uid() is not null);

-- Group members: members can read; join via insert; leave/update by self or owner
create policy "Members can read group_members"
  on public.group_members for select
  using (public.user_is_group_member(group_id));

create policy "Authenticated users can join group"
  on public.group_members for insert
  with check (auth.uid() = user_id);

create policy "Users can update own membership"
  on public.group_members for update
  using (auth.uid() = user_id);

create policy "Users can delete own membership"
  on public.group_members for delete
  using (auth.uid() = user_id);
