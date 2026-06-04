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
2. Copy only **active** chapter files into `content/course/` (see `content/course/README.md` for the current list, e.g. `04-preface.md` through `27-session-ten.md`). Do **not** copy ingest stubs (`01-front-matter`, `02-preface`, `03-further-reading`) or `00-INDEX.md` into `content/course/` — put those in `content/archive/` or `docs/course-00-INDEX.md` instead.
3. Run `pnpm generate-manifest`.

## Option 3: Word → single Markdown → split (future)

If you have one big Word doc and convert it to a single Markdown file (e.g. with Pandoc), you can add a script that splits on level-1 headings into `content/course/NN-slug.md`. See the plan in `.cursor/plans/` for the “work document” split approach; for now, using a pre-split zip (Option 1) is the supported path.

## After any content change

- **While editing:** run `pnpm watch:content` in a second terminal (alongside `pnpm dev`). It runs `generate-manifest` whenever you save a file in `content/course/`. In development, the app polls for manifest changes and refreshes the page automatically — no manual browser refresh or full Next.js rebuild. React/CSS edits still hot-reload via Next as usual.
- **One-off:** `pnpm generate-manifest` so block IDs in `content/manifest.json` stay in sync.
- **Production build:** `pnpm build` runs `generate-manifest` automatically via `prebuild`.
