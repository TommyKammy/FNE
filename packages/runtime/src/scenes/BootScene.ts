import Phaser from "phaser";
import {
  advanceBattleStageState,
  createBattleStageDefinition,
  createBattleStageState,
  getBattleStageSnapshot,
  judgeBattleStageInput,
  type BattleStageDefinition,
  type BattleStageState
} from "../battle-stage";
import { loadDemoRuntimeStage, type RuntimeDemoItem, type RuntimeStage } from "../demo-content";

const PANEL_FILL = 0x172132;
const CARD_FILL = 0x22314a;
const LANE_FILLS = [0x233354, 0x26415d, 0x274766, 0x2c3c59];
const NOTE_FILLS = [0xff8b7c, 0xffcf88, 0x7ef0ad, 0x83d7ff];
const RECEPTOR_IDLE_FILL = 0xe6edf5;
const RECEPTOR_ACTIVE_FILL = 0xffcf88;
const COMBO_IDLE_COLOR = "#d6dee8";
const COMBO_HIT_COLOR = "#f6efe5";
const COMBO_MILESTONE_COLOR = "#ffcf88";
const JUDGMENT_COLORS = {
  hit: "#7ef0ad",
  "wrong-lane": "#ff8b7c",
  "too-early": "#83d7ff",
  "missed-window": "#ff8b7c"
} as const;

export class BootScene extends Phaser.Scene {
  private runtimeStage!: RuntimeStage;
  private battleStage!: BattleStageDefinition;
  private battleState!: BattleStageState;
  private sceneStartTimeMs = 0;
  private cueImageFrame!: Phaser.GameObjects.Image;
  private cueWordText!: Phaser.GameObjects.Text;
  private cueMeaningText!: Phaser.GameObjects.Text;
  private cuePronunciationText!: Phaser.GameObjects.Text;
  private inputLegendText!: Phaser.GameObjects.Text;
  private judgmentText!: Phaser.GameObjects.Text;
  private comboText!: Phaser.GameObjects.Text;
  private receptorSprites: Phaser.GameObjects.Rectangle[] = [];
  private noteSprites = new Map<string, Phaser.GameObjects.Rectangle>();
  private activeItemId: string | null = null;
  private itemsById = new Map<string, RuntimeDemoItem>();

  constructor() {
    super("boot");
  }

  preload() {
    const runtimeStage = loadDemoRuntimeStage();

    runtimeStage.items.forEach((item, index) => {
      this.load.image(this.getImageKey(index), item.imageSrc);
      this.load.audio(this.getAudioKey(index), [item.audioSrc]);
    });
  }

  create() {
    this.runtimeStage = loadDemoRuntimeStage();
    this.battleStage = createBattleStageDefinition(this.runtimeStage);
    this.battleState = createBattleStageState(this.battleStage);
    this.itemsById = new Map(
      this.runtimeStage.items.map((item) => [item.item.id, item] satisfies [string, RuntimeDemoItem])
    );
    this.sceneStartTimeMs = this.time.now;

    this.cameras.main.setBackgroundColor("#111927");
    this.renderCuePanel();
    this.renderLanePlayfield();
    this.input.keyboard?.on("keydown", this.handleKeyDown, this);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.input.keyboard?.off("keydown", this.handleKeyDown, this);
    });

    this.refreshFrame(0);
  }

  override update() {
    const elapsedTimeMs = this.time.now - this.sceneStartTimeMs;

    this.refreshFrame(elapsedTimeMs);
  }

  private renderCuePanel() {
    const { cueArea } = this.battleStage;
    const centerX = cueArea.left + cueArea.width / 2;

    this.add
      .rectangle(centerX, cueArea.top + cueArea.height / 2, cueArea.width, cueArea.height, PANEL_FILL, 1)
      .setStrokeStyle(2, 0xffcf88, 0.2);
    this.add
      .text(centerX, cueArea.top + 34, "Battle Mode baseline", {
        color: "#f6efe5",
        fontFamily: "Trebuchet MS, Verdana, sans-serif",
        fontSize: "24px",
        fontStyle: "bold"
      })
      .setOrigin(0.5);
    this.add
      .text(centerX, cueArea.top + 68, "Image cue stays separate from timing lanes.", {
        color: "#d6dee8",
        fontFamily: "Trebuchet MS, Verdana, sans-serif",
        fontSize: "15px",
        align: "center",
        wordWrap: { width: cueArea.width - 32 }
      })
      .setOrigin(0.5);
    this.add
      .rectangle(centerX, cueArea.top + 176, cueArea.width - 44, 196, CARD_FILL, 1)
      .setStrokeStyle(2, 0xffcf88, 0.14);

    this.cueImageFrame = this.add.image(centerX, cueArea.top + 176, this.getImageKey(0)).setDisplaySize(168, 168);
    this.cueMeaningText = this.add
      .text(centerX, cueArea.top + 304, "", {
        color: "#ffcf88",
        fontFamily: "Trebuchet MS, Verdana, sans-serif",
        fontSize: "26px",
        fontStyle: "bold"
      })
      .setOrigin(0.5);
    this.cueWordText = this.add
      .text(centerX, cueArea.top + 340, "", {
        color: "#f6efe5",
        fontFamily: "Trebuchet MS, Verdana, sans-serif",
        fontSize: "22px",
        fontStyle: "bold"
      })
      .setOrigin(0.5);
    this.cuePronunciationText = this.add
      .text(centerX, cueArea.top + 372, "", {
        color: "#d6dee8",
        fontFamily: "Trebuchet MS, Verdana, sans-serif",
        fontSize: "16px"
      })
      .setOrigin(0.5);
    this.inputLegendText = this.add
      .text(centerX, cueArea.bottom - 52, "Keys: Left / Down / Up / Right", {
        color: "#f6efe5",
        fontFamily: "Trebuchet MS, Verdana, sans-serif",
        fontSize: "16px",
        align: "center",
        wordWrap: { width: cueArea.width - 32 }
      })
      .setOrigin(0.5);
    this.judgmentText = this.add
      .text(centerX, cueArea.bottom - 106, "Waiting for first note", {
        color: "#d6dee8",
        fontFamily: "Trebuchet MS, Verdana, sans-serif",
        fontSize: "16px",
        align: "center",
        wordWrap: { width: cueArea.width - 32 }
      })
      .setOrigin(0.5);
  }

  private renderLanePlayfield() {
    const { playfield, lanes, notes } = this.battleStage;

    this.add
      .rectangle(
        playfield.left + playfield.width / 2,
        playfield.top + playfield.height / 2,
        playfield.width,
        playfield.height,
        PANEL_FILL,
        1
      )
      .setStrokeStyle(2, 0xffcf88, 0.18);
    this.add
      .text(playfield.left + 20, playfield.top + 22, "Learner lanes", {
        color: "#f6efe5",
        fontFamily: "Trebuchet MS, Verdana, sans-serif",
        fontSize: "20px",
        fontStyle: "bold"
      });
    this.add
      .text(playfield.left + 20, playfield.top + 48, "Fixed columns, fixed receptors, looping beginner-safe note travel.", {
        color: "#d6dee8",
        fontFamily: "Trebuchet MS, Verdana, sans-serif",
        fontSize: "14px"
      });
    this.comboText = this.add
      .text(playfield.right - 20, playfield.top + 34, "Combo x0", {
        color: COMBO_IDLE_COLOR,
        fontFamily: "Trebuchet MS, Verdana, sans-serif",
        fontSize: "18px",
        fontStyle: "bold",
        align: "right"
      })
      .setOrigin(1, 0.5);

    lanes.forEach((lane) => {
      this.add
        .rectangle(
          lane.centerX,
          playfield.top + playfield.height / 2 + 20,
          lane.width,
          playfield.height - 92,
          LANE_FILLS[lane.index],
          0.72
        )
        .setStrokeStyle(2, 0xffffff, 0.08);
      this.add
        .text(lane.centerX, playfield.top + 92, lane.direction.toUpperCase(), {
          color: "#f6efe5",
          fontFamily: "Trebuchet MS, Verdana, sans-serif",
          fontSize: "18px",
          fontStyle: "bold"
        })
        .setOrigin(0.5);
      this.add
        .text(lane.centerX, lane.receptorY + 28, lane.key.replace("Arrow", ""), {
          color: "#d6dee8",
          fontFamily: "Trebuchet MS, Verdana, sans-serif",
          fontSize: "14px"
        })
        .setOrigin(0.5);

      const receptor = this.add
        .rectangle(lane.centerX, lane.receptorY, lane.width - 18, 16, RECEPTOR_IDLE_FILL, 1)
        .setStrokeStyle(2, 0xffffff, 0.22);

      this.receptorSprites.push(receptor);
    });

    notes.forEach((note) => {
      const lane = lanes[note.laneIndex];
      const sprite = this.add
        .rectangle(lane.centerX, playfield.top + 24, lane.width - 32, 18, NOTE_FILLS[note.laneIndex], 1)
        .setStrokeStyle(2, 0xffffff, 0.16)
        .setVisible(false);

      this.noteSprites.set(note.id, sprite);
    });
  }

  private refreshFrame(elapsedTimeMs: number) {
    this.battleState = advanceBattleStageState(this.battleState, elapsedTimeMs);

    const snapshot = getBattleStageSnapshot(this.battleStage, elapsedTimeMs, this.battleState);

    snapshot.notes.forEach((note) => {
      const sprite = this.noteSprites.get(note.id);

      if (sprite === undefined) {
        return;
      }

      sprite.setPosition(note.x, note.y).setVisible(note.isVisible);
      sprite.setAlpha(note.isVisible ? 0.96 : 0);
    });

    if (snapshot.activeItemId !== this.activeItemId) {
      this.activeItemId = snapshot.activeItemId;
      this.renderActiveCue(snapshot.activeItemId);
    }

    this.renderHitFeedback();
    this.renderJudgmentFeedback();
    this.renderComboFeedback();
  }

  private renderActiveCue(activeItemId: string | null) {
    const runtimeItem = activeItemId === null ? undefined : this.itemsById.get(activeItemId);

    if (runtimeItem === undefined) {
      return;
    }

    const itemIndex = this.runtimeStage.items.findIndex((candidate) => candidate.item.id === activeItemId);

    this.cueImageFrame.setTexture(this.getImageKey(itemIndex));
    this.cueMeaningText.setText(runtimeItem.item.meaning);
    this.cueWordText.setText(runtimeItem.item.term.toUpperCase());
    this.cuePronunciationText.setText(runtimeItem.item.pronunciation);
    this.inputLegendText.setText(`Keys: Left / Down / Up / Right\nActive cue: ${runtimeItem.item.term}`);
    this.sound.stopAll();
    this.sound.play(this.getAudioKey(itemIndex));
  }

  private handleKeyDown = (event: KeyboardEvent) => {
    const laneIndex = this.battleStage.lanes.findIndex((lane) => lane.key === event.key);

    if (laneIndex === -1) {
      return;
    }

    this.battleState = judgeBattleStageInput(
      this.battleState,
      this.time.now - this.sceneStartTimeMs,
      event.key
    );
    this.renderHitFeedback();
    this.renderJudgmentFeedback();
    this.renderComboFeedback();
  };

  private renderHitFeedback() {
    const hitFeedback = this.battleState.hitFeedback;
    const activeLaneIndex =
      hitFeedback !== null && this.battleState.timelineTimeMs <= hitFeedback.endsAtMs
        ? hitFeedback.laneIndex
        : -1;

    this.receptorSprites.forEach((receptor, laneIndex) => {
      const isActive = laneIndex === activeLaneIndex;

      receptor.setFillStyle(isActive ? RECEPTOR_ACTIVE_FILL : RECEPTOR_IDLE_FILL, 1);
      receptor.setScale(1, isActive ? 1.18 : 1);
    });
  }

  private renderJudgmentFeedback() {
    const hitFeedback = this.battleState.hitFeedback;

    if (hitFeedback !== null && this.battleState.timelineTimeMs <= hitFeedback.endsAtMs) {
      this.judgmentText.setColor(JUDGMENT_COLORS.hit).setText(hitFeedback.confirmationLabel);

      return;
    }

    const judgment = this.battleState.lastJudgment;

    if (judgment === null || judgment.outcome === "hit") {
      this.judgmentText.setColor("#d6dee8").setText("Waiting for first note");

      return;
    }

    const labelByOutcome = {
      hit: "Hit",
      "wrong-lane": "Wrong lane",
      "too-early": "Too early",
      "missed-window": "Miss"
    } as const;
    const timingLabel =
      judgment.outcome === "wrong-lane" || judgment.outcome === "missed-window"
        ? ""
        : ` (${judgment.offsetMs >= 0 ? "+" : ""}${judgment.offsetMs}ms)`;

    this.judgmentText
      .setColor(JUDGMENT_COLORS[judgment.outcome])
      .setText(`${labelByOutcome[judgment.outcome]}${timingLabel}`);
  }

  private renderComboFeedback() {
    const { comboCount, comboFeedback, timelineTimeMs } = this.battleState;
    const activeComboFeedback =
      comboFeedback !== null && timelineTimeMs <= comboFeedback.endsAtMs ? comboFeedback : null;
    const milestoneThreshold = activeComboFeedback?.milestoneThreshold ?? null;
    const fontSize = milestoneThreshold === null ? "18px" : milestoneThreshold >= 10 ? "28px" : "24px";
    const comboLabel =
      comboCount > 0
        ? activeComboFeedback?.label ?? `${comboCount} combo`
        : "Combo x0";

    this.comboText
      .setText(comboLabel)
      .setColor(
        comboCount === 0
          ? COMBO_IDLE_COLOR
          : milestoneThreshold === null
            ? COMBO_HIT_COLOR
            : COMBO_MILESTONE_COLOR
      )
      .setFontSize(fontSize)
      .setScale(1, 1);
  }

  private getImageKey(index: number) {
    return `runtime-item-image-${index}`;
  }

  private getAudioKey(index: number) {
    return `runtime-item-audio-${index}`;
  }
}
