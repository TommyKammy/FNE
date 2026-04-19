# Issue #140: Epic 14.6 - Implement vocabulary cue cadence inside Battle Mode slice

## Supervisor Snapshot
- Issue URL: https://github.com/TommyKammy/FNE/issues/140
- Branch: codex/issue-140
- Workspace: .
- Journal: .codex-supervisor/issues/140/issue-journal.md
- Current phase: reproducing
- Attempt count: 1 (implementation=1, repair=0)
- Last head SHA: 61ae27e0cb358972a7ee67021fa96f20506512fc
- Blocked reason: none
- Last failure signature: none
- Repeated failure signature count: 0
- Updated at: 2026-04-19T07:26:13.513Z

## Latest Codex Summary
- Reproduced the missing cadence boundary by adding a focused `battleStage` regression test that expected cue-level preview and phrase ownership from the runtime snapshot.
- Implemented `activeCue` snapshot data with `preview` vs `phrase` phase metadata, then updated `BootScene` to render the cue panel from that authoritative cadence surface and only replay pronunciation audio at preview start.
- Verification in this turn: `pnpm --filter @fne/web test -- src/battleStage.test.ts`, `pnpm run typecheck`, and `pnpm run lint` all pass after installing workspace dependencies.

## Active Failure Context
- None recorded.

## Codex Working Notes
### Current Handoff
- Hypothesis: Battle Mode already tracked phrase timing internally, but the exported snapshot did not expose cue-level cadence state, so the UI could not prove preview-first vocabulary ownership at the real rendering boundary.
- What changed: Added a failing regression test for cue cadence, extended `BattlePhraseDefinition`/`BattleStageSnapshot` with authoritative `activeCue` metadata, and updated `BootScene` to render preview-vs-phrase cue text from that metadata while replaying pronunciation only on preview entry.
- Current blocker: none
- Next exact step: create a checkpoint commit for the cadence slice and leave the branch ready for supervisor review or draft PR creation.
- Verification gap: manual live-play readability review under hit/combo feedback is still not exercised by automated tests in this turn.
- Files touched: `apps/web/src/battleStage.test.ts`, `packages/runtime/src/battle-stage.ts`, `packages/runtime/src/scenes/BootScene.ts`
- Rollback concern: the new `activeCue` snapshot surface is now the authoritative cue contract for the Battle Mode scene, so any rollback should revert the test and scene usage together.
- Last focused command: `pnpm run lint`
### Scratchpad
- Keep this section short. The supervisor may compact older notes automatically.
