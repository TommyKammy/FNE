# Issue #38: Epic 5.1 - Define visual readability and input simplicity rules

## Supervisor Snapshot
- Issue URL: https://github.com/TommyKammy/FNE/issues/38
- Branch: codex/issue-38
- Workspace: .
- Journal: .codex-supervisor/issues/38/issue-journal.md
- Current phase: stabilizing
- Attempt count: 2 (implementation=2, repair=0)
- Last head SHA: ba359e0a5c698f3814ac691f9301d26fcc67fbb0
- Blocked reason: none
- Last failure signature: none
- Repeated failure signature count: 0
- Updated at: 2026-04-10T09:30:05.318Z

## Latest Codex Summary
Added a dedicated shared UX rules spec in [docs/ux-rules.md](docs/ux-rules.md), linked it from [README.md](README.md), and added a focused reproducing check in [scripts/check-ux-rules.sh](scripts/check-ux-rules.sh). The new spec covers visual readability, input simplicity, failure/retry feedback, and cross-mode application without binding later implementation details.

I reproduced the gap first with `sh scripts/check-ux-rules.sh`, which failed on a missing `docs/ux-rules.md`, then fixed it and committed the checkpoint as `ba359e0` (`Add shared UX readability rules spec`). I pushed `codex/issue-38` and opened draft PR #41: https://github.com/TommyKammy/FNE/pull/41

Summary: Added and verified the shared UX readability/input simplicity spec, pushed the branch, and opened draft PR #41.
State hint: pr_open
Blocked reason: none
Tests: `sh scripts/check-ux-rules.sh`; `sh scripts/check-learn-mode.sh`; `sh scripts/check-listen-and-match-mode.sh`; `sh scripts/check-battle-mode.sh`
Next action: Wait for PR review or follow-up feedback on PR #41.
Failure signature: none

## Active Failure Context
- None recorded.

## Codex Working Notes
### Current Handoff
- Hypothesis: The issue is satisfied by a shared UX rules spec plus a focused doc contract check; remaining work is review-oriented rather than implementation-oriented.
- What changed: Added `scripts/check-ux-rules.sh`; reproduced failure on missing `docs/ux-rules.md`; added `docs/ux-rules.md` and a README pointer; reran focused doc checks successfully; pushed `codex/issue-38`; opened draft PR #41.
- Current blocker: none
- Next exact step: Monitor PR #41 for review feedback or CI updates.
- Verification gap: No broader aggregate check runner exists in this workspace; verification was done with focused shell checks only.
- Files touched: README.md, docs/ux-rules.md, scripts/check-ux-rules.sh, .codex-supervisor/issues/38/issue-journal.md
- Rollback concern: Low; this change adds a new doc contract and shared spec text without changing existing mode behavior docs.
- Last focused command: gh pr create --draft --base main --head codex/issue-38 --title "Define shared UX readability and input simplicity rules" --body ...
### Scratchpad
- Keep this section short. The supervisor may compact older notes automatically.
- 2026-04-10T09:27:01Z: `sh scripts/check-ux-rules.sh` now passes. Adjacent checks also pass: learn-mode, listen-and-match-mode, battle-mode.
- 2026-04-10T09:32Z: Pushed `codex/issue-38` and opened draft PR #41 after the GitHub app create-PR call returned 403.
