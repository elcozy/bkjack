import { SharedButton } from "./SharedButton";
import { GameScene } from "../../scenes/GameScene";

export class StandButton {
  public standBtn: SharedButton;

  constructor(private gamescene: GameScene) {
    this.standBtn = new SharedButton(
      this.gamescene.tableWidth / 2 + this.gamescene.tableWidth / 2 / 1.5,
      this.gamescene.tableHeight / 1.8,
      "✋🏼 STAND",
      this.onStandClick.bind(this)
    );
    this.gamescene.addChild(this.standBtn);
  }

  private onStandClick() {
    this.gamescene.showAddBetButton(false);
    this.gamescene.showHitAndStandCommands(false);
    this.gamescene.revealDealerHitResult();
  }
}
