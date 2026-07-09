# James Odgers — next meeting prep

Items deferred from the Jul 2026 review implementation. Bring these to the next correspondence or call with James.

## References and content

- **[56] Stuart Murray** — confirm correct citation text and whether it should appear in the course body or references only.
- **Print edition goals (D1)** — James mentioned possible print-oriented changes; digital V1 scope unchanged unless he confirms otherwise.
- **James sanity check (D4)** — ask James to read through Sessions 1, 5, and 9 on staging after deploy and flag any remaining scripture styling or footnote mismatches.

## Already implemented (Jul 2026)

- Landing branding, login-only footer, dynamic copyright (Odgers, NIV, Alpha).
- Sidebar chapter list + book-wide search (replaces Contents).
- Scroll return when following footnotes to references.
- Editorial fixes B1–B22 in course markdown.
- `29-references.md` reconciled against Word NOTES 1–65.

## How to verify before the meeting

See **[James-Review-Checklist.md](James-Review-Checklist.md)** for the full pre-release checklist (automated + manual).

## Rollback

Changes are split into scoped commits (see plan). Revert a section with `git revert <commit-hash>` if James disagrees with a particular batch.
