import * as PIXI from "pixi.js";
import { BetScene } from "../../scenes/BetScene";
import { Model } from "../../Model";
import { SharedButton } from "../../components/buttons/SharedButton";
import { gsap } from "gsap";
import { describe, expect, it } from "@jest/globals";

jest.mock("../../Model", () => {
  const ModelMock = {
    app: {
      width: 800,
      height: 600,
    },
    curBet: 0,
    balance: 1000,
    gameScene: {
      create: jest.fn(),
      removeChild: jest.fn(),
      showStartButton: jest.fn(),
      userCount: 0,
      dealerCount: 0,
      dealerCards: [],
      clearTable: jest.fn(),
      startNewGame: jest.fn(),
    },
    gameStage: {
      addChild: jest.fn(),
      removeChild: jest.fn(),
    },
    betScene: {},
    startScene: {},
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
        visible: true,
        emit: jest.fn(),
      };
      return buttonMock;
    });
  return { SharedButton: SharedButtonMock };
});

jest.mock("pixi.js", () => {
  const PIXI = jest.requireActual("pixi.js");
  const SpriteMock = jest.fn().mockImplementation(() => {
    const spriteMock = {
      interactive: true,
      buttonMode: true,
      width: 150,
      height: 150,
      tint: 0xff9900,
      x: 0,
      y: 0,
      addChild: jest.fn(),
      on: jest.fn(),
    };
    return spriteMock;
  });
  const TextMock = jest.fn().mockImplementation((text, style) => {
    const textMock = {
      text,
      style,
      x: 0,
      y: 0,
    };
    return textMock;
  });
  return { ...PIXI, Sprite: SpriteMock, Text: TextMock };
});

jest.mock("gsap", () => {
  const gsapMock = {
    delayedCall: jest.fn((_, callback) => {
      callback();
    }),
  };
  return gsapMock;
});

describe("BetScene", () => {
  let betScene;

  beforeEach(() => {
    betScene = new BetScene();
  });

  test("initializes BetScene correctly", () => {
    expect(betScene.dealButton).toBeInstanceOf(SharedButton);
    expect(betScene.chipsContainer).toBeInstanceOf(PIXI.Container);
    expect(betScene.betAmount).toBeInstanceOf(PIXI.Text);
    expect(betScene.balance).toBeInstanceOf(PIXI.Text);
    expect(betScene.gameInitiated).toBe(false);
  });

  test("create shows select bet screen correctly", () => {
    betScene.showSelectBetScreen();

    expect(betScene.dealButton).toBeInstanceOf(SharedButton);
    expect(betScene.addChild).toHaveBeenCalledTimes(5);
    expect(betScene.betAmount.text).toBe(`€ ${Model.curBet}`);
    expect(betScene.balance.text).toBe(`BANK: € ${Model.balance}`);
    expect(betScene.chipsContainer.children.length).toBe(5);
    expect(betScene.chipsContainer.children[3].emit).toHaveBeenCalledWith(
      "pointerdown"
    );
  });

  test("updateBetAmt updates betAmount correctly", () => {
    betScene.updateBetAmt();
    expect(betScene.dealButton.visible).toBe(true);
    expect(betScene.betAmount.text).toBe(`BET: € ${Model.curBet}`);
  });

  test("updateBal updates balance correctly", () => {
    betScene.updateBal();
    expect(betScene.balance.text).toBe(
      `BANK: € ${Model.balance - Model.curBet}`
    );
  });

  test("createChips creates chips correctly", () => {
    betScene.createChips();

    expect(betScene.chipsContainer.addChild).toHaveBeenCalledTimes(5);
    expect(betScene.chipsContainer.addChild.mock.calls[0][0]).toBeInstanceOf(
      PIXI.Sprite
    );
    expect(betScene.chipsContainer.children.length).toBe(5);
    expect(betScene.chipsContainer.children[0].interactive).toBe(true);
    expect(betScene.chipsContainer.children[0].buttonMode).toBe(true);
    expect(betScene.chipsContainer.children[0].width).toBe(150);
    expect(betScene.chipsContainer.children[0].height).toBe(150);
    expect(betScene.chipsContainer.children[0].tint).toBe(0xff9900);
    expect(betScene.chipsContainer.children[0].x).toBe(0);
    expect(betScene.chipsContainer.children[0].y).toBe(Model.app.height / 2);

    expect(betScene.chipsContainer.children[0].on).toHaveBeenCalledTimes(1);
    expect(betScene.chipsContainer.children[0].on.mock.calls[0][0]).toBe(
      "pointerdown"
    );
    expect(
      betScene.chipsContainer.children[0].on.mock.calls[0][1]
    ).toBeInstanceOf(Function);
  });

  test("handleDealButtonClick initiates game correctly", () => {
    betScene.handleDealButtonClick();

    expect(Model.gameScene.create).toHaveBeenCalledTimes(1);
    expect(Model.gameStage.addChild).toHaveBeenCalledWith(Model.gameScene);
    expect(Model.gameStage.removeChild).toHaveBeenCalledWith(Model.betScene);
    expect(Model.gameScene.removeChild).toHaveBeenCalledWith(
      Model.gameScene.resultBoard
    );
    expect(Model.gameScene.showStartButton).toHaveBeenCalledWith(false);
    expect(Model.gameScene.userCount).toBe(0);
    expect(Model.gameScene.dealerCount).toBe(0);
    expect(Model.gameScene.clearTable).toHaveBeenCalledTimes(1);
    expect(gsap.delayedCall).toHaveBeenCalledWith(
      0.6,
      Model.gameScene.startNewGame.bind(Model.gameScene)
    );
  });

  test("resumeScene resumes or pauses scene correctly", () => {
    betScene.resumeScene();
    expect(Model.gameScene.visible).toBe(true);

    betScene.resumeScene(false);
    expect(Model.gameScene.visible).toBe(false);
  });
});
