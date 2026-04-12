# Validation-First Generation Flow

## Status
Proposed

## Purpose
Define the handoff order from generated vocabulary item output to generated assets to assembled pack data so validation always happens before any content is treated as playable.

This document connects the single-item contract in `docs/ai-content-generation-contract.md`, the asset authoring rules in `docs/image-generation-pipeline.md` and `docs/audio-generation-pipeline.md`, the pack assembly contract in `docs/pack-assembly-pipeline.md`, and the QA boundary in `docs/qa-strategy.md`.

## Generation Order

Use the same validation-first sequence for every authored or AI-assisted pack:

1. Generate one vocabulary item JSON object.
2. Run item schema validation against `docs/vocabulary-item-schema.md`.
3. Only after the item passes schema validation, start image and audio generation from that approved item data.
4. Review and validate each generated asset against its generation pipeline and `docs/asset-conventions.md`.
5. Assemble the pack manifest only from vocabulary items and assets that already passed their earlier gates.
6. Run pack and asset validation on the assembled pack before any loader or runtime path treats it as playable.

Do not skip ahead from raw generation output to pack assembly, runtime loading, or manual playtest setup.

## Schema Gate

The first gate is the vocabulary item contract.

- Reject invalid vocabulary item JSON before image or audio generation begins.
- Reject wrapper text, unknown fields, blank required strings, or mixed-format output at this boundary.
- Treat the validated item object as the only approved source for downstream asset prompts, scripts, and manifest assembly.
- If an item fails schema validation, fix or regenerate the item instead of compensating in asset tooling or runtime code.

This keeps content generation deterministic and ensures downstream steps use one canonical item shape.

## Asset Gate

The second gate is asset review and asset validity.

- Start image generation only from an item that already passed the schema gate.
- Start audio generation only from an item that already passed the schema gate.
- Reject generated assets that fail review, naming, or format rules before pack assembly continues.
- Reject assets that depict the wrong meaning, mispronounce the target, require manual renaming, or violate supported format rules.
- Keep rejected candidate files outside the shipped pack asset directories so later validation can treat the shipped directory as authoritative.

This prevents invalid generated media from being mistaken for pack-ready content.

## Pack Gate

The third gate is assembled-pack validation.

- Assemble the manifest only from validated vocabulary item records, validated stage and mode data, and asset files that resolve through `docs/asset-conventions.md`.
- Re-run pack structure and cross-reference checks during assembly even if earlier item and asset gates already passed.
- Reject the pack before it is treated as playable if schema or asset validation fails.
- Fail the pack when a stage references an unknown item, a mode reference is missing, or a declared asset id does not resolve to a pack-local file.
- Treat assembly validation as the last required content gate before loader or gameplay verification begins.

This keeps invalid pack data out of runtime paths and preserves the pack manifest as a reliable loader contract.

## Failure Handling

Validation failures are authoring failures, not runtime repair opportunities.

- Stop the flow at the first failed gate and return a clear error tied to the invalid item, asset, or pack field.
- Do not let runtime code repair, substitute, or silently ignore invalid generated content.
- Do not mark a pack as pack-ready, review-ready, or playable while any earlier schema or asset failure is unresolved.
- If a generated asset is rejected, regenerate or replace that asset and rerun the affected validation gates before resuming assembly.
- If pack validation fails, fix the authored content and rerun pack validation instead of relying on placeholder media or hidden fallback data.

## Playable Handoff

A pack becomes eligible for runtime loading or first-playable review only after all three gates pass.

- "Playable" means the assembled pack passed schema validation, cross-reference validation, and asset resolution validation.
- Gameplay QA may assume valid content only after this handoff completes.
- Manual playtesting should start from a validated pack, not from partially reviewed generated content.
- Loader code may fail fast on invalid packs, but it should not be the first place where generated content is judged for correctness.

The validation-first handoff keeps content QA separate from gameplay QA and ensures invalid packs are rejected before they can contaminate runtime behavior or playtest results.
