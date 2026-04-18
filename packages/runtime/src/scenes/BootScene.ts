import Phaser from "phaser";
import { createBootSceneModel } from "../demo-content";
import {
  advanceRevealRound,
  beginRevealRound,
  createRevealRoundState,
  judgeRevealRoundInput,
  restartRevealRound,
  type RevealRoundState
} from "../reveal-round";

const PANEL_FILL = 0x1d2638;
const CARD_FILL = 0x24324a;
const IMAGE_KEY = "demo-item-image";
const AUDIO_KEY = "demo-item-audio";
const SUCCESS_COLOR = "#7ef0ad";
const FAILURE_COLOR = "#ff8b7c";
const NEUTRAL_COLOR = "#ffcf88";

export class BootScene extends Phaser.Scene {
  private roundState!: RevealRoundState;
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

    this.load.image(IMAGE_KEY, model.imageSrc);
    this.load.audio(AUDIO_KEY, [model.audioSrc]);
  }

  create() {
    const { width, height } = this.scale;
    const model = createBootSceneModel();
    const roundSetup = createRevealRoundState(model.item);

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

    this.add
      .text(width / 2, 96, model.subhead, {
        color: "#ffcf88",
        fontFamily: "Trebuchet MS, Verdana, sans-serif",
        fontSize: "16px"
      })
      .setOrigin(0.5);

    this.add.rectangle(width / 2, 260, 280, 280, CARD_FILL, 1).setStrokeStyle(2, 0xffcf88, 0.18);
    this.add.image(width / 2, 260, IMAGE_KEY).setDisplaySize(220, 220);

    this.cueLabelText = this.add
      .text(width / 2, 420, `Visible cue: ${model.meaning}`, {
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

    if (!roundSetup.ok) {
      this.answerHintText.setText("This item needs a Latin-letter term before keyboard play can start.");
      this.feedbackTitleText.setText("Content error");
      this.feedbackTitleText.setColor(FAILURE_COLOR);
      this.feedbackBodyText.setText(roundSetup.error.message);
      return;
    }

    this.roundState = roundSetup.state;

    this.input.keyboard?.on("keydown", this.handleKeyDown, this);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.input.keyboard?.off("keydown", this.handleKeyDown, this);
    });

    this.renderRoundState();
  }

  private handleKeyDown = (event: KeyboardEvent) => {
    const normalizedKey = event.key.toLowerCase();

    if (normalizedKey === "enter") {
      if (this.roundState.phase === "idle" || this.roundState.phase === "judged") {
        const idleState =
          this.roundState.phase === "judged"
            ? restartRevealRound(this.roundState)
            : this.roundState;

        const revealingState = beginRevealRound(idleState);

        this.roundState = revealingState;
        this.renderRoundState();
        this.playPronunciationCue();
        this.roundState = advanceRevealRound(revealingState);
        this.renderRoundState();
      }

      return;
    }

    const nextState = judgeRevealRoundInput(this.roundState, event.key);

    if (nextState !== this.roundState) {
      this.roundState = nextState;
      this.renderRoundState();
    }
  };

  private playPronunciationCue() {
    this.sound.stopAll();
    this.sound.play(AUDIO_KEY);
  }

  private renderRoundState() {
    this.feedbackTitleText.setText(this.roundState.feedbackTitle);
    this.feedbackBodyText.setText(this.roundState.feedbackBody);

    switch (this.roundState.phase) {
      case "idle":
        this.feedbackTitleText.setColor(NEUTRAL_COLOR);
        this.outcomeWordText.setVisible(false);
        break;
      case "revealing":
        this.feedbackTitleText.setColor(NEUTRAL_COLOR);
        this.outcomeWordText.setVisible(false);
        break;
      case "awaiting-input":
        this.feedbackTitleText.setColor(NEUTRAL_COLOR);
        this.outcomeWordText.setVisible(false);
        break;
      case "judged":
        this.feedbackTitleText.setColor(
          this.roundState.judgment === "success" ? SUCCESS_COLOR : FAILURE_COLOR
        );
        this.outcomeWordText
          .setText(`${this.roundState.termLabel} (${this.roundState.meaningLabel})`)
          .setVisible(true);
        break;
    }
  }
}
