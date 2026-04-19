import Phaser from "phaser";
import { createBootSceneModel } from "../demo-content";
import {
  advanceLearnStageRound,
  beginLearnStageRound,
  continueLearnStage,
  createLearnStageState,
  judgeLearnStageInput,
  judgeLearnStageTimeout,
  restartLearnStageRound,
  type LearnStageState
} from "../learn-stage";

const PANEL_FILL = 0x1d2638;
const CARD_FILL = 0x24324a;
const SUCCESS_COLOR = "#7ef0ad";
const FAILURE_COLOR = "#ff8b7c";
const NEUTRAL_COLOR = "#ffcf88";
const LEARN_RESPONSE_WINDOW_MS = 1800;

export class BootScene extends Phaser.Scene {
  private stageState!: LearnStageState;
  private responseTimeoutEvent: Phaser.Time.TimerEvent | null = null;
  private imageFrame!: Phaser.GameObjects.Image;
  private subheadText!: Phaser.GameObjects.Text;
  private feedbackTitleText!: Phaser.GameObjects.Text;
  private feedbackBodyText!: Phaser.GameObjects.Text;
  private cueLabelText!: Phaser.GameObjects.Text;
  private answerHintText!: Phaser.GameObjects.Text;
  private outcomeWordText!: Phaser.GameObjects.Text;

  constructor() {
    super("boot");
  }

  preload() {
    const model = createBootSceneModel();

    model.items.forEach((item, index) => {
      this.load.image(this.getImageKey(index), item.imageSrc);
      this.load.audio(this.getAudioKey(index), [item.audioSrc]);
    });
  }

  create() {
    const { width, height } = this.scale;
    const model = createBootSceneModel();

    this.stageState = createLearnStageState({
      packId: model.packId,
      stageId: model.stageId,
      items: model.items
    });

    this.cameras.main.setBackgroundColor("#111927");

    this.add.rectangle(width / 2, height / 2, width - 48, height - 48, PANEL_FILL, 1);
    this.add
      .text(width / 2, 58, model.headline, {
        color: "#f6efe5",
        fontFamily: "Trebuchet MS, Verdana, sans-serif",
        fontSize: "28px",
        fontStyle: "bold"
      })
      .setOrigin(0.5);

    this.subheadText = this.add
      .text(width / 2, 96, model.subhead, {
        color: "#ffcf88",
        fontFamily: "Trebuchet MS, Verdana, sans-serif",
        fontSize: "16px"
      })
      .setOrigin(0.5);

    this.add.rectangle(width / 2, 260, 280, 280, CARD_FILL, 1).setStrokeStyle(2, 0xffcf88, 0.18);
    this.imageFrame = this.add.image(width / 2, 260, this.getImageKey(0)).setDisplaySize(220, 220);

    this.cueLabelText = this.add
      .text(width / 2, 420, "", {
        color: "#f6efe5",
        fontFamily: "Trebuchet MS, Verdana, sans-serif",
        fontSize: "26px",
        fontStyle: "bold"
      })
      .setOrigin(0.5);

    this.answerHintText = this.add
      .text(width / 2, 454, "Listen for the English word, then type its first letter.", {
        color: "#d6dee8",
        fontFamily: "Trebuchet MS, Verdana, sans-serif",
        fontSize: "18px"
      })
      .setOrigin(0.5);

    this.feedbackTitleText = this.add
      .text(width / 2, 492, "", {
        color: NEUTRAL_COLOR,
        fontFamily: "Trebuchet MS, Verdana, sans-serif",
        fontSize: "24px",
        fontStyle: "bold"
      })
      .setOrigin(0.5);

    this.feedbackBodyText = this.add
      .text(width / 2, 520, "", {
        color: "#f6efe5",
        fontFamily: "Trebuchet MS, Verdana, sans-serif",
        fontSize: "16px",
        align: "center",
        wordWrap: { width: width - 120 }
      })
      .setOrigin(0.5);

    this.outcomeWordText = this.add
      .text(width / 2, 382, "", {
        color: "#f6efe5",
        fontFamily: "Trebuchet MS, Verdana, sans-serif",
        fontSize: "22px",
        fontStyle: "bold"
      })
      .setOrigin(0.5)
      .setVisible(false);

    this.input.keyboard?.on("keydown", this.handleKeyDown, this);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.clearResponseTimeout();
      this.input.keyboard?.off("keydown", this.handleKeyDown, this);
    });

    this.renderStageState();
  }

  private handleKeyDown = (event: KeyboardEvent) => {
    const normalizedKey = event.key.toLowerCase();

    if (normalizedKey === "enter") {
      if (this.stageState.kind !== "in-progress") {
        return;
      }

      if (this.stageState.roundState.phase === "passed") {
        this.clearResponseTimeout();
        this.stageState = continueLearnStage(this.stageState);
        this.renderStageState();
        return;
      }

      const readyState =
        this.stageState.roundState.phase === "idle"
          ? this.stageState
          : this.stageState.roundState.phase === "retry-needed"
            ? restartLearnStageRound(this.stageState)
            : this.stageState;

      this.stageState = beginLearnStageRound(readyState);
      this.renderRoundState();
      this.stageState = advanceLearnStageRound(this.stageState);
      this.renderRoundState();
      this.stageState = advanceLearnStageRound(this.stageState);
      this.renderRoundState();
      this.playPronunciationCue();
      this.stageState = advanceLearnStageRound(this.stageState);
      this.renderRoundState();
      this.stageState = advanceLearnStageRound(this.stageState);
      this.renderRoundState();
      this.syncResponseTimeout();
      return;
    }

    const nextState = judgeLearnStageInput(this.stageState, event.key);

    if (nextState !== this.stageState) {
      this.clearResponseTimeout();
      this.stageState = nextState;
      this.renderRoundState();
    }
  };

  private syncResponseTimeout() {
    this.clearResponseTimeout();

    if (
      this.stageState.kind !== "in-progress" ||
      this.stageState.roundState.phase !== "awaiting-input"
    ) {
      return;
    }

    this.responseTimeoutEvent = this.time.delayedCall(LEARN_RESPONSE_WINDOW_MS, () => {
      const nextState = judgeLearnStageTimeout(this.stageState);

      if (nextState === this.stageState) {
        return;
      }

      this.stageState = nextState;
      this.responseTimeoutEvent = null;
      this.renderRoundState();
    });
  }

  private clearResponseTimeout() {
    this.responseTimeoutEvent?.remove(false);
    this.responseTimeoutEvent = null;
  }

  private playPronunciationCue() {
    if (this.stageState.kind !== "in-progress") {
      return;
    }

    this.sound.stopAll();
    this.sound.play(this.getAudioKey(this.stageState.currentIndex));
  }

  private renderStageState() {
    if (this.stageState.kind === "content-error") {
      this.imageFrame.setVisible(false);
      this.cueLabelText.setText("Visible cue unavailable");
      this.answerHintText.setText("This item needs a Latin-letter term before keyboard play can start.");
      this.feedbackTitleText.setText("Content error");
      this.feedbackTitleText.setColor(FAILURE_COLOR);
      this.feedbackBodyText.setText(this.stageState.error.message);
      this.outcomeWordText.setVisible(false);
      return;
    }

    if (this.stageState.kind === "summary") {
      const supportedCount = this.stageState.completedItems.filter(
        (item) => item.passedWithSupport
      ).length;

      this.imageFrame.setVisible(false);
      this.subheadText.setText(
        `Pack ${this.stageState.packId} / Stage ${this.stageState.stageId} / Summary`
      );
      this.cueLabelText.setText("Stage complete");
      this.answerHintText.setText("Every scheduled Learn Mode item has been cleared.");
      this.feedbackTitleText.setText("Stage summary");
      this.feedbackTitleText.setColor(SUCCESS_COLOR);
      this.feedbackBodyText.setText(
        `Cleared ${this.stageState.completedItems.length} of ${this.stageState.totalItemCount} items. Supported repeats: ${supportedCount}.`
      );
      this.outcomeWordText
        .setText(this.stageState.completedItems.map((item) => item.itemId).join("  •  "))
        .setVisible(true);
      return;
    }

    this.imageFrame
      .setTexture(this.getImageKey(this.stageState.currentIndex))
      .setVisible(true);
    this.subheadText.setText(
      `Pack ${this.stageState.packId} / Stage ${this.stageState.stageId} / Item ${this.stageState.currentIndex + 1} of ${this.stageState.items.length}`
    );
    this.cueLabelText.setText(`Visible cue: ${this.stageState.currentItem.item.meaning}`);
    this.renderRoundState();
  }

  private renderRoundState() {
    if (this.stageState.kind !== "in-progress") {
      return;
    }

    const { roundState } = this.stageState;
    this.feedbackTitleText.setText(roundState.feedbackTitle);
    this.feedbackBodyText.setText(roundState.feedbackBody);

    switch (roundState.phase) {
      case "idle":
        this.feedbackTitleText.setColor(NEUTRAL_COLOR);
        this.outcomeWordText.setVisible(false);
        break;
      case "attention-cue":
        this.feedbackTitleText.setColor(NEUTRAL_COLOR);
        this.outcomeWordText.setVisible(false);
        break;
      case "image-reveal":
        this.feedbackTitleText.setColor(NEUTRAL_COLOR);
        this.outcomeWordText.setVisible(false);
        break;
      case "pronunciation-reveal":
        this.feedbackTitleText.setColor(NEUTRAL_COLOR);
        this.outcomeWordText.setVisible(false);
        break;
      case "text-reveal":
        this.feedbackTitleText.setColor(NEUTRAL_COLOR);
        this.outcomeWordText.setVisible(true);
        this.outcomeWordText.setText(`${roundState.termLabel} (${roundState.meaningLabel})`);
        break;
      case "awaiting-input":
        this.feedbackTitleText.setColor(NEUTRAL_COLOR);
        this.outcomeWordText.setText(`${roundState.termLabel} (${roundState.meaningLabel})`);
        this.outcomeWordText.setVisible(true);
        break;
      case "retry-needed":
        this.feedbackTitleText.setColor(FAILURE_COLOR);
        this.outcomeWordText
          .setText(`${roundState.termLabel} (${roundState.meaningLabel})`)
          .setVisible(true);
        break;
      case "passed":
        this.feedbackTitleText.setColor(
          roundState.judgment === "success" ? SUCCESS_COLOR : FAILURE_COLOR
        );
        this.outcomeWordText
          .setText(`${roundState.termLabel} (${roundState.meaningLabel})`)
          .setVisible(true);
        break;
    }
  }

  private getImageKey(index: number): string {
    return `demo-item-image-${index}`;
  }

  private getAudioKey(index: number): string {
    return `demo-item-audio-${index}`;
  }
}
