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
const REQUIRED_PACK_MANIFEST_FIELDS = [
  "schemaVersion",
  "id",
  "title",
  "description",
  "vocabularyItems",
  "stages",
  "modes"
] as const;
const REQUIRED_PACK_STAGE_FIELDS = ["id", "title", "vocabularyItemIds", "modeIds"] as const;
const REQUIRED_PACK_MODE_FIELDS = ["id", "label", "description"] as const;

function assertNonEmptyString(
  value: unknown,
  fieldName: string,
  errorPrefix = "Vocabulary item"
): asserts value is string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${errorPrefix} field "${fieldName}" must be a non-empty string.`);
  }
}

function assertStringArray(
  value: unknown,
  fieldName: string,
  errorPrefix: "Pack manifest" | "Pack stage"
): asserts value is string[] {
  if (!Array.isArray(value)) {
    throw new Error(`${errorPrefix} field "${fieldName}" must be an array of non-empty strings.`);
  }

  for (const entry of value) {
    assertNonEmptyString(entry, fieldName, errorPrefix);
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

export function assertValidPackManifest(manifest: unknown): asserts manifest is PackManifest {
  if (typeof manifest !== "object" || manifest === null || Array.isArray(manifest)) {
    throw new Error("Pack manifest must be an object.");
  }

  const record = manifest as Record<string, unknown>;

  for (const fieldName of ["id", "title", "description"] as const) {
    assertNonEmptyString(record[fieldName], fieldName, "Pack manifest");
  }

  const schemaVersion = record["schemaVersion"];

  if (!Number.isInteger(schemaVersion) || typeof schemaVersion !== "number" || schemaVersion <= 0) {
    throw new Error('Pack manifest field "schemaVersion" must be a positive integer.');
  }

  const vocabularyItems = record["vocabularyItems"];

  if (!Array.isArray(vocabularyItems)) {
    throw new Error('Pack manifest field "vocabularyItems" must be an array.');
  }

  for (const item of vocabularyItems) {
    assertValidVocabularyItem(item);
  }

  const stages = record["stages"];

  if (!Array.isArray(stages)) {
    throw new Error('Pack manifest field "stages" must be an array.');
  }

  for (const stage of stages) {
    if (typeof stage !== "object" || stage === null || Array.isArray(stage)) {
      throw new Error("Pack stage must be an object.");
    }

    const stageRecord = stage as Record<string, unknown>;

    assertNonEmptyString(stageRecord["id"], "id", "Pack stage");
    assertNonEmptyString(stageRecord["title"], "title", "Pack stage");
    assertStringArray(stageRecord["vocabularyItemIds"], "vocabularyItemIds", "Pack stage");
    assertStringArray(stageRecord["modeIds"], "modeIds", "Pack stage");

    const allowedFields = new Set<string>(REQUIRED_PACK_STAGE_FIELDS);

    for (const fieldName of Object.keys(stageRecord)) {
      if (!allowedFields.has(fieldName)) {
        throw new Error(`Pack stage field "${fieldName}" is not allowed.`);
      }
    }
  }

  const modes = record["modes"];

  if (!Array.isArray(modes)) {
    throw new Error('Pack manifest field "modes" must be an array.');
  }

  for (const mode of modes) {
    if (typeof mode !== "object" || mode === null || Array.isArray(mode)) {
      throw new Error("Pack mode must be an object.");
    }

    const modeRecord = mode as Record<string, unknown>;

    for (const fieldName of REQUIRED_PACK_MODE_FIELDS) {
      assertNonEmptyString(modeRecord[fieldName], fieldName, "Pack mode");
    }

    const allowedFields = new Set<string>(REQUIRED_PACK_MODE_FIELDS);

    for (const fieldName of Object.keys(modeRecord)) {
      if (!allowedFields.has(fieldName)) {
        throw new Error(`Pack mode field "${fieldName}" is not allowed.`);
      }
    }
  }

  if (record["notes"] !== undefined) {
    assertNonEmptyString(record["notes"], "notes", "Pack manifest");
  }

  const allowedFields = new Set<string>([
    ...REQUIRED_PACK_MANIFEST_FIELDS,
    "notes"
  ]);

  for (const fieldName of Object.keys(record)) {
    if (!allowedFields.has(fieldName)) {
      throw new Error(`Pack manifest field "${fieldName}" is not allowed.`);
    }
  }
}
