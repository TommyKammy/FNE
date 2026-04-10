# Vocabulary Item Schema

## Status
Proposed

## Purpose
Define the canonical JSON schema for one vocabulary item so pack docs and asset docs can reuse the same item shape without introducing pack-level assumptions.

## Canonical Shape

```json
{
  "id": "apple",
  "term": "apple",
  "meaning": "りんご",
  "pronunciation": "AP-uhl",
  "imageAssetId": "img-apple",
  "audioAssetId": "aud-apple",
  "exampleSentence": "I eat an apple.",
  "partOfSpeech": "noun",
  "tags": ["fruit", "food"],
  "notes": "Common beginner vocabulary."
}
```

## Required Fields

- `id`: Stable item identifier string.
- `term`: The vocabulary item shown to the learner.
- `meaning`: The short meaning or translation used to describe the item.
- `pronunciation`: A learner-facing pronunciation hint, such as a simple phonetic guide or IPA-like string.
- `imageAssetId`: Opaque reference to the image asset for the item.
- `audioAssetId`: Opaque reference to the pronunciation audio asset for the item.

## Optional Fields

- `exampleSentence`: A short example sentence for later study or review screens.
- `partOfSpeech`: A compact grammatical label such as `noun` or `verb`.
- `tags`: An array of descriptive strings used for grouping or filtering.
- `notes`: Additional editorial notes that do not change the learning content.

## Validation Behavior

- Reject the item if any required field is missing.
- Reject the item if any required field is present but not a string.
- Reject the item if any required string field is blank or contains only whitespace.
- Reject the item if `tags` is present but is not an array of non-empty strings.
- Reject the item if `exampleSentence`, `partOfSpeech`, or `notes` are present but are not strings.
- Treat `imageAssetId` and `audioAssetId` as opaque identifiers at this layer; asset existence is validated separately by asset or pack validation.
- Unknown fields are rejected so the schema stays stable and predictable.

## Reusability

- This schema describes one item only and does not depend on pack id, stage id, or pack ordering.
- Pack docs can reference this schema for vocabulary content.
- Asset docs can reference this schema for the shape of asset-backed item fields.
- If the schema needs new fields later, add them here first and update every dependent doc together.
