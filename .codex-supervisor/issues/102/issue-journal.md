# Issue #102: Epic 11.1 - Define weak word scoring rules

## Supervisor Snapshot
- Issue URL: https://github.com/TommyKammy/FNE/issues/102
- Branch: codex/issue-102
- Workspace: .
- Journal: .codex-supervisor/issues/102/issue-journal.md
- Current phase: reproducing
- Attempt count: 1 (implementation=1, repair=0)
- Last head SHA: 7cf23ce585d10499e2c38a89c3b555808ea40d38
- Blocked reason: none
- Last failure signature: none
- Repeated failure signature count: 0
- Updated at: 2026-04-18T09:41:50.208Z

## Latest Codex Summary
- Added a focused weak-word scoring contract check, reproduced the gap, and tightened the Learn Mode, Listen & Match Mode, Battle Mode, and review-loop docs so outcome labels map cleanly into the review loop.

## Active Failure Context
- None recorded.

## Codex Working Notes
### Current Handoff
- Hypothesis: The existing review-loop doc named weak-word entry cases, but the mode specs did not expose explicit weak-word scoring boundaries, so acceptance criteria could not be verified in a focused way.
- What changed: Added `scripts/check-weak-word-scoring-rules.sh`; reproduced failure on missing Learn Mode weak-word boundary text; added explicit `Weak-Word Scoring Boundary` sections to Learn Mode, Listen & Match Mode, and Battle Mode; tightened `docs/review-loop.md` so it consumes clean, supported, weakened, and unresolved outcome labels from the modes.
- Current blocker: none
- Next exact step: Commit the focused docs-and-check update, then open or update the draft PR if supervisor flow asks for it.
- Verification gap: No broader end-to-end runtime exists in this repo; verification is limited to the focused doc check plus adjacent mode/review shell checks.
- Files touched: .codex-supervisor/issues/102/issue-journal.md, docs/learn-mode.md, docs/listen-and-match-mode.md, docs/battle-mode.md, docs/review-loop.md, scripts/check-weak-word-scoring-rules.sh
- Rollback concern: Low; the changes are documentation contract tightening plus a new focused verification script.
- Last focused command: ./scripts/check-weak-word-scoring-rules.sh
### Scratchpad
- Keep this section short. The supervisor may compact older notes automatically.
