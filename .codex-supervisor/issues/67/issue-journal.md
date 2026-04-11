# Issue #67: Epic 8.5 - Define Battle Mode juice budget and readability guardrails

## Supervisor Snapshot
- Issue URL: https://github.com/TommyKammy/FNE/issues/67
- Branch: codex/issue-67
- Workspace: .
- Journal: .codex-supervisor/issues/67/issue-journal.md
- Current phase: reproducing
- Attempt count: 1 (implementation=1, repair=0)
- Last head SHA: 3d2f160f3b2b10869b22939233bfd0a77037f1c5
- Blocked reason: none
- Last failure signature: none
- Repeated failure signature count: 0
- Updated at: 2026-04-11T01:33:19.646Z

## Latest Codex Summary
- Tightened `scripts/check-battle-mode.sh` to require an explicit Battle Mode juice budget, a visibility priority order for competing feedback layers, and lane readability protection around incoming notes.
- Reproduced the issue locally when the new checker failed on missing `readability as a fixed juice budget`, then updated `docs/battle-mode.md` to define those guardrails and re-ran the focused verifier successfully.
- Pushed `codex/issue-67` and opened draft PR #72: https://github.com/TommyKammy/FNE/pull/72

## Active Failure Context
- None recorded.

## Codex Working Notes
### Current Handoff
- Hypothesis: Battle Mode already described restrained feedback, but it lacked explicit guardrails for how much spectacle can be active at once and which cues must win when effects compete.
- What changed: Added focused `check-battle-mode.sh` assertions for juice-budget language, cue-priority ordering, and lane readability protection; then added matching bullets to `docs/battle-mode.md`.
- Current blocker: none
- Next exact step: Watch PR #72 for review or CI signals and expand verification only if adjacent doc checks or reviewer feedback expose another gap.
- Verification gap: Only the focused Battle Mode checker was run; no broader doc suite run yet.
- Files touched: docs/battle-mode.md; scripts/check-battle-mode.sh; .codex-supervisor/issues/67/issue-journal.md
- Rollback concern: Low; changes are limited to doc contract language and its focused verifier.
- Last focused command: gh pr create --draft --base main --head codex/issue-67 --title "Epic 8.5: define Battle Mode juice budget and readability guardrails" --body ...
### Scratchpad
- Keep this section short. The supervisor may compact older notes automatically.
- Reproduced failure signature before patch: `missing required Battle Mode content: readability as a fixed juice budget`
