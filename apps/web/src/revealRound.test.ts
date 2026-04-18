import {
  createRevealRoundState,
  judgeRevealRoundInput,
  restartRevealRound,
  startRevealRound
} from "@fne/runtime/reveal-round";
import { describe, expect, it } from "vitest";

describe("reveal round state", () => {
  it("gates audio start, judges the typed first letter, and resets for replay", () => {
    const state = createRevealRoundState({
      id: "apple",
      term: "apple",
      meaning: "りんご",
      pronunciation: "AP-uhl",
      imageAssetId: "img-apple",
      audioAssetId: "aud-apple"
    });

    expect(state.phase).toBe("ready");
    expect(state.expectedKey).toBe("a");
    expect(state.audioCueRequestCount).toBe(0);

    const started = startRevealRound(state);

    expect(started.phase).toBe("awaiting-answer");
    expect(started.audioCueRequestCount).toBe(1);
    expect(started.feedbackTitle).toBe("Type the first letter");

    const failed = judgeRevealRoundInput(started, "x");

    expect(failed.phase).toBe("failure");
    expect(failed.lastInput).toBe("x");
    expect(failed.feedbackBody).toContain("A");
    expect(failed.feedbackBody).toContain("X");

    const replayReady = restartRevealRound(failed);
    const replayStarted = startRevealRound(replayReady);
    const succeeded = judgeRevealRoundInput(replayStarted, "A");

    expect(replayReady.phase).toBe("ready");
    expect(replayStarted.audioCueRequestCount).toBe(2);
    expect(succeeded.phase).toBe("success");
    expect(succeeded.feedbackBody).toContain("apple");
    expect(succeeded.feedbackBody).toContain("A");
  });
});
