import {
  advanceLearnStageRound,
  beginLearnStageRound,
  continueLearnStage,
  createLearnStageState,
  judgeLearnStageInput,
  judgeLearnStageTimeout,
  restartLearnStage,
  restartLearnStageAndBeginRound,
  restartLearnStageRound,
  type LearnStageProgressState
} from "@fne/runtime/learn-stage";
import type { RuntimeStage } from "@fne/runtime/demo-content";
import { describe, expect, it } from "vitest";

function createFixtureStage(): RuntimeStage {
  return {
    packId: "demo-pack",
    stageId: "stage-fruit-1",
    items: [
      {
        packId: "demo-pack",
        stageId: "stage-fruit-1",
        item: {
          id: "apple",
          term: "apple",
          meaning: "りんご",
          pronunciation: "AP-uhl",
          imageAssetId: "img-apple",
          audioAssetId: "aud-apple"
        },
        imageSrc: "/content/packs/demo-pack/assets/images/img-apple.svg",
        audioSrc: "/content/packs/demo-pack/assets/audio/aud-apple.wav"
      },
      {
        packId: "demo-pack",
        stageId: "stage-fruit-1",
        item: {
          id: "melon",
          term: "melon",
          meaning: "メロン",
          pronunciation: "MEH-luhn",
          imageAssetId: "img-melon",
          audioAssetId: "aud-melon"
        },
        imageSrc: "/content/packs/demo-pack/assets/images/img-melon.svg",
        audioSrc: "/content/packs/demo-pack/assets/audio/aud-melon.wav"
      },
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
  };
}

function expectInProgressState(
  state: ReturnType<typeof createLearnStageState>
): LearnStageProgressState {
  expect(state.kind).toBe("in-progress");

  if (state.kind !== "in-progress") {
    throw new Error("expected an in-progress learn stage");
  }

  return state;
}

function moveToAwaitingInput(state: LearnStageProgressState): LearnStageProgressState {
  const attentionCue = beginLearnStageRound(state);
  const imageReveal = advanceLearnStageRound(attentionCue);
  const pronunciationReveal = advanceLearnStageRound(imageReveal);
  const textReveal = advanceLearnStageRound(pronunciationReveal);
  const awaitingInput = advanceLearnStageRound(textReveal);

  expect(awaitingInput.kind).toBe("in-progress");

  if (awaitingInput.kind !== "in-progress") {
    throw new Error("expected an in-progress learn stage");
  }

  expect(awaitingInput.roundState.phase).toBe("awaiting-input");

  return awaitingInput;
}

describe("learn stage state", () => {
  it("advances to the next item only after the current item is passed", () => {
    const stage = expectInProgressState(createLearnStageState(createFixtureStage()));
    const awaitingInput = moveToAwaitingInput(stage);
    const failed = judgeLearnStageInput(awaitingInput, "x");

    expect(failed.kind).toBe("in-progress");

    if (failed.kind !== "in-progress") {
      throw new Error("expected an in-progress learn stage");
    }

    expect(failed.roundState.phase).toBe("retry-needed");
    expect(continueLearnStage(failed)).toBe(failed);

    const replayIdle = restartLearnStageRound(failed);
    const replayAwaitingInput = moveToAwaitingInput(expectInProgressState(replayIdle));
    const passed = judgeLearnStageInput(replayAwaitingInput, "a");

    expect(passed.kind).toBe("in-progress");

    if (passed.kind !== "in-progress") {
      throw new Error("expected an in-progress learn stage");
    }

    expect(passed.roundState.phase).toBe("passed");

    const nextItem = continueLearnStage(passed);

    expect(nextItem.kind).toBe("in-progress");

    if (nextItem.kind !== "in-progress") {
      throw new Error("expected an in-progress learn stage");
    }

    expect(nextItem.currentIndex).toBe(1);
    expect(nextItem.currentItem.item.id).toBe("melon");
    expect(nextItem.completedItems).toEqual([
      {
        itemId: "apple",
        passedWithSupport: true,
        attemptCount: 2
      }
    ]);
  });

  it("completes the stage after all scheduled items are passed in order", () => {
    let state = createLearnStageState(createFixtureStage());

    for (const expectedKey of ["a", "m", "b"]) {
      const awaitingInput = moveToAwaitingInput(expectInProgressState(state));
      const passed = judgeLearnStageInput(awaitingInput, expectedKey);

      expect(passed.kind).toBe("in-progress");

      if (passed.kind !== "in-progress") {
        throw new Error("expected an in-progress learn stage");
      }

      expect(passed.roundState.phase).toBe("passed");
      state = continueLearnStage(passed);
    }

    expect(state.kind).toBe("summary");

    if (state.kind !== "summary") {
      throw new Error("expected a summary learn stage");
    }

    expect(state.totalItemCount).toBe(3);
    expect(state.completedItems).toEqual([
      {
        itemId: "apple",
        passedWithSupport: false,
        attemptCount: 1
      },
      {
        itemId: "melon",
        passedWithSupport: false,
        attemptCount: 1
      },
      {
        itemId: "banana",
        passedWithSupport: false,
        attemptCount: 1
      }
    ]);
  });

  it("restarts from the summary with the first item active again", () => {
    let state = createLearnStageState(createFixtureStage());

    for (const expectedKey of ["a", "m", "b"]) {
      const awaitingInput = moveToAwaitingInput(expectInProgressState(state));
      const passed = judgeLearnStageInput(awaitingInput, expectedKey);

      expect(passed.kind).toBe("in-progress");

      if (passed.kind !== "in-progress") {
        throw new Error("expected an in-progress learn stage");
      }

      state = continueLearnStage(passed);
    }

    expect(state.kind).toBe("summary");

    const restarted = restartLearnStage(state);

    expect(restarted.kind).toBe("in-progress");

    if (restarted.kind !== "in-progress") {
      throw new Error("expected an in-progress learn stage");
    }

    expect(restarted.currentIndex).toBe(0);
    expect(restarted.currentItem.item.id).toBe("apple");
    expect(restarted.completedItems).toEqual([]);
    expect(restarted.roundState.phase).toBe("idle");
  });

  it("starts the first round immediately when the summary is replayed", () => {
    let state = createLearnStageState(createFixtureStage());

    for (const expectedKey of ["a", "m", "b"]) {
      const awaitingInput = moveToAwaitingInput(expectInProgressState(state));
      const passed = judgeLearnStageInput(awaitingInput, expectedKey);

      expect(passed.kind).toBe("in-progress");

      if (passed.kind !== "in-progress") {
        throw new Error("expected an in-progress learn stage");
      }

      state = continueLearnStage(passed);
    }

    expect(state.kind).toBe("summary");

    const restarted = restartLearnStageAndBeginRound(state);

    expect(restarted.kind).toBe("in-progress");

    if (restarted.kind !== "in-progress") {
      throw new Error("expected an in-progress learn stage");
    }

    expect(restarted.currentIndex).toBe(0);
    expect(restarted.currentItem.item.id).toBe("apple");
    expect(restarted.completedItems).toEqual([]);
    expect(restarted.roundState.phase).toBe("awaiting-input");
    expect(restarted.roundState.attemptCount).toBe(1);
    expect(restarted.roundState.audioCueRequestCount).toBe(1);
  });

  it("keeps the same item active after a missed timing window and records the supported clear", () => {
    const stage = expectInProgressState(createLearnStageState(createFixtureStage()));
    const awaitingInput = moveToAwaitingInput(stage);
    const missed = judgeLearnStageTimeout(awaitingInput);

    expect(missed.kind).toBe("in-progress");

    if (missed.kind !== "in-progress") {
      throw new Error("expected an in-progress learn stage");
    }

    expect(missed.currentIndex).toBe(0);
    expect(missed.currentItem.item.id).toBe("apple");
    expect(missed.roundState.phase).toBe("retry-needed");
    expect(missed.roundState.feedbackBody).toContain("little late");

    const replayIdle = restartLearnStageRound(missed);
    const replayAwaitingInput = moveToAwaitingInput(expectInProgressState(replayIdle));
    const passed = judgeLearnStageInput(replayAwaitingInput, "a");
    const nextItem = continueLearnStage(expectInProgressState(passed));

    expect(nextItem.kind).toBe("in-progress");

    if (nextItem.kind !== "in-progress") {
      throw new Error("expected an in-progress learn stage");
    }

    expect(nextItem.currentIndex).toBe(1);
    expect(nextItem.completedItems).toEqual([
      {
        itemId: "apple",
        passedWithSupport: true,
        attemptCount: 2
      }
    ]);
  });
});
