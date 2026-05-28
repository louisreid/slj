# Content review — Session One (`09-session-one.md`)

PDF reference: **p.22–24**

## Checklist (applied)

- [x] **Fix glued quote attribution (web readability)**
  - **PDF**: p.22.
  - **Check in web**: in the “Discussion” section, the Schumacher quote ends cleanly, and the attribution appears on its own line.

- [x] **Remove in-reader table markup for “Time horizons” (print-only grid)**
  - **PDF**: p.23–24 show a grid intended for writing/ticking.
  - **Check in web**: “Time horizons” is not a table; it’s a short sentence telling you to use the printable worksheet.

# Content review — Session One (`09-session-one.md`)

PDF reference: **p.22–24**

## Checklist (proposed changes)

- [x] **Fix glued quote attribution (web readability)**
  - **PDF**: p.22 shows the Schumacher quote, then continues with discussion questions.
  - **Current web markdown**:

```65:68:content/course/09-session-one.md
E. F. Schumacher describing people who, by conscious choice, were learning to live with less.

‘Many of them had a better time than they ever had in their lives because they were discovering the new freedom – the less you need, the freer you become. They discovered and kept discovering that they were carrying far too much baggage and so they dropped pieces right and left. And the more they dropped, the happier they became... and when they thought they had dropped nearly everything, they discovered that they were still needing and using and wasting more than the great majority of mankind.’E. F. Schumacher describing people who, by conscious choice, were learning to live with less.
```

  - **Applied**: inserted a line break before the trailing attribution and formatted it as an em dash attribution line.
  - **Why**: the current single paragraph reads as a typo; the PDF has clean separation.

- [x] **Remove in-reader table markup for “Time horizons” (print-only grid)**
  - **PDF**: p.23 shows a table-like “THINGS TO CHANGE” section and time horizons columns; p.24 continues with writing rows. These are intended as a **printable worksheet**.
  - **Current web markdown**:

```121:138:content/course/09-session-one.md
## Things To Change

Use the printable **[Things to Change worksheet](/worksheets/print/things-to-change)** (see also [all worksheets](/worksheets)) to write out this section on paper during or after the session.

**Daily practice or habit**

Could be spiritual, like prayer, or physical, like daily exercise.

**Possessions**

**Non-material attachments**

### Time horizons

| Immediately | Within six months |
| --- | --- |
|  |  |
```

  - **Applied**:
    - Keep the worksheet links and the three labels (“Daily practice…”, “Possessions”, “Non-material attachments”) as-is (they read well on web).
    - Replace the `### Time horizons` + pipe table with 1–2 lines of prose that point back to the worksheet (no table syntax in the reader).
  - **Why**: pipe tables don’t render meaningfully in the current reader pipeline and don’t match your “print-only grid → worksheets” rule.

## PDF extraction notes (for verification)

From the PDF text extractor:
- p.23 includes the “THINGS TO CHANGE … IMMEDIATELY / WITHIN SIX MONTHS” columns (worksheet content).
- p.24 contains the “Use of Money / Work / Use of Time …” write-in rows (worksheet content).

