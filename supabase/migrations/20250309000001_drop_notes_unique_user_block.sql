-- Allow multiple notes per (user, block) for comments UX.
-- No RLS or other schema changes.
alter table public.notes drop constraint if exists notes_user_id_block_id_key;
