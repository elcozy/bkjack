import * as PIXI from "pixi.js";
import * as WebFont from "webfontloader";
import { Model } from "../Model";
import { StartScene } from "../scenes/StartScene";
import { BetScene } from "../scenes/BetScene";
import { GameScene } from "../scenes/GameScene";
import "@testing-library/jest-dom/extend-expect";
import "jest-canvas-mock";

describe("Game Initialization", () => {
  let mockContainer: HTMLDivElement;

  beforeEach(() => {
    mockContainer = document.createElement("div");
    mockContainer.id = "blackjack-game";
    document.body.appendChild(mockContainer);
  });

  afterEach(() => {
    document.body.removeChild(mockContainer);
  });

  test("Game initialization sets up the scenes and starts the game loop", () => {
    // Create a mock implementation for PIXI.autoDetectRenderer
    const autoDetectRendererMock = jest
      .spyOn(PIXI, "autoDetectRenderer")
      .mockReturnValue({} as any);

    // Create a mock implementation for WebFont.load
    const webFontLoadMock = jest
      .spyOn(WebFont, "load")
      .mockImplementationOnce((config: WebFont.Config) => {
        // Call the active callback to simulate font loading completed
        config.active?.();
      });

    // Call the code under test
    require("./index");

    // Assert that the necessary functions and objects are set up correctly
    expect(autoDetectRendererMock).toHaveBeenCalledWith({
      width: 1920,
      height: 1080,
      antialias: true,
    });
    expect(Model.app).toBeDefined();
    expect(Model.gameContainer).toBe(mockContainer);
    expect(Model.gameStage).toBeInstanceOf(PIXI.Container);
    expect(Model.startScene).toBeInstanceOf(StartScene);
    expect(Model.betScene).toBeInstanceOf(BetScene);
    expect(Model.gameScene).toBeInstanceOf(GameScene);

    // Assert that the game loop has started
    expect(Model.runGameLoop).toHaveBeenCalled();

    // Clean up the mock implementations
    autoDetectRendererMock.mockRestore();
    webFontLoadMock.mockRestore();
  });
});
