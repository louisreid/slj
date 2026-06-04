# Content fixes and heading guardrails

Use this guide when content extraction introduces occasional heading mistakes (for example, a scripture reference like `Matthew 6:25–33` becoming a heading).

**Session chapters:** see [`SessionFormattingRules.md`](SessionFormattingRules.md) for the full rulebook (lists, quotes, scripture, worksheets).

## Where content lives

- Course markdown files (active): `content/course/*.md` — see `content/course/README.md`
- Archived ingest stubs: `content/archive/`
- Generated block manifest: `content/manifest.json`
- Manifest generation script: `scripts/generate-manifest.ts`

## Safe manual content fix workflow

1. Edit the affected chapter file in `content/course/`.
2. Keep markdown simple:
   - `#` / `##` for real headings only
   - regular paragraphs for scripture references and quote bodies
   - inline emphasis: `*italic*` or `_italic_` (no `**bold**` — not supported); links: `[label](/path)`
   - **print worksheet icon**: `[](/worksheets/print/{id})` renders a printer icon button (opens print view); optional label: `[Print](/worksheets/print/things-to-change)`
   - **Headline quote** (centered key line, like in the printed course): prefix the paragraph with `!!`:
     ```markdown
     !! Simple living is about being joyfully aware of what we do and why we do it
     ```
     Not standard GitHub Markdown — this project’s convention (like `^` for inline quotes and `@` for scripture).
   - **bulleted lists**: consecutive lines starting with `- ` (blank line ends the list). Optional intro line immediately before the first bullet:
     ```markdown
     Richard Foster suggests:

     - First point
     - Second point
     ```
     A single short `- Name` line after a quote stays an attribution, not a list.
     - Inside bullets, lines that start with `‘` or `“` stay **normal list text** (no pull-quote bar). Use a pull quote only outside the list if you want the bordered quote style.
   - **quotes + attribution** (two paragraphs; blank line between optional):
     ```markdown
     ‘We must be the change we wish to see in the world.’

     — Gandhi
     ```
     The quote line must start with a curly quote (`‘` / `“`) or similar; put the attribution on the **next line** starting with `—` (preferred) or `-` (short attribution only). A blank line between quote and attribution is optional — the parser splits `—` lines automatically. Standard `>` blockquotes are not parsed — use this pattern instead.
     - In the reader, a quote plus its `—` attribution line render as **one figure**; margin notes attach to the quote block only (not the attribution line alone).
   - **Inline quotation on its own line:** start the paragraph with `^` to skip pull-quote styling (the `^` is removed in the reader). Use when the line begins with `‘`, `“`, or `"` but should read as body text:
     ```markdown
     In light of this, we have to ask ourselves the question that Micah asked:

     ^“What does the Lord require of me?” In our world today…
     ```
     Without `^`, a new paragraph that starts with a quote character gets pull-quote styling (left rule + italic).
   - **Bible quotes** (distinct from other quotes):
     - Automatic: verse in curly quotes + reference in parentheses at the end, e.g. `'…' (Micah 6:8)` or `'…' (Matthew 6:25–33).` (trailing `.` after the reference is fine).
     - Explicit reference: append ` @Matthew 6:25–33` (space + `@` + reference) at the end of the paragraph.
     - Explicit scripture block: start the paragraph with `@scripture ` (space after the word) when the line begins with a quote character or you want the scripture styling without relying on parentheses alone.
     - Reader styling: semibold (not italic), stronger left rule, light background, **Scripture** label + reference below the verse.
3. Regenerate manifest (or keep `pnpm watch:content` running while you edit):
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

## Footnotes (`[n]`)

- In-text references like `[38]` in session chapters link to [`content/course/29-references.md`](../content/course/29-references.md).
- Each note is an `## [n]` heading followed by one or more paragraphs.
- After editing notes, run `pnpm generate-manifest` (or `pnpm watch:content`).
- Footnote links are rendered in the reader automatically; do not use `[n](url)` unless you intend a normal markdown link.

## Notes on block IDs

Block IDs are content-derived in `scripts/generate-manifest.ts`. If you edit paragraph text, that block ID can change. This is expected.

## About existing notes

Because notes are anchored to block IDs, changing paragraph text can move notes away from their original location. For small copy or heading fixes this is usually acceptable, but avoid rewriting whole chapters unless you intentionally want to reset note anchors.
