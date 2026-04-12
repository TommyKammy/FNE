# Image Generation Pipeline

## Status
Proposed

## Purpose
Define the authoring pipeline that turns one validated vocabulary item into one reviewable image brief and one named image asset without inventing per-item rules during production.

This pipeline sits between the structured vocabulary item contract in `docs/ai-content-generation-contract.md` and the stored asset rules in `docs/asset-conventions.md`.

## Inputs

The image workflow starts only after one vocabulary item already satisfies `docs/vocabulary-item-schema.md`.

Minimum required input fields:

- `id`
- `term`
- `meaning`
- `imageAssetId`

Optional fields that may improve prompt quality:

- `exampleSentence`
- `partOfSpeech`
- `tags`
- `notes`

Do not start image generation from freeform notes alone. The vocabulary item remains the authoritative source for naming and learner meaning.

## Generation Steps

1. Validate that the vocabulary item JSON is complete and already approved for authoring.
2. Build the image prompt from the template in this document using the exact item fields.
3. Generate one candidate image that represents the target meaning clearly for a junior-high learner.
4. Review the candidate against the style and validation rules below.
5. Store the approved asset under the pack-local image directory using the exact `imageAssetId` naming convention.
6. Reject and regenerate if the output is ambiguous, stylistically inconsistent, or cannot be stored without naming ambiguity.

The workflow goal is consistent and valid image output, not high-volume batch generation with ad hoc prompt variations.

## Prompt Template

Use one prompt template shape so generated art stays predictable across packs. Fill placeholders from the vocabulary item directly.

```text
Create a single educational illustration for a junior-high English vocabulary game.
Target term: {{term}}
Meaning to depict: {{meaning}}
Part of speech: {{partOfSpeech}}
Example sentence: {{exampleSentence}}
Tags: {{tags}}

Requirements:
- Show one clear primary subject that matches the target meaning.
- Keep the composition simple enough to understand at a glance.
- Use a clean, game-friendly illustration style for beginner learners.
- Avoid text labels, letters, logos, watermarks, speech bubbles, and UI chrome.
- Avoid extra background objects that could confuse the intended meaning.
- Output a square image that reads clearly at small sizes.
```

Prompt assembly rules:

- Omit optional lines when the source field is absent.
- Do not rename placeholders or replace `{{term}}` and `{{meaning}}` with freeform aliases in tooling.
- Do not inject asset filenames, version strings, or pack paths into the visual prompt body.
- If the item meaning is still ambiguous after template filling, stop for editorial clarification before generation.

## Style Contract

Every generated image should follow the same baseline style unless a later doc explicitly defines a different pack art direction.

- Use bright, readable, kid-safe illustration rather than photorealistic rendering.
- Favor a centered subject, simple silhouette, and limited background detail.
- Keep framing consistent so multiple items feel like part of the same lesson set.
- Prefer neutral or transparent backgrounds when the subject remains readable.
- Avoid horror imagery, sarcasm, visual metaphors, or culture-specific jokes that could confuse the term.
- Avoid showing multiple possible answers in one frame when the item is meant to teach a single noun or concept.

If a pack later needs a style variant, define that override in pack-level documentation while still preserving this document's naming and validation rules.

## Asset Naming and Handoff

- The final filename must use the exact `imageAssetId` from the vocabulary item.
- Store approved files under `content/packs/<pack-id>/assets/images/`.
- Use a supported extension from `docs/asset-conventions.md`.
- The stored filename must be `<imageAssetId>.<ext>`.
- Do not append model names, prompt hashes, timestamps, `final`, or version suffixes to the shipped filename.
- Keep rejected experiments outside the shipped asset directory so runtime resolution remains unambiguous.

Example handoff:

```text
Vocabulary item imageAssetId: img-apple
Approved file: content/packs/starter-pack/assets/images/img-apple.webp
```

## Validation and Review

Review each generated image before it is treated as pack-ready.

Accept only when all of the following are true:

- The image meaning matches the vocabulary item's intended learner meaning.
- The primary subject is obvious without reading text.
- The output matches the shared style contract well enough to sit beside neighboring items.
- The filename can be stored directly from `imageAssetId` without ambiguity.
- The selected format and extension comply with `docs/asset-conventions.md`.

Reject and regenerate when any of the following occur:

- The image depicts the wrong object, action, or sense of the term.
- The image includes readable text, branding, or UI artifacts.
- The image style differs enough from neighboring assets to distract the learner.
- The output requires manual renaming that breaks the `imageAssetId` contract.
- Two candidate files would map to the same shipped asset name.

## Relationship To Other Contracts

- `docs/ai-content-generation-contract.md` defines how the vocabulary item JSON is generated.
- `docs/vocabulary-item-schema.md` defines the authoritative item fields consumed by this pipeline.
- `docs/asset-conventions.md` defines where the approved image file is stored and how `imageAssetId` resolves at runtime.
- `docs/pack-schema.md` and `docs/stage-schema.md` continue to reference item ids and asset ids rather than prompt text or generation metadata.

Keep prompt construction, style review, and asset storage rules separate so content generation stays deterministic and runtime asset loading stays simple.
