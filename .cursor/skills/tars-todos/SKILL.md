---
name: tars-todos
description: >-
  Create and update Louis's todo lists per TARS canonical format: Cursor Canvas
  primary, urgency lanes (🔴🟡🟢), dedicated thread markdown secondary, state in
  git. Use when creating project todos, decision checklists, thread task lists,
  or converting TODOS.md items into a canvas.
---

# TARS todos — agent skill

## When to use

- User asks for a todo list, checklist, or decision board for a **project thread**
- User says "tars todos", "canvas todos", or references `TODO-FORMAT.md`
- Starting or refreshing a multi-step project with deadlines or GO/NO-GO forks
- Converting an existing markdown checklist into interactive canvas format

## Canonical spec (read first)

**TARS repo root:** `/Users/louisreid/Documents/å-reid-finance`

**Full doc:** [`docs/tars/TODO-FORMAT.md`](/Users/louisreid/Documents/å-reid-finance/docs/tars/TODO-FORMAT.md)

If this skill is installed in a **non-TARS repo**, still read the canonical doc at the path above (do not fork the spec).

## Louis's rules (non-negotiable)

1. **Primary surface:** Cursor Canvas — `canvases/<slug>-todos.canvas.tsx` in the **git repo**
2. **Structure:** **Urgency lanes only** — 🔴 urgent · 🟡 soon · 🟢 later (not long phase-only sections)
3. **Secondary:** Markdown thread (`*-THREAD.md`) — narrative + link to canvas; **do not duplicate** the full checklist
4. **Done state:** `canvases/<slug>-todos.canvas.data.json` in **git** (other agents read this)
5. **Scope:** Dedicated thread per multi-step project; one pointer in `docs/tars/TODOS.md` if household/strategic
6. **Package decisions:** Optional one-line decision sequence at top; items still sorted into urgency lanes
7. **Todo index codes:** Prefix every item with **lane letter + number** so Louis can say e.g. `R3` or `Y8` in chat:
   - **R** = 🔴 urgent (`R1`, `R2`, …)
   - **Y** = 🟡 soon (`Y1`, `Y2`, …)
   - **G** = 🟢 later (`G1`, `G2`, …)
   - Format in canvas: `R1 — Send Lund email…`
   - Keep stable `id` fields in code; index is display + chat shorthand
   - When user references a code, resolve to that item and act without re-listing the whole board

## Workflow

1. Read [`TODO-FORMAT.md`](/Users/louisreid/Documents/å-reid-finance/docs/tars/TODO-FORMAT.md).
2. Read [`~/.cursor/skills-cursor/canvas/SKILL.md`](../../../.cursor/skills-cursor/canvas/SKILL.md) before writing `.canvas.tsx`.
3. Create or update:
   - `canvases/<slug>-todos.canvas.tsx`
   - `canvases/<slug>-todos.canvas.data.json` (preserve existing statuses when editing)
   - `data/memory/<domain>/<project>/<PROJECT>-THREAD.md` (link to canvas)
4. If IDE panel needed: also ensure file exists under `~/.cursor/projects/<workspace>/canvases/` (copy from repo if missing).
5. Open canvas for user: `open_resource` on the canvas file path.
6. Add one line to `docs/tars/TODOS.md` if strategic/household.

## Canvas authoring

- Import **only** from `cursor/canvas`
- Use `useCanvasState("todo-statuses", …)` for row status
- Click row → cycle `pending` → `in_progress` → `completed`
- Use `CollapsibleSection` per urgency lane
- Header: title, deadline pill, goal sentence, optional decision sequence
- Stats: done/total, in progress (warning tone when > 0), days to deadline
- **Index every row:** `R1 —`, `Y1 —`, `G1 —` (lane letter + number within lane)
- No gradients, box-shadows, or emoji decoration (lane emoji in section titles OK)

### In-progress / active status (required on all todo canvases)

When Louis or an agent is **actively working** an item, set its status to `in_progress` in **both**:

1. Default `status` on the `TodoItem` in `.canvas.tsx` (for first load)
2. `canvases/<slug>-todos.canvas.data.json` under `todo-statuses` (git source of truth)

**Visual pattern** (copy to every todo canvas — engineering, sweden, future threads):

| Element | Implementation |
|---------|----------------|
| **Active now banner** | `Callout tone="warning" title="Active now"` listing all `in_progress` rows with `Pill tone="warning" size="sm"` label "In progress" |
| **Section trailing** | Show `{n} active` warning pill when section has in-progress items, plus done/total pill |
| **In progress stat** | `Stat` with `tone="warning"` when count > 0, else `tone="info"` |
| **TodoList rows** | SDK renders status icon per row; click cycles status |

**Agent rules:**

- Mark `in_progress` when you **start** work on an item in the current thread
- Mark `completed` when done; revert to `pending` only if blocked/deferred
- Never leave stale `in_progress` — update before ending the session
- Read `.canvas.data.json` before picking work; prefer items already `in_progress` or next 🔴 pending
- Louis may say "R3" — resolve code → set `in_progress` → do the work → `completed`

**Helper pattern** (inline in each `.canvas.tsx`, not a shared module):

```tsx
function ActiveNowBanner({ items }: { items: readonly TodoItem[] }) {
  const active = items.filter((t) => t.status === "in_progress");
  if (active.length === 0) return null;
  return (
    <Callout tone="warning" title="Active now">
      <Stack gap={8}>
        {active.map((item) => (
          <Row key={item.id} gap={8} align="center" wrap>
            <Pill tone="warning" size="sm">In progress</Pill>
            <Text>{item.content}</Text>
          </Row>
        ))}
      </Stack>
    </Callout>
  );
}
```

Place `<ActiveNowBanner items={allOpenItems} />` directly below the header, above stats.

## Install in other repos

```bash
# From TARS repo root
cp -R skills/tars-todos /path/to/other-repo/.cursor/skills/tars-todos
# or personal:
cp -R skills/tars-todos ~/.cursor/skills/tars-todos
```

Point `AGENTS.md` in each project repo to TARS `docs/tars/TODO-FORMAT.md`.

## Quick prompt

```text
Use tars-todos skill. Project: {name}. Deadline: {date}. Decisions: {yes/no forks}.
Create canvas + thread; urgency lanes only; commit canvas data to git.
```
