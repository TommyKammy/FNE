import type { VocabularyItem } from "@fne/shared";

export type RevealRoundPhase = "ready" | "awaiting-answer" | "success" | "failure";

export interface RevealRoundState {
  itemId: string;
  termLabel: string;
  meaningLabel: string;
  expectedKey: string;
  phase: RevealRoundPhase;
  audioCueRequestCount: number;
  feedbackTitle: string;
  feedbackBody: string;
  lastInput: string | null;
}

function normalizeKeyboardLetter(key: string): string | null {
  if (key.length !== 1) {
    return null;
  }

  const normalized = key.toLowerCase();

  return /^[a-z]$/.test(normalized) ? normalized : null;
}

function getExpectedKey(term: string): string {
  for (const character of term) {
    const normalizedCharacter = normalizeKeyboardLetter(character);

    if (normalizedCharacter !== null) {
      return normalizedCharacter;
    }
  }

  throw new Error(`Vocabulary item term "${term}" must contain at least one latin letter.`);
}

export function createRevealRoundState(item: VocabularyItem): RevealRoundState {
  const expectedKey = getExpectedKey(item.term);

  return {
    itemId: item.id,
    termLabel: item.term,
    meaningLabel: item.meaning,
    expectedKey,
    phase: "ready",
    audioCueRequestCount: 0,
    feedbackTitle: "Ready to listen?",
    feedbackBody: `Press Enter to hear the word, then type ${expectedKey.toUpperCase()}.`,
    lastInput: null
  };
}

export function startRevealRound(state: RevealRoundState): RevealRoundState {
  if (state.phase === "awaiting-answer") {
    return state;
  }

  return {
    ...state,
    phase: "awaiting-answer",
    audioCueRequestCount: state.audioCueRequestCount + 1,
    feedbackTitle: "Type the first letter",
    feedbackBody: `Listen for the word, then press ${state.expectedKey.toUpperCase()}.`,
    lastInput: null
  };
}

export function judgeRevealRoundInput(
  state: RevealRoundState,
  key: string
): RevealRoundState {
  if (state.phase !== "awaiting-answer") {
    return state;
  }

  const normalizedKey = normalizeKeyboardLetter(key);

  if (normalizedKey === null) {
    return state;
  }

  if (normalizedKey === state.expectedKey) {
    return {
      ...state,
      phase: "success",
      feedbackTitle: "Nice hit",
      feedbackBody: `${state.termLabel} starts with ${state.expectedKey.toUpperCase()}. Press Enter to replay.`,
      lastInput: normalizedKey
    };
  }

  return {
    ...state,
    phase: "failure",
    feedbackTitle: "Not yet",
    feedbackBody: `${state.termLabel} starts with ${state.expectedKey.toUpperCase()}, not ${normalizedKey.toUpperCase()}. Press Enter to replay.`,
    lastInput: normalizedKey
  };
}

export function restartRevealRound(state: RevealRoundState): RevealRoundState {
  return {
    ...state,
    phase: "ready",
    feedbackTitle: "Ready to listen?",
    feedbackBody: `Press Enter to hear the word, then type ${state.expectedKey.toUpperCase()}.`,
    lastInput: null
  };
}
