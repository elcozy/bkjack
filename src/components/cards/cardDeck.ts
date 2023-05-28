import * as PIXI from "pixi.js";
import { Card } from "./Card";

export class CardDeck extends PIXI.Container {
  private deckSize: number = 52;
  private suits: string[] = ["hearts", "diamonds", "spades", "clubs"];
  private cardFaces: string[] = [
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "J",
    "Q",
    "K",
    "A",
  ];
  private cards: Card[] = [];
  private deckCardCount: PIXI.Text;
  constructor() {
    super();
    this.createDeck();
    this.shuffleDeckCards();
    this.deckCardCount = this.createRemainingCardsText();
    this.addChild(this.deckCardCount);
  }

  private createRemainingCardsText(): PIXI.Text {
    const textStyle = new PIXI.TextStyle({
      fontFamily: "Arial",
      fontSize: 16,
      fill: "#FFFFFF",
      align: "center",
    });

    const text = new PIXI.Text(`Cards Left: ${this.cards.length}`, textStyle);
    text.position.set(20, 200);

    return text;
  }

  public shuffleDeckCards() {
    for (let i = 0; i < this.deckSize / 2; i++) {
      const randomPosition = Math.floor(Math.random() * this.cards.length);
      const card = this.cards.splice(randomPosition, 1)[0];
      this.cards.push(card);
      this.addChild(card);
    }
    this.organizeDeck();
  }

  private organizeDeck() {
    for (let i = 0; i < this.cards.length; i++) {
      const card = this.cards[i];
      card.x = 0.4 * i;
      card.y = -0.1 * i;
    }
  }

  private createDeck() {
    for (let i = 0; i < this.deckSize; i++) {
      const name =
        this.cardFaces[i % this.cardFaces.length] +
        "-" +
        this.suits[Math.floor(i / this.cardFaces.length)];
      const card = new Card(name);
      card.x = 0.4 * i;
      card.y = -0.1 * i;

      this.cards.push(card);
    }
  }
  setChildInd(child: PIXI.DisplayObject, index: number): void {
    this.setChildIndex(child, index);
  }
  drawCard(): Card {
    this.deckCardCount.text = `Cards Left: ${this.cards.length}`;

    return this.cards.pop();
  }

  returnCard(card: Card) {
    this.cards.push(card);
    this.addChild(card);
  }

  reset() {
    this.shuffleDeckCards();
  }
}
