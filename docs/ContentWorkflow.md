# Content workflow

How to get course content from Word (or a zip of markdown chapters) into the app.

## Option 1: Zip of extracted chapters (e.g. from ChatGPT)

1. Get a zip with one `.md` file per chapter, named `01-slug.md`, `02-slug.md`, … (and optionally `00-INDEX.md`).
2. From the project root, run:
   ```bash
   pnpm run ingest-from-zip /path/to/slj_course_sections_md.zip
   pnpm generate-manifest
   ```
3. The script copies chapter files into `content/course/` and `00-INDEX.md` into `docs/course-00-INDEX.md`. The manifest is regenerated so the app sees the new chapters.

## Option 2: Manual copy

1. Unzip the chapter markdown somewhere.
2. Copy only the chapter files (`01-*.md` through `35-*.md` or whatever your numbering is) into `content/course/`. Do **not** copy `00-INDEX.md` into `content/course/` or it will appear as a chapter.
3. Run `pnpm generate-manifest`.

## Option 3: Word → single Markdown → split (future)

If you have one big Word doc and convert it to a single Markdown file (e.g. with Pandoc), you can add a script that splits on level-1 headings into `content/course/NN-slug.md`. See the plan in `.cursor/plans/` for the “work document” split approach; for now, using a pre-split zip (Option 1) is the supported path.

## After any content change

- Run `pnpm generate-manifest` so block IDs in `content/manifest.json` stay in sync. The build runs this automatically before `pnpm build`.
