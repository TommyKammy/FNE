import {
  assertValidPackManifest,
  assertValidVocabularyItem,
  type PackManifest,
  type VocabularyItem
} from "@fne/shared";
import {
  createBootSceneModel,
  loadDemoRuntimeItem,
  loadRuntimeItemFromManifest,
  loadRuntimeStageFromManifest
} from "@fne/runtime/demo-content";
import { describe, expect, it, vi } from "vitest";

describe("demo runtime content", () => {
  it("builds the boot scene model from a loader seam", () => {
    const loader = vi.fn(() => ({
      packId: "demo-pack",
      stageId: "stage-fruit-1",
      items: [
        {
          packId: "demo-pack",
          stageId: "stage-fruit-1",
          item: {
            id: "banana",
            term: "banana",
            meaning: "バナナ",
            pronunciation: "buh-NA-nuh",
            imageAssetId: "img-banana",
            audioAssetId: "aud-banana"
          },
          imageSrc: "/content/packs/demo-pack/assets/images/img-banana.svg",
          audioSrc: "/content/packs/demo-pack/assets/audio/aud-banana.wav"
        }
      ]
    }));

    const model = createBootSceneModel(loader);

    expect(loader).toHaveBeenCalledTimes(1);
    expect(model.packId).toBe("demo-pack");
    expect(model.stageId).toBe("stage-fruit-1");
    expect(model.items).toHaveLength(1);
    expect(model.items[0]?.item.term).toBe("banana");
    expect(model.items[0]?.item.meaning).toBe("バナナ");
    expect(model.items[0]?.audioSrc).toBe("/content/packs/demo-pack/assets/audio/aud-banana.wav");
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

  it("loads a short ordered runtime stage from stage item references", () => {
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
        },
        {
          id: "melon",
          term: "melon",
          meaning: "メロン",
          pronunciation: "MEH-luhn",
          imageAssetId: "img-melon",
          audioAssetId: "aud-melon"
        }
      ],
      stages: [
        {
          id: "stage-fruit-1",
          title: "Fruit Basics",
          vocabularyItemIds: ["apple", "melon", "banana"],
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

    const runtimeStage = loadRuntimeStageFromManifest(manifest);

    expect(runtimeStage.stageId).toBe("stage-fruit-1");
    expect(runtimeStage.items.map((item) => item.item.id)).toEqual(["apple", "melon", "banana"]);
    expect(runtimeStage.items.map((item) => item.imageSrc)).toEqual([
      "/content/packs/demo-pack/assets/images/img-apple.svg",
      "/content/packs/demo-pack/assets/images/img-melon.svg",
      "/content/packs/demo-pack/assets/images/img-banana.svg"
    ]);
    expect(runtimeStage.items.map((item) => item.audioSrc)).toEqual([
      "/content/packs/demo-pack/assets/audio/aud-apple.wav",
      "/content/packs/demo-pack/assets/audio/aud-melon.wav",
      "/content/packs/demo-pack/assets/audio/aud-banana.wav"
    ]);
  });

  it("reports pack-specific validation errors instead of vocabulary-item prefixes", () => {
    const manifestMissingTitle: unknown = {
      schemaVersion: 1,
      id: "demo-pack",
      title: " ",
      description: "fixture",
      vocabularyItems: [],
      stages: [],
      modes: []
    };
    const manifestWithInvalidStageItemId: unknown = {
      schemaVersion: 1,
      id: "demo-pack",
      title: "Demo Pack",
      description: "fixture",
      vocabularyItems: [],
      stages: [
        {
          id: "stage-fruit-1",
          title: "Fruit Basics",
          vocabularyItemIds: [" "],
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
    const manifestWithInvalidModeLabel: unknown = {
      schemaVersion: 1,
      id: "demo-pack",
      title: "Demo Pack",
      description: "fixture",
      vocabularyItems: [],
      stages: [],
      modes: [
        {
          id: "practice",
          label: " ",
          description: "fixture"
        }
      ]
    };

    expect(() => assertValidPackManifest(manifestMissingTitle)).toThrow(
      'Pack manifest field "title" must be a non-empty string.'
    );
    expect(() => assertValidPackManifest(manifestWithInvalidStageItemId)).toThrow(
      'Pack stage field "vocabularyItemIds" must be a non-empty string.'
    );
    expect(() => assertValidPackManifest(manifestWithInvalidModeLabel)).toThrow(
      'Pack mode field "label" must be a non-empty string.'
    );
  });

  it("rejects stage references that point outside declared items and modes", () => {
    const manifestWithUnknownStageItem: unknown = {
      schemaVersion: 1,
      id: "demo-pack",
      title: "Demo Pack",
      description: "fixture",
      vocabularyItems: [
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
          vocabularyItemIds: ["banana"],
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
    const manifestWithUnknownStageMode: unknown = {
      schemaVersion: 1,
      id: "demo-pack",
      title: "Demo Pack",
      description: "fixture",
      vocabularyItems: [
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
          modeIds: ["boss"]
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

    expect(() => assertValidPackManifest(manifestWithUnknownStageItem)).toThrow(
      'Pack stage "stage-fruit-1" references unknown vocabulary item "banana".'
    );
    expect(() => assertValidPackManifest(manifestWithUnknownStageMode)).toThrow(
      'Pack stage "stage-fruit-1" references unknown mode "boss".'
    );
  });

  it("rejects duplicate declared vocabulary item, stage, and mode ids", () => {
    const manifestWithDuplicateVocabularyItemId: unknown = {
      schemaVersion: 1,
      id: "demo-pack",
      title: "Demo Pack",
      description: "fixture",
      vocabularyItems: [
        {
          id: "apple",
          term: "apple",
          meaning: "りんご",
          pronunciation: "AP-uhl",
          imageAssetId: "img-apple",
          audioAssetId: "aud-apple"
        },
        {
          id: "apple",
          term: "green apple",
          meaning: "青りんご",
          pronunciation: "GREEN AP-uhl",
          imageAssetId: "img-green-apple",
          audioAssetId: "aud-green-apple"
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
    const manifestWithDuplicateStageId: unknown = {
      schemaVersion: 1,
      id: "demo-pack",
      title: "Demo Pack",
      description: "fixture",
      vocabularyItems: [
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
        },
        {
          id: "stage-fruit-1",
          title: "Fruit Review",
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
    const manifestWithDuplicateModeId: unknown = {
      schemaVersion: 1,
      id: "demo-pack",
      title: "Demo Pack",
      description: "fixture",
      vocabularyItems: [
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
        },
        {
          id: "practice",
          label: "Boss",
          description: "fixture"
        }
      ]
    };

    expect(() => assertValidPackManifest(manifestWithDuplicateVocabularyItemId)).toThrow(
      'Pack manifest contains duplicate vocabulary item id "apple".'
    );
    expect(() => assertValidPackManifest(manifestWithDuplicateStageId)).toThrow(
      'Pack manifest contains duplicate stage id "stage-fruit-1".'
    );
    expect(() => assertValidPackManifest(manifestWithDuplicateModeId)).toThrow(
      'Pack manifest contains duplicate mode id "practice".'
    );
  });
});
