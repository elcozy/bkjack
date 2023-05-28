import * as PIXI from "pixi.js";
import { getCardTextureRectangle } from "./cardData";

export class CardSprites {
  public cardBaseSprite: PIXI.Sprite;
  public cardFaceSprite: PIXI.Sprite;
  public isCardVisible: boolean;

  constructor(cardName: string, isVisible: boolean = true) {
    const baseTexture = PIXI.BaseTexture.from("img/cards.png");
    this.isCardVisible = isVisible;

    const backTexture = new PIXI.Texture(
      baseTexture,
      getCardTextureRectangle("3-empty")
    );
    this.cardBaseSprite = new PIXI.Sprite(backTexture);

    const faceTexture = new PIXI.Texture(
      baseTexture,
      getCardTextureRectangle(cardName)
    );
    this.cardFaceSprite = new PIXI.Sprite(faceTexture);

    this.setupCardSprites();
  }

  private setupCardSprites() {
    this.cardBaseSprite.scale.set(2.6);
    this.cardFaceSprite.scale.set(2.6);
    this.cardFaceSprite.visible = this.isCardVisible;
    this.cardBaseSprite.visible = !this.isCardVisible;
  }

  public toggleCardFaceVisibility() {
    this.cardFaceSprite.visible = !this.cardFaceSprite.visible;
    this.cardBaseSprite.visible = !this.cardFaceSprite.visible;
  }

  public getCardBaseSprite(): PIXI.Sprite {
    return this.cardBaseSprite;
  }

  public getCardFaceSprite(): PIXI.Sprite {
    return this.cardFaceSprite;
  }
}
