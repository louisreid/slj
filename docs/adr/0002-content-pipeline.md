# ADR 0002 — Content pipeline

## Context
Course is a long Word doc. Need stable anchors for notes.

## Decision
Convert Word → Markdown, split into chapters, generate stable block IDs into `content/manifest.json`.

## Alternatives
PDF viewer + coordinate annotations, storing content in DB.

## Consequences
Edits to content can change IDs if text changes. Minimize churn by editing carefully.

## Static vs interactive mode
The manifest carries a `mode` per chapter: `"interactive"` or `"static"`. Reference-only chapters (front matter, contents, reviews, preface, foreword, introduction, further reading/resources, notes) are **static**; session and core course chapters are **interactive**. The reader renders static chapters without note affordances or “In this chapter” progress UI; interactive chapters keep full note anchoring and progress. Mode is set at manifest generation time from filename patterns.
