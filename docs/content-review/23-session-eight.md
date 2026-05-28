# Content review — Session Eight (`23-session-eight.md`)

PDF reference: **p.84–87**

## Checklist (applied)

- [x] **Replace the questionnaire grid with a worksheet link (web reader should not show printable tick-box grids)**
  - **PDF**: p.85–86 are the tick-box grids.
  - **Check in web**: after “Please tick a box for each question.” the grid is gone and replaced by a single link line pointing to Worksheets.

- [x] **Remove table-column pseudo-headings**
  - **PDF**: headings like “I BUY / I DO IT / IT DOESN’T CROSS MY MIND” are column labels in the grid, not real reader headings.
  - **Check in web**: those headings no longer appear as separate `##` headings.

# Content review — Session Eight (`23-session-eight.md`)

PDF reference: **p.84–87**

## Checklist (proposed changes)

- [x] **Replace the questionnaire grid with a worksheet link (web reader should not show printable tick-box grids)**
  - **PDF**: p.84 introduces “WHAT ON EARTH AM I DOING?” and says “Please tick a box for each question.” p.85–86 are the multi-column tick-box grids. p.87 contains “GRAND TOTAL” scoring and “SCORES & DEFINITIONS”.
  - **Current web markdown** (table headers + broken concatenated lines):

```125:233:content/course/23-session-eight.md
## What On Earth Am I Doing?
...
Please tick a box for each question.

## It Doesn’T Cross My Mind

## I Buy
...
IT DOESN’T CROSS MY MINDIT DOESN’T CROSS MY MINDI BUYI BUYI BUYFair Trade coffee Fair Trade teaEnvironmentally friendly washing powder/liquid...
...
Each point is worthGRAND TOTALEach point is worthGRAND TOTAL...
```

  - **Applied**:
    - Keep the intro text and `## What On Earth Am I Doing?` heading.
    - After “Please tick a box for each question.” remove everything that is purely the grid/table representation (all the column headings and the concatenated “IT DOESN’T CROSS MY MIND…” blocks).
    - Insert a short callout paragraph linking to `[all worksheets](/worksheets)` for the printable questionnaire (worksheet will live there in your other thread).
    - Keep “Grand Total” + score bands + definitions, but ensure they read as normal paragraphs (remove duplicated “Each point is worthGRAND TOTAL…” merged line).
  - **Why**: aligns with your rule “print-only grids live in worksheets; reader shows links only”, and removes unreadable artifacts.

- [x] **Normalize headings that are only table columns**
  - **Current**: many `## ...` headings like `## I Buy`, `## I Do It`, `## I Think About It`, etc.
  - **Proposed**: delete these headings as part of removing the grid. They are not meaningful headings in web context without the grid.

## PDF extraction notes (for verification)

From PDF extraction:
- p.84 contains the intro and “WHAT ON EARTH AM I DOING?” text.
- p.85–86 contain grid column labels and item rows (worksheet content).
- p.87 contains “GRAND TOTAL”, score bands, and “SCORES & DEFINITIONS”.

