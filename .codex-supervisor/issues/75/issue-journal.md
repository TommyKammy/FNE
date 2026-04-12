# Issue #75: Epic 9.2 - Define image generation pipeline

## Supervisor Snapshot
- Issue URL: https://github.com/TommyKammy/FNE/issues/75
- Branch: codex/issue-75
- Workspace: .
- Journal: .codex-supervisor/issues/75/issue-journal.md
- Current phase: addressing_review
- Attempt count: 3 (implementation=1, repair=2)
- Last head SHA: 15ee48140e957699faf48e942e56cfa064f1e466
- Blocked reason: none
- Last failure signature: PRRT_kwDOR-A-2M56V13h
- Repeated failure signature count: 1
- Updated at: 2026-04-12T04:03:44.440Z

## Latest Codex Summary
Updated [docs/image-generation-pipeline.md](docs/image-generation-pipeline.md:46) so the prompt contract now explicitly includes `Notes: {{notes}}`, and the assembly rules now state that `notes` is optional editorial guidance only and cannot override the authoritative `term` or `meaning` ([line 64](docs/image-generation-pipeline.md:64)). I also tightened [scripts/check-image-generation-pipeline.sh](scripts/check-image-generation-pipeline.sh:29) so the focused guard now fails if either the `{{notes}}` placeholder or the non-authoritative mapping rule disappears.

The fix is committed and pushed on `codex/issue-75` in `1354b3c` and the follow-up journal sync commit `15ee481`. I did not reply to or resolve the GitHub review thread itself because that is a separate write action. Local verification passed with `sh scripts/check-image-generation-pipeline.sh`, `sh scripts/check-asset-conventions.sh`, and `sh scripts/check-ai-content-generation-contract.sh`.

Summary: Clarified the image prompt contract so optional `notes` is explicitly rendered and constrained, added a regression guard for that contract, updated the issue journal, and pushed the branch updates.
State hint: addressing_review
Blocked reason: none
Tests: `sh scripts/check-image-generation-pipeline.sh`; `sh scripts/check-asset-conventions.sh`; `sh scripts/check-ai-content-generation-contract.sh`
Next action: Re-check PR #83 after the pushed fix and, if desired, reply to or resolve the remaining review thread on GitHub.
Failure signature: PRRT_kwDOR-A-2M56V13h

## Active Failure Context
- Category: review
- Summary: 1 unresolved automated review thread(s) remain.
- Reference: https://github.com/TommyKammy/FNE/pull/83#discussion_r3068933547
- Details:
  - scripts/check-image-generation-pipeline.sh:27 summary=_⚠️ Potential issue_ | _🟡 Minor_ **Add an explicit README existence check for clearer failures.** Right now a missing README is reported as a missing pattern, which obscures ro... url=https://github.com/TommyKammy/FNE/pull/83#discussion_r3068933547

## Codex Working Notes
### Current Handoff
- Hypothesis: The remaining review blocker is the missing README existence guard in `scripts/check-image-generation-pipeline.sh`; the correct fix is to fail fast on an absent README before any pattern grep runs.
- What changed: Added an explicit `[ ! -f "$readme" ]` pre-check to `scripts/check-image-generation-pipeline.sh` so a missing README now reports `missing README: <path>` instead of a misleading missing-pattern failure.
- Current blocker: none
- Next exact step: Re-check PR #83 after CodeRabbit processes commit `81560c9`, and only reply to or resolve the remaining thread if an operator explicitly wants GitHub write actions.
- Verification gap: No broader aggregator script exists in this repo, so verification remains limited to the focused image-pipeline check plus adjacent contract checks.
- Files touched: scripts/check-image-generation-pipeline.sh
- Rollback concern: low; changes are additive documentation and validation only.
- Last focused command: gh api graphql -f query='query { repository(owner: "TommyKammy", name: "FNE") { pullRequest(number: 83) { reviewThreads(first: 20) { nodes { id isResolved isOutdated path line comments(first: 10) { nodes { author { login } body url createdAt } } } } } } }'
### Scratchpad
- Keep this section short. The supervisor may compact older notes automatically.
- Reproduced initial failure with `sh scripts/check-image-generation-pipeline.sh` before adding the doc; failure was `missing image generation pipeline doc`.
- Verified the CodeRabbit thread with `gh api graphql` and confirmed the only unresolved thread is `PRRT_kwDOR-A-2M56V0wn` on `docs/image-generation-pipeline.md`.
- Local verification after the review fix: `sh scripts/check-image-generation-pipeline.sh`; `sh scripts/check-asset-conventions.sh`; `sh scripts/check-ai-content-generation-contract.sh`.
- Pushed review-fix commit `1354b3c` (`Clarify notes handling in image prompt contract`) to `origin/codex/issue-75`.
- Rechecked the current script and confirmed the README guard was still missing even though the doc guard existed.
- Verified the new failure mode with a temporary copy of the script and doc but no README; the script now exits with `missing README: <temp path>`.
- Committed the README guard fix as `81560c9` (`Add README guard to image pipeline check`) and pushed it to `origin/codex/issue-75`.
- Post-push GraphQL review-thread check: `PRRT_kwDOR-A-2M56V0wn` is resolved, `PRRT_kwDOR-A-2M56V13h` remains unresolved but matches the now-pushed script change.
