# Content fixes and heading guardrails

Use this guide when content extraction introduces occasional heading mistakes (for example, a scripture reference like `Matthew 6:25–33` becoming a heading).

## Where content lives

- Course markdown files: `content/course/*.md`
- Generated block manifest: `content/manifest.json`
- Manifest generation script: `scripts/generate-manifest.ts`

## Safe manual content fix workflow

1. Edit the affected chapter file in `content/course/`.
2. Keep markdown simple:
   - `#` / `##` for real headings only
   - regular paragraphs for scripture references and quote bodies
3. Regenerate manifest:
   ```bash
   pnpm generate-manifest
   ```
4. Optionally run content lint warnings:
   ```bash
   pnpm lint:content
   ```
5. Smoke test in the app:
   - open the chapter
   - confirm headings and paragraphs render correctly
   - confirm notes still anchor correctly where expected

## Notes on block IDs

Block IDs are content-derived in `scripts/generate-manifest.ts`. If you edit paragraph text, that block ID can change. This is expected.

## About existing notes

Because notes are anchored to block IDs, changing paragraph text can move notes away from their original location. For small copy or heading fixes this is usually acceptable, but avoid rewriting whole chapters unless you intentionally want to reset note anchors.
