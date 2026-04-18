import { assertValidVocabularyItem, type PackManifest, type VocabularyItem } from "@fne/shared";
import {
  createBootSceneModel,
  loadDemoRuntimeItem,
  loadRuntimeItemFromManifest
} from "@fne/runtime/demo-content";
import { describe, expect, it, vi } from "vitest";

describe("demo runtime content", () => {
  it("builds the boot scene model from a loader seam", () => {
    const item: VocabularyItem = {
      id: "banana",
      term: "banana",
      meaning: "バナナ",
      pronunciation: "buh-NA-nuh",
      imageAssetId: "img-banana",
      audioAssetId: "aud-banana"
    };
    const loader = vi.fn(() => ({
      packId: "demo-pack",
      stageId: "stage-fruit-1",
      item,
      imageSrc: "/content/packs/demo-pack/assets/images/img-banana.svg",
      audioSrc: "/content/packs/demo-pack/assets/audio/aud-banana.wav"
    }));

    const model = createBootSceneModel(loader);

    expect(loader).toHaveBeenCalledTimes(1);
    expect(model.term).toBe("banana");
    expect(model.meaning).toBe("バナナ");
    expect(model.audioSrc).toBe("/content/packs/demo-pack/assets/audio/aud-banana.wav");
  });

  it("loads one demo item with canonical item fields and convention-aligned asset paths", () => {
    const demoItem = loadDemoRuntimeItem();

    expect(() => assertValidVocabularyItem(demoItem.item)).not.toThrow();
    expect(demoItem.packId).toBe("demo-pack");
    expect(demoItem.stageId).toBe("stage-fruit-1");
    expect(demoItem.imageSrc).toBe("/content/packs/demo-pack/assets/images/img-apple.svg");
    expect(demoItem.audioSrc).toBe("/content/packs/demo-pack/assets/audio/aud-apple.wav");
  });

  it("resolves the runtime item from the selected stage reference instead of global item order", () => {
    const manifest: PackManifest = {
      schemaVersion: 1,
      id: "demo-pack",
      title: "Demo Pack",
      description: "fixture",
      vocabularyItems: [
        {
          id: "banana",
          term: "banana",
          meaning: "バナナ",
          pronunciation: "buh-NA-nuh",
          imageAssetId: "img-banana",
          audioAssetId: "aud-banana"
        },
        {
          id: "apple",
          term: "apple",
          meaning: "りんご",
          pronunciation: "AP-uhl",
          imageAssetId: "img-apple",
          audioAssetId: "aud-apple"
        }
      ],
      stages: [
        {
          id: "stage-fruit-1",
          title: "Fruit Basics",
          vocabularyItemIds: ["apple"],
          modeIds: ["practice"]
        }
      ],
      modes: [
        {
          id: "practice",
          label: "Practice",
          description: "fixture"
        }
      ]
    };

    const runtimeItem = loadRuntimeItemFromManifest(manifest);

    expect(runtimeItem.stageId).toBe("stage-fruit-1");
    expect(runtimeItem.item.id).toBe("apple");
    expect(runtimeItem.imageSrc).toBe("/content/packs/demo-pack/assets/images/img-apple.svg");
    expect(runtimeItem.audioSrc).toBe("/content/packs/demo-pack/assets/audio/aud-apple.wav");
  });
});
