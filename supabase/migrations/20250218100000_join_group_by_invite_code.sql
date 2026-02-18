-- RPC: join a group by invite code (for authenticated user).
-- SECURITY DEFINER so we can resolve group by code without exposing groups to non-members.

create or replace function public.join_group_by_invite_code(p_invite_code text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_group_id uuid;
  v_uid uuid;
begin
  v_uid := auth.uid();
  if v_uid is null then
    raise exception 'Not authenticated';
  end if;

  select id into v_group_id
  from public.groups
  where invite_code = trim(p_invite_code)
  limit 1;

  if v_group_id is null then
    return null;
  end if;

  insert into public.group_members (group_id, user_id, role)
  values (v_group_id, v_uid, 'member')
  on conflict (group_id, user_id) do nothing;

  return v_group_id;
end;
$$;
