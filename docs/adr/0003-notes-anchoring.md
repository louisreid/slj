# ADR 0003 — Notes anchoring

## Context
Margin notes should line up with text, and be reliable.

## Decision
Anchor notes to paragraph/heading block IDs only (V1).

## Alternatives
Text-range/highlight anchors.

## Consequences
Simpler and more stable; highlight support can be added later if needed.

## Addendum (2025) — Presentation
Notes render in a **margin row** beside each note-capable paragraph (desktop: two-column grid; mobile: note stacked under the paragraph). Data model unchanged (`block_id` on `notes` table).
