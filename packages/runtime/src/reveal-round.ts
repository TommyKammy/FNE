import type { VocabularyItem } from "@fne/shared";

export type RevealRoundPhase =
  | "idle"
  | "attention-cue"
  | "image-reveal"
  | "pronunciation-reveal"
  | "text-reveal"
  | "awaiting-input"
  | "retry-needed"
  | "passed";
export type RevealRoundJudgment = "success" | "retry-needed";

export interface RevealRoundState {
  itemId: string;
  termLabel: string;
  meaningLabel: string;
  expectedKey: string;
  phase: RevealRoundPhase;
  judgment: RevealRoundJudgment | null;
  attemptCount: number;
  passedWithSupport: boolean;
  audioCueRequestCount: number;
  feedbackTitle: string;
  feedbackBody: string;
  lastInput: string | null;
}

export interface RevealRoundContentError {
  kind: "content-error";
  itemId: string;
  message: string;
}

export type RevealRoundSetupResult =
  | {
      ok: true;
      state: RevealRoundState;
    }
  | {
      ok: false;
      error: RevealRoundContentError;
    };

function normalizeKeyboardLetter(key: string): string | null {
  if (key.length !== 1) {
    return null;
  }

  const normalized = key.toLowerCase();

  return /^[a-z]$/.test(normalized) ? normalized : null;
}

function getExpectedKey(term: string): string | null {
  for (const character of term) {
    const normalizedCharacter = normalizeKeyboardLetter(character);

    if (normalizedCharacter !== null) {
      return normalizedCharacter;
    }
  }

  return null;
}

export function createRevealRoundState(item: VocabularyItem): RevealRoundSetupResult {
  const expectedKey = getExpectedKey(item.term);

  if (expectedKey === null) {
    return {
      ok: false,
      error: {
        kind: "content-error",
        itemId: item.id,
        message: `Vocabulary item "${item.id}" cannot start the reveal round because term "${item.term}" does not contain a Latin letter for keyboard judgment.`
      }
    };
  }

  return {
    ok: true,
    state: {
      itemId: item.id,
      termLabel: item.term,
      meaningLabel: item.meaning,
      expectedKey,
      phase: "idle",
      judgment: null,
      attemptCount: 0,
      passedWithSupport: false,
      audioCueRequestCount: 0,
      feedbackTitle: "Ready to listen?",
      feedbackBody: "Press Enter to start the next Learn Mode reveal.",
      lastInput: null
    }
  };
}

export function beginRevealRound(state: RevealRoundState): RevealRoundState {
  if (state.phase !== "idle") {
    return state;
  }

  const nextAttemptCount = state.attemptCount + 1;
  const isSupportedRepeat = nextAttemptCount > 1;

  return {
    ...state,
    phase: "attention-cue",
    judgment: null,
    attemptCount: nextAttemptCount,
    passedWithSupport: false,
    feedbackTitle: "Get ready",
    feedbackBody: isSupportedRepeat
      ? "Try the same word again with the image and sound cue."
      : "A new word is about to begin.",
    lastInput: null
  };
}

export function advanceRevealRound(state: RevealRoundState): RevealRoundState {
  switch (state.phase) {
    case "attention-cue":
      return {
        ...state,
        phase: "image-reveal",
        feedbackTitle: "Look at the image",
        feedbackBody: "Use the picture as your first meaning cue.",
        lastInput: null
      };
    case "image-reveal":
      return {
        ...state,
        phase: "pronunciation-reveal",
        audioCueRequestCount: state.audioCueRequestCount + 1,
        feedbackTitle: "Listen to the word",
        feedbackBody:
          state.attemptCount > 1
            ? "Hear the pronunciation again, then get ready to answer."
            : "Hear the pronunciation before the word text appears.",
        lastInput: null
      };
    case "pronunciation-reveal":
      return {
        ...state,
        phase: "text-reveal",
        feedbackTitle: "Now read it",
        feedbackBody: `The word is ${state.termLabel}.`,
        lastInput: null
      };
    case "text-reveal":
      return {
        ...state,
        phase: "awaiting-input",
        feedbackTitle: "Your turn",
        feedbackBody: "Type the first letter of the word you just heard.",
        lastInput: null
      };
    default:
      return state;
  }
}

export function judgeRevealRoundInput(
  state: RevealRoundState,
  key: string
): RevealRoundState {
  if (state.phase !== "awaiting-input") {
    return state;
  }

  const normalizedKey = normalizeKeyboardLetter(key);

  if (normalizedKey === null) {
    return state;
  }

  if (normalizedKey === state.expectedKey) {
    return {
      ...state,
      phase: "passed",
      judgment: "success",
      passedWithSupport: state.attemptCount > 1,
      feedbackTitle: state.attemptCount > 1 ? "Nice recovery" : "Nice hit",
      feedbackBody:
        state.attemptCount > 1
          ? `${state.termLabel} starts with ${state.expectedKey.toUpperCase()}. You cleared it after a supported repeat. Press Enter to replay the demo item.`
          : `${state.termLabel} starts with ${state.expectedKey.toUpperCase()}. Press Enter to replay the demo item.`,
      lastInput: normalizedKey
    };
  }

  return {
    ...state,
    phase: "retry-needed",
    judgment: "retry-needed",
    feedbackTitle: "Try again",
    feedbackBody: `${state.termLabel} starts with ${state.expectedKey.toUpperCase()}, not ${normalizedKey.toUpperCase()}. Press Enter to try again with the guided reveal.`,
    lastInput: normalizedKey
  };
}

export function restartRevealRound(state: RevealRoundState): RevealRoundState {
  if (state.phase !== "retry-needed" && state.phase !== "passed") {
    return state;
  }

  return {
    ...state,
    phase: "idle",
    judgment: null,
    passedWithSupport: false,
    feedbackTitle: "Ready to listen?",
    feedbackBody: "Press Enter to start the next Learn Mode reveal.",
    lastInput: null
  };
}
