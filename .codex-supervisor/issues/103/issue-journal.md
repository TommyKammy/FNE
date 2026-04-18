# Issue #103: Epic 11.2 - Define repetition limits

## Supervisor Snapshot
- Issue URL: https://github.com/TommyKammy/FNE/issues/103
- Branch: codex/issue-103
- Workspace: .
- Journal: .codex-supervisor/issues/103/issue-journal.md
- Current phase: reproducing
- Attempt count: 1 (implementation=1, repair=0)
- Last head SHA: 1753259d21aceeff157405b11608c2d2d74b266b
- Blocked reason: none
- Last failure signature: none
- Repeated failure signature count: 0
- Updated at: 2026-04-18T10:01:19.366Z

## Latest Codex Summary
- Reproduced the gap at the review-loop contract boundary by tightening `scripts/check-review-loop.sh` to require explicit numeric repetition-limit language. Updated `docs/review-loop.md` to define a maximum of two review resurfacing passes per weak word in the same stage after first-pass exposure, with unresolved items forced to summary or future follow-up instead of a third pass. Focused review-loop and weak-word checks now pass.

## Active Failure Context
- None recorded.

## Codex Working Notes
### Current Handoff
- Hypothesis: `docs/review-loop.md` only promised a finite loop in prose and left the actual repetition cap implicit, so issue #103 should be fixed by tightening the contract and its guard script rather than broad repo changes.
- What changed: Added explicit review-loop guard assertions in `scripts/check-review-loop.sh`; updated `docs/review-loop.md` so the baseline loop allows at most two review resurfacing passes per weak word after first-pass exposure and forbids a third resurfacing pass in the same stage.
- Current blocker: none
- Next exact step: Commit the focused spec+guard checkpoint on `codex/issue-103` and leave the branch ready for PR/open-review flow.
- Verification gap: Did not run broader repo-wide doc checks beyond the review-loop and weak-word guards because this issue was scoped to the review-loop contract.
- Files touched: scripts/check-review-loop.sh; docs/review-loop.md; .codex-supervisor/issues/103/issue-journal.md
- Rollback concern: Low; the change narrows an existing ambiguous contract into explicit limits without changing unrelated mode rules.
- Last focused command: sh scripts/check-review-loop.sh && sh scripts/check-weak-word-scoring-rules.sh
### Scratchpad
- Keep this section short. The supervisor may compact older notes automatically.
