# Security

## Auth
- Supabase magic link email auth (V1)

## Data boundaries
- Notes and progress are strictly private to the user
- Groups are membership-gated shared data
- Group shared_notes is editable by any member (by design)

## RLS requirements
- RLS enabled on notes, progress, group_members, groups
- Policies enforce:
  - ownership for private tables
  - membership for group tables

## Logging
- Never log note contents
- Avoid logging emails outside auth/profile context
