# Archived course markdown

Files here are **not** loaded by the app. The reader uses only `content/course/*.md` entries that pass `scripts/generate-manifest.ts` (see `content/manifest.json`).

## Why these were archived

| File | Reason |
|------|--------|
| `00-INDEX.md` | Table of contents for ingest only; belongs in docs, not served as a chapter |
| `01-front-matter.md` | Title/copyright page; excluded from manifest (not a reader chapter in V1) |
| `02-preface.md` | Ingest stub (“Reviews Foreword Introduction”); real preface is `04-preface.md` |
| `03-further-reading.md` | Ingest stub (page numbers only) |
| `08-further-reading-and-resources.md` | Former standalone chapter; content merged into `07-introduction.md` |

## Active chapters

See [../course/README.md](../course/README.md) for the 15 files currently in the course reader.

## Restoring a file

Move it back to `content/course/`, then run `pnpm generate-manifest`. If it is a stub, prefer merging content into the canonical chapter file instead.
