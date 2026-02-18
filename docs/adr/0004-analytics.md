# ADR 0004 — Analytics (V1 minimal)

## Context
Need simple success metrics without heavy plumbing.

## Decision
No event pipeline in V1. Use profile fields + progress to infer WAU and completion.
Optionally add events/aggregates in production hardening phase.

## Consequences
Less granularity, more durability.
