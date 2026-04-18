# Review Loop Transition to Future Systems

## Status
Proposed

## Purpose
Define how the v1 short review loop can hand off to later persistence and spaced-repetition systems without rewriting the current-stage recovery contract in [docs/review-loop.md](review-loop.md) or the measurement boundary in [docs/measurement-points.md](measurement-points.md).

## Current V1 Boundary

- V1 owns only the short in-stage review loop that happens after the learner has received one first-pass exposure to each scheduled item.
- V1 keeps weak-word handling inside the current stage run, including short resurfacing, final unresolved visibility, and summary or future follow-up when the review limit is reached.
- V1 must not require persistent learner identity, server-owned history, or cross-device syncing to decide whether an item is weak, resurfaced, resolved, or still active.
- V1 must not reopen or rewrite first-pass mode rules in Learn Mode, Listen & Match Mode, or Battle Mode, because those modes already provide the authoritative outcome labels that the review loop consumes.

## Persistence Compatibility

- A later persistence layer should persist the same weak-word outcomes that v1 already produces instead of replacing them with a second incompatible status model.
- The persisted record should start from authoritative gameplay outcome records such as weak-word-enqueued, weak-word-resolved, and weak-word-still-active boundaries already described in [docs/measurement-points.md](measurement-points.md).
- A future save path may store unresolved or partially recovered weak words after the stage reaches summary or future follow-up, but it should not change what counted as a weak word during the original stage.
- The first durable version should remain compatible with a single-session browser run by treating persistence as an optional extension of the same run results, not as a prerequisite for stage completion.
- If later work adds local storage, backend storage, or export/import paths, those paths should preserve the same item order, outcome meaning, and review-limit result that v1 already documents.

## Future Spaced Repetition Compatibility

- A future cross-session scheduler should extend the same weak-word state instead of inventing a parallel retry taxonomy.
- The scheduler may decide when an unresolved or recently supported item returns in a later session, but it should treat the v1 loop as the first recovery layer, not as a disposable prototype.
- Cross-session spacing can add interval choice, decay rules, or resurfacing priority across visits, but it should not erase whether the item was a clean first-pass clear, a supported clear, or still unresolved at the end of the stage.
- Later spaced repetition should begin only after the current stage has finished its documented short review closure, so future scheduling does not compete with the in-stage loop for the same recovery job.

## Measurement and Handoff Compatibility

- Later persistence and spacing work should anchor to the authoritative gameplay outcome records already identified in [docs/measurement-points.md](measurement-points.md), not to parent-facing summaries, convenience counters, or UI badges.
- The handoff from v1 review to later systems should occur at the point where the stage reaches summary or future follow-up with its final weak-word state already decided.
- Any later rollup should preserve the distinction between stage-sized outcomes and cross-session history so parent observation and learner-facing summaries do not silently redefine the underlying result.
- If a later system reads multiple stored records to assemble future review candidates, it should use one committed snapshot of the authoritative run results instead of mixing partial writes from different moments.

## Review Boundary

- Review should confirm that this note keeps the v1 contract stage-sized, session-sized, and compatible with a single-session browser run.
- Review should confirm that later persistence and spaced repetition are described as extensions of the current weak-word outcomes rather than replacements for the existing loop.
- Review should reject proposals that require identity, backend storage, or scheduler state before the learner can complete the current-stage review loop.
