export interface VocabularyItem {
  id: string;
  term: string;
  meaning: string;
  pronunciation: string;
  imageAssetId: string;
  audioAssetId: string;
  exampleSentence?: string;
  partOfSpeech?: string;
  tags?: string[];
  notes?: string;
}

export interface PackStage {
  id: string;
  title: string;
  vocabularyItemIds: string[];
  modeIds: string[];
}

export interface PackMode {
  id: string;
  label: string;
  description: string;
}

export interface PackManifest {
  schemaVersion: number;
  id: string;
  title: string;
  description: string;
  vocabularyItems: VocabularyItem[];
  stages: PackStage[];
  modes: PackMode[];
  notes?: string;
}

const REQUIRED_VOCABULARY_ITEM_FIELDS = [
  "id",
  "term",
  "meaning",
  "pronunciation",
  "imageAssetId",
  "audioAssetId"
] as const;

const OPTIONAL_STRING_FIELDS = ["exampleSentence", "partOfSpeech", "notes"] as const;

function assertNonEmptyString(value: unknown, fieldName: string): asserts value is string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`Vocabulary item field "${fieldName}" must be a non-empty string.`);
  }
}

export function assertValidVocabularyItem(item: unknown): asserts item is VocabularyItem {
  if (typeof item !== "object" || item === null || Array.isArray(item)) {
    throw new Error("Vocabulary item must be an object.");
  }

  const record = item as Record<string, unknown>;

  for (const fieldName of REQUIRED_VOCABULARY_ITEM_FIELDS) {
    assertNonEmptyString(record[fieldName], fieldName);
  }

  for (const fieldName of OPTIONAL_STRING_FIELDS) {
    if (record[fieldName] !== undefined) {
      assertNonEmptyString(record[fieldName], fieldName);
    }
  }

  const tags = record["tags"];

  if (tags !== undefined) {
    if (!Array.isArray(tags)) {
      throw new Error('Vocabulary item field "tags" must be an array of non-empty strings.');
    }

    for (const tag of tags) {
      assertNonEmptyString(tag, "tags");
    }
  }

  const allowedFields = new Set<string>([
    ...REQUIRED_VOCABULARY_ITEM_FIELDS,
    ...OPTIONAL_STRING_FIELDS,
    "tags"
  ]);

  for (const fieldName of Object.keys(record)) {
    if (!allowedFields.has(fieldName)) {
      throw new Error(`Vocabulary item field "${fieldName}" is not allowed.`);
    }
  }
}
