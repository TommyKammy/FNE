# Issue #38: Epic 5.1 - Define visual readability and input simplicity rules

## Supervisor Snapshot
- Issue URL: https://github.com/TommyKammy/FNE/issues/38
- Branch: codex/issue-38
- Workspace: .
- Journal: .codex-supervisor/issues/38/issue-journal.md
- Current phase: reproducing
- Attempt count: 1 (implementation=1, repair=0)
- Last head SHA: 241ff6fcb69d907319c1e2859f8ee8638551424c
- Blocked reason: none
- Last failure signature: none
- Repeated failure signature count: 0
- Updated at: 2026-04-10T09:24:38.287Z

## Latest Codex Summary
- Added a focused UX-rules documentation check, reproduced the gap as a missing `docs/ux-rules.md` file, then added the new shared UX rules spec and README pointer.

## Active Failure Context
- Reproduced initially with `sh scripts/check-ux-rules.sh`, which failed on missing `docs/ux-rules.md`.

## Codex Working Notes
### Current Handoff
- Hypothesis: Issue #38 needs a dedicated shared UX rules spec, and the narrowest proof is a new shell check that asserts required readability, simplicity, and recovery content.
- What changed: Added `scripts/check-ux-rules.sh`; reproduced failure on missing `docs/ux-rules.md`; added `docs/ux-rules.md` and a README pointer; reran focused doc checks successfully.
- Current blocker: none
- Next exact step: Commit the UX rules checkpoint on `codex/issue-38`.
- Verification gap: No broader aggregate check runner exists in this workspace; verification was done with focused shell checks only.
- Files touched: README.md, docs/ux-rules.md, scripts/check-ux-rules.sh, .codex-supervisor/issues/38/issue-journal.md
- Rollback concern: Low; this change adds a new doc contract and shared spec text without changing existing mode behavior docs.
- Last focused command: sh scripts/check-ux-rules.sh
### Scratchpad
- Keep this section short. The supervisor may compact older notes automatically.
- 2026-04-10T09:27:01Z: `sh scripts/check-ux-rules.sh` now passes. Adjacent checks also pass: learn-mode, listen-and-match-mode, battle-mode.
