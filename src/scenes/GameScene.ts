import { StartButton } from "../components/buttons/StartButton";
import { ScoreBoard } from "../components/ScoreBoard";
import { CardDeck } from "../components/cards/cardDeck";
import * as PIXI from "pixi.js";
import { Card } from "../components/cards/Card";
import { SharedButton } from "../components/buttons/SharedButton";
import { Model } from "../Model";
import { BetPlusButton, HitButton, StandButton } from "../components/buttons";
import { gsap } from "gsap";

export class GameScene extends PIXI.Container {
  public tableWidth: number = 1920;
  public tableHeight: number = 1080;
  public deck: CardDeck = new CardDeck();

  public dealerCards: Card[] = [];
  public userCards: Card[] = [];

  public userCount: number = 0;
  public dealerCount: number = 0;

  private userCountText: PIXI.Text;
  private dealerCountText: PIXI.Text;

  private cardXCoordinate: number = 750;
  private dealerCardYCoordinate: number = 0;
  private playerCardYCoordinate: number = 550;
  private cardSpacing: number = 80;

  public startButton: SharedButton;
  public standButton: SharedButton;
  public hitButton: SharedButton;
  public betPlusButton: PIXI.Container;

  public resultBoard: ScoreBoard;
  private curCardIndx: number = 0;
  private betText: PIXI.Text;
  private balanceDisplay: PIXI.Text;

  constructor() {
    super();

    this.createButtons();
    this.createBalanceText();
    this.updateBalanceMeter();
    this.createUserDealerTextCount();

    this.betText = new PIXI.Text(
      ` | BET: € ${Model.curBet}`,
      new PIXI.TextStyle({
        fontFamily: "Chakra Petch",
        fontSize: 40,
        fill: "#ff3e5f",
        lineJoin: "round",
        fontWeight: "bold",
      })
    );
    this.betText.anchor.set(0.5, 0);
    this.betText.x = 450;
    this.betText.y = 10;

    this.addChild(this.betText);
    this.resultBoard = new ScoreBoard("");
  }

  public updateSelectedBet() {
    this.betText.text = ` | BET: € ${Model.curBet}`;
  }

  public create() {
    this.deck.x = 150;
    this.deck.y = 290;
    this.addChild(this.deck);

    this.showStartButton();
    this.showAddBetButton(false);
    this.showHitAndStandCommands(false);

    this.addChild(this.resultBoard);
    this.resultBoard.visible = false;

    //start game
    this.showStartButton(false);
    this.userCount = 0;
    this.dealerCount = 0;
    if (this.dealerCards.length > 0) {
      this.clearTable();
      gsap.delayedCall(0.6, this.startNewGame.bind(this));
    } else {
      this.startNewGame();
    }
  }

  public startNewGame() {
    this.curCardIndx = 0;
    Model.placeBet();
    this.updateBalanceMeter();
    this.showStartButton(false);
    this.showuserDealerTextCount();
    this.deck.shuffleDeckCards();
    this.shareCards();
  }

  private createButtons() {
    const startBtn = new StartButton(this);
    this.startButton = startBtn.startBtn;
    const standBtn = new StandButton(this);
    this.standButton = standBtn.standBtn;
    const hitBtn = new HitButton(this);
    this.hitButton = hitBtn.hitBtn;
    const betPlusBtn = new BetPlusButton(this);
    this.betPlusButton = betPlusBtn.chipsContainer;
  }

  public showuserDealerTextCount(active: boolean = true) {
    this.userCountText.visible = active;
    this.userCountText.interactive = active;

    this.dealerCountText.visible = active;
    this.dealerCountText.interactive = active;
  }

  private createUserDealerTextCount() {
    this.userCountText = new PIXI.Text(
      `${this.userCount} - USER`,
      new PIXI.TextStyle({
        fontFamily: "Chakra Petch",
        fontSize: 60,
        fill: "#f9c95f",
        lineJoin: "round",
        fontWeight: "bold",
      })
    );

    this.addChild(this.userCountText);
    this.userCountText.x = this.tableWidth / 2 + this.tableWidth / 2 / 2;
    this.userCountText.y = this.tableHeight / 2 + this.tableHeight / 2 / 2;

    this.dealerCountText = new PIXI.Text(
      `${this.dealerCount} - DEALER`,
      new PIXI.TextStyle({
        fontFamily: "Chakra Petch",
        fontSize: 60,
        fill: "#f9c95f",
        lineJoin: "round",
        fontWeight: "bold",
      })
    );

    this.addChild(this.dealerCountText);
    this.dealerCountText.x = this.tableWidth / 2 + this.tableWidth / 2 / 2;
    this.dealerCountText.y = this.tableHeight / 2 - this.tableHeight / 2 / 2;

    this.showuserDealerTextCount(false);
  }

  private createBalanceText() {
    this.balanceDisplay = new PIXI.Text(
      "1000",
      new PIXI.TextStyle({
        fontFamily: "Chakra Petch",
        fontSize: 40,
        fill: "#f9c95f",
        lineJoin: "round",
        fontWeight: "bold",
      })
    );

    this.addChild(this.balanceDisplay);
    this.balanceDisplay.x = 10;
    this.balanceDisplay.y = 10;
  }

  public clearTable() {
    this.resultBoard.updateText("");
    this.resultBoard.visible = false;
    for (let i = 0; i < this.dealerCards.length; i++) {
      this.dealerCards[i].hideCard();
    }
    for (let i = 0; i < this.userCards.length; i++) {
      this.userCards[i].hideCard();
    }

    while (this.dealerCards.length > 0) {
      const card = this.dealerCards.pop();
      if (card) {
        this.deck.returnCard(card);
        gsap.to(card, { x: 0, y: 0, duration: 0.2 });
      }
    }
    while (this.userCards.length > 0) {
      const card = this.userCards.pop();
      if (card) {
        this.deck.returnCard(card);
        gsap.to(card, { x: 0, y: 0, duration: 0.2 });
      }
    }
  }

  private playDealerHitSequence() {
    const card = this.deck.drawCard();
    this.curCardIndx++;
    this.deck.addChildAt(card, this.curCardIndx);

    card.revealCard();
    this.updateDealerCount(card.cardValue);

    this.dealerCards.push(card);
    // this.addToDealerCards(card)

    gsap.to(card, {
      x:
        this.cardXCoordinate + (this.dealerCards.length - 1) * this.cardSpacing,
      y: this.dealerCardYCoordinate,
      duration: 0.4,
      onComplete: this.revealDealerHitResult.bind(this),
    });
  }

  public revealDealerHitResult() {
    for (let i = 0; i < this.dealerCards.length; i++) {
      this.dealerCards[i].revealCard();
      if (!this.dealerCards[i].cardVisible)
        this.updateDealerCount(this.dealerCards[i].cardValue);
    }

    setTimeout(() => {
      this.verifyDealerGameOver();
    }, 200);
  }

  private verifyDealerGameOver() {
    let playerCardCount = this.checkCardResult(this.userCards);
    let dealerCardCount = this.checkCardResult(this.dealerCards);

    if (dealerCardCount <= 21 && dealerCardCount > playerCardCount) {
      this.resultBoard.updateText("DEALER WON :(");
      this.resultBoard.visible = true;
      this.showHitAndStandCommands(false);
      setTimeout(() => {
        this.showStartButton();
      }, 500);
    } else if (dealerCardCount > 21) {
      this.resultBoard.updateText("YOU WIN");
      this.resultBoard.visible = true;

      Model.addWins(Model.curBet * 2);
      this.updateBalanceMeter();
      this.showHitAndStandCommands(false);
      setTimeout(() => {
        this.showStartButton();
      }, 500);
    } else {
      this.playDealerHitSequence();
    }
  }

  public dealCardToPlayer() {
    this.showHitAndStandCommands(false);
    const card = this.deck.drawCard();
    this.curCardIndx++;
    this.deck.addChildAt(card, this.curCardIndx);

    card.revealCard();
    this.updateUserCount(card.cardValue);
    this.userCards.push(card);

    gsap.to(card, {
      x: this.cardXCoordinate + (this.userCards.length - 1) * this.cardSpacing,
      y: this.playerCardYCoordinate,
      duration: 0.4,
      onComplete: this.revealCard.bind(this),
    });
  }

  public showHitAndStandCommands(active: boolean = true) {
    this.hitButton.visible = active;
    this.standButton.visible = active;
    this.hitButton.interactive = active;
    this.standButton.interactive = active;
  }

  public showAddBetButton(active: boolean = true) {
    this.betPlusButton.visible = active;
    this.betPlusButton.interactive = active;
  }

  public showStartButton(active: boolean = true) {
    this.startButton.visible = active;
    this.startButton.interactive = active;
  }

  public shareCards() {
    const cardUserTiltAngle = -0.15;
    const cardDealerTiltAngle = 0.15;

    for (let i = 0; i < 2; i++) {
      const dealerCard = this.deck.drawCard();
      this.curCardIndx++;
      this.deck.addChildAt(dealerCard, this.curCardIndx);
      if (i === 1) {
        dealerCard.revealCard();
      }

      this.dealerCards.push(dealerCard);
      if (i === 1) {
        this.updateDealerCount(dealerCard.cardValue);
      }

      const userCard = this.deck.drawCard();
      userCard.revealCard();

      this.curCardIndx++;
      this.deck.addChildAt(userCard, this.curCardIndx);

      this.userCards.push(userCard);
      this.updateUserCount(userCard.cardValue);
    }

    for (let i = 0; i < this.dealerCards.length; i++) {
      const tiltDealer =
        cardDealerTiltAngle * (i - 0.5 * (this.dealerCards.length - 1));
      const tiltUser =
        cardUserTiltAngle * (i - 0.5 * (this.userCards.length - 1));

      const dealerCard = this.dealerCards[i];
      const userCard = this.userCards[i];

      gsap.to(dealerCard, {
        x: this.cardXCoordinate + i * this.cardSpacing,
        y: this.dealerCardYCoordinate,
        rotation: tiltDealer,
        duration: 0.4,
        delay: i * 0.4,
      });
      gsap.to(userCard, {
        x: this.cardXCoordinate + i * this.cardSpacing,
        y: this.playerCardYCoordinate,
        rotation: tiltUser,
        duration: 0.4,
        delay: i * 0.4,
      });
    }

    gsap.delayedCall(this.dealerCards.length * 0.4, this.revealCard.bind(this));
  }

  private updateUserCount(count: number) {
    this.userCount += count;

    this.userCountText.text = `${this.userCount} - USER`;
  }

  private updateDealerCount(count: number) {
    this.dealerCount += count;

    this.dealerCountText.text = `${this.dealerCount} - DEALER`;
  }

  private revealCard() {
    for (let i = 0; i < this.userCards.length; i++) {
      this.userCards[i].revealCard();
      if (!this.userCards[i].cardVisible)
        this.updateUserCount(this.userCards[i].cardValue);
    }
    this.dealerCards[1].revealCard();
    if (!this.dealerCards[1].cardVisible)
      this.updateDealerCount(this.dealerCards[1].cardValue);

    let playerCardCount = this.checkCardResult(this.userCards);
    if (playerCardCount < 21) {
      setTimeout(() => {
        this.showAddBetButton();
        this.showHitAndStandCommands();
      }, 500);
    } else {
      if (playerCardCount === 21) {
        if (this.userCards.length === 2) {
          this.resultBoard.updateText("YOU WIN");
          this.resultBoard.visible = true;

          Model.addWins(Model.curBet * 2);
          this.updateBalanceMeter();
          setTimeout(() => {
            this.showStartButton();
          }, 500);
        } else {
          setTimeout(() => {
            this.showAddBetButton();
            this.showHitAndStandCommands();
          }, 500);
        }
      } else {
        this.resultBoard.updateText("BUST - DEALER WIN");
        this.resultBoard.visible = true;

        this.updateControlOnGameEnd();
      }
    }
  }

  public updateBalanceMeter() {
    this.balanceDisplay.text = "BALANCE : € " + Model.balance;
  }
  private updateControlOnGameEnd() {
    this.showStartButton();
    this.showAddBetButton(false);
    this.showHitAndStandCommands(false);
  }

  private checkCardResult(cards: Card[]) {
    let aceCount = 0;
    let totalCardValue = 0;

    for (const card of cards) {
      const cardValue = card.cardValue;
      totalCardValue += cardValue;

      if (cardValue === 11) {
        aceCount++;
      }
    }

    if (aceCount > 0) {
      totalCardValue += aceCount - 1;
      totalCardValue += totalCardValue + 11 <= 21 ? 11 : 1;
    }

    return totalCardValue;
  }
}
