# Testing (V1 draft)

Start basic, then harden later.

## V1 minimum
- Unit tests:
  - stable ID generation
  - markdown parsing into blocks/sections
- Manual checks:
  - RLS: confirm users cannot access others’ notes/progress via Supabase queries
- Smoke test (manual):
  - sign in
  - create note
  - mark progress
  - print worksheet
  - join group and edit shared group notes

## Later “production hardening”
- Add CI (lint/typecheck/tests)
- Add RLS policy tests using Supabase tools/emulator
- Add Playwright smoke suite
