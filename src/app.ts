import * as PIXI from "pixi.js";
import { StartScene } from "./scenes/StartScene";
import { BetScene } from "./scenes/BetScene";
import { GameScene } from "./scenes/GameScene";
import { Model } from "./Model";
import * as WebFont from "webfontloader";
import { GameEngineConfig } from "./types";

const config: GameEngineConfig = {
  gameContainerId: "blackjack-game",
  gameCanvasWidth: 1920,
  gameCanvasHeight: 1080,
  maxFPS: 60,
};

window.onload = () => {
  Model.app = PIXI.autoDetectRenderer({
    width: 1920,
    height: 1080,
    antialias: true,
  });

  function initializeGame() {
    WebFont.load({
      google: {
        families: ["Chakra Petch", "Chakra Petch:700", "Droid Serif"],
      },
      active: () => {
        // this.showIntroScreen();
        Model.runGameLoop();
      },
    });
  }
  Model.gameStage = new PIXI.Container();

  Model.gameContainer = config.gameContainerId
    ? document.getElementById(config.gameContainerId) || document.body
    : document.body;
  Model.gameContainer.appendChild(Model.app.view);

  Model.centerGameContainer();
  Model.setupResizeHandling();
  initializeGame();

  document.body.appendChild(Model.app.view);

  // Initialize scenes
  Model.startScene = new StartScene();
  Model.betScene = new BetScene();
  Model.gameScene = new GameScene();

  const background = PIXI.Sprite.from("img/bg-table.jpg");
  Model.gameStage.addChild(background);

  // Set initial scene
  Model.gameStage.addChild(Model.startScene);
};
