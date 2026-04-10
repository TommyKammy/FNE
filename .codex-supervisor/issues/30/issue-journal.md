# Issue #30: Epic 4.2 - Specify Battle Mode

## Supervisor Snapshot
- Issue URL: https://github.com/TommyKammy/FNE/issues/30
- Branch: codex/issue-30
- Workspace: .
- Journal: .codex-supervisor/issues/30/issue-journal.md
- Current phase: reproducing
- Attempt count: 1 (implementation=1, repair=0)
- Last head SHA: 86d6e1a6ec7da92e94e27f63539b552190adcb9a
- Blocked reason: none
- Last failure signature: none
- Repeated failure signature count: 0
- Updated at: 2026-04-10T08:32:23.806Z

## Latest Codex Summary
- Added a focused Battle Mode documentation check, reproduced the issue as a missing `docs/battle-mode.md` spec, then added the spec and README pointer so the new check passes.

## Active Failure Context
- None recorded.

## Codex Working Notes
### Current Handoff
- Hypothesis: The narrowest reproducible failure is the absence of a Battle Mode spec and README pointer following the same pattern used by `docs/learn-mode.md` and `scripts/check-learn-mode.sh`.
- What changed: Added `scripts/check-battle-mode.sh`; reproduced failure on missing `docs/battle-mode.md`; added `docs/battle-mode.md` covering lane layout, count structure, timing concept, vocabulary cadence, feedback/combo, fail state, and browser-first boundaries; added README link.
- Current blocker: none
- Next exact step: Commit the Battle Mode spec checkpoint, then open a draft PR if branch state remains coherent and no existing PR exists.
- Verification gap: No broader docs aggregation script exists in this repo; focused shell checks passed for Battle Mode, Learn Mode, and product brief.
- Files touched: README.md; docs/battle-mode.md; scripts/check-battle-mode.sh
- Rollback concern: Low; changes are additive docs plus a focused validation script.
- Last focused command: ./scripts/check-battle-mode.sh
### Scratchpad
- Keep this section short. The supervisor may compact older notes automatically.
- Reproducer failure: `grep: .../docs/battle-mode.md: No such file or directory` followed by `missing required Battle Mode content: Battle Mode`.
