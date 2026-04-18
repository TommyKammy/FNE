import type { VocabularyItem } from "@fne/shared";

export type RevealRoundPhase = "idle" | "revealing" | "awaiting-input" | "judged";
export type RevealRoundJudgment = "success" | "failure";

export interface RevealRoundState {
  itemId: string;
  termLabel: string;
  meaningLabel: string;
  expectedKey: string;
  phase: RevealRoundPhase;
  judgment: RevealRoundJudgment | null;
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
      audioCueRequestCount: 0,
      feedbackTitle: "Ready to listen?",
      feedbackBody: "Press Enter to hear the word, then type its first letter.",
      lastInput: null
    }
  };
}

export function beginRevealRound(state: RevealRoundState): RevealRoundState {
  if (state.phase !== "idle") {
    return state;
  }

  return {
    ...state,
    phase: "revealing",
    judgment: null,
    audioCueRequestCount: state.audioCueRequestCount + 1,
    feedbackTitle: "Listen to the word",
    feedbackBody: "The pronunciation cue is playing now.",
    lastInput: null
  };
}

export function advanceRevealRound(state: RevealRoundState): RevealRoundState {
  if (state.phase !== "revealing") {
    return state;
  }

  return {
    ...state,
    phase: "awaiting-input",
    feedbackTitle: "Type the first letter",
    feedbackBody: "Type the first letter of the word you just heard.",
    lastInput: null
  };
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
      phase: "judged",
      judgment: "success",
      feedbackTitle: "Nice hit",
      feedbackBody: `${state.termLabel} starts with ${state.expectedKey.toUpperCase()}. Press Enter to replay.`,
      lastInput: normalizedKey
    };
  }

  return {
    ...state,
    phase: "judged",
    judgment: "failure",
    feedbackTitle: "Not yet",
    feedbackBody: `${state.termLabel} starts with ${state.expectedKey.toUpperCase()}, not ${normalizedKey.toUpperCase()}. Press Enter to replay.`,
    lastInput: normalizedKey
  };
}

export function restartRevealRound(state: RevealRoundState): RevealRoundState {
  if (state.phase !== "judged") {
    return state;
  }

  return {
    ...state,
    phase: "idle",
    judgment: null,
    feedbackTitle: "Ready to listen?",
    feedbackBody: "Press Enter to hear the word, then type its first letter.",
    lastInput: null
  };
}
