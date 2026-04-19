import { describe, expect, it } from "vitest";
import {
  advanceBattleStageState,
  createBattleStageDefinition,
  createBattleStageState,
  getBattleStageSnapshot,
  judgeBattleStageInput
} from "@fne/runtime/battle-stage";
import { loadDemoRuntimeStage } from "@fne/runtime/demo-content";

describe("battle stage baseline", () => {
  it("builds four fixed learner lanes with stable receptors and keyboard mapping", () => {
    const battleStage = createBattleStageDefinition(loadDemoRuntimeStage());

    expect(battleStage.lanes).toHaveLength(4);
    expect(battleStage.lanes.map((lane) => lane.key)).toEqual([
      "ArrowLeft",
      "ArrowDown",
      "ArrowUp",
      "ArrowRight"
    ]);
    expect(battleStage.lanes.map((lane) => lane.direction)).toEqual([
      "left",
      "down",
      "up",
      "right"
    ]);
    expect(battleStage.lanes.map((lane) => lane.centerX)).toEqual(
      [...battleStage.lanes]
        .sort((leftLane, rightLane) => leftLane.centerX - rightLane.centerX)
        .map((lane) => lane.centerX)
    );
    expect(battleStage.cueArea.right).toBeLessThan(battleStage.playfield.left);

    for (const lane of battleStage.lanes) {
      expect(lane.receptorY).toBeGreaterThan(
        battleStage.playfield.top + battleStage.playfield.height / 2
      );
      expect(lane.width).toBeGreaterThanOrEqual(72);
    }
  });

  it("moves scheduled notes toward the receptors predictably over time", () => {
    const battleStage = createBattleStageDefinition(loadDemoRuntimeStage());
    const note = battleStage.notes[0];

    expect(note).toBeDefined();

    if (note === undefined) {
      throw new Error("expected the battle stage to schedule at least one note");
    }

    const earlySnapshot = getBattleStageSnapshot(battleStage, note.spawnTimeMs);
    const midSnapshot = getBattleStageSnapshot(
      battleStage,
      note.spawnTimeMs + note.travelDurationMs / 2
    );
    const hitSnapshot = getBattleStageSnapshot(battleStage, note.hitTimeMs);
    const earlyNote = earlySnapshot.notes.find((candidate) => candidate.id === note.id);
    const midNote = midSnapshot.notes.find((candidate) => candidate.id === note.id);
    const hitNote = hitSnapshot.notes.find((candidate) => candidate.id === note.id);

    expect(earlySnapshot.activeItemId).toBe(note.itemId);
    expect(hitSnapshot.activeItemId).toBe(note.itemId);
    expect(earlyNote?.isVisible).toBe(true);
    expect(midNote?.isVisible).toBe(true);
    expect(hitNote?.isVisible).toBe(true);
    expect(earlyNote?.y).toBeLessThan(midNote?.y ?? Number.POSITIVE_INFINITY);
    expect(midNote?.y).toBeLessThan(hitNote?.y ?? Number.POSITIVE_INFINITY);
    expect(hitNote?.y).toBeCloseTo(hitNote?.receptorY ?? -1, 1);
  });

  it("registers a hit when the matching lane key lands inside the timing window", () => {
    const battleStage = createBattleStageDefinition(loadDemoRuntimeStage());
    const note = battleStage.notes[0];

    expect(note).toBeDefined();

    if (note === undefined) {
      throw new Error("expected the battle stage to schedule at least one note");
    }

    const lane = battleStage.lanes[note.laneIndex];
    const initialState = createBattleStageState(battleStage);
    const judgedState = judgeBattleStageInput(
      initialState,
      note.hitTimeMs + 36,
      lane.key
    );

    expect(judgedState.noteStates[note.id]).toBe("hit");
    expect(judgedState.lastJudgment).toMatchObject({
      noteId: note.id,
      laneIndex: note.laneIndex,
      outcome: "hit",
      inputKey: lane.key,
      offsetMs: 36,
      consumedNote: true
    });

    const snapshotAfterHit = getBattleStageSnapshot(
      battleStage,
      note.hitTimeMs + 36,
      judgedState
    );
    const hitNote = snapshotAfterHit.notes.find((candidate) => candidate.id === note.id);

    expect(hitNote?.isVisible).toBe(false);
  });

  it("keeps failed inputs separate from the durable miss that closes the note window", () => {
    const battleStage = createBattleStageDefinition(loadDemoRuntimeStage());
    const note = battleStage.notes[0];

    expect(note).toBeDefined();

    if (note === undefined) {
      throw new Error("expected the battle stage to schedule at least one note");
    }

    const wrongLane = battleStage.lanes[(note.laneIndex + 1) % battleStage.lanes.length];
    const matchingLane = battleStage.lanes[note.laneIndex];
    const initialState = createBattleStageState(battleStage);
    const wrongLaneAttempt = judgeBattleStageInput(
      initialState,
      note.hitTimeMs,
      wrongLane.key
    );

    expect(wrongLaneAttempt.noteStates[note.id]).toBe("pending");
    expect(wrongLaneAttempt.lastJudgment).toMatchObject({
      noteId: note.id,
      laneIndex: note.laneIndex,
      inputKey: wrongLane.key,
      outcome: "wrong-lane",
      consumedNote: false
    });

    const tooEarlyAttempt = judgeBattleStageInput(
      wrongLaneAttempt,
      note.hitTimeMs - 220,
      matchingLane.key
    );

    expect(tooEarlyAttempt.noteStates[note.id]).toBe("pending");
    expect(tooEarlyAttempt.lastJudgment).toMatchObject({
      noteId: note.id,
      laneIndex: note.laneIndex,
      inputKey: matchingLane.key,
      outcome: "too-early",
      consumedNote: false
    });

    const settledState = advanceBattleStageState(tooEarlyAttempt, note.hitTimeMs + 181);

    expect(settledState.noteStates[note.id]).toBe("missed");
    expect(settledState.lastJudgment).toMatchObject({
      noteId: note.id,
      laneIndex: note.laneIndex,
      outcome: "missed-window",
      consumedNote: true
    });
  });

  it("resets note state when elapsed time skips across a full chart loop", () => {
    const battleStage = createBattleStageDefinition(loadDemoRuntimeStage());
    const note = battleStage.notes[0];

    expect(note).toBeDefined();

    if (note === undefined) {
      throw new Error("expected the battle stage to schedule at least one note");
    }

    const lane = battleStage.lanes[note.laneIndex];
    const initialState = createBattleStageState(battleStage);
    const hitState = judgeBattleStageInput(
      initialState,
      note.hitTimeMs + 36,
      lane.key
    );
    const loopedState = advanceBattleStageState(
      hitState,
      battleStage.totalDurationMs + note.hitTimeMs + 60
    );

    expect(loopedState.loopCount).toBe(1);
    expect(loopedState.noteStates[note.id]).toBe("pending");
    expect(loopedState.lastJudgment).toBeNull();
  });

  it("judges a late keypress against the missed note instead of the next pending note", () => {
    const battleStage = createBattleStageDefinition(loadDemoRuntimeStage());
    const firstNote = battleStage.notes[0];
    const nextNote = battleStage.notes[1];

    expect(firstNote).toBeDefined();
    expect(nextNote).toBeDefined();

    if (firstNote === undefined || nextNote === undefined) {
      throw new Error("expected the battle stage to schedule at least two notes");
    }

    const lane = battleStage.lanes[firstNote.laneIndex];
    const initialState = createBattleStageState(battleStage);
    const lateState = judgeBattleStageInput(
      initialState,
      firstNote.hitTimeMs + 181,
      lane.key
    );

    expect(lateState.noteStates[firstNote.id]).toBe("missed");
    expect(lateState.noteStates[nextNote.id]).toBe("pending");
    expect(lateState.lastJudgment).toMatchObject({
      noteId: firstNote.id,
      laneIndex: firstNote.laneIndex,
      inputKey: lane.key,
      outcome: "missed-window",
      consumedNote: true
    });
  });
});
