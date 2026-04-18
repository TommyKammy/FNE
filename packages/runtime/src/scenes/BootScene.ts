import Phaser from "phaser";
import { createBootSceneModel } from "../demo-content";

export class BootScene extends Phaser.Scene {
  constructor() {
    super("boot");
  }

  create() {
    const { width, height } = this.scale;
    const model = createBootSceneModel();

    this.cameras.main.setBackgroundColor("#111927");

    this.add.rectangle(width / 2, height / 2, width - 48, height - 48, 0x1d2638, 1);
    this.add
      .text(width / 2, height / 2 - 70, model.headline, {
        color: "#f6efe5",
        fontFamily: "Trebuchet MS, Verdana, sans-serif",
        fontSize: "32px",
        fontStyle: "bold"
      })
      .setOrigin(0.5);

    this.add
      .text(width / 2, height / 2 - 18, model.subhead, {
        color: "#ffcf88",
        fontFamily: "Trebuchet MS, Verdana, sans-serif",
        fontSize: "18px"
      })
      .setOrigin(0.5);

    this.add
      .text(width / 2, height / 2 + 30, `${model.term} - ${model.meaning}`, {
        color: "#f6efe5",
        fontFamily: "Trebuchet MS, Verdana, sans-serif",
        fontSize: "28px",
        fontStyle: "bold"
      })
      .setOrigin(0.5);

    this.add
      .text(width / 2, height / 2 + 72, "Runtime reads the first demo item through the loader seam.", {
        color: "#ffcf88",
        fontFamily: "Trebuchet MS, Verdana, sans-serif",
        fontSize: "18px"
      })
      .setOrigin(0.5);
  }
}
