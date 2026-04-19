# Issue #151: Follow-up - Keep root lint stable after web build artifacts are generated

## Supervisor Snapshot
- Issue URL: https://github.com/TommyKammy/FNE/issues/151
- Branch: codex/issue-151
- Workspace: .
- Journal: .codex-supervisor/issues/151/issue-journal.md
- Current phase: reproducing
- Attempt count: 1 (implementation=1, repair=0)
- Last head SHA: 12282a42f0ae305dc442577912239d63ef23d1ea
- Blocked reason: none
- Last failure signature: none
- Repeated failure signature count: 0
- Updated at: 2026-04-19T09:10:45.545Z

## Latest Codex Summary
- Reproduced the documented failure after installing workspace dependencies: `pnpm --filter @fne/web build` succeeded, and the next root `pnpm lint` failed by linting `apps/web/dist/assets/index-*.js` with typed rules.
- Added a focused Node test (`eslint.config.test.mjs`) that creates a synthetic file under `apps/web/dist/assets`, runs ESLint against `apps` and `packages`, and asserts the generated file is skipped while a real source file is still linted.
- Narrow fix applied in `eslint.config.mjs`: changed root ignore globs from `dist/**` and `coverage/**` to `**/dist/**` and `**/coverage/**` so nested workspace build output stays outside the typed lint set.
- Verified both acceptance states locally: `pnpm lint` passes from a clean state and also after `pnpm --filter @fne/web build`.

## Active Failure Context
- None recorded.

## Codex Working Notes
### Current Handoff
- Hypothesis: The root flat ESLint ignore only matched a top-level `dist/`, so `pnpm lint` traversed `apps/web/dist` after a Vite build and applied typed rules to generated JavaScript.
- What changed: Added a focused ESLint regression test and widened the ignore globs to `**/dist/**` and `**/coverage/**`.
- Current blocker: none
- Next exact step: Commit the fix on `codex/issue-151`; open or update the draft PR if supervisor flow requires it next.
- Verification gap: none for local acceptance; CI has not run yet in this turn.
- Files touched: `.codex-supervisor/issues/151/issue-journal.md`, `eslint.config.mjs`, `eslint.config.test.mjs`
- Rollback concern: low; the change only narrows lint traversal away from generated outputs while preserving the `apps` and `packages` source roots.
- Last focused command: `pnpm lint`
### Scratchpad
- Journal rehydration note: this journal was rehydrated on this host because the prior local-only handoff journal was unavailable.
- Prior host-local handoff text could not be recovered from durable state when recreating the local journal.
- Keep this section short. The supervisor may compact older notes automatically.
