# Stage Schema

## Status
Proposed

## Purpose
Define the stage shape so a pack can reference vocabulary items by id and attach unlock and pass metadata without duplicating the item contract.

## Stage Schema

```json
{
  "id": "stage-fruit-1",
  "title": "Fruit Basics",
  "summary": "Learn the first fruit words in a short practice run.",
  "vocabularyItemIds": ["apple", "banana"],
  "modeIds": ["practice", "review"],
  "unlock": {
    "kind": "after-stage",
    "stageIds": ["stage-intro"]
  },
  "pass": {
    "kind": "score-threshold",
    "minimumScore": 80,
    "minimumAccuracy": 0.75
  }
}
```

## Stage Fields

- `id`: Stable stage identifier string.
- `title`: Stage display name.
- `summary`: Short learner-facing description of the stage.
- `vocabularyItemIds`: Ordered list of vocabulary item ids used in the stage.
- `modeIds`: Ordered list of mode ids allowed for the stage.
- `unlock`: Optional unlock metadata block.
- `pass`: Optional pass metadata block.
- `notes`: Optional editorial metadata for internal use.

## Vocabulary Item References

- A stage should point to vocabulary item ids from the owning pack.
- The stage should never embed a second copy of the full vocabulary item shape.
- The order of `vocabularyItemIds` should define the lesson flow for that stage.
- If the same item appears in more than one stage, the pack manifest still relies on the same canonical item schema for the item itself.

## Unlock Metadata

- `unlock` describes when the stage becomes available to the learner.
- Suggested `unlock.kind` values include `after-stage`, `immediate`, and `manual`.
- When `unlock.kind` is `after-stage`, `stageIds` should identify the prerequisite stage or stages.
- Unlock metadata should stay descriptive enough for content planning while remaining separate from runtime engine state.

## Pass Metadata

- `pass` describes what counts as completing the stage.
- Suggested `pass.kind` values include `score-threshold`, `accuracy-threshold`, and `clear-all-items`.
- `minimumScore` and `minimumAccuracy` can express simple thresholds for early content planning.
- Pass metadata should define the completion bar without embedding engine-specific scoring code in the content schema.

## Validation Behavior

- Reject the stage if `id`, `title`, or `vocabularyItemIds` is missing.
- Reject the stage if `vocabularyItemIds` is not an array of non-empty strings.
- Reject the stage if `modeIds` is present but is not an array of non-empty strings.
- Reject the stage if `unlock` or `pass` is present but is not an object.
- Reject the stage if `unlock` or `pass` contains fields that are not described by the schema.
- The stage should reject unknown fields so the schema stays stable and predictable.

## Reusability

- A stage should stay small enough to represent one lesson-sized progression step.
- A pack can define multiple stages and reuse the same stage shape for each one.
- The stage schema remains compatible with item-level validation because it only references vocabulary item ids rather than redefining item fields.
