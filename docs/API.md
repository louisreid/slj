# API (V1)

V1 uses Supabase directly with RLS; avoid custom API routes unless necessary.

## Operations
- Auth: email OTP
- Notes:
  - create/update/delete note for { user_id, block_id }
- Progress:
  - upsert per { user_id, section_id }
- Groups:
  - create group
  - join group via invite code/link
  - view/edit shared group notes block

## Error handling
- Show user-friendly messages
- Retry transient network errors
- Do not expose raw SQL errors to users
