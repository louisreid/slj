# Agent handoff — Jul 2026 (James sign-off complete)

**For agents picking up work on SLJ.** Read this first, then the linked docs.

**Production:** https://slj.talksfromthewarehouse.co.uk  
**Repo:** `main` is current; Vercel auto-deploys on push.

---

## What shipped in this thread (Jul 2026)

### James review rounds (already live)

| Commit | Summary |
|--------|---------|
| `d19ac31` | Round 2: footer, search page, footnote return, prev/next, references backlinks |
| `44c6409` | Search UX: sidebar placement, autofocus, back-to-results |
| `704adab` | Search: visited links, richer previews, scroll to clicked result |
| `3369b3c` | **James 15 Jul sign-off edits** + CI + journey e2e |
| `548185a` | **Talks from the Warehouse** back link (sign-in, landing, sidebar) |

### James sign-off edits (15 Jul call) — all done

1. Reviews: “in an issue” → **“on an issue”** (`content/course/05-reviews.md`)
2. Session Three: *Cat's in the Cradle* centered (`::` not `>>`) (`content/course/13-session-three.md`)
3. Worksheet 1A: **“After reading the example below…”** (`components/worksheets/BudgetingMoneyAuditWorksheet.tsx`)
4. Session Nine: removed errant `'` after “surplus given away” (`content/course/25-session-nine.md`)
5. Footnote [2] cited-in: shows **Introduction**, reliable hash scroll (`lib/footnote-citations.ts`, `components/FootnoteBacklinks.tsx`, `lib/scroll-return.ts`)

**Explicitly not changed:** justified gaps in Work “capitalism” paragraph — James accepted.

### Production maturity — done (except M5)

- **CI:** `.github/workflows/ci.yml` — lint, typecheck, unit, content scripts, manifest drift, build, e2e (45 tests)
- **E2e journeys:** `e2e/auth-smoke.spec.ts`, `reader-navigation.spec.ts`, `search.spec.ts`, `worksheets.spec.ts`, `james-signoff-2026-07.spec.ts`
- **`pnpm test:content`** — content lint + footnote link check

### Talks from the Warehouse back link

- Component: `components/TalksFromTheWarehouseLink.tsx`
- URL constant: `lib/site-branding.ts` → `TALKS_FROM_THE_WAREHOUSE_URL`
- Placed on: sign-in page, unsigned landing, course sidebar footer

---

## Deferred (do not start without Louis/James)

**T9 — Public launch** (see `docs/plans/James-Signoff-And-Maturity-Plan.md` Part 3):

- TFW banner (“Now available”) + remove taster page
- MailChimp email to subscriber list
- Access policy (open vs barrier like Faith in the Soil)

**M5 — RLS policy tests** (optional, when groups are actively used)

**Footnote [56] Stuart Murray** — confirm with James (`docs/James-Next-Meeting-Prep.md`)

---

## Commands agents must run before merging

```bash
pnpm lint && pnpm typecheck && pnpm test
pnpm test:content
pnpm run generate-manifest   # if content/*.md changed; commit manifest.json
PLAYWRIGHT_PORT=3010 pnpm test:e2e
pnpm build
```

CI runs the same on every push/PR to `main`.

---

## Key files by feature

| Feature | Files |
|---------|-------|
| Course reader | `components/CourseReader.tsx`, `components/BlockContent.tsx`, `components/buildReaderBlocks.tsx` |
| Footnotes / return | `lib/scroll-return.ts`, `components/ReturnToReadingButton.tsx`, `lib/footnote-citations.ts` |
| Search | `components/CourseSearchPage.tsx`, `components/NavCourseSearch.tsx`, `lib/course-search-index.ts`, `lib/search-return.ts` |
| Nav / TFW link | `components/AppNav.tsx`, `components/TalksFromTheWarehouseLink.tsx` |
| Content pipeline | `content/course/*.md`, `scripts/generate-manifest.ts`, `content/manifest.json` |
| Auth | `middleware.ts`, `app/(auth)/auth/sign-in/page.tsx` |

---

## Manual test gold path

`docs/James-Review-Checklist-Round2.md` — full pre-release walkthrough (~30–40 min).

Quick spots:

- Session One footnote [6] → References → Return to where you were reading
- Search “money” → open result → Back to search results
- References #note-2 → Cited in: Introduction
- Sign-in / course sidebar → Talks from the Warehouse

---

## Related docs

- [plans/James-Signoff-And-Maturity-Plan.md](plans/James-Signoff-And-Maturity-Plan.md) — full plan with checkboxes
- [Tasks.md](Tasks.md) — implementation task list
- [Testing.md](Testing.md) — test layers and CI
- [James-Review-Checklist-Round2.md](James-Review-Checklist-Round2.md) — manual regression
- [DEPLOYMENT.md](DEPLOYMENT.md) — Vercel + Supabase + DNS
