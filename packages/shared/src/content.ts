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

function assertNoDuplicateIds(
  ids: Iterable<string>,
  duplicateLabel: "vocabulary item" | "stage" | "mode"
): void {
  const seenIds = new Set<string>();

  for (const id of ids) {
    if (seenIds.has(id)) {
      throw new Error(`Pack manifest contains duplicate ${duplicateLabel} id "${id}".`);
    }

    seenIds.add(id);
  }
}

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

  const validatedStages: PackStage[] = [];

  for (const stage of stages) {
    if (typeof stage !== "object" || stage === null || Array.isArray(stage)) {
      throw new Error("Pack stage must be an object.");
    }

    const stageRecord = stage as Record<string, unknown>;
    const stageId = stageRecord["id"];
    const stageTitle = stageRecord["title"];
    const stageVocabularyItemIds = stageRecord["vocabularyItemIds"];
    const stageModeIds = stageRecord["modeIds"];

    assertNonEmptyString(stageId, "id", "Pack stage");
    assertNonEmptyString(stageTitle, "title", "Pack stage");
    assertStringArray(stageVocabularyItemIds, "vocabularyItemIds", "Pack stage");
    assertStringArray(stageModeIds, "modeIds", "Pack stage");

    const allowedFields = new Set<string>(REQUIRED_PACK_STAGE_FIELDS);

    for (const fieldName of Object.keys(stageRecord)) {
      if (!allowedFields.has(fieldName)) {
        throw new Error(`Pack stage field "${fieldName}" is not allowed.`);
      }
    }

    validatedStages.push({
      id: stageId,
      title: stageTitle,
      vocabularyItemIds: stageVocabularyItemIds,
      modeIds: stageModeIds
    });
  }

  const modes = record["modes"];

  if (!Array.isArray(modes)) {
    throw new Error('Pack manifest field "modes" must be an array.');
  }

  const validatedModes: PackMode[] = [];

  for (const mode of modes) {
    if (typeof mode !== "object" || mode === null || Array.isArray(mode)) {
      throw new Error("Pack mode must be an object.");
    }

    const modeRecord = mode as Record<string, unknown>;
    const modeId = modeRecord["id"];
    const modeLabel = modeRecord["label"];
    const modeDescription = modeRecord["description"];

    assertNonEmptyString(modeId, "id", "Pack mode");
    assertNonEmptyString(modeLabel, "label", "Pack mode");
    assertNonEmptyString(modeDescription, "description", "Pack mode");

    const allowedFields = new Set<string>(REQUIRED_PACK_MODE_FIELDS);

    for (const fieldName of Object.keys(modeRecord)) {
      if (!allowedFields.has(fieldName)) {
        throw new Error(`Pack mode field "${fieldName}" is not allowed.`);
      }
    }

    validatedModes.push({
      id: modeId,
      label: modeLabel,
      description: modeDescription
    });
  }

  assertNoDuplicateIds(
    (vocabularyItems as VocabularyItem[]).map((item) => item.id),
    "vocabulary item"
  );
  assertNoDuplicateIds(validatedStages.map((stage) => stage.id), "stage");
  assertNoDuplicateIds(validatedModes.map((mode) => mode.id), "mode");

  const vocabularyItemIds = new Set(vocabularyItems.map((item) => (item as VocabularyItem).id));
  const modeIds = new Set(validatedModes.map((mode) => mode.id));

  for (const stage of validatedStages) {
    for (const vocabularyItemId of stage.vocabularyItemIds) {
      if (!vocabularyItemIds.has(vocabularyItemId)) {
        throw new Error(
          `Pack stage "${stage.id}" references unknown vocabulary item "${vocabularyItemId}".`
        );
      }
    }

    for (const modeId of stage.modeIds) {
      if (!modeIds.has(modeId)) {
        throw new Error(`Pack stage "${stage.id}" references unknown mode "${modeId}".`);
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
