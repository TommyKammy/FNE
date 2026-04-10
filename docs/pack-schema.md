# Pack Schema

## Status
Proposed

## Purpose
Define the pack manifest shape so a pack can group vocabulary items into multiple stages and modes without changing the canonical item contract.

## Pack Manifest Shape

```json
{
  "schemaVersion": 1,
  "id": "starter-pack",
  "title": "Starter Pack",
  "description": "Beginner vocabulary lessons for the first playtests.",
  "vocabularyItems": [
    {
      "id": "apple",
      "term": "apple",
      "meaning": "りんご",
      "pronunciation": "AP-uhl",
      "imageAssetId": "img-apple",
      "audioAssetId": "aud-apple"
    }
  ],
  "stages": [
    {
      "id": "stage-fruit-1",
      "title": "Fruit Basics",
      "vocabularyItemIds": ["apple"],
      "modeIds": ["practice"]
    }
  ],
  "modes": [
    {
      "id": "practice",
      "label": "Practice",
      "description": "Low-pressure learning mode for first exposure."
    }
  ]
}
```

## Pack Manifest Fields

- `schemaVersion`: Manifest version number for future evolution.
- `id`: Stable pack identifier string.
- `title`: Pack display name.
- `description`: Short pack summary for selection screens or documentation.
- `vocabularyItems`: Array of vocabulary item objects that must satisfy the canonical vocabulary item schema.
- `stages`: Ordered array of stage definitions that make up the pack.
- `modes`: Array of pack-local mode definitions that describe how stages can run.
- `notes`: Optional editorial metadata for internal use.

## Stage Collection

- A pack should support multiple stages, and the `stages` array is the progression order for the pack.
- Stages may reuse the same vocabulary items when a later lesson needs review or mixed practice.
- The pack manifest should not copy item fields into stage definitions.
- The stage list should stay readable as a lesson sequence, not as a flattened engine table.

## Mode Collection

- Modes describe rule sets or presentation profiles that can be applied to one or more stages.
- A mode should be defined once at the pack level when multiple stages share the same behavior.
- Modes must remain separate from vocabulary content so changing a lesson mode does not mutate the item catalog.

## Compatible with the canonical vocabulary item schema

- Each entry in `vocabularyItems` must satisfy [docs/vocabulary-item-schema.md](vocabulary-item-schema.md) without pack-specific changes.
- Pack validation should treat the item schema as authoritative for item shape and required fields.
- Stage references should point to item `id` values from the pack item catalog, not to a second item shape.
- If the vocabulary item schema expands later, the pack schema should continue to reuse it rather than redefining the item contract.

## Validation Behavior

- Reject the pack if `vocabularyItems` is missing or is not an array.
- Reject the pack if `stages` is missing or is not an array.
- Reject the pack if `modes` is present but is not an array.
- Reject the pack if any stage references a vocabulary item id that is not present in `vocabularyItems`.
- Reject the pack if any vocabulary item fails the canonical vocabulary item schema.
- Reject unknown fields so the manifest stays predictable and easy to validate.

## Reusability

- This schema is intentionally pack-local and can be copied for a new lesson bundle without changing the runtime contract.
- It can support multiple lessons per pack by adding more stage entries to the ordered `stages` array.
- It stays compatible with item-level validation because the pack manifest reuses the canonical item schema instead of inventing a new item shape.
