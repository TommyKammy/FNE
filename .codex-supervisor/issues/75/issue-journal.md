# Issue #75: Epic 9.2 - Define image generation pipeline

## Supervisor Snapshot
- Issue URL: https://github.com/TommyKammy/FNE/issues/75
- Branch: codex/issue-75
- Workspace: .
- Journal: .codex-supervisor/issues/75/issue-journal.md
- Current phase: addressing_review
- Attempt count: 2 (implementation=1, repair=1)
- Last head SHA: 34b2661d2e0a04977adb5f51800ae67452673452
- Blocked reason: none
- Last failure signature: PRRT_kwDOR-A-2M56V0wn
- Repeated failure signature count: 1
- Updated at: 2026-04-12T03:55:29.740Z

## Latest Codex Summary
Added the missing image-generation contract as [docs/image-generation-pipeline.md](docs/image-generation-pipeline.md), plus a focused reproducer/guard in [scripts/check-image-generation-pipeline.sh](scripts/check-image-generation-pipeline.sh) and the README pointer in [README.md](README.md:19). The new doc covers prompt-template structure, shared style rules, and exact `imageAssetId`-based storage handoff so generated assets can be named and stored without ambiguity.

I reproduced the gap first by running the new check before the doc existed, then verified the fix with the focused check and adjacent contract checks. The branch is pushed and draft PR #83 is open: https://github.com/TommyKammy/FNE/pull/83

Summary: Added a focused failing check for the missing image-generation pipeline, defined the pipeline contract doc, linked it from the README, updated the issue journal, and opened draft PR #83.
State hint: draft_pr
Blocked reason: none
Tests: `sh scripts/check-image-generation-pipeline.sh`; `sh scripts/check-asset-conventions.sh`; `sh scripts/check-ai-content-generation-contract.sh`
Next action: Review draft PR #83 and decide whether to add a higher-level aggregated docs validation step in a follow-up issue.
Failure signature: PRRT_kwDOR-A-2M56V0wn

## Active Failure Context
- Category: review
- Summary: 1 unresolved automated review thread(s) remain.
- Reference: https://github.com/TommyKammy/FNE/pull/83#discussion_r3068928016
- Details:
  - docs/image-generation-pipeline.md:27 summary=_⚠️ Potential issue_ | _🟡 Minor_ **Resolve the `notes` field contract mismatch.** Line 22 says `notes` may improve prompt quality, but the template has no `{{notes}}` placehold... url=https://github.com/TommyKammy/FNE/pull/83#discussion_r3068928016

## Codex Working Notes
### Current Handoff
- Hypothesis: The remaining review blocker is a documentation contract mismatch, not a schema change; the correct fix is to bind optional `notes` explicitly into the prompt template while keeping `term` and `meaning` authoritative.
- What changed: Added `Notes: {{notes}}` plus a non-authoritative mapping rule to `docs/image-generation-pipeline.md`, and strengthened `scripts/check-image-generation-pipeline.sh` to require both the placeholder and the guidance text.
- Current blocker: none
- Next exact step: Re-check PR #83 for any new feedback after commit `1354b3c`, and resolve or answer the remaining review thread if an operator explicitly wants GitHub write actions.
- Verification gap: No broader aggregator script exists in this repo, so verification remains limited to the focused image-pipeline check plus adjacent contract checks.
- Files touched: docs/image-generation-pipeline.md; scripts/check-image-generation-pipeline.sh
- Rollback concern: low; changes are additive documentation and validation only.
- Last focused command: git push origin codex/issue-75
### Scratchpad
- Keep this section short. The supervisor may compact older notes automatically.
- Reproduced initial failure with `sh scripts/check-image-generation-pipeline.sh` before adding the doc; failure was `missing image generation pipeline doc`.
- Verified the CodeRabbit thread with `gh api graphql` and confirmed the only unresolved thread is `PRRT_kwDOR-A-2M56V0wn` on `docs/image-generation-pipeline.md`.
- Local verification after the review fix: `sh scripts/check-image-generation-pipeline.sh`; `sh scripts/check-asset-conventions.sh`; `sh scripts/check-ai-content-generation-contract.sh`.
- Pushed review-fix commit `1354b3c` (`Clarify notes handling in image prompt contract`) to `origin/codex/issue-75`.
