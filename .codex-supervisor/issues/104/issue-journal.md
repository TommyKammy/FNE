# Issue #104: Epic 11.3 - Define review prioritization

## Supervisor Snapshot
- Issue URL: https://github.com/TommyKammy/FNE/issues/104
- Branch: codex/issue-104
- Workspace: .
- Journal: .codex-supervisor/issues/104/issue-journal.md
- Current phase: reproducing
- Attempt count: 1 (implementation=1, repair=0)
- Last head SHA: a611459c6cd5e60c40e5d9b35b1b887454d5b9ef
- Blocked reason: none
- Last failure signature: none
- Repeated failure signature count: 0
- Updated at: 2026-04-18T10:08:19.938Z

## Latest Codex Summary
- Added a focused `check-review-loop.sh` reproducer for missing review prioritization/fairness rules, then updated `docs/review-loop.md` so ordering is anchored to weak-word event order and second resurfacing cannot starve first resurfacing coverage for other weak words.

## Active Failure Context
- None recorded.

## Codex Working Notes
### Current Handoff
- Hypothesis: `docs/review-loop.md` defined weak-word entry and repetition caps but did not explicitly define mixed-item prioritization, so supported-repeat clusters could implicitly over-focus the queue and starve later unresolved items.
- What changed: Tightened `scripts/check-review-loop.sh` with explicit prioritization/fairness assertions, reproduced the missing rule, then added review-loop wording that keeps one authoritative queue ordered by first-pass weak-word events and requires every weak word to get a first resurfacing before any item gets a second resurfacing when capacity is tight.
- Current blocker: none
- Next exact step: Review the wording for issue acceptance, then open or update a draft PR if this checkpoint should be sent upstream before more review-loop work lands.
- Verification gap: No broader repo-wide doc sweep beyond the directly related weak-word and KPI checks.
- Files touched: docs/review-loop.md; scripts/check-review-loop.sh; .codex-supervisor/issues/104/issue-journal.md
- Rollback concern: Low; this is a spec/check alignment change localized to review-loop documentation and its focused verifier.
- Last focused command: ./scripts/check-review-loop.sh
### Scratchpad
- Keep this section short. The supervisor may compact older notes automatically.
- Reproduced failure before spec edit: `missing required review loop content: prioritize weak words by the order their first-pass outcomes marked them weak`
- Verified after edit: `./scripts/check-review-loop.sh && ./scripts/check-weak-word-scoring-rules.sh && ./scripts/check-learning-kpis.sh`
