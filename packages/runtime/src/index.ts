import Phaser from "phaser";
import { SHELL_HEIGHT_PX, SHELL_WIDTH_PX, type RuntimeMount } from "@fne/shared";
import { BootScene } from "./scenes/BootScene";

export {
  createBootSceneModel,
  loadDemoRuntimeItem,
  type BootSceneModel,
  type DemoRuntimeItemLoader,
  type RuntimeDemoItem
} from "./demo-content";

export function mountRuntime(container: HTMLElement): RuntimeMount {
  const game = new Phaser.Game({
    type: Phaser.AUTO,
    parent: container,
    backgroundColor: "#111927",
    width: SHELL_WIDTH_PX,
    height: SHELL_HEIGHT_PX,
    scene: [BootScene],
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: SHELL_WIDTH_PX,
      height: SHELL_HEIGHT_PX
    }
  });

  return {
    destroy() {
      game.destroy(true);
    }
  };
}
