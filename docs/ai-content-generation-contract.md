# AI Content Generation Contract

## Status
Proposed

## Purpose
Define the structured JSON output contract for AI-authored vocabulary content so generated data can be reviewed and validated against the canonical vocabulary item schema without extra interpretation.

Use `vocabulary item` as the content term for this contract. Do not replace it with `word card`, `flashcard`, or `entry`.

## Output Contract

The AI output must satisfy docs/vocabulary-item-schema.md exactly.

The generator should return one JSON object for one vocabulary item at a time.

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

Do not wrap the JSON object in markdown fences.

Do not prepend or append explanations, labels, or commentary outside the JSON object.

## Required Output Fields

- `id`: Stable item identifier string.
- `term`: The vocabulary item shown to the learner.
- `meaning`: The short meaning or translation used to describe the item.
- `pronunciation`: A learner-facing pronunciation hint, such as a simple phonetic guide or IPA-like string.
- `imageAssetId`: Opaque reference to the image asset for the item.
- `audioAssetId`: Opaque reference to the pronunciation audio asset for the item.

## Optional Output Fields

- `exampleSentence`: A short example sentence for later study or review screens.
- `partOfSpeech`: A compact grammatical label such as `noun` or `verb`.
- `tags`: An array of descriptive strings used for grouping or filtering.
- `notes`: Additional editorial notes that do not change the learning content.

## Validation Rules

- Reject the output if any required field is missing.
- Reject the output if any required field is present but not a string.
- Reject the output if any required string field is blank or contains only whitespace.
- Reject the output if `tags` is present but is not an array of non-empty strings.
- Reject the output if `exampleSentence`, `partOfSpeech`, or `notes` are present but are not strings.
- Unknown fields must be rejected.
- Reject arrays of items, wrapper objects, or mixed response formats because this contract is for one vocabulary item only.
- Treat `imageAssetId` and `audioAssetId` as opaque identifiers at this layer; asset existence is validated separately.

## Prompting Guidance

- Ask for exactly one vocabulary item JSON object per response.
- Name the required fields explicitly in the prompt so the model does not omit them.
- Reuse the canonical field names from `docs/vocabulary-item-schema.md` instead of aliases or translated keys.
- Keep the contract data-only so downstream validation can stay deterministic and separate from gameplay logic.
- If a later workflow needs batch generation, define that as a separate wrapper contract instead of changing the single-item contract here.
