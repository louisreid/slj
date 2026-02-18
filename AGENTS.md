# AGENTS.md — Simplicity, Love & Justice (A Discussion Course)

## Stack (boring + durable)
- Next.js (App Router) + TypeScript
- Supabase (Auth: magic link email, Postgres, RLS)
- Tailwind CSS (minimal, typography-first)
- Hosting: Vercel
- Content: Markdown in repo + stable block IDs

## V1 outcomes
Users can:
- Request a magic link and sign in via email
- Read the course in a clean reader
- Write PRIVATE margin-style notes anchored to paragraphs/blocks
- Track progress (manual per-section completion)
- Print worksheets (print-only; blank tables for writing)
- Join a group and see:
  - course start date
  - a shared free-text “group notes” block editable by all members

## Non-negotiables
- Notes are private by design and by RLS.
- Keep the system bulletproof for 3+ years:
  - no exotic frameworks
  - minimize dependencies
  - avoid clever architecture
- This is not an LMS. Avoid complex features (quizzes, certificates, grading, etc.).
- Content is developer-driven (Markdown in repo). No CMS UI in V1.

## Commands (pnpm)
- Install: `pnpm i`
- Dev: `pnpm dev`
- Lint: `pnpm lint`
- Typecheck: `pnpm typecheck`
- Test (unit): `pnpm test`
- Build: `pnpm build`
- Start: `pnpm start`

## Environment variables
Create `.env.local` from `.env.example`.

Required:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Server-only (only if needed later):
- `SUPABASE_SERVICE_ROLE_KEY` (never in client)

## Directory map
- `app/` Next.js routes
  - `(public)/`
  - `(auth)/auth`
  - `(course)/course`
  - `(worksheets)/worksheets`
  - `(groups)/groups`
- `content/`
  - `course/` markdown chapters
  - `worksheets/` print-only worksheet definitions (md or json)
  - `manifest.json` generated stable IDs
- `lib/`
  - `supabase/` client helpers
  - `content/` loaders + manifest utilities
- `scripts/` content build scripts
- `supabase/` migrations + RLS policies
- `docs/` planning + architecture + rules
- `.cursor/rules/` scoped rules for agents

## Definition of Done (any task)
- Meets acceptance criteria in `docs/Tasks.md`
- Lint + typecheck pass
- RLS enforced for all tables with user data
- No TODOs left behind
- Docs updated (if architecture/decisions changed)

## PR rules (even if you’re solo)
- Small, task-scoped commits
- Update `docs/Tasks.md` checkboxes
- Include “How to test” steps in PR description

## Security rules
- Validate user input (zod) where applicable
- RLS on all tables containing user data
- Never log note contents
- Do not store course content in DB
