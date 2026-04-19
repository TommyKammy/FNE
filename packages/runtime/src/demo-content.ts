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

export interface RuntimeStage {
  packId: string;
  stageId: string;
  items: RuntimeDemoItem[];
}

export interface BootSceneModel extends RuntimeStage {
  headline: string;
  subhead: string;
}

type AssetDirectory = "images" | "audio";

export type DemoRuntimeItemLoader = () => RuntimeDemoItem;
export type DemoRuntimeStageLoader = () => RuntimeStage;

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

export function loadRuntimeStageFromManifest(manifest: PackManifest): RuntimeStage {
  const stage = manifest.stages[0];

  if (stage === undefined) {
    throw new Error(`Pack "${manifest.id}" must contain at least one stage.`);
  }

  if (stage.vocabularyItemIds[0] === undefined) {
    throw new Error(`Stage "${stage.id}" must reference at least one vocabulary item id.`);
  }

  const items = stage.vocabularyItemIds.map((stageItemId) => {
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
  });

  return {
    packId: manifest.id,
    stageId: stage.id,
    items
  };
}

export function loadRuntimeItemFromManifest(manifest: PackManifest): RuntimeDemoItem {
  const stage = loadRuntimeStageFromManifest(manifest);
  const firstItem = stage.items[0];

  if (firstItem === undefined) {
    throw new Error(`Stage "${stage.stageId}" must reference at least one vocabulary item id.`);
  }

  return firstItem;
}

export function loadDemoRuntimeItem(): RuntimeDemoItem {
  return loadRuntimeItemFromManifest(DEMO_PACK_MANIFEST);
}

export function loadDemoRuntimeStage(): RuntimeStage {
  return loadRuntimeStageFromManifest(DEMO_PACK_MANIFEST);
}

export function createBootSceneModel(
  loadRuntimeStage: DemoRuntimeStageLoader = loadDemoRuntimeStage
): BootSceneModel {
  const runtimeStage = loadRuntimeStage();

  return {
    ...runtimeStage,
    headline: "Loader seam demo",
    subhead: `Pack ${runtimeStage.packId} / Stage ${runtimeStage.stageId}`
  };
}
