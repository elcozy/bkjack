import { GameScene } from "../../scenes/GameScene";
import { SharedButton } from "./SharedButton";
import { gsap } from "gsap";

export class StartButton {
  public startBtn: SharedButton;

  constructor(private gamescene: GameScene) {
    this.startBtn = new SharedButton(
      this.gamescene.tableWidth - 200,
      this.gamescene.tableHeight - 90,
      "START",
      this.onStartClick.bind(this)
    );
    this.gamescene.addChild(this.startBtn);
  }

  private onStartClick() {
    this.gamescene.showStartButton(false);
    this.gamescene.userCount = 0;
    this.gamescene.dealerCount = 0;
    if (this.gamescene.dealerCards.length > 0) {
      this.gamescene.clearTable();
      gsap.delayedCall(0.6, this.gamescene.startNewGame.bind(this.gamescene));
    } else {
      this.gamescene.startNewGame();
    }
  }
}
