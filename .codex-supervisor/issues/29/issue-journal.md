# Issue #29: Epic 4.1 - Specify Learn Mode

## Supervisor Snapshot
- Issue URL: https://github.com/TommyKammy/FNE/issues/29
- Branch: codex/issue-29
- Workspace: .
- Journal: .codex-supervisor/issues/29/issue-journal.md
- Current phase: reproducing
- Attempt count: 1 (implementation=1, repair=0)
- Last head SHA: 6c890e395c662f7cbcb8a95136b122c4ceab0544
- Blocked reason: none
- Last failure signature: none
- Repeated failure signature count: 0
- Updated at: 2026-04-10T08:14:14.398Z

## Latest Codex Summary
- Added a standalone Learn Mode behavior spec in `docs/learn-mode.md`, linked it from `README.md`, and introduced `scripts/check-learn-mode.sh` as the focused verification gate for flow, timing, difficulty assumptions, and pass conditions.

## Active Failure Context
- Initial reproducible gap: `./scripts/check-learn-mode.sh` failed with `no such file or directory`, which showed the repo had no focused Learn Mode spec or verification hook yet.

## Codex Working Notes
### Current Handoff
- Hypothesis: Issue #29 can be satisfied by adding a standalone Learn Mode spec plus a narrow shell check consistent with the repo's existing doc-validation pattern.
- What changed: Created `docs/learn-mode.md`; added `scripts/check-learn-mode.sh`; added the README pointer to the new spec.
- Current blocker: none
- Next exact step: Commit the verified doc/check changes on `codex/issue-29`, then decide whether to open a draft PR for this checkpoint.
- Verification gap: No broader doc aggregator exists in this repo yet, so verification is still by focused script execution.
- Files touched: `README.md`, `docs/learn-mode.md`, `scripts/check-learn-mode.sh`, `.codex-supervisor/issues/29/issue-journal.md`
- Rollback concern: low; changes are additive documentation and a focused check script.
- Last focused command: `./scripts/check-learn-mode.sh`
### Scratchpad
- Keep this section short. The supervisor may compact older notes automatically.
- Verification run: `./scripts/check-learn-mode.sh`, `./scripts/check-planning-glossary.sh`, `./scripts/check-pack-stage-schema.sh`
