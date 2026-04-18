# Issue #91: Epic 10.1 - Define engagement KPIs

## Supervisor Snapshot
- Issue URL: https://github.com/TommyKammy/FNE/issues/91
- Branch: codex/issue-91
- Workspace: .
- Journal: .codex-supervisor/issues/91/issue-journal.md
- Current phase: reproducing
- Attempt count: 1 (implementation=1, repair=0)
- Last head SHA: 3d2ece25af2a3aa48bd8227ebdc47bb4b4457a33
- Blocked reason: none
- Last failure signature: none
- Repeated failure signature count: 0
- Updated at: 2026-04-18T05:54:59.405Z

## Latest Codex Summary
- Added a focused engagement KPI planning doc plus a narrow shell check that first failed on the missing doc and now passes after wiring the new spec into `README.md`.

## Active Failure Context
- None recorded.

## Codex Working Notes
### Current Handoff
- Hypothesis: Issue #91 is a planning-doc gap, so the narrowest reproducible failure is a missing `docs/engagement-kpis.md` spec plus missing README pointer.
- What changed: Added `scripts/check-engagement-kpis.sh`, reproduced the failure on the missing doc, added `docs/engagement-kpis.md`, and linked it from `README.md`.
- Current blocker: none
- Next exact step: Stage the KPI doc, README pointer, check script, and journal update; commit them as the issue-91 checkpoint.
- Verification gap: No broader runner was executed because this ticket only adds a new planning doc and focused shell check; adjacent flow checks passed.
- Files touched: README.md; docs/engagement-kpis.md; scripts/check-engagement-kpis.sh; .codex-supervisor/issues/91/issue-journal.md
- Rollback concern: Low; the change is additive planning documentation plus one focused validation script.
- Last focused command: sh scripts/check-parent-observation.sh
### Scratchpad
- Keep this section short. The supervisor may compact older notes automatically.
- Reproduced failure before implementation with `sh scripts/check-engagement-kpis.sh` -> missing `docs/engagement-kpis.md`.
- Focused verification after edits:
  - `sh scripts/check-engagement-kpis.sh`
  - `sh scripts/check-first-launch-flow.sh`
  - `sh scripts/check-battle-mode.sh`
  - `sh scripts/check-parent-observation.sh`
