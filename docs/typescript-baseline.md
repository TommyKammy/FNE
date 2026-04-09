# TypeScript Baseline

## Status
Draft

## Purpose
Define the strict root compiler baseline that `apps/web/`, `packages/runtime/`, and `packages/shared/` can extend without drifting into legacy module assumptions.

## Baseline Shape

The root baseline should stay modern and strict:

- `strict: true`
- `noImplicitOverride: true`
- `noPropertyAccessFromIndexSignature: true`
- `exactOptionalPropertyTypes: true`
- `verbatimModuleSyntax: true`
- `module` set to an ESM-first output mode
- `moduleResolution` set to a browser- and bundler-friendly resolver
- `target` kept on a current ESM-era baseline instead of an old CommonJS-era target

The baseline should be shared by the app and package layers through `extends`, with only the narrowest layer-specific overrides.

## Layer Expectations

### `apps/web/`

- Browser-focused
- DOM and browser library types enabled where needed
- ESM-first imports and exports
- No CommonJS or Node-only module assumptions

### `packages/runtime/`

- ESM-first package code
- Shared runtime logic stays isolated from app chrome
- Imports stay within package boundaries or through documented entrypoints

### `packages/shared/`

- Pure shared types, schemas, constants, and utilities
- No runtime-specific globals
- No dependency on app or engine internals

## Deprecated And Legacy Settings To Avoid

Keep the baseline free of deprecated or legacy compiler options, including:

- `importsNotUsedAsValues`
- `preserveValueImports`
- `noImplicitUseStrict`
- `charset`
- `target: ES3`
- `suppressExcessPropertyErrors`
- `suppressImplicitAnyIndexErrors`
- `out`
- `prepend`

Avoid module-shape assumptions that point back to CommonJS, such as `require`, `module.exports`, `export =`, or `import = require`.

## Migration Notes

- Prefer additive config changes and shared `extends` chains over one-off config copies.
- Keep the baseline easy to move forward when future TypeScript releases change defaults or deprecate older flags.
- When a package needs a special compiler setting, document the reason next to the override so the exception is easy to revisit.
- Treat the root baseline as a compatibility contract, not a place to accumulate tool-specific hacks.
