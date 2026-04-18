import {
  advanceRevealRound,
  beginRevealRound,
  createRevealRoundState,
  judgeRevealRoundInput,
  restartRevealRound,
  type RevealRoundState
} from "@fne/runtime/reveal-round";
import { describe, expect, it } from "vitest";

function expectPlayableState(
  setup: ReturnType<typeof createRevealRoundState>
): RevealRoundState {
  expect(setup.ok).toBe(true);

  if (!setup.ok) {
    throw new Error("expected a playable reveal round");
  }

  return setup.state;
}

describe("reveal round state", () => {
  it("uses explicit idle, reveal, input, and judged states for the restartable loop", () => {
    const state = expectPlayableState(
      createRevealRoundState({
        id: "apple",
        term: "apple",
        meaning: "りんご",
        pronunciation: "AP-uhl",
        imageAssetId: "img-apple",
        audioAssetId: "aud-apple"
      })
    );

    expect(state.phase).toBe("idle");
    expect(state.judgment).toBeNull();
    expect(state.expectedKey).toBe("a");
    expect(state.audioCueRequestCount).toBe(0);

    const revealing = beginRevealRound(state);

    expect(revealing.phase).toBe("revealing");
    expect(revealing.judgment).toBeNull();
    expect(revealing.audioCueRequestCount).toBe(1);
    expect(revealing.feedbackTitle).toBe("Listen to the word");

    const awaitingInput = advanceRevealRound(revealing);

    expect(awaitingInput.phase).toBe("awaiting-input");
    expect(awaitingInput.feedbackTitle).toBe("Type the first letter");
    expect(awaitingInput.feedbackBody).toBe("Type the first letter of the word you just heard.");

    const failed = judgeRevealRoundInput(awaitingInput, "x");

    expect(failed.phase).toBe("judged");
    expect(failed.judgment).toBe("failure");
    expect(failed.lastInput).toBe("x");
    expect(failed.feedbackBody).toContain("A");
    expect(failed.feedbackBody).toContain("X");

    const restarted = restartRevealRound(failed);

    expect(restarted.phase).toBe("idle");
    expect(restarted.judgment).toBeNull();
    expect(restarted.audioCueRequestCount).toBe(1);

    const replayRevealing = beginRevealRound(restarted);
    const replayAwaitingInput = advanceRevealRound(replayRevealing);
    const succeeded = judgeRevealRoundInput(replayAwaitingInput, "A");

    expect(replayRevealing.audioCueRequestCount).toBe(2);
    expect(succeeded.phase).toBe("judged");
    expect(succeeded.judgment).toBe("success");
    expect(succeeded.feedbackBody).toContain("apple");
    expect(succeeded.feedbackBody).toContain("A");
  });

  it("fails closed on invalid transitions and keeps the current state unchanged", () => {
    const idleState = expectPlayableState(
      createRevealRoundState({
        id: "apple",
        term: "apple",
        meaning: "りんご",
        pronunciation: "AP-uhl",
        imageAssetId: "img-apple",
        audioAssetId: "aud-apple"
      })
    );

    expect(advanceRevealRound(idleState)).toBe(idleState);
    expect(judgeRevealRoundInput(idleState, "a")).toBe(idleState);
    expect(restartRevealRound(idleState)).toBe(idleState);

    const revealing = beginRevealRound(idleState);

    expect(beginRevealRound(revealing)).toBe(revealing);
    expect(judgeRevealRoundInput(revealing, "a")).toBe(revealing);
    expect(restartRevealRound(revealing)).toBe(revealing);

    const awaitingInput = advanceRevealRound(revealing);
    const judged = judgeRevealRoundInput(awaitingInput, "a");

    expect(advanceRevealRound(awaitingInput)).toBe(awaitingInput);
    expect(beginRevealRound(awaitingInput)).toBe(awaitingInput);
    expect(advanceRevealRound(judged)).toBe(judged);
    expect(judgeRevealRoundInput(judged, "a")).toBe(judged);
    expect(beginRevealRound(judged)).toBe(judged);
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
