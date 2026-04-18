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
  it("follows the Learn Mode cue order and records whether the item needed support", () => {
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
    expect(state.attemptCount).toBe(0);
    expect(state.passedWithSupport).toBe(false);
    expect(state.expectedKey).toBe("a");
    expect(state.audioCueRequestCount).toBe(0);

    const attentionCue = beginRevealRound(state);

    expect(attentionCue.phase).toBe("attention-cue");
    expect(attentionCue.judgment).toBeNull();
    expect(attentionCue.attemptCount).toBe(1);
    expect(attentionCue.audioCueRequestCount).toBe(0);
    expect(attentionCue.feedbackTitle).toBe("Get ready");

    const imageReveal = advanceRevealRound(attentionCue);
    const pronunciationReveal = advanceRevealRound(imageReveal);
    const textReveal = advanceRevealRound(pronunciationReveal);
    const awaitingInput = advanceRevealRound(textReveal);

    expect(imageReveal.phase).toBe("image-reveal");
    expect(pronunciationReveal.phase).toBe("pronunciation-reveal");
    expect(pronunciationReveal.audioCueRequestCount).toBe(1);
    expect(textReveal.phase).toBe("text-reveal");
    expect(awaitingInput.phase).toBe("awaiting-input");
    expect(awaitingInput.feedbackTitle).toBe("Your turn");
    expect(awaitingInput.feedbackBody).toContain("first letter");

    const failed = judgeRevealRoundInput(awaitingInput, "x");

    expect(failed.phase).toBe("retry-needed");
    expect(failed.judgment).toBe("retry-needed");
    expect(failed.lastInput).toBe("x");
    expect(failed.passedWithSupport).toBe(false);
    expect(failed.feedbackBody).toContain("A");
    expect(failed.feedbackBody).toContain("X");
    expect(failed.feedbackBody).toContain("try again");

    const restarted = restartRevealRound(failed);

    expect(restarted.phase).toBe("idle");
    expect(restarted.judgment).toBeNull();
    expect(restarted.audioCueRequestCount).toBe(1);
    expect(restarted.attemptCount).toBe(1);
    expect(restarted.passedWithSupport).toBe(false);

    const replayAttentionCue = beginRevealRound(restarted);
    const replayImageReveal = advanceRevealRound(replayAttentionCue);
    const replayPronunciationReveal = advanceRevealRound(replayImageReveal);
    const replayTextReveal = advanceRevealRound(replayPronunciationReveal);
    const replayAwaitingInput = advanceRevealRound(replayTextReveal);
    const succeeded = judgeRevealRoundInput(replayAwaitingInput, "A");

    expect(replayPronunciationReveal.audioCueRequestCount).toBe(2);
    expect(succeeded.phase).toBe("passed");
    expect(succeeded.judgment).toBe("success");
    expect(succeeded.attemptCount).toBe(2);
    expect(succeeded.passedWithSupport).toBe(true);
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

    const attentionCue = beginRevealRound(idleState);

    expect(beginRevealRound(attentionCue)).toBe(attentionCue);
    expect(judgeRevealRoundInput(attentionCue, "a")).toBe(attentionCue);
    expect(restartRevealRound(attentionCue)).toBe(attentionCue);

    const imageReveal = advanceRevealRound(attentionCue);
    const pronunciationReveal = advanceRevealRound(imageReveal);
    const textReveal = advanceRevealRound(pronunciationReveal);
    const awaitingInput = advanceRevealRound(textReveal);
    const passed = judgeRevealRoundInput(awaitingInput, "a");

    expect(advanceRevealRound(awaitingInput)).toBe(awaitingInput);
    expect(beginRevealRound(awaitingInput)).toBe(awaitingInput);
    expect(advanceRevealRound(passed)).toBe(passed);
    expect(judgeRevealRoundInput(passed, "a")).toBe(passed);
    expect(beginRevealRound(passed)).toBe(passed);
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
