# Data Model (V1)

## Entities
### profiles
- `id` (uuid, matches `auth.users.id`)
- `email`
- `created_at`
- `last_sign_in_at` (optional)
- `last_active_at` (optional)

### notes (private)
- `id`
- `user_id`
- `block_id`
- `body`
- `created_at`, `updated_at`

### progress (private)
- `id`
- `user_id`
- `section_id`
- `completed_at` (nullable)
- `last_block_id` (nullable)
- `updated_at`

### groups
- `id`
- `name`
- `invite_code`
- `start_date`
- `shared_notes` (text)
- `created_by`
- `created_at`

### group_members
- `id`
- `group_id`
- `user_id`
- `role` ('member' | 'owner')
- `joined_at`

## Invariants
- `notes.user_id = auth.uid()`
- `progress.user_id = auth.uid()`
- group read/write requires membership
- invite_code is not secret, but controls join flow

## Indexes (minimum)
- notes: (user_id, block_id)
- progress: (user_id, section_id)
- group_members: (group_id, user_id)
- groups: (invite_code)
