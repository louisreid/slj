# CHECKPOINT — T1 (Supabase setup: Auth + tables + RLS)

## Summary
- Supabase magic-link email auth: sign-in page, callback route, sign-out route; session handled via `@supabase/ssr` (browser + server clients + middleware refresh).
- SQL migrations add profiles, notes, progress, groups, group_members per `docs/DataModel.md`; RLS enabled on all five tables with ownership/membership policies.
- Protected routes: `/course`, `/worksheets`, `/groups` require auth; unauthenticated users redirect to `/auth/sign-in` with `next` preserved.
- No service role key in client code; anon key only.

## Commands to run
```bash
pnpm i
cp .env.example .env.local   # set NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY
pnpm dev                     # verify app runs
pnpm lint
pnpm typecheck
```
Apply migrations in Supabase (Dashboard SQL editor or `supabase db push` if using Supabase CLI): run `supabase/migrations/20250218000001_initial_schema.sql` then `supabase/migrations/20250218000002_rls_policies.sql`. In Supabase Auth settings, add redirect URL: `http://localhost:3000/auth/callback` (and production URL when deployed).

## Files changed
- **Created:** `lib/supabase/client.ts`, `lib/supabase/server.ts`, `middleware.ts`
- **Created:** `app/(auth)/auth/sign-in/page.tsx`, `app/(auth)/auth/callback/route.ts`, `app/(auth)/auth/sign-out/route.ts`, `app/(auth)/auth/layout.tsx`
- **Created:** `app/(course)/course/page.tsx`, `app/(worksheets)/worksheets/page.tsx`, `app/(groups)/groups/page.tsx`
- **Created:** `supabase/migrations/20250218000001_initial_schema.sql`, `supabase/migrations/20250218000002_rls_policies.sql`
- **Updated:** `app/page.tsx` (session-aware home with Sign in / Sign out), `package.json` (deps: `@supabase/supabase-js`, `@supabase/ssr`)
- **Updated:** `docs/Tasks.md` (T1 checkboxes)

## Manual RLS verification steps
1. In Supabase SQL editor, as anon: `select * from notes;` → 0 rows (RLS blocks). Set `request.jwt.claim.sub` via “Run as user” (or sign in and use a client) and retry → only that user’s rows.
2. Same for `progress`: only own rows when authenticated.
3. For `groups` / `group_members`: create a group and membership as user A; as user B, `select * from groups` → no rows; as A or another member → group visible. Confirm inserts/updates only where policies allow.

## Next
Run T2.
