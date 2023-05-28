// Card.ts

import * as PIXI from "pixi.js";
import { CardSprites } from "./CardSprites";
import gsap from "gsap";

export class Card extends PIXI.Container {
  private cardName: string;
  private cardSprites: CardSprites;
  private cardWidth: number;
  constructor(cardName: string, isVisible: boolean = false) {
    super();
    this.cardName = cardName;
    this.cardSprites = new CardSprites(cardName, isVisible);
    this.cardWidth = this.cardSprites.cardFaceSprite.width;
    this.createCard();
  }

  private createCard() {
    this.cardSprites.cardBaseSprite.anchor.set(0.5);
    this.cardSprites.cardFaceSprite.anchor.set(0.5);
    this.addChild(
      this.cardSprites.cardBaseSprite,
      this.cardSprites.cardFaceSprite
    );
  }

  public revealCard() {
    if (!this.cardSprites.cardFaceSprite.visible) {
      this.flipCard();
    }
  }

  get cardVisible() {
    return !!this.cardSprites.cardFaceSprite.visible;
  }
  public hideCard() {
    if (this.cardSprites.cardFaceSprite.visible) {
      this.flipCard();
    }
  }

  private flipCard() {
    let timeline = gsap.timeline();
    timeline
      .to(this, {
        width: 0,
        duration: 0.09,
        onComplete: () => this.cardSprites.toggleCardFaceVisibility(),
      })
      .to(this, { width: this.cardWidth, duration: 0.09 });
  }

  get cardValue() {
    const cardFace = this.cardName.split("-")[0];
    const valueLookup: { [key: string]: number } = {
      A: 11,
      K: 10,
      Q: 10,
      J: 10,
    };
    const value = valueLookup[cardFace] || parseInt(cardFace);
    return value || 0;
  }

  reset() {}
}
