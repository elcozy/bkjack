import { SharedButton } from "./SharedButton";
import * as PIXI from "pixi.js";
import { GameScene } from "../../scenes/GameScene";
import { Model } from "../../Model";

export class AddBetButton {
  public betPlusBtn: SharedButton;
  public chipsContainer: PIXI.Container;

  constructor(private gamescene: GameScene) {
    this.betPlusBtn = new SharedButton(
      200,
      this.gamescene.tableHeight - 90,
      "ADD BET",
      this.onAddBetClick.bind(this)
    );
    this.addChips();
    this.gamescene.addChild(this.chipsContainer);
    // this.gamescene.addChild(this.betPlusBtn);
  }

  private onAddBetClick() {
    Model.setSelectedBet(Model.curBet * 2);
    this.gamescene.updateSelectedBet();
    Model.setPlayerBalance(Model.balance - Model.curBet);
    // Model.placeBet();
    this.gamescene.updateBalanceMeter();
  }

  private addChips() {
    this.chipsContainer = new PIXI.Container();
    const chipColors = [0xff9900, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff];
    const chipAmounts = [1, 2, 5, 10, 20];

    let offsetX = 0;

    for (let i = 0; i < 5; i++) {
      const chip = PIXI.Sprite.from("assets/img/chip.png");
      const chipAmount: PIXI.Text = new PIXI.Text(
        `${chipAmounts[i]}`,
        new PIXI.TextStyle({
          fontFamily: "Chakra Petch",
          fontSize: 250,
          fill: "#fff",
          fontWeight: "bold",
        })
      );
      chip.interactive = true;
      chip.buttonMode = true;

      chipAmount.anchor.set(0.5);
      chip.anchor.set(0.5);

      chip.addChild(chipAmount);

      chip.on("pointerdown", () => {
        Model.curBet += parseFloat(chipAmount.text);
        this.gamescene.updateSelectedBet();

        // Model.setSelectedBet(
        //     Model.curBet + parseFloat(chipAmount.text)
        // );
        Model.setPlayerBalance(Model.balance - parseFloat(chipAmount.text));
        this.gamescene.updateBalanceMeter();
      });

      chip.width = 70;
      chip.height = 70;
      chip.tint = chipColors[i];
      chip.x = chip.width;
      chip.y = 1080 / 1.5 + offsetX * 75;
      this.chipsContainer.addChild(chip);

      offsetX++;
    }
  }
}
