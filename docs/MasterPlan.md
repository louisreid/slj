# MasterPlan — Simplicity, Love & Justice (A Discussion Course)

## Vision
A calm, durable reading experience for a long course, with private margin notes and printable worksheets, plus lightweight groups for shared timing and coordination.

## Target audience
Small cohort (<100/year), non-technical. Desktop-first reading, mobile-supported.

## Problem
Word/PDF fails for:
- margin-style notes in-browser
- progress tracking
- printable worksheets that are consistently formatted
- lightweight group coordination

## V1 success metrics
Primary:
- Course completion rate (manual completion per section)
- Weekly active users (WAU)
- Support burden near zero (few/no “how do I…” messages)

Secondary:
- Notes created per active user
- Worksheets printed per active user

## Milestones (V1)
- M0: Repo + Supabase + deploy pipeline ready
- M1: Content pipeline + reader renders chapters with stable block IDs
- M2: Private margin notes (CRUD + RLS)
- M3: Worksheets print routes working
- M4: Progress tracking
- M5: Groups (start date + shared notes block)
- M6: Launch + buffer for fixes

## Out of scope (V1)
- Rich highlights / text-range anchors
- CMS UI
- LMS features (quizzes, certificates, grading, certificates)
- Real-time chat
- Payments

## Key docs
- Tasks: `docs/Tasks.md`
- UX flows: `docs/UserJourneys.md`
- Design: `docs/DesignGuidelines.md`
- Rules: `docs/Rules.md`
- Architecture: `docs/Architecture.md`
- Data model: `docs/DataModel.md`
