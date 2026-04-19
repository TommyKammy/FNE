import { describe, expect, it } from "vitest";
import {
  createBattleStageDefinition,
  getBattleStageSnapshot
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
      expect.arrayContaining(
        [...battleStage.lanes]
          .sort((leftLane, rightLane) => leftLane.centerX - rightLane.centerX)
          .map((lane) => lane.centerX)
      )
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

    expect(earlySnapshot.activeItemId).toBe("apple");
    expect(hitSnapshot.activeItemId).toBe("apple");
    expect(earlyNote?.isVisible).toBe(true);
    expect(midNote?.isVisible).toBe(true);
    expect(hitNote?.isVisible).toBe(true);
    expect(earlyNote?.y).toBeLessThan(midNote?.y ?? Number.POSITIVE_INFINITY);
    expect(midNote?.y).toBeLessThan(hitNote?.y ?? Number.POSITIVE_INFINITY);
    expect(hitNote?.y).toBeCloseTo(hitNote?.receptorY ?? -1, 1);
  });
});
