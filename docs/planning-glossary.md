# Planning Glossary

## Purpose
Use these terms consistently in planning docs, issues, and implementation tickets so future work can reuse the same language without interpretation drift.

## Content Terms

### Pack
A pack is the content bundle that ships as one unit.

A pack groups the vocabulary, assets, and pack-level metadata needed for a lesson set. Runtime code should treat the pack as the top-level content boundary and load it through the manifest or loader defined in the repository layout.

Use `pack` when referring to the reusable content package itself. Do not replace it with `course`, `unit`, or `book`.

### Stage
A stage is a playable slice inside a pack.

A stage groups a small set of words or objectives into one progression step so the learner can complete a short lesson before moving on. A stage belongs to a pack and should read as a content progression concept, not as a generic engine scene.

Use `stage` when referring to a lesson-sized progression step. Do not replace it with `level`, `chapter`, or `round`.

### Mode
A mode is the rule set or presentation profile used to run a stage.

Modes let the product vary how a stage behaves without changing the underlying pack content. Example differences may include a practice-focused flow, a review-focused flow, or a stricter timing profile.

Use `mode` when referring to a gameplay configuration. Do not replace it with `difficulty` unless the issue is specifically about challenge tuning.

## Gameplay Terms

### Weak Word
A weak word is a word the learner has not yet secured and needs more repetition on.

Weak words are promoted by performance or recall signals so the review system can surface them again. The term is about learner state, not about the word itself being poor quality.

Use `weak word` when referring to a target for extra practice. Do not replace it with `missed word`, `forgotten word`, or `error word`.

### Review Loop
The review loop is the repeat cycle that brings weak words back into practice.

It is the product mechanism for spacing repetition, rechecking recall, and giving the learner another chance to recognize or pronounce the word. The review loop should stay short and motivating so it feels like part of the rhythm game instead of a separate quiz mode.

Use `review loop` when referring to the recurring practice cycle. Do not replace it with `retry loop` or `study loop`.

### Hit Window
The hit window is the timing range in which an input counts as a successful hit.

This term belongs to the rhythm layer and describes the tolerance around the expected beat or cue timing. It should stay separate from content language because it is about input judgment, not vocabulary mastery.

Use `hit window` when referring to timing tolerance. Do not replace it with `timing window` or `accuracy band`.

## Usage Rules

- Use `pack` for content bundles, `stage` for progression slices, and `mode` for gameplay rulesets.
- Use `weak word` and `review loop` for learner recovery and repetition concepts.
- Use `hit window` only for timing tolerance in gameplay.
- If a later issue needs a new term, define it here before using it in implementation tickets.

## Completeness Check
The glossary is complete enough for the current planning phase when it covers:

- content organization through `pack` and `stage`
- gameplay configuration through `mode`
- learner recovery through `weak word` and `review loop`
- rhythm timing through `hit window`

