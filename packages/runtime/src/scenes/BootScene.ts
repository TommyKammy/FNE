import Phaser from "phaser";

export class BootScene extends Phaser.Scene {
  constructor() {
    super("boot");
  }

  create() {
    const { width, height } = this.scale;

    this.cameras.main.setBackgroundColor("#111927");

    this.add.rectangle(width / 2, height / 2, width - 48, height - 48, 0x1d2638, 1);
    this.add
      .text(width / 2, height / 2 - 28, "Phaser Surface", {
        color: "#f6efe5",
        fontFamily: "Trebuchet MS, Verdana, sans-serif",
        fontSize: "36px",
        fontStyle: "bold"
      })
      .setOrigin(0.5);

    this.add
      .text(width / 2, height / 2 + 28, "Runtime mounted inside the React shell.", {
        color: "#ffcf88",
        fontFamily: "Trebuchet MS, Verdana, sans-serif",
        fontSize: "20px"
      })
      .setOrigin(0.5);
  }
}
