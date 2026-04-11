# Issue #65: Epic 8.3 - Define miss handling that preserves flow

## Supervisor Snapshot
- Issue URL: https://github.com/TommyKammy/FNE/issues/65
- Branch: codex/issue-65
- Workspace: .
- Journal: .codex-supervisor/issues/65/issue-journal.md
- Current phase: reproducing
- Attempt count: 1 (implementation=1, repair=0)
- Last head SHA: 642bc4ce502105e9603302227ce4c436a69e7640
- Blocked reason: none
- Last failure signature: none
- Repeated failure signature count: 0
- Updated at: 2026-04-11T00:49:45.312Z

## Latest Codex Summary
- Added a focused Battle Mode check for isolated-miss continuity, reproduced the gap locally, and updated the Battle Mode spec so misses preserve note flow, cue visibility, and immediate recovery through subsequent notes.

## Active Failure Context
- None recorded.

## Codex Working Notes
### Current Handoff
- Hypothesis: The existing Battle Mode contract defined miss penalty and fail state, but not the post-miss continuity needed to preserve rhythm and learner momentum after an isolated error.
- What changed: Tightened `scripts/check-battle-mode.sh` with focused miss-continuity assertions, reproduced the missing-spec failure, then updated `docs/battle-mode.md` to require uninterrupted scroll/song flow, fast-clearing miss feedback, cue persistence, and recovery through the next judged notes.
- Current blocker: none
- Next exact step: Monitor draft PR #70 and continue only if follow-up review asks for stronger verification or adjacent miss-recovery clarifications.
- Verification gap: No runtime/playtest verification is possible in this docs-only workspace; verification is limited to doc contract checks.
- Files touched: .codex-supervisor/issues/65/issue-journal.md; docs/battle-mode.md; scripts/check-battle-mode.sh
- Rollback concern: Low; changes only narrow and clarify the Battle Mode documentation contract and its focused validation script.
- Last focused command: git push -u origin codex/issue-65 && gh pr create --draft --base main --head codex/issue-65 --title "Define miss continuity in battle mode" --body ...
### Scratchpad
- Keep this section short. The supervisor may compact older notes automatically.
