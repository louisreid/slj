# James Jul 2026 review — pre-release checklist

Use this before sending the site to James Odgers for his review.

**Production URL:** https://slj.talksfromthewarehouse.co.uk  
**Deployed:** 8 Jul 2026 (commits `1ed5d4a`–`2c34afd` on `main`)

---

## How to use this document

- **Phase 1** — already run by the agent (results below). Re-run locally if you change anything.
- **Phases 2–7** — work through in order on **production**, signed in where noted. Tick each box as you go.
- **Phase 8** — only if something is wrong.
- **Phase 9** — what to send James once Phases 2–7 pass.

Estimated time for Phases 2–7: **45–60 minutes**.

---

## Phase 1 — Automated verification ✅

*Run from the repo root. Agent completed this on **8 Jul 2026**.*

```bash
pnpm lint && pnpm typecheck && pnpm test
pnpm tsx scripts/audit-footnotes.ts
PLAYWRIGHT_PORT=3010 pnpm test:e2e
```

### Results (8 Jul 2026)

| Check | Result |
|-------|--------|
| `pnpm lint` | ✅ Pass — no ESLint warnings or errors |
| `pnpm typecheck` | ✅ Pass |
| `pnpm test` | ✅ Pass — 6 suites, 16 tests |
| `pnpm test:e2e` | ✅ Pass — 26/26 Playwright tests (incl. visual snapshots) |
| `pnpm tsx scripts/audit-footnotes.ts` | ⚠️ Expected warnings — see below |

### Footnote audit notes

- **41** unique in-text `[n]` markers in the course body.
- **65** back-matter headings in References.
- **No missing back-matter** for any in-text marker (good).
- **24 back-matter entries** have no in-text marker: `[40]`–`[52]`, `[54]`–`[64]`. These are mostly worksheet-only or bibliography entries — **not a blocker** unless James expects every note to be cited in the body.

Re-run Phase 1 after any code or content change before sending to James.

---

## Phase 2 — Landing & branding (signed out)

Open https://slj.talksfromthewarehouse.co.uk in a **private/incognito** window (or sign out first).

### A1 — Landing copy

- [ ] Page shows **Simplicity Love & Justice** as the main title
- [ ] Subtitle **A Discussion Course** appears above the title
- [ ] **James Odgers** appears as author (no other byline)
- [ ] **Sign in** button is visible
- [ ] No extra marketing paragraphs on the landing page

### A3 / A4 — Footer on landing only

- [ ] Footer is **visible** at the bottom of the landing page
- [ ] Footer contains `Copyright © James Odgers` with the **current year** (2026)
- [ ] Footer contains the **New International Version** line
- [ ] Footer contains **Alpha International** publisher line
- [ ] Footer does **not** contain an ISBN

### A3 — No footer in course reader

Sign in (magic link), then:

- [ ] Open https://slj.talksfromthewarehouse.co.uk/course/09-session-one
- [ ] **No site footer** at the bottom of the reader
- [ ] Copyright line does **not** appear inside the chapter article

---

## Phase 3 — Navigation & search (signed in)

### B9 — Sidebar chapter list

- [ ] Left nav has **Chapters** (expandable section)
- [ ] **No “Contents”** link in the nav
- [ ] Chapter list includes: Preface, Reviews, Foreword, Introduction, Sessions 1–10, References, Further reading
- [ ] Clicking a chapter in the list opens the correct `/course/{id}` page

### A6 — Session labels in nav

- [ ] Session chapters show **Session One**, **Session Two**, etc. above the chapter title in the sidebar

### B-EXTRA — Book-wide search

- [ ] Search box **“Search course”** is visible in the sidebar (below chapter list)
- [ ] Search **Micah** → a result appears; click it → lands on **Introduction**
- [ ] Search a phrase you know from Session 5 (e.g. **money**) → correct session opens

---

## Phase 4 — Reader UX (signed in)

### A5 — Justified text

- [ ] Open any session (e.g. Session One)
- [ ] Body paragraphs are **justified** (aligned on both left and right)

### A7 — Static chapter heading alignment

- [ ] Open https://slj.talksfromthewarehouse.co.uk/course/06-foreword-summer-2004
- [ ] Chapter **h1** lines up with the body text column (not full browser width)

### A8–A10 — Introduction

- [ ] Open https://slj.talksfromthewarehouse.co.uk/course/07-introduction
- [ ] **No** “We would love to hear from you” / “Please write to us” paragraph
- [ ] **Further Reading and Resources** is a subsection under “How to use” (not a top-level chapter heading)
- [ ] Digital **private notes** guidance appears under “How to use the material” (hover / tap note icon)

### A12 — Scroll return from footnotes

- [ ] Open Session One; scroll partway down the page
- [ ] Click an in-text footnote link (e.g. **[6]**)
- [ ] You land on **References** at the correct note
- [ ] **“Return to where you were reading”** appears (top right)
- [ ] Click it → returns to Session One at roughly where you were
- [ ] Dismiss (×) removes the return link

### A11 — Worksheets

- [ ] On Session One, find the **Things to Change** worksheet callout
- [ ] Click **Open** → worksheet loads (**no** “Application error”)
- [ ] Print preview looks usable (table + ruled lines)

### A13 — Chapter navigation

- [ ] On Session One, click **Next** (or sidebar → Session Two)
- [ ] Page loads without hanging
- [ ] Scroll position resets to **top** of the new chapter

---

## Phase 5 — Content spot-checks (signed in)

Skim each page — you are checking James’s editorial fixes landed correctly.

### Preface & front matter

| ID | URL | Check |
|----|-----|-------|
| B1–B3 | [/course/04-preface](https://slj.talksfromthewarehouse.co.uk/course/04-preface) | - [ ] Besom links to **thebesomnetwork.org**<br>- [ ] Faith in the Soil links to **faithinthesoil.co.uk**<br>- [ ] Campbell-Clause / Somerset farm links to **cactusfoodandfaith.com**<br>- [ ] No broken “see .” empty link |
| B4 | [/course/06-foreword-summer-2004](https://slj.talksfromthewarehouse.co.uk/course/06-foreword-summer-2004) | - [ ] Bracket closed after “among the poor in our churches)**)** |

### Session One

| ID | URL | Check |
|----|-----|-------|
| B5 | [/course/09-session-one](https://slj.talksfromthewarehouse.co.uk/course/09-session-one) | - [ ] “**television**” (not “televisio”) |
| B6 | same | - [ ] John 10:10 is **inline** `(John 10:10)` in normal prose — not a scripture block |
| B7 | same | - [ ] “Which ones strike you…” is a **normal paragraph**, not a bullet |
| A6 | same | - [ ] **Session One** label visible in reader |

### Session Three

| ID | URL | Check |
|----|-----|-------|
| B8 | [/course/13-session-three](https://slj.talksfromthewarehouse.co.uk/course/13-session-three) | - [ ] No stray **image.png** before Mark A. Burch attribution |

### Session Five

| ID | URL | Check |
|----|-----|-------|
| B9b | [/course/17-session-five](https://slj.talksfromthewarehouse.co.uk/course/17-session-five) | - [ ] **No** orphan line “With people this is impossible…” below the main Mark 10 block |

### Session Six

| ID | URL | Check |
|----|-----|-------|
| B10 | [/course/19-session-six](https://slj.talksfromthewarehouse.co.uk/course/19-session-six) | - [ ] Anon quote “We buy things we do not want…” appears **after** the happiness / inundated paragraph |

### Session Eight

| ID | URL | Check |
|----|-----|-------|
| B11 | [/course/23-session-eight](https://slj.talksfromthewarehouse.co.uk/course/23-session-eight) | - [ ] “The heavens declare…” appears **before** the Ron Sider block |
| B12 | same | - [ ] Faith in the Soil film links to **faithinthesoil.co.uk** in further reading |

### Session Nine

| ID | URL | Check |
|----|-----|-------|
| B13–B22 | [/course/25-session-nine](https://slj.talksfromthewarehouse.co.uk/course/25-session-nine) | - [ ] Matthew 6:19 inline after “treasures on earth”<br>- [ ] Saving/insurance paragraphs are normal prose (not block quote)<br>- [ ] Credit card tip is a **blockquote** with Centre for a New American Dream<br>- [ ] **Burkett** (not Burkitt); **[53]** after God’s people<br>- [ ] Discipline questions are **separate bullets**<br>- [ ] Giving section uses **(2 Corinthians 9)** inline |

### Session Ten

| ID | URL | Check |
|----|-----|-------|
| B22 | [/course/27-session-ten](https://slj.talksfromthewarehouse.co.uk/course/27-session-ten) | - [ ] Quotes around “you've done that” are **paired correctly** |

---

## Phase 6 — References (signed in)

### C — Back matter

- [ ] Open https://slj.talksfromthewarehouse.co.uk/course/29-references#note-2
- [ ] Note **[2]** reads **Making Christ Known** with lausanne.org link
- [ ] Spot-check Foster notes **[7]**, **[8]**, **[9]** — pages 107, 99, 110–115

### In-text footnote links

From Session One, Five, and Nine:

- [ ] Click **[6]** (or another) in Session One → correct `#note-n` on References
- [ ] Click a footnote in Session Five → correct anchor
- [ ] Click a footnote in Session Nine → correct anchor

### Deferred (not blocking your review)

- [ ] **[56] Stuart Murray** — confirm wording with James at next meeting (see [James-Next-Meeting-Prep.md](James-Next-Meeting-Prep.md))

---

## Phase 7 — Progress & account (signed in)

### Dashboard

- [ ] Home (`/`) shows progress dashboard when signed in
- [ ] Session cards show **Session One**, **Session Two**, etc.

### Progress persistence

- [ ] Open a session → **Mark complete** → refresh page → still marked complete
- [ ] `/progress` reflects completion percentage

### Private notes

- [ ] On Session One, add a note beside a paragraph
- [ ] Refresh → note is still there
- [ ] Sign out and back in → note still there (same account)

### Auth smoke test

- [ ] Sign out → Sign in again via magic link → still works

---

## Phase 8 — If something is wrong (rollback)

Each batch of changes is a separate commit. Revert only what failed:

```bash
git log --oneline -8
```

| Commit | Reverts |
|--------|---------|
| `1ed5d4a` | Landing + footer + copyright (A1–A4) |
| `78f58f1` | Justify + session labels + alignment (A5–A7) |
| `e669f70` | Introduction copy (A8–A10) |
| `93e0460` | Scroll return + worksheets (A11–A13) |
| `127acb4` | Sidebar + search (B9) |
| `8605f47` | Editorial content B1–B22 |
| `5f9383b` | References rewrite (C) |
| `2c34afd` | E2e tests only |

```bash
git revert <commit-hash>
git push origin main
```

Vercel will redeploy automatically after push.

---

## Phase 9 — Ready to send James

When Phases 2–7 are all ticked:

### Email / message draft

> James,
>
> The digital course is ready for your review:
> **https://slj.talksfromthewarehouse.co.uk**
>
> Please sign in with the email address we’ve set up for you (magic link).
>
> **Focus areas:** Sessions **1**, **5**, and **9** (scripture styling and footnotes), plus the **References** section at the end.
>
> **Deferred for our next call:** footnote [56] (Stuart Murray) — we’d like your confirmation on the correct text.
>
> Thank you — Louis

### Your sign-off

- [ ] All Phase 2–7 boxes ticked
- [ ] James has a working login email on Supabase
- [ ] Message sent

---

## Quick links (production)

| Page | URL |
|------|-----|
| Landing | https://slj.talksfromthewarehouse.co.uk/ |
| Sign in | https://slj.talksfromthewarehouse.co.uk/auth/sign-in |
| Preface | https://slj.talksfromthewarehouse.co.uk/course/04-preface |
| Introduction | https://slj.talksfromthewarehouse.co.uk/course/07-introduction |
| Session One | https://slj.talksfromthewarehouse.co.uk/course/09-session-one |
| Session Five | https://slj.talksfromthewarehouse.co.uk/course/17-session-five |
| Session Nine | https://slj.talksfromthewarehouse.co.uk/course/25-session-nine |
| References | https://slj.talksfromthewarehouse.co.uk/course/29-references |
| Progress | https://slj.talksfromthewarehouse.co.uk/progress |

---

## Related docs

- [James-Review-Checklist.md](James-Review-Checklist.md) — original Round 1 checklist
- [James-Review-Checklist-Round2.md](James-Review-Checklist-Round2.md) — **Round 2** fixes after Louis walkthrough (8 Jul 2026)
- [DEPLOYMENT.md](DEPLOYMENT.md) — Vercel / Supabase / DNS setup
