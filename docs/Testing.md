# Testing

## Quick commands

```bash
pnpm lint && pnpm typecheck && pnpm test
pnpm lint:content
pnpm tsx scripts/check-footnote-links.ts
pnpm run generate-manifest   # after content edits; commit manifest.json
PLAYWRIGHT_PORT=3010 pnpm test:e2e
pnpm build
```

## Layers

### Unit (Jest)

- Stable IDs, footnotes, progress, worksheets, smoke
- Run: `pnpm test`

### Content scripts

- `pnpm lint:content` — markdown conventions
- `pnpm tsx scripts/check-footnote-links.ts` — in-text `[n]` ↔ References headings

Run both after any `content/course/*.md` change, then regenerate manifest.

### E2e (Playwright)

| Spec | Coverage |
|------|----------|
| `e2e/james-jul-2026-review.spec.ts` | James editorial + search + footnote return |
| `e2e/james-feedback-visual.spec.ts` | Layout snapshots |
| `e2e/site-footer-layout.spec.ts` | Landing footer |

Run: `pnpm test:e2e` (starts dev server; uses placeholder Supabase when env unset).

**Planned (M2):** journey specs for auth, reader nav, search, worksheets — see [plans/James-Signoff-And-Maturity-Plan.md](plans/James-Signoff-And-Maturity-Plan.md).

## Manual checks (before release)

- RLS: users cannot read others’ notes/progress (Supabase dashboard or two test accounts)
- Sign in → read → note → progress → worksheet print → group notes

See [ReleaseChecklist.md](ReleaseChecklist.md) and [James-Review-Checklist-Round2.md](James-Review-Checklist-Round2.md).

## CI

GitHub Actions runs on every push/PR to `main`: lint, typecheck, unit tests, content scripts, manifest drift check, build, and Playwright e2e (44 tests).

Workflow: `.github/workflows/ci.yml`

## Later hardening

- RLS policy tests (Supabase local / emulator)
- Optional analytics dashboard
