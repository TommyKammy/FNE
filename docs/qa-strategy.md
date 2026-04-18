# QA Strategy for Content and Gameplay Logic

## Status
Proposed

## Purpose
Define how first-wave QA should cover content schemas, asset validity, and gameplay behavior without blurring authoring errors into runtime logic bugs.

This strategy is written for the planning-stage repo structure, where `docs/` defines contracts first and later implementation work can attach concrete validators and automated tests to the same boundaries.

## Scope Separation

- Content QA proves that authored data is valid before runtime logic tries to use it.
- Gameplay QA proves that mode rules, scoring, timing, and learner feedback behave correctly when valid content is already loaded.
- Asset validity is treated as content QA because missing or mismatched files are authoring failures, not gameplay behavior failures.
- Manual playtesting is used to judge first-playable learner flow and feedback quality, not to replace schema validation or logic tests.

## Schema Validation for Content Files

- Treat `docs/vocabulary-item-schema.md`, `docs/pack-schema.md`, and `docs/stage-schema.md` as the source contracts for content validation.
- Validate vocabulary item shape first, then pack-level structure, then stage references and unlock/pass metadata.
- Reject unknown fields at the schema boundary so content drift is caught before implementation code compensates for it.
- Validate cross-file references separately from gameplay logic:
  - vocabulary item ids referenced by stages must exist
  - declared asset ids must resolve through the asset rules in `docs/asset-conventions.md`
  - pack and stage manifests must stay compatible with the published schema version rules
- Keep schema validation deterministic and data-only so the same checks can run in CI, local authoring review, or mod intake later.

## Content QA

- Primary goal: prove that authored lesson data is structurally valid and complete enough to load safely.
- Required checks:
  - schema validation for vocabulary items, packs, and stages
  - asset validity for referenced image and audio files
  - content-level review that stage ordering, pass thresholds, and unlock metadata are present and internally consistent
- Failure examples that belong in content QA:
  - a vocabulary item is missing a required field
  - a stage references an unknown item id
  - an `imageAssetId` or `audioAssetId` does not resolve to a pack-local file
  - a manifest uses unsupported schema metadata
- Content QA should stop before judging timing windows, score tuning, or mode-specific player feedback.

## Gameplay QA

- Primary goal: prove that gameplay logic behaves correctly once valid content has already passed content QA.
- Focus automated tests on mode rules and state transitions:
  - Learn Mode reveal order and completion flow
  - Listen & Match answer resolution, distractor handling, and retry behavior
  - Battle Mode judgment, streak, fail state, and recovery rules
  - review-loop promotion of weak words and stage outcome summaries
- Failure examples that belong in gameplay QA:
  - the wrong answer is accepted as correct
  - score or accuracy thresholds are applied incorrectly
  - review logic fails to resurface weak words
  - UI feedback or state progression disagrees with the documented mode rules
- Gameplay QA should assume fixtures already satisfy the content schemas so tests stay separate from gameplay logic concerns.

## Manual Playtest Expectations

- Manual playtests are required for first-playable work even when schema and gameplay checks pass.
- `docs/poc-evaluation-criteria.md` defines the shared pass/fail rubric and notes shape for deciding whether a playable PoC is ready for first external playtests.
- A first-playable playtest should confirm:
  - the learner can start and finish one short stage without facilitator translation
  - image, audio, and prompt timing are understandable on first contact
  - success, mistake, retry, and completion states are visible enough to follow in real time
  - the loop feels like one coherent round instead of disconnected screens or debug scaffolding
- Record manual observations separately from automated pass/fail checks so subjective findings do not weaken hard validation gates.
- If a manual playtest finds a content comprehension issue, route it to content QA; if it finds a rules or feedback bug, route it to gameplay QA.

## Verification Layers

- Layer 1: schema and asset validation for content files
- Layer 2: focused automated tests for gameplay logic
- Layer 3: manual playtest review for first-playable learner experience

This order keeps content failures separate from gameplay logic failures and keeps manual review from becoming the first line of defense for broken data contracts.
