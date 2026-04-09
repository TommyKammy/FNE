# Repository Boundaries and Package Ownership

## Status
Proposed

## Goal
Define the first-wave repository shape so engine code, shared code, and content data stay separated.

## Top-Level Layout

The repository starts with three top-level areas:

- `apps/` for runnable application surfaces
- `packages/` for reusable code
- `content/` for pure game data and media

The first intended folders under that shape are:

- `apps/web/` for the browser entrypoint, shell, routing, and screen orchestration
- `packages/runtime/` for game-loop code, scene orchestration, and engine-specific adapters
- `packages/shared/` for shared types, schemas, constants, and utilities
- `content/packs/<pack-id>/` for vocabulary packs, manifests, lesson data, and asset references

## Ownership

- `apps/web/` owns the browser experience around the game: menus, onboarding, settings, and screen composition.
- `packages/runtime/` owns the moment-to-moment play experience: timing, state transitions, note flow, and engine integration.
- `packages/shared/` owns code that needs to be reused by both app and runtime layers, especially types and validation helpers.
- `content/` owns lesson data only: prompts, word lists, art, audio references, and pack metadata.

## Dependency Direction

Dependencies should flow downward only:

- `apps/web/` may import from `packages/runtime/` and `packages/shared/`
- `packages/runtime/` may import from `packages/shared/`
- `packages/shared/` should not import from `packages/runtime/` or `apps/web/`
- `content/` should not import application code at all

This keeps the executable layers aware of data, while keeping data blind to engine implementation.

## Content and Engine Separation

The engine must not embed lesson content directly in gameplay code.

Instead, runtime code reads pack data from `content/packs/<pack-id>/` through a manifest or loader boundary. That makes it possible to add a new mod pack by copying or adding content files, without duplicating gameplay logic or rebuilding the data model around each pack.

## Future Mod Pack Rule

Any future mod pack should fit the same shape:

- one pack directory
- one pack manifest
- pack-local media and text data
- no direct dependency on engine internals

If a pack needs new mechanics, the mechanic belongs in `packages/runtime/` or `packages/shared/`, not inside the pack itself.

## Validation

This boundary proposal is considered clear if a contributor can answer these questions without guessing:

- Where does browser-facing code live?
- Where does shared logic live?
- Where does gameplay logic live?
- Where does content live?
- Which direction are imports allowed to flow?
- How do we add a new pack without copying engine code?
