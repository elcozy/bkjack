import * as PIXI from "pixi.js";
import { StartScene } from "./scenes/StartScene";
import { BetScene } from "./scenes/BetScene";
import { GameScene } from "./scenes/GameScene";

export class Model {
  static app: PIXI.Renderer;
  static balance: number = 1000;
  static curBet: number = 0;

  static gameContainer: HTMLElement;
  // static gameRenderer: PIXI.Renderer;
  static gameStage: PIXI.Container;

  // static app: PIXI.Application;
  static startScene: StartScene;
  static betScene: BetScene;
  static gameScene: GameScene;

  static setPlayerBalance(value: number) {
    this.balance = value;
  }

  static getPlayerBalance() {
    return this.balance;
  }

  static setSelectedBet(value: number) {
    this.curBet = value;
  }

  static getSelectedBet() {
    return this.curBet;
  }

  static placeBet() {
    this.balance -= this.curBet;
  }

  static addWins(winAmount: number) {
    this.balance += winAmount;
  }

  static centerGameContainer() {
    this.gameContainer.style.display = "flex";
    this.gameContainer.style.justifyContent = "center";
    this.gameContainer.style.alignItems = "center";
  }
  static setupResizeHandling() {
    window.addEventListener("resize", this.handleResize.bind(this));
    this.handleResize();
  }

  static handleResize() {
    const ratio = Math.min(window.innerWidth / 1920, window.innerHeight / 1080);
    this.app.view.style.width = 1920 * ratio + "px";
    this.app.view.style.height = 1080 * ratio + "px";

    // this.table?.adjustToWindowResizeMath.min(window.innerWidth / 1920, window.innerHeight / 1080);
  }
  // static initializeGame() {
  //     WebFont.load({
  //         google: {
  //             families: ["Chakra Petch", "Chakra Petch:700", "Droid Serif"],
  //         },
  //         active: () => {
  //             // this.showIntroScreen();
  //             this.runGameLoop();
  //         },
  //     });
  // }
  static runGameLoop() {
    requestAnimationFrame(this.runGameLoop.bind(this));
    this.app.render(this.gameStage);
  }
}
