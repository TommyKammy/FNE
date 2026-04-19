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
  notes: BattleNoteSnapshot[];
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
  elapsedTimeMs: number
): BattleStageSnapshot {
  const timelineTimeMs =
    battleStage.totalDurationMs > 0
      ? ((elapsedTimeMs % battleStage.totalDurationMs) + battleStage.totalDurationMs) %
        battleStage.totalDurationMs
      : 0;
  const activePhrase =
    battleStage.phrases.find(
      (phrase) =>
        timelineTimeMs >= phrase.previewStartTimeMs &&
        timelineTimeMs < phrase.phraseEndTimeMs + PREVIEW_RECOVERY_MS
    ) ?? null;
  const notes = battleStage.notes.map((note) => {
    const lane = battleStage.lanes[note.laneIndex];
    const rawProgress = (timelineTimeMs - note.spawnTimeMs) / note.travelDurationMs;
    const progress = Math.min(Math.max(rawProgress, 0), 1);
    const y = NOTE_SPAWN_TOP_PX + (lane.receptorY - NOTE_SPAWN_TOP_PX) * progress;
    const lingerMs = 180;
    const isVisible =
      timelineTimeMs >= note.spawnTimeMs && timelineTimeMs <= note.hitTimeMs + lingerMs;

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
    activeItemId: activePhrase?.itemId ?? null,
    notes
  };
}
