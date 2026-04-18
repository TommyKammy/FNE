# Issue #116: Epic 12.4 - Add minimal runtime state model for restartable local play

## Supervisor Snapshot
- Issue URL: https://github.com/TommyKammy/FNE/issues/116
- Branch: codex/issue-116
- Workspace: .
- Journal: .codex-supervisor/issues/116/issue-journal.md
- Current phase: reproducing
- Attempt count: 1 (implementation=1, repair=0)
- Last head SHA: c598cd693002ddabedf2e1552593c334454a51be
- Blocked reason: none
- Last failure signature: none
- Repeated failure signature count: 0
- Updated at: 2026-04-18T14:41:02.240Z

## Latest Codex Summary
- Reproduced the runtime-model gap with a focused `revealRound` test, then replaced the coarse `ready -> awaiting-answer -> success|failure` flow with an explicit `idle -> revealing -> awaiting-input -> judged` state machine plus separate `judgment` outcome. Updated `BootScene` to drive restart through those transitions and verified with targeted tests, `lint`, and `typecheck`.

## Active Failure Context
- None recorded.

## Codex Working Notes
### Current Handoff
- Hypothesis: The issue was not missing restart logic; it was that the authoritative runtime boundary still collapsed reveal, input, and terminal outcome into one coarse phase model, which made the loop less explicit than Epic 12.4 requires.
- What changed: Added a focused failing test for explicit `idle/revealing/awaiting-input/judged` transitions and fail-closed invalid transitions. Reworked `packages/runtime/src/reveal-round.ts` to use those phases plus `judgment`, and updated `packages/runtime/src/scenes/BootScene.ts` to restart by returning to `idle`, beginning reveal, playing audio, then advancing into input.
- Current blocker: none
- Next exact step: Commit the state-model/test changes on `codex/issue-116`, then decide whether to open a draft PR now or continue with any additional local review the supervisor requests.
- Verification gap: Manual browser confirmation of restart after both success and failure has not been run in this turn; automated runtime boundary coverage, `lint`, and `typecheck` are passing.
- Files touched: apps/web/src/revealRound.test.ts; packages/runtime/src/reveal-round.ts; packages/runtime/src/scenes/BootScene.ts
- Rollback concern: Low. The change is localized to the reveal-round state machine and its Phaser scene consumer, but any later code that still expects the old phase names would need updating.
- Last focused command: `pnpm typecheck`
### Scratchpad
- Keep this section short. The supervisor may compact older notes automatically.
- Repro command after install: `pnpm test -- --run revealRound`
