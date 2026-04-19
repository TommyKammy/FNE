import { SHELL_HEIGHT_PX, SHELL_WIDTH_PX } from "@fne/shared";
import type { RuntimeStage } from "./demo-content";

const BATTLE_LANE_KEYS = [
  "ArrowLeft",
  "ArrowDown",
  "ArrowUp",
  "ArrowRight"
] as const;
const BATTLE_LANE_DIRECTIONS = ["left", "down", "up", "right"] as const;
const CUE_AREA_WIDTH_PX = 252;
const HORIZONTAL_MARGIN_PX = 40;
const PLAYFIELD_GAP_PX = 36;
const PLAYFIELD_TOP_PX = 40;
const PLAYFIELD_HEIGHT_PX = SHELL_HEIGHT_PX - 80;
const LANE_GAP_PX = 16;
const RECEPTOR_OFFSET_PX = 74;
const NOTE_SPAWN_TOP_PX = PLAYFIELD_TOP_PX + 112;
const DEFAULT_BPM = 100;
const PREVIEW_RECOVERY_MS = 900;
const NOTE_TRAVEL_MS = 2200;
const HIT_WINDOW_MS = 180;
const HIT_FEEL_DURATION_MS = 120;
const COMBO_FEEL_DURATION_MS = 240;
const COMBO_MILESTONE_THRESHOLDS = [3, 5, 10] as const;
const FAIL_METER_MAX_VALUE = 100;
const FAIL_METER_DRAIN_PER_MISS = 25;
const FAIL_METER_RECOVERY_PER_HIT = 8;

export type BattleLaneDirection = (typeof BATTLE_LANE_DIRECTIONS)[number];

export interface BattleBounds {
  left: number;
  top: number;
  width: number;
  height: number;
  right: number;
  bottom: number;
}

export interface BattleLaneDefinition {
  index: number;
  key: (typeof BATTLE_LANE_KEYS)[number];
  direction: BattleLaneDirection;
  left: number;
  width: number;
  centerX: number;
  receptorY: number;
}

export interface BattlePhraseDefinition {
  itemId: string;
  term: string;
  meaning: string;
  pronunciation: string;
  imageSrc: string;
  audioSrc: string;
  previewStartTimeMs: number;
  previewEndTimeMs: number;
  phraseEndTimeMs: number;
}

export interface BattleNoteDefinition {
  id: string;
  itemId: string;
  laneIndex: number;
  spawnTimeMs: number;
  hitTimeMs: number;
  travelDurationMs: number;
}

export interface BattleStageDefinition {
  cueArea: BattleBounds;
  playfield: BattleBounds;
  lanes: BattleLaneDefinition[];
  phrases: BattlePhraseDefinition[];
  notes: BattleNoteDefinition[];
  totalDurationMs: number;
}

export interface BattleNoteSnapshot extends BattleNoteDefinition {
  direction: BattleLaneDirection;
  key: BattleLaneDefinition["key"];
  x: number;
  y: number;
  progress: number;
  receptorY: number;
  isVisible: boolean;
}

export interface BattleStageSnapshot {
  activeItemId: string | null;
  activeCue: BattleActiveCueSnapshot | null;
  notes: BattleNoteSnapshot[];
}

export type BattleCuePhase = "preview" | "phrase";

export interface BattleActiveCueSnapshot {
  itemId: string;
  term: string;
  meaning: string;
  pronunciation: string;
  imageSrc: string;
  audioSrc: string;
  phase: BattleCuePhase;
  previewEndsAtMs: number;
  phraseEndsAtMs: number;
}

export type BattleNoteState = "pending" | "hit" | "missed";
export type BattleJudgmentOutcome = "hit" | "wrong-lane" | "too-early" | "missed-window";

export interface BattleJudgmentEvent {
  noteId: string;
  itemId: string;
  laneIndex: number;
  inputKey: string | null;
  inputLaneIndex: number | null;
  judgedAtMs: number;
  offsetMs: number;
  outcome: BattleJudgmentOutcome;
  consumedNote: boolean;
}

export interface BattleHitFeedback {
  laneIndex: number;
  startedAtMs: number;
  endsAtMs: number;
  judgmentOutcome: "hit";
  confirmationLabel: string;
}

export interface BattleComboFeedback {
  comboCount: number;
  milestoneThreshold: (typeof COMBO_MILESTONE_THRESHOLDS)[number] | null;
  startedAtMs: number;
  endsAtMs: number;
  label: string;
}

export interface BattleFailMeter {
  value: number;
  maxValue: number;
}

export type BattleStageStatus = "playing" | "failed";

export interface BattleStageState {
  battleStage: BattleStageDefinition;
  noteStates: Record<string, BattleNoteState>;
  lastJudgment: BattleJudgmentEvent | null;
  hitFeedback: BattleHitFeedback | null;
  comboCount: number;
  bestComboCount: number;
  comboFeedback: BattleComboFeedback | null;
  failMeter: BattleFailMeter;
  stageStatus: BattleStageStatus;
  failedAtMs: number | null;
  timelineTimeMs: number;
  loopCount: number;
}

function createBounds(left: number, top: number, width: number, height: number): BattleBounds {
  return {
    left,
    top,
    width,
    height,
    right: left + width,
    bottom: top + height
  };
}

function countPronunciationBeats(pronunciation: string): number {
  const segments = pronunciation
    .split("-")
    .map((segment) => segment.trim())
    .filter((segment) => segment.length > 0);

  return Math.min(Math.max(segments.length, 1), 4);
}

function createLanePattern(noteCount: number, anchorLaneIndex: number): number[] {
  const stablePatterns = [
    [anchorLaneIndex],
    [anchorLaneIndex, (anchorLaneIndex + 1) % 4],
    [anchorLaneIndex, (anchorLaneIndex + 1) % 4, anchorLaneIndex],
    [
      anchorLaneIndex,
      (anchorLaneIndex + 1) % 4,
      (anchorLaneIndex + 2) % 4,
      (anchorLaneIndex + 1) % 4
    ]
  ] as const;

  return [...stablePatterns[noteCount - 1]];
}

function getTimelineTimeMs(battleStage: BattleStageDefinition, elapsedTimeMs: number): number {
  return battleStage.totalDurationMs > 0
    ? ((elapsedTimeMs % battleStage.totalDurationMs) + battleStage.totalDurationMs) %
        battleStage.totalDurationMs
    : 0;
}

function createInitialNoteStates(battleStage: BattleStageDefinition): Record<string, BattleNoteState> {
  return Object.fromEntries(
    battleStage.notes.map((note) => [note.id, "pending"] satisfies [string, BattleNoteState])
  );
}

function createInitialFailMeter(): BattleFailMeter {
  return {
    value: FAIL_METER_MAX_VALUE,
    maxValue: FAIL_METER_MAX_VALUE
  };
}

function getNextLoopCount(battleStage: BattleStageDefinition, elapsedTimeMs: number): number {
  return battleStage.totalDurationMs > 0
    ? Math.max(0, Math.floor(elapsedTimeMs / battleStage.totalDurationMs))
    : 0;
}

function getFirstPendingNote(
  battleStage: BattleStageDefinition,
  noteStates: Record<string, BattleNoteState>
): BattleNoteDefinition | undefined {
  return battleStage.notes.find((note) => noteStates[note.id] === "pending");
}

function syncBattleLoop(
  state: BattleStageState,
  battleStage: BattleStageDefinition,
  elapsedTimeMs: number
): BattleStageState {
  if (state.stageStatus === "failed") {
    return state;
  }

  const timelineTimeMs = getTimelineTimeMs(battleStage, elapsedTimeMs);
  const nextLoopCount = getNextLoopCount(battleStage, elapsedTimeMs);

  if (nextLoopCount !== state.loopCount) {
    return {
      battleStage,
      noteStates: createInitialNoteStates(battleStage),
      lastJudgment: null,
      hitFeedback: null,
      comboCount: 0,
      bestComboCount: state.bestComboCount,
      comboFeedback: null,
      failMeter: createInitialFailMeter(),
      stageStatus: "playing",
      failedAtMs: null,
      timelineTimeMs,
      loopCount: nextLoopCount
    };
  }

  if (timelineTimeMs === state.timelineTimeMs) {
    return state;
  }

  return {
    ...state,
    timelineTimeMs,
    hitFeedback:
      state.hitFeedback !== null && timelineTimeMs > state.hitFeedback.endsAtMs
        ? null
        : state.hitFeedback,
    comboFeedback:
      state.comboFeedback !== null && timelineTimeMs > state.comboFeedback.endsAtMs
        ? null
        : state.comboFeedback
  };
}

export function createBattleStageState(battleStage: BattleStageDefinition): BattleStageState {
  return {
    battleStage,
    noteStates: createInitialNoteStates(battleStage),
    lastJudgment: null,
    hitFeedback: null,
    comboCount: 0,
    bestComboCount: 0,
    comboFeedback: null,
    failMeter: createInitialFailMeter(),
    stageStatus: "playing",
    failedAtMs: null,
    timelineTimeMs: 0,
    loopCount: 0
  };
}

function formatHitConfirmationLabel(offsetMs: number): string {
  return `Hit (${offsetMs >= 0 ? "+" : ""}${offsetMs}ms)`;
}

function getComboMilestoneThreshold(comboCount: number) {
  return COMBO_MILESTONE_THRESHOLDS.find((threshold) => threshold === comboCount) ?? null;
}

function formatComboLabel(comboCount: number, milestoneThreshold: number | null) {
  return milestoneThreshold === null ? `${comboCount} combo` : `${comboCount} combo!`;
}

function breakCombo(
  state: BattleStageState,
  lastJudgment: BattleJudgmentEvent
): BattleStageState {
  return {
    ...state,
    lastJudgment,
    hitFeedback: null,
    comboCount: 0,
    comboFeedback: null
  };
}

function applyMissPenalty(
  state: BattleStageState,
  lastJudgment: BattleJudgmentEvent
): BattleStageState {
  const nextFailMeterValue = Math.max(0, state.failMeter.value - FAIL_METER_DRAIN_PER_MISS);
  const stageStatus = nextFailMeterValue === 0 ? "failed" : state.stageStatus;

  return {
    ...breakCombo(state, lastJudgment),
    failMeter: {
      ...state.failMeter,
      value: nextFailMeterValue
    },
    stageStatus,
    failedAtMs: stageStatus === "failed" ? lastJudgment.judgedAtMs : state.failedAtMs
  };
}

export function advanceBattleStageState(state: BattleStageState, elapsedTimeMs: number): BattleStageState {
  const { battleStage } = state;
  const loopSyncedState = syncBattleLoop(state, battleStage, elapsedTimeMs);
  let nextState = loopSyncedState;

  for (const note of battleStage.notes) {
    if (nextState.noteStates[note.id] !== "pending") {
      continue;
    }

    const missDeadlineMs = note.hitTimeMs + HIT_WINDOW_MS;

    if (nextState.timelineTimeMs <= missDeadlineMs) {
      break;
    }

    nextState = applyMissPenalty(
      {
        ...nextState,
        noteStates: {
          ...nextState.noteStates,
          [note.id]: "missed"
        }
      },
      {
        noteId: note.id,
        itemId: note.itemId,
        laneIndex: note.laneIndex,
        inputKey: null,
        inputLaneIndex: null,
        judgedAtMs: nextState.timelineTimeMs,
        offsetMs: nextState.timelineTimeMs - note.hitTimeMs,
        outcome: "missed-window",
        consumedNote: true
      }
    );

    if (nextState.stageStatus === "failed") {
      break;
    }
  }

  return nextState;
}

export function judgeBattleStageInput(
  state: BattleStageState,
  elapsedTimeMs: number,
  key: string
): BattleStageState {
  if (state.stageStatus === "failed") {
    return state;
  }

  const { battleStage } = state;
  const loopSyncedState = syncBattleLoop(state, battleStage, elapsedTimeMs);
  const targetNote = getFirstPendingNote(battleStage, loopSyncedState.noteStates);
  const advancedState = advanceBattleStageState(loopSyncedState, elapsedTimeMs);

  if (targetNote === undefined) {
    return advancedState;
  }

  const inputLaneIndex = battleStage.lanes.findIndex((lane) => lane.key === key);

  if (inputLaneIndex === -1) {
    return advancedState;
  }

  const offsetMs = loopSyncedState.timelineTimeMs - targetNote.hitTimeMs;

  if (offsetMs > HIT_WINDOW_MS) {
    return applyMissPenalty(
      {
        ...advancedState,
        noteStates: {
          ...advancedState.noteStates,
          [targetNote.id]: "missed"
        }
      },
      {
        noteId: targetNote.id,
        itemId: targetNote.itemId,
        laneIndex: targetNote.laneIndex,
        inputKey: key,
        inputLaneIndex,
        judgedAtMs: loopSyncedState.timelineTimeMs,
        offsetMs,
        outcome: "missed-window",
        consumedNote: true
      }
    );
  }

  if (offsetMs < -HIT_WINDOW_MS) {
    return breakCombo(advancedState, {
        noteId: targetNote.id,
        itemId: targetNote.itemId,
        laneIndex: targetNote.laneIndex,
        inputKey: key,
        inputLaneIndex,
        judgedAtMs: loopSyncedState.timelineTimeMs,
        offsetMs,
        outcome: "too-early",
        consumedNote: false
      });
  }

  if (inputLaneIndex !== targetNote.laneIndex) {
    return breakCombo(advancedState, {
        noteId: targetNote.id,
        itemId: targetNote.itemId,
        laneIndex: targetNote.laneIndex,
        inputKey: key,
        inputLaneIndex,
        judgedAtMs: loopSyncedState.timelineTimeMs,
        offsetMs,
        outcome: "wrong-lane",
        consumedNote: false
      });
  }

  const comboCount = advancedState.comboCount + 1;
  const milestoneThreshold = getComboMilestoneThreshold(comboCount);

  return {
    ...advancedState,
    noteStates: {
      ...advancedState.noteStates,
      [targetNote.id]: "hit"
    },
    lastJudgment: {
      noteId: targetNote.id,
      itemId: targetNote.itemId,
      laneIndex: targetNote.laneIndex,
      inputKey: key,
      inputLaneIndex,
      judgedAtMs: loopSyncedState.timelineTimeMs,
      offsetMs,
      outcome: "hit",
      consumedNote: true
    },
    hitFeedback: {
      laneIndex: targetNote.laneIndex,
      startedAtMs: loopSyncedState.timelineTimeMs,
      endsAtMs: loopSyncedState.timelineTimeMs + HIT_FEEL_DURATION_MS,
      judgmentOutcome: "hit",
      confirmationLabel: formatHitConfirmationLabel(offsetMs)
    },
    comboCount,
    bestComboCount: Math.max(advancedState.bestComboCount, comboCount),
    failMeter: {
      ...advancedState.failMeter,
      value: Math.min(
        advancedState.failMeter.maxValue,
        advancedState.failMeter.value + FAIL_METER_RECOVERY_PER_HIT
      )
    },
    comboFeedback: {
      comboCount,
      milestoneThreshold,
      startedAtMs: loopSyncedState.timelineTimeMs,
      endsAtMs: loopSyncedState.timelineTimeMs + COMBO_FEEL_DURATION_MS,
      label: formatComboLabel(comboCount, milestoneThreshold)
    }
  };
}

export function restartBattleStage(state: BattleStageState): BattleStageState {
  return {
    ...createBattleStageState(state.battleStage),
    bestComboCount: state.bestComboCount
  };
}

export function createBattleStageDefinition(stage: RuntimeStage): BattleStageDefinition {
  const cueArea = createBounds(
    HORIZONTAL_MARGIN_PX,
    PLAYFIELD_TOP_PX,
    CUE_AREA_WIDTH_PX,
    PLAYFIELD_HEIGHT_PX
  );
  const playfieldLeft = cueArea.right + PLAYFIELD_GAP_PX;
  const playfield = createBounds(
    playfieldLeft,
    PLAYFIELD_TOP_PX,
    SHELL_WIDTH_PX - playfieldLeft - HORIZONTAL_MARGIN_PX,
    PLAYFIELD_HEIGHT_PX
  );
  const laneWidth = (playfield.width - LANE_GAP_PX * (BATTLE_LANE_KEYS.length - 1)) / 4;
  const receptorY = playfield.bottom - RECEPTOR_OFFSET_PX;
  const beatDurationMs = 60_000 / DEFAULT_BPM;
  const lanes = BATTLE_LANE_KEYS.map((key, index) => {
    const left = playfield.left + index * (laneWidth + LANE_GAP_PX);

    return {
      index,
      key,
      direction: BATTLE_LANE_DIRECTIONS[index],
      left,
      width: laneWidth,
      centerX: left + laneWidth / 2,
      receptorY
    };
  });

  let cursorMs = 0;
  const phrases: BattlePhraseDefinition[] = [];
  const notes: BattleNoteDefinition[] = [];

  stage.items.forEach((runtimeItem, itemIndex) => {
    const noteCount = countPronunciationBeats(runtimeItem.item.pronunciation);
    const anchorLaneIndex = itemIndex % lanes.length;
    const lanePattern = createLanePattern(noteCount, anchorLaneIndex);
    const previewStartTimeMs = cursorMs;
    const phraseStartTimeMs = previewStartTimeMs + NOTE_TRAVEL_MS;

    lanePattern.forEach((laneIndex, noteIndex) => {
      const hitTimeMs = phraseStartTimeMs + noteIndex * beatDurationMs;

      notes.push({
        id: `${runtimeItem.item.id}-note-${noteIndex + 1}`,
        itemId: runtimeItem.item.id,
        laneIndex,
        spawnTimeMs: hitTimeMs - NOTE_TRAVEL_MS,
        hitTimeMs,
        travelDurationMs: NOTE_TRAVEL_MS
      });
    });

    const lastHitTimeMs =
      phraseStartTimeMs + Math.max(lanePattern.length - 1, 0) * beatDurationMs;
    const phraseEndTimeMs = lastHitTimeMs + beatDurationMs;

    phrases.push({
      itemId: runtimeItem.item.id,
      term: runtimeItem.item.term,
      meaning: runtimeItem.item.meaning,
      pronunciation: runtimeItem.item.pronunciation,
      imageSrc: runtimeItem.imageSrc,
      audioSrc: runtimeItem.audioSrc,
      previewStartTimeMs,
      previewEndTimeMs: phraseStartTimeMs,
      phraseEndTimeMs
    });

    cursorMs = phraseEndTimeMs + PREVIEW_RECOVERY_MS;
  });

  return {
    cueArea,
    playfield,
    lanes,
    phrases,
    notes,
    totalDurationMs: cursorMs
  };
}

export function getBattleStageSnapshot(
  battleStage: BattleStageDefinition,
  elapsedTimeMs: number,
  state?: BattleStageState
): BattleStageSnapshot {
  const timelineTimeMs =
    state?.stageStatus === "failed"
      ? state.timelineTimeMs
      : getTimelineTimeMs(battleStage, elapsedTimeMs);
  const activePhrase =
    battleStage.phrases.find(
      (phrase) =>
        timelineTimeMs >= phrase.previewStartTimeMs &&
        timelineTimeMs < phrase.phraseEndTimeMs + PREVIEW_RECOVERY_MS
    ) ?? null;
  const activeCue =
    activePhrase === null
      ? null
      : {
          itemId: activePhrase.itemId,
          term: activePhrase.term,
          meaning: activePhrase.meaning,
          pronunciation: activePhrase.pronunciation,
          imageSrc: activePhrase.imageSrc,
          audioSrc: activePhrase.audioSrc,
          phase: timelineTimeMs < activePhrase.previewEndTimeMs ? "preview" : "phrase",
          previewEndsAtMs: activePhrase.previewEndTimeMs,
          phraseEndsAtMs: activePhrase.phraseEndTimeMs
        } satisfies BattleActiveCueSnapshot;
  const notes = battleStage.notes.map((note) => {
    const lane = battleStage.lanes[note.laneIndex];
    const rawProgress = (timelineTimeMs - note.spawnTimeMs) / note.travelDurationMs;
    const progress = Math.min(Math.max(rawProgress, 0), 1);
    const y = NOTE_SPAWN_TOP_PX + (lane.receptorY - NOTE_SPAWN_TOP_PX) * progress;
    const lingerMs = 180;
    const isResolved = state !== undefined && state.noteStates[note.id] !== "pending";
    const isVisible =
      !isResolved && timelineTimeMs >= note.spawnTimeMs && timelineTimeMs <= note.hitTimeMs + lingerMs;

    return {
      ...note,
      direction: lane.direction,
      key: lane.key,
      x: lane.centerX,
      y,
      progress,
      receptorY: lane.receptorY,
      isVisible
    };
  });

  return {
    activeItemId: activeCue?.itemId ?? null,
    activeCue,
    notes
  };
}
