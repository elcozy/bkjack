import { SharedButton } from "./SharedButton";
import { GameScene } from "../../scenes/GameScene";

export class HitButton {
  public hitBtn: SharedButton;

  constructor(private gamescene: GameScene) {
    this.hitBtn = new SharedButton(
      this.gamescene.tableWidth / 2 - this.gamescene.tableWidth / 2 / 1.5,
      this.gamescene.tableHeight / 1.8,
      "👆🏼 HIT",
      this.onHitClick.bind(this)
    );
    this.gamescene.addChild(this.hitBtn);
  }

  private onHitClick() {
    this.gamescene.dealCardToPlayer();
  }
}
