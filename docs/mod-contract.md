# Mod Contract v1

## Status
Proposed

## Purpose
Define the narrow, data-only surface a first-wave mod may use so content expansion stays safe and the engine can validate mods without executing plugin code.

## What A Mod Can Do

- Provide pack-local content files for vocabulary, stages, and modes.
- Reference existing item ids, asset ids, and stage ids through the published manifest shapes.
- Add or update text, images, audio references, and other declared data-only metadata within the allowed schemas.
- Define compatibility metadata through the manifest `schemaVersion` field so loaders can reject unsupported content cleanly.

## What A Mod Cannot Do

- A mod cannot include arbitrary code execution.
- A mod cannot ship runtime hooks, scripts, eval-like payloads, or other executable behavior.
- A mod cannot reach into engine internals or replace runtime systems from content files.
- A mod cannot introduce new schema shapes that bypass the published pack, stage, mode, or item contracts.

## Compatibility And Versioning

- Version `1` is intentionally narrow and data-only.
- Loaders should accept only mods that declare a supported `schemaVersion`.
- A mod should be rejected if its version is unknown, missing, or incompatible with the current loader.
- Backward compatibility should be maintained by adding new optional data fields only when they are documented in the contract first.
- Breaking changes require a new major contract version rather than silently expanding v1.

## Enforcement Rules

- Validate mod content by schema and file layout only.
- Reject any mod that requires code execution to interpret, load, or transform.
- Reject unknown fields unless the contract explicitly allows them.
- Keep the contract narrow enough that the engine can stay stable while the content surface expands.

## Validation

This contract is considered safe enough for first-wave content expansion when:

- the mod surface remains data-only
- arbitrary code execution is explicitly out of scope
- version compatibility is checked before content is accepted
- enforcement can be implemented without executing mod-provided code
