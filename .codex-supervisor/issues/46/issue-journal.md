# Issue #46: Epic 6.2 - Define issue template style for this repo

## Supervisor Snapshot
- Issue URL: https://github.com/TommyKammy/FNE/issues/46
- Branch: codex/issue-46
- Workspace: .
- Journal: .codex-supervisor/issues/46/issue-journal.md
- Current phase: reproducing
- Attempt count: 1 (implementation=1, repair=0)
- Last head SHA: 6cea4cb326aa505547d0796465d53a419c5c6bce
- Blocked reason: none
- Last failure signature: none
- Repeated failure signature count: 0
- Updated at: 2026-04-10T14:21:19.189Z

## Latest Codex Summary
- Added a focused reproducer `sh scripts/check-issue-template-style.sh`, confirmed the repo was missing the issue-template spec and reusable GitHub templates, then implemented the missing doc, epic template, child issue template, and README pointer. Focused verification now passes.

## Active Failure Context
- None recorded.

## Codex Working Notes
### Current Handoff
- Hypothesis: The issue is a missing repository standard for future implementation-ticket structure, best fixed by following the repo's existing doc-plus-check pattern.
- What changed: Added `docs/issue-template-style.md`, `.github/ISSUE_TEMPLATE/epic.md`, `.github/ISSUE_TEMPLATE/implementation-ticket.md`, `scripts/check-issue-template-style.sh`, and a README pointer to the new spec.
- Current blocker: none
- Next exact step: Stage the new files, commit the checkpoint on `codex/issue-46`, and decide whether to open a draft PR.
- Verification gap: No broader CI exists; only focused shell-doc checks were run locally.
- Files touched: README.md, docs/issue-template-style.md, .github/ISSUE_TEMPLATE/epic.md, .github/ISSUE_TEMPLATE/implementation-ticket.md, scripts/check-issue-template-style.sh
- Rollback concern: Low; the change only adds documentation, templates, and a focused verification script.
- Last focused command: sh scripts/check-issue-template-style.sh
### Scratchpad
- Reproducer before fix: `sh scripts/check-issue-template-style.sh` failed with `missing issue template style doc`.
- Verification after fix: `sh scripts/check-issue-template-style.sh`, `sh scripts/check-planning-glossary.sh`, `sh scripts/check-validation-gates.sh`.
