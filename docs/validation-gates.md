# Validation Gates

## Status
Proposed

## Purpose
Define the minimum lint and typecheck gates so future implementation issues can reuse the same validation language.

## Typecheck Gate

- The typecheck gate runs the repo's TypeScript compiler validation for the affected code.
- It must fail on any TypeScript error, including missing symbols, incompatible types, invalid module shapes, and unresolved paths.
- The gate is passing only when the TypeScript compiler reports zero errors.
- A PR must not merge while the typecheck gate is failing.

## Lint Gate

- The lint gate runs the repo's lint validation for the affected code.
- It must fail on any lint error and on any lint warning that the repo config treats as blocking.
- The gate is passing only when lint reports zero blocking findings.
- A PR must not merge while the lint gate is failing.

## No-Merge Conditions

- Do not merge when TypeScript hygiene failures are present.
- Do not merge when a lint failure is present.
- Do not merge when a temporary workaround hides the failure instead of fixing it.
- Do not merge when the validation command was skipped or scoped away from the affected code.

## Reusable Verification Rules

- Use the same gate names in future issue acceptance criteria: `typecheck` and `lint`.
- Verify success with exact pass/fail checks that can be mapped to repo scripts later.
- Keep future issue checks focused on whether the gate passes, whether the gate fails, and whether merge is blocked on failure.
- Treat the validation rules as a reusable issue-verification baseline rather than a one-off checklist.
