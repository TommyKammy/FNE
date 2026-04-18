import { describe, expect, it, vi } from "vitest";
import { SHELL_HEIGHT_PX, SHELL_WIDTH_PX } from "@fne/shared";
import {
  createRuntimeGameConfig,
  mountRuntimeWithGameCtor,
  type RuntimeGameConfig,
  type RuntimeGameHandle,
  type RuntimePhaserApi
} from "@fne/runtime/runtime-mount";

describe("runtime smoke", () => {
  it("builds a runtime game config and destroys the runtime cleanly", () => {
    const container = document.createElement("div");
    const destroySpy = vi.fn();
    const fakeScene = { key: "boot-scene" };
    const fakePhaserApi: RuntimePhaserApi = {
      AUTO: "AUTO",
      Scale: {
        FIT: "FIT",
        CENTER_BOTH: "CENTER_BOTH"
      }
    };
    const capturedConfigs: RuntimeGameConfig<typeof fakeScene>[] = [];

    class FakeGame implements RuntimeGameHandle {
      constructor(config: RuntimeGameConfig<typeof fakeScene>) {
        capturedConfigs.push(config);
      }

      destroy(removeCanvas?: boolean) {
        destroySpy(removeCanvas);
      }
    }

    const config = createRuntimeGameConfig(container, fakeScene, fakePhaserApi);
    const runtime = mountRuntimeWithGameCtor(config, FakeGame);

    expect(config).toMatchObject({
      type: "AUTO",
      parent: container,
      width: SHELL_WIDTH_PX,
      height: SHELL_HEIGHT_PX,
      backgroundColor: "#111927",
      scene: [fakeScene],
      scale: {
        mode: "FIT",
        autoCenter: "CENTER_BOTH",
        width: SHELL_WIDTH_PX,
        height: SHELL_HEIGHT_PX
      }
    });
    expect(capturedConfigs).toEqual([config]);

    runtime.destroy();

    expect(destroySpy).toHaveBeenCalledWith(true);
  });
});
