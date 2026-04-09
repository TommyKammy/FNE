# TypeScript Usage Policy

## Purpose
Keep TypeScript usage browser-first, easy to review, and safe to upgrade.

## Approved Conventions

- Use TypeScript in `apps/web/`, `packages/runtime/`, and `packages/shared/`.
- Keep browser-facing code compatible with the browser-first stack: React for UI, Phaser for gameplay, Vite for build tooling, and plain web APIs where possible.
- Use ES modules only. Prefer `import` and `export` syntax everywhere.
- Import within a package with relative paths.
- Import across packages only from a package entrypoint or documented public adapter, never from another package's private `src/` files.
- Keep `tsconfig` strict and modern. The default posture should be `strict: true`, browser-oriented module resolution, and compiler settings that do not rely on legacy Node-only behavior for browser code.

## Forbidden Patterns

- CommonJS module syntax such as `require`, `module.exports`, `export =`, or `import = require`.
- Legacy TypeScript namespaces.
- `const enum`.
- `@ts-ignore` and `@ts-nocheck`.
- Deep imports that bypass package boundaries.
- New uses of `any` unless they are isolated at a browser API or third-party boundary and are justified in the surrounding code.

## TypeScript 7 Posture

Write code so a future TypeScript 7 upgrade is mostly a config update, not a rewrite.

- Keep types explicit at boundaries between UI, gameplay, shared code, and external services.
- Prefer small adapters around third-party libraries instead of sprinkling compatibility hacks through the codebase.
- Avoid deprecated compiler flags and legacy syntax.
- Fix type problems locally instead of widening types across the app.

## Review Rule

If a change introduces a new module shape, import path, or compiler setting, the review should check it against this policy before approval.
