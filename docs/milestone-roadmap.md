# Milestone Roadmap from Planning Docs to First PoC

## Intent
This roadmap turns the current planning draft into a delivery sequence that can move FNE from documentation to a first browser-playable proof of concept.

The order stays aligned with the current planning stack:

- foundation and shared rules before implementation commitments
- content and repository contracts before runtime integration
- Learn Mode before later practice and pressure modes
- Listen & Match Mode and Battle Mode before parent-facing interpretation of results
- Parent Observation Features only after learner outcomes exist to summarize

## Milestone 1 - Planning Baseline Locked
Lock the project-wide planning rules that every later milestone depends on.

### Exit Criteria
- The team agrees on the product thesis and first-wave learner goals from `README.md`.
- The repository shape in `docs/repo-boundaries.md` is accepted as the working boundary for `apps/`, `packages/`, and `content/`.
- Shared planning language from `docs/planning-glossary.md` is stable enough to reuse in implementation tickets without term drift.
- The Architecture Decision Record: Browser-First Stack in `docs/architecture.md` remains the active implementation baseline.
- `docs/ux-rules.md`, `docs/accessibility-baseline.md`, and Validation Gates in `docs/validation-gates.md` are treated as required review gates for later UI and implementation work.

## Milestone 2 - Content and Runtime Contracts Locked
Freeze the authoring contracts that let runtime work proceed without inventing new data rules mid-build.

### Exit Criteria
- The canonical content contracts for vocabulary items, packs, stages, and mod boundaries are clear enough to author one playable pack without schema guessing.
- `docs/vocabulary-item-schema.md`, `docs/pack-schema.md`, `docs/stage-schema.md`, and `docs/mod-contract.md` define the required fields and ownership boundaries for first-wave content.
- `docs/asset-conventions.md` is explicit enough for art and audio references to be added without path or naming ambiguity.
- The contract between content data and engine code still follows the repository and architecture boundaries instead of embedding lesson data in runtime logic.
- A contributor can identify what must exist to load one browser-playable stage from content files alone.

## Milestone 3 - Learn Mode Vertical Slice Playable
Deliver the first complete learner-facing slice around the guided image-plus-audio teaching loop.

### Exit Criteria
- One browser-playable stage can run the Learn Mode reveal order from `docs/learn-mode.md` from start to summary.
- The playable slice uses the Browser-First Stack from `docs/architecture.md`, including the React shell around gameplay and the Phaser-owned moment-to-moment play scene.
- The stage demonstrates the image-first, pronunciation-backed teaching flow described in `README.md`.
- The slice respects the core readability, keyboard-first, visible-state, and audio-fallback expectations from `docs/accessibility-baseline.md`.
- The team can review the slice as the first playable demo even if later modes and progression systems are still stubbed or absent.

## Milestone 4 - Stage Loop Expansion Ready
Extend the first slice into a short but complete learning loop that can teach, recheck, and pressure-test the same stage content.

### Exit Criteria
- Listen & Match Mode is defined well enough in `docs/listen-and-match-mode.md` to run pronunciation-first recognition on the same pack content used by Learn Mode.
- Battle Mode is defined well enough in `docs/battle-mode.md` to pressure-test previously exposed vocabulary in a browser-first stage flow.
- The Review and Weak-Word Loop in `docs/review-loop.md` closes the stage by resurfacing weak words after the first pass instead of dropping unresolved items.
- Stage outcomes can distinguish clean clears, supported clears, and unresolved weak words without inventing a separate product thesis.
- The intended stage sequence is now clear: guided exposure first, recognition follow-up second, higher-pressure rhythm challenge third, short review closure last.

## Milestone 5 - Browser PoC Ready for First External Playtest
Shape the planned learning loop into a coherent first proof of concept that can be shared and judged outside the planning circle.

### Exit Criteria
- The browser PoC covers one end-to-end learner loop from entry to completion using the accepted browser-first architecture.
- `docs/release-posture.md` defines the internal preview build boundary and PoC-era versioning language without assuming a shipping pipeline yet.
- `docs/poc-evaluation-criteria.md` defines the explicit success thresholds and qualitative feedback collection path for first external playtest readiness.
- Parent Observation Features are limited to lightweight summaries derived from stage results, consistent with `docs/parent-observation.md`.
- The PoC is reviewable as a delivery plan outcome rather than a codebase sketch: what is playable, what is observable, and what remains intentionally deferred are all explicit.
- The verification language for implementation tickets can reuse the `typecheck` and `lint` gate names from `docs/validation-gates.md`.
- `docs/qa-strategy.md` separates content QA, gameplay QA, and first-playable manual playtest expectations well enough to guide later verification work.
- The team can schedule first external playtests with a shared understanding of what must be true before the PoC counts as ready.

## Review Notes
- This roadmap keeps the first playable milestone narrower than the full PoC so the project can validate the guided loop before expanding scope.
- It preserves the current epic direction by keeping Learn Mode ahead of later recognition and battle work, and by keeping Parent Observation Features downstream of learner-facing outcomes.
- It keeps the plan anchored to existing docs instead of inventing a new implementation architecture beyond the accepted Browser-First Stack and current planning rules.
