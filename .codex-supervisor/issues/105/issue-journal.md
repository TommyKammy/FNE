# Issue #105: Epic 11.4 - Define transition to future systems

## Supervisor Snapshot
- Issue URL: https://github.com/TommyKammy/FNE/issues/105
- Branch: codex/issue-105
- Workspace: .
- Journal: .codex-supervisor/issues/105/issue-journal.md
- Current phase: reproducing
- Attempt count: 1 (implementation=1, repair=0)
- Last head SHA: 0bf5137871664bfeb98660f4abe98c0395d24594
- Blocked reason: none
- Last failure signature: none
- Repeated failure signature count: 0
- Updated at: 2026-04-18T10:20:55.027Z

## Latest Codex Summary
- Added a focused `check-review-loop-transition.sh` reproducer for the missing transition note, captured the missing-doc failure, then added `docs/review-loop-transition.md` and a README pointer that keep future persistence and spaced-repetition plans anchored to the existing review-loop and measurement boundaries.

## Active Failure Context
- None recorded.

## Codex Working Notes
### Current Handoff
- Hypothesis: The repo already defined the in-stage review-loop contract and its measurement boundary, but issue #105 had no focused transition note or guard for how later persistence and spaced-repetition systems must extend that contract without widening v1.
- What changed: Added `scripts/check-review-loop-transition.sh`; reproduced the gap as a missing `docs/review-loop-transition.md`; added that transition note plus a README pointer. The new note keeps future persistence tied to authoritative weak-word outcomes and keeps future spaced repetition as a later cross-session layer rather than a rewrite of the current-stage loop.
- Current blocker: none
- Next exact step: Commit the focused docs-and-checkpoint update on `codex/issue-105`, then open or update a draft PR if supervisor flow requires an early review checkpoint.
- Verification gap: Verification is limited to focused doc guards; there is no runtime implementation for persistence or scheduler behavior in this repo yet.
- Files touched: .codex-supervisor/issues/105/issue-journal.md, README.md, docs/review-loop-transition.md, scripts/check-review-loop-transition.sh
- Rollback concern: Low; this is a documentation boundary plus focused verifier, with no runtime behavior changes.
- Last focused command: sh scripts/check-review-loop-transition.sh && sh scripts/check-review-loop.sh && sh scripts/check-measurement-points.sh
### Scratchpad
- Keep this section short. The supervisor may compact older notes automatically.
- Reproduced failure before doc edit: `missing required file: .../docs/review-loop-transition.md`
- Verified after edit: `Review loop transition check passed`
