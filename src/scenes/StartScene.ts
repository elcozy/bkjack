import { SharedButton } from "../components/buttons/SharedButton";
import * as PIXI from "pixi.js";
import { Model } from "../Model";

export class StartScene extends PIXI.Container {
  private startButton: SharedButton;
  private bJackLogo: any;

  constructor() {
    super();
    this.showIntroScreen();
  }

  private handleStartButtonClick() {
    this.initiateGamePlay();
  }

  private initiateGamePlay() {
    Model.gameStage.removeChild(Model.startScene);
    Model.gameStage.addChild(Model.betScene);
  }

  private showIntroScreen() {
    const x = Model.app.width / 2;
    const y = Model.app.height / 4;

    this.startButton = new SharedButton(
      x,
      y,
      "PLAY",
      this.handleStartButtonClick.bind(this)
    );

    this.bJackLogo = PIXI.Sprite.from("img/bjack-logo.png");
    this.bJackLogo.scale.set(0.7);
    this.bJackLogo.anchor.set(0.5);

    this.bJackLogo.x = Model.app.width / 2;
    this.bJackLogo.y = Model.app.height / 2;
    this.addChild(this.bJackLogo, this.startButton);
  }
}
