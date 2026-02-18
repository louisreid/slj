# CHECKPOINT — T2 (Content pipeline: Markdown → manifest → stable block IDs)

## Summary
- Chapters live as Markdown in `content/course/`; sample chapter `01-intro.md` added.
- `pnpm generate-manifest` runs `scripts/generate-manifest.ts` and writes `content/manifest.json` with stable block IDs per paragraph/heading (content-based hash).
- Content loader in `lib/content` reads the manifest and exposes `getChapters()`, `getChapter(id)`, `getSections()`, `getBlocks()`, `getBlockById()` for chapters → sections → blocks.
- Blocks have `block_id` for `data-block-id` and `#block-id` linking (reader UI in T3).
- No heavy markdown frameworks; minimal Node + crypto for IDs.

## How to run manifest generation
```bash
pnpm generate-manifest
```
Run after adding or editing any `content/course/*.md` file. Writes `content/manifest.json`.

## Files changed
- **Created:** `content/course/01-intro.md`
- **Created:** `scripts/generate-manifest.ts`, `content/manifest.json` (generated)
- **Created:** `lib/content/types.ts`, `lib/content/loader.ts`, `lib/content/index.ts`
- **Updated:** `package.json` (script `generate-manifest`, devDep `tsx`)
- **Updated:** `docs/Tasks.md` (T2 checkboxes)

## Next
Run T3.
