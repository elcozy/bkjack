import * as PIXI from "pixi.js";
import { Model } from "../Model";
import { SharedButton } from "../components/buttons/SharedButton";
import { gsap } from "gsap";

export class BetScene extends PIXI.Container {
  private dealButton: SharedButton;
  private chipsContainer: PIXI.Container;
  private betAmount: PIXI.Text;
  private balance: PIXI.Text;
  private gameInitiated: boolean = false;

  constructor() {
    super();
    this.create();
  }

  public create() {
    this.showSelectBetScreen();
  }

  private showSelectBetScreen() {
    const x = Model.app.width / 2;
    const y = Model.app.height / 4;

    this.dealButton = new SharedButton(
      x,
      y,
      "DEAL",
      this.handleDealButtonClick.bind(this)
    );
    const background = PIXI.Sprite.from("assets/img/bg-table.jpg");
    this.createChips();

    this.betAmount = new PIXI.Text(
      `€ ${Model.curBet}`,
      new PIXI.TextStyle({
        fontFamily: "Chakra Petch",
        fontSize: 70,
        fill: "#fff",
        fontWeight: "bold",
      })
    );

    this.betAmount.x = Model.app.width / 2;
    this.betAmount.y = Model.app.height / 2;

    this.balance = new PIXI.Text(
      `BANK: € ${Model.balance}`,
      new PIXI.TextStyle({
        fontFamily: "Chakra Petch",
        fontSize: 70,
        fill: "#fff",
        fontWeight: "bold",
      })
    );

    this.balance.x = Model.app.width / 2;
    this.balance.y = Model.app.height / 2.3;

    this.addChild(
      background,
      this.chipsContainer,
      this.betAmount,
      this.balance,
      this.dealButton
    );

    const initialChip = this.chipsContainer.children[3] as PIXI.Sprite;
    initialChip.emit("pointerdown");
  }
  
  updateBetAmt() {
    const hideDealBtn = Model.curBet === 0;
    this.dealButton.visible = !hideDealBtn;

    this.betAmount.text = `BET: € ${Model.curBet}`;
  }

  updateBal() {
    this.balance.text = `BANK: € ${Model.balance - Model.curBet}`;
  }

  private createChips() {
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
          fontSize: 200,
          fill: "#fff",
          fontWeight: "bold",
        })
      );
      chip.interactive = true;
      chip.buttonMode = true;

      chipAmount.anchor.set(0.5);
      chip.anchor.set(0.5);
      chipAmount.position.set(chip.width / 2, chip.height / 2);

      chip.addChild(chipAmount);

      chip.on("pointerdown", () => {
        Model.curBet += parseFloat(chipAmount.text);
        this.updateBetAmt();
        this.updateBal();

        // Create a new chip sprite as a copy of the clicked chip
        const newChip = PIXI.Sprite.from("assets/img/chip.png");
        newChip.width = chip.width;
        newChip.height = chip.height;
        newChip.tint = chip.tint;
        newChip.anchor.set(0.5);
        newChip.position.set(
          450 + 4 * this.chipsContainer.children.length,
          chip.y + 156
        );

        const newChipAmount: PIXI.Text = new PIXI.Text(
          chipAmount.text,
          chipAmount.style
        );
        newChipAmount.anchor.set(0.5);
        newChip.addChild(newChipAmount);

        newChip.interactive = true;
        newChip.buttonMode = true;

        newChip.on("pointerdown", () => {
          Model.curBet -= parseFloat(newChipAmount.text);
          this.updateBetAmt();
          this.updateBal();
          this.chipsContainer.removeChild(newChip);
        });

        this.chipsContainer.addChild(newChip);
      });

      chip.width = 150;
      chip.height = 150;
      chip.tint = chipColors[i];
      chip.x = chip.width + offsetX * 160;
      chip.y = Model.app.height / 2;
      this.chipsContainer.addChild(chip);

      offsetX++;
    }
  }

  private handleDealButtonClick() {
    if (!this.gameInitiated) {
      Model.gameScene.create();

      this.initiateGamePlay();
    } else {
      // this.resumeScene(false);
      Model.gameScene.removeChild(Model.gameScene.resultBoard);
      Model.gameScene.showStartButton(false);
      Model.gameScene.userCount = 0;
      Model.gameScene.dealerCount = 0;
      if (Model.gameScene.dealerCards.length > 0) {
        Model.gameScene.clearTable();
        gsap.delayedCall(
          0.6,
          Model.gameScene.startNewGame.bind(Model.gameScene)
        );
      } else {
        Model.gameScene.startNewGame();
      }
    }
  }

  public resumeScene(resume: boolean = true) {
    // resume or pause
    // this.dealButton.visible = resume;
    // this.chipsContainer.visible = resume;
    // this.betAmount.visible = resume;
    // this.balance.visible = resume;
    Model.gameScene.visible = !resume;
  }

  private initiateGamePlay() {
    // Model.gameStage.removeChild(this.dealButton);
    // this.dealButton.destroy();
    // this.chipsContainer.destroy();
    // this.betAmount.destroy();
    // this.balance.destroy();
    // this.gameInitiated = true;
    // this.dealButton.visible = false;
    // this.chipsContainer.visible = false;
    // this.betAmount.visible = false;
    // this.balance.visible = false;

    Model.gameStage.addChild(Model.gameScene);
    Model.gameStage.removeChild(Model.betScene);
  }
}
