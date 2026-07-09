# James review — Round 2 manual checklist

Follow this after the **Round 2** fixes (post–Louis walkthrough, 8 Jul 2026).

**Production:** https://slj.talksfromthewarehouse.co.uk  
**Time:** ~30–40 minutes signed in.

---

## What changed in Round 2

| Area | Fix |
|------|-----|
| Footer | Copyright + “All rights reserved” on one line; Alpha + private publisher on one line |
| Sidebar chapters | No inner scrollbar cap — full chapter list scrolls with the nav |
| Search | Typing in sidebar opens **/search** full-page results (sidebar no longer shows tiny result list) |
| Return link | Only after **footnote** click to References; not via chapter menu or worksheet back |
| Return link UX | Larger dismiss (×) button; restores **scroll position** in chapter, not just session |
| Introduction | “private notes” is normal text (no bold/asterisks) |
| Session 1 | John 10:10 paragraph is normal prose, not scripture block |
| Session 9 | Saving & Insurance normal prose; credit-card quote proper pull-quote + attribution |
| Chapters | Previous / Next links at **top and bottom** of every chapter |
| References | `[n]` numbers same size as citation text; **Cited in:** backlinks to course body |

---

## Phase 1 — Automated (agent or local)

```bash
pnpm lint && pnpm typecheck && pnpm test
pnpm tsx scripts/check-footnote-links.ts
PLAYWRIGHT_PORT=3010 pnpm test:e2e
```

- [ ] All commands pass (footnote link check should report “All in-text footnote links have matching headings”)

---

## Phase 2 — Footer (signed out)

- [ ] Open https://slj.talksfromthewarehouse.co.uk/ (incognito)
- [ ] First footer line reads: `Copyright © James Odgers 2026. All rights reserved.` (one sentence)
- [ ] Alpha line ends with: `…England. Subsequently published privately by the author.` (one paragraph)
- [ ] Course reader still has **no** footer

---

## Phase 3 — Sidebar & search (signed in)

### Chapters list

- [ ] Open sidebar → **Chapters** shows Preface through References **without** a small capped box / inner scrollbar on the list alone
- [ ] You can reach Session One at the top of the list (scroll the nav if needed on small screens)

### Search

- [ ] Search field sits **directly under** the “Simplicity Love & Justice” title (no “Search course” label, no “Open full search” link)
- [ ] Placeholder reads **Search all chapters…**
- [ ] Click or type in sidebar field → opens **/search** full page
- [ ] Search page input is **auto-focused** and ready to type
- [ ] Click a result → opens chapter; **“Back to search results”** appears (top right, below return link if both shown)
- [ ] Back to search returns to same query/results

---

## Phase 4 — Return to reading (signed in)

### Should appear

- [ ] Open Session One; scroll to footnote **[6]** (Jesus’ own words paragraph)
- [ ] Click **[6]** → References
- [ ] **“Return to where you were reading”** appears
- [ ] Click it → returns to the **same paragraph** as footnote [6], not the “Reading” heading
- [ ] × dismiss is **easy to tap** and removes the banner

### Should NOT appear

- [ ] Sidebar → **References** (chapter menu) → **no** return banner
- [ ] Session One → Open worksheet → **Back to course** → **no** return banner
- [ ] Sidebar → another chapter → **no** return banner

---

## Phase 5 — Introduction & scripture styling (signed in)

### Introduction (`/course/07-introduction`)

- [ ] Find the digital notes sentence — **private notes** is plain text (not `**private notes**` / bold)

### Session One (`/course/09-session-one`)

- [ ] Find “true life in all its abundance **(John 10:10)**”
- [ ] It is **normal justified paragraph** — no grey scripture box, no “SCRIPTURE” label

### Session Nine (`/course/25-session-nine`)

#### Saving & Insurance

- [ ] Opening paragraph with Proverbs 6:8 and Matthew 6:19 is **normal prose**
- [ ] No scripture block styling; `(Matthew 6:19)` stays inline in the paragraph

#### Credit & Debit

- [ ] Credit-card tip is a **clean pull-quote** (left rule, no raw `>` characters visible)
- [ ] Attribution reads: **— Centre for A New American Dream**

---

## Phase 6 — Chapter navigation (signed in)

- [ ] Open any session (e.g. Session Five)
- [ ] **Previous / Next** links appear **above** the chapter body
- [ ] Same links also appear **below** the chapter body
- [ ] Both sets work

---

## Phase 7 — References (signed in)

Open https://slj.talksfromthewarehouse.co.uk/course/29-references

- [ ] `[1]`, `[2]`, etc. are **same font size** as the citation text (not huge headings)
- [ ] Under note **[2]** (and others), **Cited in:** links appear where that note is used in the course
- [ ] Click a “Cited in” link → jumps to the correct chapter passage
- [ ] Spot-check **[7]**, **[8]**, **[9]** Foster entries still correct

### Footnote links from body

- [ ] Session One → **[6]** → correct `#note-6`
- [ ] Session Five → any footnote → correct anchor
- [ ] Session Nine → any footnote → correct anchor

---

## Phase 8 — Regression spot-check (signed in)

Quick confirm Round 1 items still good:

- [ ] Justified body text
- [ ] Session labels in sidebar and reader
- [ ] Preface links (Besom, faithinthesoil, cactus)
- [ ] Worksheets Open without error
- [ ] Mark complete + private notes still persist
- [ ] No footer in course reader

---

## Phase 9 — Ready for James

When all boxes are ticked:

- [ ] Deploy latest `main` to production (if testing locally first)
- [ ] Re-run Phase 4–7 on **production**
- [ ] Send James the link with focus on Sessions **1**, **5**, **9** and **References**

**Deferred:** footnote **[56]** Stuart Murray — confirm with James at next call.

---

## Quick links

| Page | URL |
|------|-----|
| Search | https://slj.talksfromthewarehouse.co.uk/search |
| Introduction | https://slj.talksfromthewarehouse.co.uk/course/07-introduction |
| Session One | https://slj.talksfromthewarehouse.co.uk/course/09-session-one |
| Session Nine | https://slj.talksfromthewarehouse.co.uk/course/25-session-nine |
| References | https://slj.talksfromthewarehouse.co.uk/course/29-references |

---

## Related

- [James-Review-Checklist.md](James-Review-Checklist.md) — original Round 1 checklist
- [James-Next-Meeting-Prep.md](James-Next-Meeting-Prep.md) — deferred items
