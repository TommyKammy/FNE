# TypeScript Compatibility Review Checklist

Use this checklist before approving changes that touch TypeScript modules, imports, configuration, or asset loading.

## Module Shape

- [ ] The change keeps the codebase on ES modules only.
- [ ] No CommonJS syntax was introduced (`require`, `module.exports`, `export =`, or `import = require`).
- [ ] No legacy TypeScript namespaces or `const enum` usage was added.
- [ ] Any new module boundary stays compatible with the browser-first stack.

## Import Hygiene

- [ ] Imports stay within the package through relative paths.
- [ ] Cross-package imports use a package entrypoint or documented public adapter.
- [ ] No deep import reaches into another package's private `src/` files.
- [ ] Browser-facing code does not pick up Node-only assumptions through imports.

## Config Hygiene

- [ ] The change does not weaken strict TypeScript settings.
- [ ] New `tsconfig` settings stay aligned with the modern baseline.
- [ ] No deprecated or legacy compiler flag was added.
- [ ] Any exception is documented next to the override so it can be revisited.

## Asset Loading Hygiene

- [ ] Asset loading goes through a typed loader or manifest boundary.
- [ ] Raw string paths are not spread through gameplay code without a clear adapter.
- [ ] Asset access stays compatible with the browser-first runtime.
- [ ] New asset-loading code does not hide type errors behind dynamic lookup.

## Typing Hygiene

- [ ] Public boundaries use explicit types instead of inferred spillover.
- [ ] No `any` was introduced unless it is isolated at an external boundary and justified.
- [ ] `@ts-ignore` and `@ts-nocheck` were not added.
- [ ] Type problems were fixed locally rather than by widening types globally.

## Review Closeout

- [ ] The diff still looks easy to upgrade with future TypeScript releases.
- [ ] Any exception is narrow, documented, and obviously temporary.
- [ ] The checklist was applied without ambiguity to the changed files.
