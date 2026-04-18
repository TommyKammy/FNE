# Parent Observation Features

## Status
Proposed

## Purpose
Define the smallest planning slice that lets a parent notice whether the learner is progressing later, while keeping the first version aligned with the child-focused learning loop.

## Scope

- This planning pass covers only lightweight parent observation ideas that can be derived from the learner's normal stage and review outcomes.
- The goal is to make later progress visibility easier to design, not to add parent-facing accounts, notifications, dashboards, or cross-device syncing in v1.
- The scope should stay compatible with [docs/learn-mode.md](learn-mode.md), [docs/review-loop.md](review-loop.md), [docs/learning-kpis.md](learning-kpis.md), and the browser-first assumptions already documented elsewhere in the repo.

## Candidate v1 Progress Metrics

- `stages started` gives a simple sign that the learner is entering practice sessions at all.
- `stages completed` gives the clearest lightweight signal that the learner is finishing short learning loops instead of abandoning them early.
- `weak words still active` gives a compact view of whether the current stage ended with unresolved recovery items that may need more practice later.
- `clean first-pass items versus supported clears` gives a rough distinction between confident recall and progress that still needed help, without introducing a full mastery model.
- `most recent practice date` gives a parent a basic recency signal without requiring streak pressure, attendance rules, or scheduled reminders.
- [docs/learning-kpis.md](learning-kpis.md) defines the learner-facing recognition accuracy, retry rate, and weak word frequency signals that later parent summaries may compress into simpler labels.

## V1 Planning Scope

- V1 should treat these metrics as planning outputs that can be summarized from existing run results without requiring a parent account.
- V1 should avoid permanent learner profiles, new schema fields, or any server-authored reporting pipeline, and should remain usable without assuming a backend.
- V1 should stay stage-sized and session-sized: a parent needs a lightweight sense of whether practice happened and whether the learner finished or still has weak words to revisit.
- V1 should prefer simple labels and counts over comparative scores, rankings, or dense analytics because the child-focused learning loop remains the core product surface.
- V1 should not force new gameplay branches, teacher-style grading language, or interruptive approval flows inside the learner session.

## Later Product Ideas

- Later work may add durable history across sessions, pack-level rollups, and longer-term trend summaries once the base loop is proven.
- Later work may add parent-facing summaries of repeated weak words, practice consistency, or celebration moments after the runtime and data model are stable.
- Later work may explore shareable reports, notifications, or family account views, but only after the product intentionally decides how identity, privacy, and retention should work.
- Later work may define stronger mastery or readiness signals, but those should extend the existing stage and review outcomes rather than replace them with a separate scoring system too early.

## Review Boundary

- This planning doc is complete enough for the current phase when it names a small set of candidate metrics, separates v1 planning scope from later product ideas, and stays compatible with the current child-focused learning loop.
- Review should confirm that parent observation remains intentionally minimal, does not require new infrastructure assumptions, and does not overtake the learner-facing gameplay priorities.
