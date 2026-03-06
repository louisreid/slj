# Release Checklist (Draft)

## Supabase URL configuration

Before deploy, configure Auth URLs in **Supabase Dashboard → Authentication → URL Configuration**:

- **Site URL**
  - Production: `https://<your-production-domain>` (e.g. `https://your-app.vercel.app`)
  - Local dev: `http://localhost:3000`
- **Redirect URLs** (add each used environment):
  - `https://<your-production-domain>/auth/callback`
  - `http://localhost:3000/auth/callback`

Auth callbacks use the request origin; if the production URL is not in Redirect URLs, sign-in will fail.

## Draft deploy
- [ ] Env vars set in Vercel
- [ ] Supabase redirect URLs and Site URL configured (see above)
- [ ] Migrations applied
- [ ] RLS enabled for all tables
- [ ] Manual smoke test:
  - [ ] sign in (email code)
  - [ ] read content
  - [ ] create note
  - [ ] print worksheet
  - [ ] join group + edit group shared notes

## Later “production hardening”
- [ ] GitHub Actions CI required before deploy
- [ ] RLS policy tests passing
- [ ] Rollback plan documented
