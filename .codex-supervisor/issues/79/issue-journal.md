# Issue #79: Epic 9.6 - Define pack assembly pipeline

## Supervisor Snapshot
- Issue URL: https://github.com/TommyKammy/FNE/issues/79
- Branch: codex/issue-79
- Workspace: .
- Journal: .codex-supervisor/issues/79/issue-journal.md
- Current phase: addressing_review
- Attempt count: 2 (implementation=1, repair=1)
- Last head SHA: d9d56ed4fb2a3937f0be5cfd73bdcaf636b00d6c
- Blocked reason: none
- Last failure signature: PRRT_kwDOR-A-2M56V-Sw
- Repeated failure signature count: 1
- Updated at: 2026-04-12T04:51:06.396Z

## Latest Codex Summary
Added a documentation-backed pack assembly contract and made the missing gap reproducible first. The branch now includes a focused check script, a new [pack-assembly-pipeline doc](docs/pack-assembly-pipeline.md), and a README pointer in [README.md](README.md:24). The doc defines pack-local inputs, deterministic manifest generation, explicit stage assignment rules, and assembly-time structural validation against the existing pack/stage/item contracts.

I reproduced the issue by adding `scripts/check-pack-assembly-pipeline.sh` and running it before the doc existed, which failed on the missing `docs/pack-assembly-pipeline.md`. After the implementation, these checks passed:
`sh scripts/check-pack-assembly-pipeline.sh`
`sh scripts/check-pack-stage-schema.sh`
`sh scripts/check-asset-conventions.sh`
`sh scripts/check-repo-boundaries.sh`

I committed the work on `codex/issue-79`, pushed it, and opened draft PR `#87`: https://github.com/TommyKammy/FNE/pull/87

Summary: Added a focused pack assembly pipeline contract, proved the missing-doc failure with a new narrow check, passed the related schema checks, and opened draft PR #87.
State hint: draft_pr
Blocked reason: none
Tests: Ran `sh scripts/check-pack-assembly-pipeline.sh`, `sh scripts/check-pack-stage-schema.sh`, `sh scripts/check-asset-conventions.sh`, and `sh scripts/check-repo-boundaries.sh`
Next action: Wait for PR review/checks on #87, then tighten the contract further only if reviewers want more specific source-file authoring rules.
Failure signature: PRRT_kwDOR-A-2M56V-Sw

## Active Failure Context
- Category: review
- Summary: 1 unresolved automated review thread(s) remain.
- Reference: https://github.com/TommyKammy/FNE/pull/87#discussion_r3068978713
- Details:
  - docs/pack-assembly-pipeline.md:21 summary=_⚠️ Potential issue_ | _🟠 Major_ **Determinism is underspecified for merged inputs.** Line 21 allows combining multiple source files, but Lines 48–56 do not define canonical or... url=https://github.com/TommyKammy/FNE/pull/87#discussion_r3068978713

## Codex Working Notes
### Current Handoff
- Hypothesis: The remaining PR blocker is a documentation gap, not a loader bug; the pack assembly contract needed explicit deterministic merge, duplicate, and serialization rules for split source files.
- What changed: Tightened `docs/pack-assembly-pipeline.md` so merged inputs now require stable array ordering, duplicate-id rejection, deterministic stage file merge order, and stable JSON key ordering; extended `scripts/check-pack-assembly-pipeline.sh` to assert the new determinism language.
- Current blocker: none
- Next exact step: Commit and push the review-fix update to PR #87, then wait for the unresolved CodeRabbit thread to be re-evaluated or closed.
- Verification gap: No broader end-to-end loader exists yet; verification is still limited to focused documentation checks aligned with existing pack, stage, asset, and repo-boundary contracts.
- Files touched: README.md; docs/pack-assembly-pipeline.md; scripts/check-pack-assembly-pipeline.sh
- Rollback concern: low; changes are documentation-only plus one focused validation script.
- Last focused command: sh scripts/check-repo-boundaries.sh
### Scratchpad
- Keep this section short. The supervisor may compact older notes automatically.
- Reproduced initial failure with `sh scripts/check-pack-assembly-pipeline.sh` before adding the doc.
- Reviewed PR thread `PRRT_kwDOR-A-2M56V-Sw` with the GitHub skill script and confirmed the determinism concern was valid.
- Verification on the review fix: `sh scripts/check-pack-assembly-pipeline.sh`, `sh scripts/check-pack-stage-schema.sh`, `sh scripts/check-asset-conventions.sh`, `sh scripts/check-repo-boundaries.sh`, `git diff --check`.
- Draft PR: https://github.com/TommyKammy/FNE/pull/87
