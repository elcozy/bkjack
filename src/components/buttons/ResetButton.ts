import { Model } from "../../Model";
import { GameScene } from "../../scenes/GameScene";
import { SharedButton } from "./SharedButton";
import { gsap } from "gsap";

export class ResetButton {
    public resetBtn: SharedButton;

    constructor(private gamescene: GameScene) {
        this.resetBtn = new SharedButton(
            this.gamescene.tableWidth - 200,
            90,
            "RESET",
            this.onResetClick.bind(this)
        );
        this.gamescene.addChild(this.resetBtn);
    }

    private onResetClick() {
      this.gamescene.reset();
        this.gamescene.showStartButton(false);

        this.gamescene.clearTable();
        Model.reset();
        Model.betScene.reset();
        Model.gameStage.removeChild(Model.gameScene);

        Model.gameStage.addChild(Model.betScene);
    }
}
