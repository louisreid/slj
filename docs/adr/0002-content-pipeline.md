# ADR 0002 — Content pipeline

## Context
Course is a long Word doc. Need stable anchors for notes.

## Decision
Convert Word → Markdown, split into chapters, generate stable block IDs into `content/manifest.json`.

## Alternatives
PDF viewer + coordinate annotations, storing content in DB.

## Consequences
Edits to content can change IDs if text changes. Minimize churn by editing carefully.
