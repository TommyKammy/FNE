import { assertValidVocabularyItem, type PackManifest, type VocabularyItem } from "@fne/shared";
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

const DEMO_PACK_MANIFEST = demoPackManifestJson as PackManifest;

function createAssetPath(
  packId: string,
  assetDirectory: AssetDirectory,
  assetId: string,
  extension: string
): string {
  return `/content/packs/${packId}/assets/${assetDirectory}/${assetId}.${extension}`;
}

function getFirstDemoItem(): VocabularyItem {
  const item = DEMO_PACK_MANIFEST.vocabularyItems[0];

  if (item === undefined) {
    throw new Error(`Pack "${DEMO_PACK_MANIFEST.id}" must contain at least one vocabulary item.`);
  }

  assertValidVocabularyItem(item);

  return item;
}

export function loadDemoRuntimeItem(): RuntimeDemoItem {
  const item = getFirstDemoItem();
  const stage = DEMO_PACK_MANIFEST.stages[0];

  if (stage === undefined) {
    throw new Error(`Pack "${DEMO_PACK_MANIFEST.id}" must contain at least one stage.`);
  }

  return {
    packId: DEMO_PACK_MANIFEST.id,
    stageId: stage.id,
    item,
    imageSrc: createAssetPath(DEMO_PACK_MANIFEST.id, "images", item.imageAssetId, "svg"),
    audioSrc: createAssetPath(DEMO_PACK_MANIFEST.id, "audio", item.audioAssetId, "wav")
  };
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
