# Session formatting rules

Apply these when editing interactive session chapters (`content/course/*-session-*.md`). Reference implementation: [`content/course/09-session-one.md`](../content/course/09-session-one.md).

After edits: `pnpm generate-manifest` (or `pnpm watch:content` while editing).

## Chapter structure

| Rule | Convention |
|------|------------|
| Chapter open | Remove `# SESSION N`; start with `## {Topic}` |
| Goals | `- To …` bullet list under `## Goals` |
| Sections | `## Goals`, `## Reading`, `## Discussion`, `## Action`, `## Prayer`, `## Further reading` |
| Nav title | First `##` becomes manifest title → reader shows the topic title (e.g. “Community”, “Time”) |

## Lists

Consecutive lines starting with `- ` form a bulleted list (blank line ends the list). Use for:

- Goals
- Discussion questions
- Action items (including “Five simple things…” style lists)
- Further reading bibliography
- Foster-style numbered suggestions (intro line stays plain; bullets follow)

A **single** `- Author` line immediately after a quote is an attribution, not a list.

Inside bullets, lines starting with `‘` stay normal list text (no pull-quote bar).

## Quotes and attribution

```markdown
‘Quote text here.’

— Author, source
```

- Quote paragraph starts with `‘` or `“`
- Attribution on the **next line**: `—` (preferred) or `-` (short cite)
- In **session chapters**, quote and attribution stay **two blocks** (margin notes)
- Do **not** use `>` blockquotes (not parsed)

## Special paragraph markers

| Marker | Effect |
|--------|--------|
| `!! …` | Centered headline / key line |
| `>> …` | Side verse / song lyrics (right-aligned, smaller type; blank `>>` = stanza gap) |
| `:: …` | Centered poem or prayer (smaller type; blank `::` = stanza gap) |
| `^…` | Force body text when line starts with a quote character |
| `@scripture …` | Scripture block styling (semibold, Scripture label) |
| `@Matthew 6:25–33` | Explicit reference at end of scripture paragraph |

Short opener with `(1 John 3:17)` at end auto-detects as scripture.

## Inline markdown (supported)

- `*italic*` or `_italic_`
- `[label](/path)` links
- `[](/worksheets/print/{id})` → printer icon (print worksheet)
- **Not supported:** `**bold**` (breaks rendering)

## Worksheets

Handwriting exercises belong on print worksheets, not as `**` fields or ingested tables in markdown.

```markdown
Write this section on paper during or after the session. Open the printable form [](/worksheets/print/things-to-change) (Things to Change).
```

Worksheet ids: `things-to-change`, `budgeting-money-audit`, `time-sheet`, `time-circles`, `what-on-earth-am-i-doing`.

## Further reading

```markdown
## Further reading

- Author, Title (Publisher, year).
- …

'Closing quote if any…'
- Author – Source
```

Normalize `## Further reading / resources` to `## Further reading`. Do not include footnote/endnote fragments in the reader.

## Block IDs and notes

Editing paragraph text changes block IDs. Surgical edits are fine; avoid rewriting whole chapters unless resetting note anchors is intentional.

See also: [`ContentFixes.md`](ContentFixes.md), [`content/course/README.md`](../content/course/README.md).
