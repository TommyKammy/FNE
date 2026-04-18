import {
  assertValidPackManifest,
  assertValidVocabularyItem,
  type PackManifest,
  type VocabularyItem
} from "@fne/shared";
import demoPackManifestJson from "./content/demo-pack/manifest.json";

export interface RuntimeDemoItem {
  packId: string;
  stageId: string;
  item: VocabularyItem;
  imageSrc: string;
  audioSrc: string;
}

export interface BootSceneModel extends RuntimeDemoItem {
  headline: string;
  subhead: string;
  term: string;
  meaning: string;
}

type AssetDirectory = "images" | "audio";

export type DemoRuntimeItemLoader = () => RuntimeDemoItem;

assertValidPackManifest(demoPackManifestJson);
const DEMO_PACK_MANIFEST = demoPackManifestJson;

function createAssetPath(
  packId: string,
  assetDirectory: AssetDirectory,
  assetId: string,
  extension: string
): string {
  return `/content/packs/${packId}/assets/${assetDirectory}/${assetId}.${extension}`;
}

export function loadRuntimeItemFromManifest(manifest: PackManifest): RuntimeDemoItem {
  const stage = manifest.stages[0];

  if (stage === undefined) {
    throw new Error(`Pack "${manifest.id}" must contain at least one stage.`);
  }

  const stageItemId = stage.vocabularyItemIds[0];

  if (stageItemId === undefined) {
    throw new Error(`Stage "${stage.id}" must reference at least one vocabulary item id.`);
  }

  const item = manifest.vocabularyItems.find((candidate) => candidate.id === stageItemId);

  if (item === undefined) {
    throw new Error(`Stage "${stage.id}" references unknown vocabulary item "${stageItemId}".`);
  }

  assertValidVocabularyItem(item);

  return {
    packId: manifest.id,
    stageId: stage.id,
    item,
    imageSrc: createAssetPath(manifest.id, "images", item.imageAssetId, "svg"),
    audioSrc: createAssetPath(manifest.id, "audio", item.audioAssetId, "wav")
  };
}

export function loadDemoRuntimeItem(): RuntimeDemoItem {
  return loadRuntimeItemFromManifest(DEMO_PACK_MANIFEST);
}

export function createBootSceneModel(
  loadRuntimeItem: DemoRuntimeItemLoader = loadDemoRuntimeItem
): BootSceneModel {
  const runtimeItem = loadRuntimeItem();

  return {
    ...runtimeItem,
    headline: "Loader seam demo",
    subhead: `Pack ${runtimeItem.packId} / Stage ${runtimeItem.stageId}`,
    term: runtimeItem.item.term,
    meaning: runtimeItem.item.meaning
  };
}
