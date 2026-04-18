import { SHELL_HEIGHT_PX, SHELL_WIDTH_PX, type RuntimeMount } from "@fne/shared";

export interface RuntimeGameHandle {
  destroy(removeCanvas?: boolean): void;
}

export interface RuntimeGameConstructor<TConfig> {
  new (config: TConfig): RuntimeGameHandle;
}

export interface RuntimeScaleApi {
  FIT: unknown;
  CENTER_BOTH: unknown;
}

export interface RuntimePhaserApi {
  AUTO: unknown;
  Scale: RuntimeScaleApi;
}

export interface RuntimeGameConfig<TScene> {
  type: unknown;
  parent: HTMLElement;
  backgroundColor: string;
  width: number;
  height: number;
  scene: TScene[];
  scale: {
    mode: unknown;
    autoCenter: unknown;
    width: number;
    height: number;
  };
}

export function createRuntimeGameConfig<TScene>(
  container: HTMLElement,
  scene: TScene,
  phaserApi: RuntimePhaserApi
): RuntimeGameConfig<TScene> {
  return {
    type: phaserApi.AUTO,
    parent: container,
    backgroundColor: "#111927",
    width: SHELL_WIDTH_PX,
    height: SHELL_HEIGHT_PX,
    scene: [scene],
    scale: {
      mode: phaserApi.Scale.FIT,
      autoCenter: phaserApi.Scale.CENTER_BOTH,
      width: SHELL_WIDTH_PX,
      height: SHELL_HEIGHT_PX
    }
  };
}

export function mountRuntimeWithGameCtor<TScene, TConfig extends RuntimeGameConfig<TScene>>(
  config: TConfig,
  GameCtor: RuntimeGameConstructor<TConfig>
): RuntimeMount {
  const game = new GameCtor(config);

  return {
    destroy() {
      game.destroy(true);
    }
  };
}
