-- Chapter-level progress (user can mark entire chapter complete)
create table public.chapter_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  chapter_id text not null,
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  unique (user_id, chapter_id)
);

create index chapter_progress_user_chapter_idx on public.chapter_progress (user_id, chapter_id);

alter table public.chapter_progress enable row level security;

create policy "Users can read own chapter_progress"
  on public.chapter_progress for select
  using (auth.uid() = user_id);

create policy "Users can insert own chapter_progress"
  on public.chapter_progress for insert
  with check (auth.uid() = user_id);

create policy "Users can update own chapter_progress"
  on public.chapter_progress for update
  using (auth.uid() = user_id);

create policy "Users can delete own chapter_progress"
  on public.chapter_progress for delete
  using (auth.uid() = user_id);
