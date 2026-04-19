import type { RuntimeDemoItem, RuntimeStage } from "./demo-content";
import {
  advanceRevealRound,
  beginRevealRound,
  createRevealRoundState,
  judgeRevealRoundInput,
  judgeRevealRoundTimeout,
  restartRevealRound,
  type RevealRoundContentError,
  type RevealRoundState
} from "./reveal-round";

export interface LearnStageItemResult {
  itemId: string;
  passedWithSupport: boolean;
  attemptCount: number;
}

export interface LearnStageProgressState {
  kind: "in-progress";
  packId: string;
  stageId: string;
  items: RuntimeDemoItem[];
  currentIndex: number;
  currentItem: RuntimeDemoItem;
  roundState: RevealRoundState;
  completedItems: LearnStageItemResult[];
}

export interface LearnStageSummaryState {
  kind: "summary";
  packId: string;
  stageId: string;
  items: RuntimeDemoItem[];
  completedItems: LearnStageItemResult[];
  totalItemCount: number;
}

export interface LearnStageContentErrorState {
  kind: "content-error";
  packId: string;
  stageId: string;
  error: RevealRoundContentError;
}

export type LearnStageState =
  | LearnStageProgressState
  | LearnStageSummaryState
  | LearnStageContentErrorState;

function createItemResult(roundState: RevealRoundState): LearnStageItemResult {
  return {
    itemId: roundState.itemId,
    passedWithSupport: roundState.passedWithSupport,
    attemptCount: roundState.attemptCount
  };
}

function createProgressState(
  stage: RuntimeStage,
  currentIndex: number,
  completedItems: LearnStageItemResult[]
): LearnStageState {
  const currentItem = stage.items[currentIndex];

  if (currentItem === undefined) {
    return {
      kind: "summary",
      packId: stage.packId,
      stageId: stage.stageId,
      items: stage.items,
      completedItems,
      totalItemCount: stage.items.length
    };
  }

  const roundSetup = createRevealRoundState(currentItem.item);

  if (!roundSetup.ok) {
    return {
      kind: "content-error",
      packId: stage.packId,
      stageId: stage.stageId,
      error: roundSetup.error
    };
  }

  return {
    kind: "in-progress",
    packId: stage.packId,
    stageId: stage.stageId,
    items: stage.items,
    currentIndex,
    currentItem,
    roundState: roundSetup.state,
    completedItems
  };
}

export function createLearnStageState(stage: RuntimeStage): LearnStageState {
  return createProgressState(stage, 0, []);
}

export function beginLearnStageRound(state: LearnStageState): LearnStageState {
  if (state.kind !== "in-progress") {
    return state;
  }

  return {
    ...state,
    roundState: beginRevealRound(state.roundState)
  };
}

export function advanceLearnStageRound(state: LearnStageState): LearnStageState {
  if (state.kind !== "in-progress") {
    return state;
  }

  return {
    ...state,
    roundState: advanceRevealRound(state.roundState)
  };
}

export function judgeLearnStageInput(state: LearnStageState, key: string): LearnStageState {
  if (state.kind !== "in-progress") {
    return state;
  }

  return {
    ...state,
    roundState: judgeRevealRoundInput(state.roundState, key)
  };
}

export function restartLearnStageRound(state: LearnStageState): LearnStageState {
  if (state.kind !== "in-progress") {
    return state;
  }

  return {
    ...state,
    roundState: restartRevealRound(state.roundState)
  };
}

export function judgeLearnStageTimeout(state: LearnStageState): LearnStageState {
  if (state.kind !== "in-progress") {
    return state;
  }

  return {
    ...state,
    roundState: judgeRevealRoundTimeout(state.roundState)
  };
}

export function continueLearnStage(state: LearnStageState): LearnStageState {
  if (state.kind !== "in-progress" || state.roundState.phase !== "passed") {
    return state;
  }

  const completedItems = [...state.completedItems, createItemResult(state.roundState)];
  const nextIndex = state.currentIndex + 1;

  return createProgressState(
    {
      packId: state.packId,
      stageId: state.stageId,
      items: state.items
    },
    nextIndex,
    completedItems
  );
}

export function restartLearnStage(state: LearnStageState): LearnStageState {
  if (state.kind !== "summary") {
    return state;
  }

  return createProgressState(
    {
      packId: state.packId,
      stageId: state.stageId,
      items: state.items
    },
    0,
    []
  );
}
