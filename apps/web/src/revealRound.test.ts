import {
  createRevealRoundState,
  judgeRevealRoundInput,
  restartRevealRound,
  startRevealRound
} from "@fne/runtime/reveal-round";
import { describe, expect, it } from "vitest";

describe("reveal round state", () => {
  it("gates audio start, judges the typed first letter, and resets for replay", () => {
    const setup = createRevealRoundState({
      id: "apple",
      term: "apple",
      meaning: "りんご",
      pronunciation: "AP-uhl",
      imageAssetId: "img-apple",
      audioAssetId: "aud-apple"
    });

    expect(setup.ok).toBe(true);

    if (!setup.ok) {
      throw new Error("expected a playable reveal round");
    }

    const state = setup.state;

    expect(state.phase).toBe("ready");
    expect(state.expectedKey).toBe("a");
    expect(state.audioCueRequestCount).toBe(0);
    expect(state.feedbackBody).toBe("Press Enter to hear the word, then type its first letter.");

    const started = startRevealRound(state);

    expect(started.phase).toBe("awaiting-answer");
    expect(started.audioCueRequestCount).toBe(1);
    expect(started.feedbackTitle).toBe("Type the first letter");
    expect(started.feedbackBody).toBe("Listen for the word, then type its first letter.");

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

  it("returns a recoverable content error when the term has no Latin letter", () => {
    const setup = createRevealRoundState({
      id: "ringo",
      term: "りんご",
      meaning: "apple",
      pronunciation: "ringo",
      imageAssetId: "img-ringo",
      audioAssetId: "aud-ringo"
    });

    expect(setup.ok).toBe(false);

    if (setup.ok) {
      throw new Error("expected a content error");
    }

    expect(setup.error.kind).toBe("content-error");
    expect(setup.error.itemId).toBe("ringo");
    expect(setup.error.message).toContain('does not contain a Latin letter');
  });
});
