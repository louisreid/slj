# Architecture (Simple C4)

## Context
A small course platform:
- read course content
- private margin notes
- print worksheets
- minimal groups (start date + shared notes)
- manual progress tracking

## Containers
- Web app: Next.js on Vercel
- DB/Auth: Supabase Postgres + Auth + RLS
- Content: Markdown in repo + build script to generate stable IDs manifest

## Data flow
- Content: server renders Markdown → blocks with stable IDs
- Notes/progress: client reads/writes via Supabase (RLS enforces ownership)
- Groups: membership-gated shared data (start date + shared notes)

## Modules
- `content/` source of truth
- `scripts/` generate `content/manifest.json`
- `lib/content/` loaders + ID helpers
- `lib/supabase/` client helpers
- `app/(course)` reader pages
- `app/(groups)` group pages
- `app/(worksheets)` worksheets + print routes

## Operational simplicity
No background jobs required for V1.
Later (production hardening): CI + RLS tests + richer analytics if needed.
