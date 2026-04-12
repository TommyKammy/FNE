# Audio Generation Pipeline

## Status
Proposed

## Purpose
Define the authoring pipeline that turns one validated vocabulary item into one reviewable pronunciation script and one named pronunciation asset without inventing per-item rules during production.

This pipeline sits between the structured vocabulary item contract in `docs/ai-content-generation-contract.md` and the stored asset rules in `docs/asset-conventions.md`.

The workflow assumes a TTS-backed authoring pass for the first implementation. Human voice replacement can be added later, but it should still preserve the same naming, review, and normalization contract.

## Input Fields

The audio workflow starts only after one vocabulary item already satisfies `docs/vocabulary-item-schema.md`.

Minimum required input fields:

- `id`
- `term`
- `pronunciation`
- `audioAssetId`

Optional fields that may improve the spoken result:

- `meaning`
- `exampleSentence`
- `partOfSpeech`
- `notes`

Do not start audio generation from freeform notes alone. The vocabulary item remains the authoritative source for naming and learner pronunciation intent.

## Generation Steps

1. Validate that the vocabulary item JSON is complete and already approved for authoring.
2. Build the TTS script from the template in this document using the exact item fields.
3. Generate one pronunciation clip that says only the intended learner cue for the item.
4. Review the spoken output against the script, timing, and normalization rules below.
5. Normalize and trim the approved output so the shipped clip stays short and consistent across the pack.
6. Store the approved asset under the pack-local audio directory using the exact `audioAssetId` naming convention.
7. Reject and regenerate if the output is mispronounced, too long, uneven in loudness, or cannot be stored without naming ambiguity.

The workflow goal is consistent and valid pronunciation output, not high-volume batch generation with ad hoc voice settings.

## Script Template

Use one script template shape so generated speech stays predictable across packs. Fill placeholders from the vocabulary item directly.

```text
Speak a short pronunciation clip for a junior-high English vocabulary game.
Target term: {{term}}
Learner pronunciation guide: {{pronunciation}}
Meaning reference: {{meaning}}
Part of speech: {{partOfSpeech}}
Example sentence: {{exampleSentence}}
Editorial notes: {{notes}}
Output asset id: {{audioAssetId}}

Requirements:
- Speak only the target term unless the notes explicitly approve a short alternate cue.
- Use a clear, neutral, encouraging voice suitable for repeated listening.
- Keep the spoken delivery concise, with no intro, outro, numbering, or explanation.
- Avoid background music, sound effects, room noise, character acting, or dramatic emphasis.
- Keep pacing steady enough that neighboring clips feel like one lesson set.
```

Script assembly rules:

- Omit optional lines when the source field is absent.
- Keep `{{term}}`, `{{pronunciation}}`, and `{{audioAssetId}}` unchanged in tooling so review stays traceable back to the source item.
- Use `meaning` only as disambiguating context for the TTS authoring step, not as spoken output.
- Use `exampleSentence` only when the pronunciation needs context for stress or syllable timing, never as a second spoken sentence in the shipped clip.
- Use `notes` only as optional editorial guidance that may clarify accent, disambiguation, or reading intent, never as a replacement for the item's `term` or `pronunciation`.
- Do not inject pack paths, timestamps, model names, or version suffixes into the spoken script.
- If the intended pronunciation is still ambiguous after template filling, stop for editorial clarification before generation.

## Voice and Delivery Contract

Every generated clip should follow the same baseline voice unless a later doc explicitly defines a different pack-level voice direction.

- Prefer one consistent TTS voice per pack so learners are not asked to adapt to voice changes between neighboring items.
- Use a neutral accent that matches the planned lesson target and stays consistent within the same pack.
- Speak the target once per shipped clip.
- Avoid exaggerated acting, whispering, shouting, or novelty character voices.
- Keep the clip focused on pronunciation support, not entertainment filler.
- If a later pack needs a different voice style, define that override in pack-level documentation while still preserving this document's timing, naming, and normalization rules.

## Normalization Rules

- Trim leading silence so the word starts promptly when the runtime triggers playback.
- Trim trailing silence so the clip ends cleanly and does not pad lesson timing.
- Apply peak normalization to a consistent target during export so neighboring clips do not jump in loudness.
- Keep each clip dry and centered. Do not ship reverb, delay, stereo theatrics, or mixed-in ambience.
- Export a single pronunciation clip that is short and consistent enough to replay without disrupting the lesson flow.
- If the generated clip contains breaths, glitches, duplicated words, or clipped consonants, reject and regenerate instead of patching around it in runtime code.
- Keep pronunciation clips bounded to a short, single-cue duration. If a term cannot be delivered clearly within that bound, escalate for editorial review instead of silently shipping a longer clip.

## Asset Naming and Handoff

- The final filename must use the exact `audioAssetId` from the vocabulary item.
- Store approved files under `content/packs/<pack-id>/assets/audio/`.
- Use a supported extension from `docs/asset-conventions.md`.
- The stored filename must be `<audioAssetId>.<ext>`.
- Do not append model names, voice ids, prompt hashes, timestamps, `final`, or version suffixes to the shipped filename.
- Keep rejected experiments outside the shipped asset directory so runtime resolution remains unambiguous.

Example handoff:

```text
Vocabulary item audioAssetId: aud-apple
Approved file: content/packs/starter-pack/assets/audio/aud-apple.mp3
```

## Validation and Review

Review each generated pronunciation clip before it is treated as pack-ready.

Accept only when all of the following are true:

- The spoken word matches the vocabulary item's intended pronunciation.
- The clip says the target once and does not include extra commentary.
- The timing is short and consistent with neighboring pronunciation clips.
- The output loudness and silence trimming comply with the normalization rules above.
- The filename can be stored directly from `audioAssetId` without ambiguity.
- The selected format and extension comply with `docs/asset-conventions.md`.

Reject and regenerate when any of the following occur:

- The voice mispronounces the term or uses the wrong stress.
- The clip includes multiple takes, extra words, or audible generation artifacts.
- The clip is long enough to interfere with cue timing or repeated playback.
- The loudness differs enough from neighboring assets to force runtime compensation.
- The output requires manual renaming that breaks the `audioAssetId` contract.
- Two candidate files would map to the same shipped asset name.

## Relationship To Other Contracts

- `docs/ai-content-generation-contract.md` defines how the vocabulary item JSON is generated.
- `docs/vocabulary-item-schema.md` defines the authoritative item fields consumed by this pipeline.
- `docs/asset-conventions.md` defines where the approved audio file is stored and how `audioAssetId` resolves at runtime.
- `docs/pack-schema.md` and `docs/stage-schema.md` continue to reference item ids and asset ids rather than TTS settings or generation metadata.
- `docs/qa-strategy.md` defines how asset validity and authoring review stay separate from gameplay QA.

Keep script construction, pronunciation review, normalization rules, and asset storage rules separate so content generation stays deterministic and runtime audio loading stays simple.
