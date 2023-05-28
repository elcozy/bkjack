import { gsap } from "gsap";
import { GameScene } from "../../scenes/GameScene";
import { Model } from "../../Model";
import { CardDeck } from "../../components/cards/cardDeck";
import { SharedButton } from "../../components/buttons";
import { ScoreBoard } from "../../components/ScoreBoard";

describe("GameScene", () => {
  let gameScene;

  beforeEach(() => {
    gameScene = new GameScene();
    Model.curBet = 10;
    Model.balance = 1000;
  });

  test("initializes GameScene correctly", () => {
    expect(gameScene.deck).toBeInstanceOf(CardDeck);
    expect(gameScene.userCount).toBe(0);
    expect(gameScene.dealerCount).toBe(0);
    expect(gameScene.userCountText).toBeInstanceOf(PIXI.Text);
    expect(gameScene.dealerCountText).toBeInstanceOf(PIXI.Text);
    expect(gameScene.startButton).toBeInstanceOf(SharedButton);
    expect(gameScene.standButton).toBeInstanceOf(SharedButton);
    expect(gameScene.hitButton).toBeInstanceOf(SharedButton);
    expect(gameScene.betPlusButton).toBeInstanceOf(PIXI.Container);
    expect(gameScene.resultBoard).toBeInstanceOf(ScoreBoard);
    expect(gameScene.curCardIndx).toBe(0);
    expect(gameScene.betText).toBeInstanceOf(PIXI.Text);
    expect(gameScene.balanceDisplay).toBeInstanceOf(PIXI.Text);
  });

  test("updateSelectedBet updates betText correctly", () => {
    gameScene.updateSelectedBet();
    expect(gameScene.betText.text).toBe(` | BET: € ${Model.curBet}`);
  });

  test("create calls the expected methods and initializes game", () => {
    gameScene.deck = {
      x: 0,
      y: 0,
      shuffleDeckCards: jest.fn(),
      drawCard: jest.fn(),
      addChildAt: jest.fn(),
      returnCard: jest.fn(),
    };
    gameScene.clearTable = jest.fn();
    gameScene.startNewGame = jest.fn();
    gameScene.showStartButton = jest.fn();
    gameScene.showuserDealerTextCount = jest.fn();

    gameScene.create();

    expect(gameScene.deck.shuffleDeckCards).toHaveBeenCalled();
    expect(gameScene.clearTable).toHaveBeenCalled();
    expect(gameScene.startNewGame).toHaveBeenCalled();
    expect(gameScene.showStartButton).toHaveBeenCalledWith(false);
    expect(gameScene.showuserDealerTextCount).toHaveBeenCalled();
  });

  test("startNewGame initializes game correctly", () => {
    gameScene.curCardIndx = 5;
    gameScene.updateBalanceMeter = jest.fn();
    gameScene.showStartButton = jest.fn();
    gameScene.showuserDealerTextCount = jest.fn();
    gameScene.deck = {
      shuffleDeckCards: jest.fn(),
    };

    gameScene.startNewGame();

    expect(gameScene.curCardIndx).toBe(0);
    expect(Model.placeBet).toHaveBeenCalled();
    expect(gameScene.updateBalanceMeter).toHaveBeenCalled();
    expect(gameScene.showStartButton).toHaveBeenCalledWith(false);
    expect(gameScene.showuserDealerTextCount).toHaveBeenCalled();
    expect(gameScene.deck.shuffleDeckCards).toHaveBeenCalled();
    expect(gameScene.shareCards).toHaveBeenCalled();
  });

  test("clearTable hides cards and returns them to the deck", () => {
    const dealerCard1 = { hideCard: jest.fn() };
    const dealerCard2 = { hideCard: jest.fn() };
    const userCard1 = { hideCard: jest.fn() };
    const userCard2 = { hideCard: jest.fn() };
    gameScene.dealerCards = [dealerCard1, dealerCard2];
    gameScene.userCards = [userCard1, userCard2];
    gameScene.deck = {
      returnCard: jest.fn(),
    };

    gameScene.clearTable();

    expect(dealerCard1.hideCard).toHaveBeenCalled();
    expect(dealerCard2.hideCard).toHaveBeenCalled();
    expect(userCard1.hideCard).toHaveBeenCalled();
    expect(userCard2.hideCard).toHaveBeenCalled();
    expect(gameScene.deck.returnCard).toHaveBeenCalledWith(dealerCard1);
    expect(gameScene.deck.returnCard).toHaveBeenCalledWith(dealerCard2);
    expect(gameScene.deck.returnCard).toHaveBeenCalledWith(userCard1);
    expect(gameScene.deck.returnCard).toHaveBeenCalledWith(userCard2);
  });
});
