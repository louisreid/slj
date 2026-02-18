# CHECKPOINT — T0 (Scaffold & basic tooling)

## Summary
- Next.js App Router + TypeScript + Tailwind scaffold in place.
- pnpm scripts: dev, lint, typecheck, test, build, start.
- `.env.example` added with Supabase placeholders (no secrets).
- `pnpm dev` runs; `pnpm lint` and `pnpm typecheck` pass.
- T0 checkboxes in `docs/Tasks.md` updated.

## Commands to run
```bash
pnpm i
pnpm dev      # verify app runs
pnpm lint
pnpm typecheck
pnpm test
pnpm build    # optional
```

## Files changed
- **Created:** `package.json`, `tsconfig.json`, `next.config.ts`, `tailwind.config.ts`, `postcss.config.mjs`, `.eslintrc.json`, `jest.config.mjs`, `next-env.d.ts`, `.gitignore`
- **Created:** `app/layout.tsx`, `app/globals.css`, `app/page.tsx`
- **Created:** `app/(public)/.gitkeep`, `app/(auth)/auth/.gitkeep`, `app/(course)/course/.gitkeep`, `app/(worksheets)/worksheets/.gitkeep`, `app/(groups)/groups/.gitkeep`
- **Created:** `.env.example`, `__tests__/smoke.test.ts`
- **Updated:** `docs/Tasks.md` (T0 checkboxes)

## What to do next
Run T1.
