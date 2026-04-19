import Phaser from "phaser";
import { type RuntimeMount } from "@fne/shared";
import { BootScene } from "./scenes/BootScene";
import {
  createRuntimeGameConfig,
  mountRuntimeWithGameCtor,
  type RuntimeGameConfig,
  type RuntimeGameConstructor,
  type RuntimePhaserApi
} from "./runtime-mount";

export { BootScene } from "./scenes/BootScene";
export {
  createBootSceneModel,
  loadDemoRuntimeStage,
  loadDemoRuntimeItem,
  loadRuntimeStageFromManifest,
  type BootSceneModel,
  type DemoRuntimeItemLoader,
  type DemoRuntimeStageLoader,
  type RuntimeDemoItem,
  type RuntimeStage
} from "./demo-content";
export {
  advanceLearnStageRound,
  beginLearnStageRound,
  continueLearnStage,
  createLearnStageState,
  judgeLearnStageInput,
  restartLearnStageRound,
  type LearnStageContentErrorState,
  type LearnStageItemResult,
  type LearnStageProgressState,
  type LearnStageState,
  type LearnStageSummaryState
} from "./learn-stage";
export {
  createRuntimeGameConfig,
  mountRuntimeWithGameCtor,
  type RuntimeGameConfig,
  type RuntimeGameConstructor,
  type RuntimeGameHandle,
  type RuntimePhaserApi
} from "./runtime-mount";

export function mountRuntime(container: HTMLElement): RuntimeMount {
  const phaserApi: RuntimePhaserApi = Phaser;
  const gameCtor =
    Phaser.Game as unknown as RuntimeGameConstructor<RuntimeGameConfig<typeof BootScene>>;
  const config = createRuntimeGameConfig(container, BootScene, phaserApi);

  return mountRuntimeWithGameCtor(config, gameCtor);
}
