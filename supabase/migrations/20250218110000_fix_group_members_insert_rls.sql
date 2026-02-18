-- Security fix: group_members INSERT was over-permissive (any user could join any group).
-- Restrict to: only group creators can add themselves as owner when creating the group.
-- All other joins must use join_group_by_invite_code RPC.
-- Also: allow creators to delete own group (enables createGroup rollback and future delete feature).

drop policy if exists "Authenticated users can join group" on public.group_members;

create policy "Group creators can add themselves as owner"
  on public.group_members for insert
  with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.groups g
      where g.id = group_id and g.created_by = auth.uid()
    )
  );

create policy "Creators can delete own group"
  on public.groups for delete
  using (auth.uid() = created_by);
