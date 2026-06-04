# Simplicity, Love & Justice

A discussion course app: read content, take private notes, track progress, join groups.

## Local setup

1. Clone the repo and install: `pnpm i`
2. Copy env template: `cp .env.example .env.local`
3. Fill in Supabase credentials in `.env.local` (URL and anon key from [Supabase Dashboard → API](https://supabase.com/dashboard/project/_/settings/api))
4. Apply Supabase migrations: `pnpm db:push` (requires `supabase login`; uses Supabase CLI v2.104+). If `SUPABASE_ACCESS_TOKEN` in `.env.local` is expired, remove it or the script uses a clean workdir.
5. Run dev server: `pnpm dev` → open [http://localhost:3000](http://localhost:3000)

## Commands (pnpm)

| Command | Description |
|---------|-------------|
| `pnpm i` | Install dependencies |
| `pnpm dev` | Start dev server |
| `pnpm lint` | Run ESLint |
| `pnpm typecheck` | TypeScript check |
| `pnpm test` | Run unit tests |
| `pnpm build` | Production build |
| `pnpm start` | Start production server |

See [AGENTS.md](AGENTS.md) for full directory map and details.

## Required env vars

Create `.env.local` from `.env.example`. Required:

- `NEXT_PUBLIC_SUPABASE_URL` — Project URL from [Supabase Dashboard → API](https://supabase.com/dashboard/project/_/settings/api)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Anon/public key (RLS enforces security)

For deploy steps, see [docs/ReleaseChecklist.md](docs/ReleaseChecklist.md).

## Content patching workflow (quick fixes)

For occasional content glitches (for example, an accidental heading or duplicated quote),
you can patch markdown directly without a full re-ingestion.

1. Edit files in `content/course/*.md`
2. Rebuild manifest IDs: `pnpm generate-manifest`
3. Optional sanity check: `pnpm lint:content`

See [docs/ContentFixes.md](docs/ContentFixes.md) for detailed guidance.
