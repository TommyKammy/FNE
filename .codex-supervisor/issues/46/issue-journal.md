# Issue #46: Epic 6.2 - Define issue template style for this repo

## Supervisor Snapshot
- Issue URL: https://github.com/TommyKammy/FNE/issues/46
- Branch: codex/issue-46
- Workspace: .
- Journal: .codex-supervisor/issues/46/issue-journal.md
- Current phase: addressing_review
- Attempt count: 3 (implementation=2, repair=1)
- Last head SHA: 761bbe1864f5b0c1155852172ffdb774fa39344d
- Blocked reason: none
- Last failure signature: PRRT_kwDOR-A-2M56KIOg
- Repeated failure signature count: 1
- Updated at: 2026-04-10T14:32:59.058Z

## Latest Codex Summary
Pushed `codex/issue-46` and opened draft PR [#50](https://github.com/TommyKammy/FNE/pull/50) against `main`. The GitHub app could not create the PR because of integration permissions, so I used `gh` as fallback and updated the issue journal handoff to reflect the live PR state and remaining verification gap.

Summary: Pushed the committed issue-template changes and opened draft PR #50; updated the journal handoff to the live `pr_open` state.
State hint: pr_open
Blocked reason: none
Tests: `gh pr view 50 --json number,url,state,isDraft,headRefName,baseRefName`; previously verified with `sh scripts/check-issue-template-style.sh`, `sh scripts/check-planning-glossary.sh`, `sh scripts/check-validation-gates.sh`
Next action: Monitor draft PR #50 for review or requested changes, then address feedback or mark it ready for review.
Failure signature: PRRT_kwDOR-A-2M56KIOg

## Active Failure Context
- Category: review
- Summary: 1 unresolved automated review thread(s) remain.
- Reference: https://github.com/TommyKammy/FNE/pull/50#discussion_r3064907030
- Details:
  - scripts/check-issue-template-style.sh:32 summary=_⚠️ Potential issue_ | _🟡 Minor_ **Add explicit README file existence validation before content checks.** Line 55 checks README content, but README presence is never validated ... url=https://github.com/TommyKammy/FNE/pull/50#discussion_r3064907030

## Codex Working Notes
### Current Handoff
- Hypothesis: The issue is a missing repository standard for future implementation-ticket structure, best fixed by following the repo's existing doc-plus-check pattern.
- What changed: Added `docs/issue-template-style.md`, `.github/ISSUE_TEMPLATE/epic.md`, `.github/ISSUE_TEMPLATE/implementation-ticket.md`, `scripts/check-issue-template-style.sh`, and a README pointer to the new spec; committed as `761bbe1`; pushed `codex/issue-46`; opened draft PR #50.
- Current blocker: none
- Next exact step: Commit and push the review-thread fix for `scripts/check-issue-template-style.sh`, then monitor PR #50 for updated review state.
- Verification gap: No broader CI exists; the review fix is covered by focused local shell checks only.
- Files touched: README.md, docs/issue-template-style.md, .github/ISSUE_TEMPLATE/epic.md, .github/ISSUE_TEMPLATE/implementation-ticket.md, scripts/check-issue-template-style.sh, .codex-supervisor/issues/46/issue-journal.md
- Rollback concern: Low; the change only adds documentation, templates, and a focused verification script.
- Last focused command: `sh scripts/check-issue-template-style.sh`
### Scratchpad
- Reproducer before fix: `sh scripts/check-issue-template-style.sh` failed with `missing issue template style doc`.
- Verification after fix: `sh scripts/check-issue-template-style.sh`, `sh scripts/check-planning-glossary.sh`, `sh scripts/check-validation-gates.sh`.
- PR status: draft PR #50 open against `main` from `codex/issue-46`.
- Review finding validated: CodeRabbit thread `PRRT_kwDOR-A-2M56KIOg` is valid because the checker asserted README content without first verifying README existence.
- Review fix applied: added `check_file "$readme" "README"` before the README content assertion in `scripts/check-issue-template-style.sh`.
- Review verification: `sh scripts/check-issue-template-style.sh`; temp-directory negative test with missing `README.md` now fails as `missing README: .../README.md`.
