# Course content checklist

Track drafting, review, and ready status for each chapter.

| Chapter file        | Draft | Review | Ready |
|---------------------|-------|--------|-------|
| 01-intro.md         | ✓     | ✓      | ✓     |
| (add more as needed)|       |        |       |

## Ingesting from a zip (e.g. ChatGPT-extracted chapters)

If you have a zip of chapter markdown (e.g. `slj_course_sections_md.zip` with files like `01-front-matter.md`, `02-preface.md`, …):

```bash
pnpm run ingest-from-zip ~/Downloads/slj_course_sections_md.zip
pnpm generate-manifest
```

The script copies all `NN-*.md` chapter files (excluding `00-INDEX.md`) into `content/course/` and puts `00-INDEX.md` in `docs/course-00-INDEX.md`. Then run `pnpm generate-manifest` to update the manifest.

Alternatively, unzip manually and copy only `01-*.md` … `35-*.md` into `content/course/` (do not copy `00-INDEX.md` there), then run `pnpm generate-manifest`.

## After editing chapters

After adding or editing markdown in `content/course/*.md`, run:

```bash
pnpm generate-manifest
```

(The build script runs this automatically before `pnpm build`.)
