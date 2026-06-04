# Course markdown (active)

These files are the **only** chapter sources for the web reader.

### Editing workflow (recommended)

Use two terminals — no full app rebuild:

| Terminal | Command |
|----------|---------|
| 1 | `pnpm dev` — app UI |
| 2 | `pnpm watch:content` — rebuilds `content/manifest.json` on every save |

After you save a file, wait for `[watch:content] manifest updated` in terminal 2 — with `pnpm dev` running, the open chapter tab should **update on its own** within a couple of seconds (dev-only poller). You can still refresh manually if needed.

### One-off rebuild

```bash
pnpm generate-manifest
```

## Chapters in the app (15)

| File | Reader chapter |
|------|----------------|
| `04-preface.md` | Preface |
| `05-reviews.md` | Reviews |
| `06-foreword-summer-2004.md` | Foreword |
| `07-introduction.md` | Introduction (includes further reading and resources) |
| `09-session-one.md` | Session one |
| `11-session-two.md` | Session two |
| `13-session-three.md` | Session three |
| `15-session-four.md` | Session four |
| `17-session-five.md` | Session five |
| `19-session-six.md` | Session six |
| `21-session-seven.md` | Session seven |
| `23-session-eight.md` | Session eight |
| `25-session-nine.md` | Session nine |
| `27-session-ten.md` | Session ten |
| `28-notes.md` | Notes (end-of-book references for `[n]` footnotes) |

Odd numbers between sessions are reserved for notes/further-reading stubs from older ingests; those live in [../archive/](../archive/) if needed.

## Archived / unused

Ingest duplicates and stubs: [../archive/](../archive/)
