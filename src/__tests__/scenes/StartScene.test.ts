import * as PIXI from "pixi.js";
import { StartScene } from "../../scenes/StartScene";
import { SharedButton } from "../../components/buttons";
import { Model } from "../../Model";

jest.mock("../../Model", () => {
  const ModelMock = {
    app: {
      width: 800,
      height: 600,
    },
    gameStage: {
      removeChild: jest.fn(),
      addChild: jest.fn(),
    },
    startScene: {},
    betScene: {},
  };
  return ModelMock;
});

jest.mock("../../components/buttons/SharedButton", () => {
  const SharedButtonMock = jest
    .fn()
    .mockImplementation((x, y, text, onClick) => {
      const buttonMock = {
        x,
        y,
        text,
        onClick,
        interactive: true,
        buttonMode: true,
        addChild: jest.fn(),
        on: jest.fn(),
      };
      return buttonMock;
    });
  return { SharedButton: SharedButtonMock };
});

jest.mock("pixi.js", () => {
  const PIXI = jest.requireActual("pixi.js");
  const SpriteMock = jest.fn().mockImplementation(() => {
    const spriteMock = {
      scale: {
        set: jest.fn(),
      },
      anchor: {
        set: jest.fn(),
      },
      x: 0,
      y: 0,
      addChild: jest.fn(),
    };
    return spriteMock;
  });
  return { ...PIXI, Sprite: SpriteMock };
});

describe("StartScene", () => {
  let startScene;

  beforeEach(() => {
    startScene = new StartScene();
  });

  test("initializes StartScene correctly", () => {
    expect(startScene.startButton).toBeInstanceOf(SharedButton);
    expect(startScene.bJackLogo).toBeInstanceOf(PIXI.Sprite);
  });

  test("handleStartButtonClick initiates game correctly", () => {
    startScene.initiateGamePlay();
    expect(Model.gameStage.removeChild).toHaveBeenCalledWith(Model.startScene);
    expect(Model.gameStage.addChild).toHaveBeenCalledWith(Model.betScene);
  });

  test("showIntroScreen shows intro screen correctly", () => {
    startScene.showIntroScreen();
    expect(startScene.addChild).toHaveBeenCalledTimes(2);
    expect(startScene.addChild).toHaveBeenCalledWith(startScene.bJackLogo);
    expect(startScene.addChild).toHaveBeenCalledWith(startScene.startButton);
    expect(startScene.startButton.onClick).toBeInstanceOf(Function);
  });
});
