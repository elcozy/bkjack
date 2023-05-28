import * as PIXI from "pixi.js";

export class SharedButton extends PIXI.Container {
  private button: PIXI.Sprite;
  private buttonText: PIXI.Text;
  private onClick: () => void;
  private defaultTexture = PIXI.Texture.from("img/bg-btn.png");
  private defaultTextStyle = new PIXI.TextStyle({
    fontFamily: "Chakra Petch",
    fontSize: 60,
    fill: "#000000",
    lineJoin: "round",
    fontWeight: "bold",
  });
  private posX: number;
  private posY: number;
  constructor(
    x: number,
    y: number,
    text: string,
    onClick: () => void,
    overrideTexture?: PIXI.Texture,
    overrideTextStyle?: PIXI.TextStyle
  ) {
    super();
    this.posX = x;
    this.posY = y;
    this.button = new PIXI.Sprite(overrideTexture || this.defaultTexture);
    this.button.anchor.set(0.5);
    this.addChild(this.button);
    const mergedTextStyle = new PIXI.TextStyle(
      Object.assign({}, this.defaultTextStyle, overrideTextStyle)
    );

    this.buttonText = new PIXI.Text(text, mergedTextStyle);
    this.buttonText.anchor.set(0.5);
    this.button.addChild(this.buttonText);

    this.onClick = onClick;

    this.button.interactive = true;
    this.button.buttonMode = true;

    this.button.on("pointerover", this.onButtonHover);
    this.button.on("pointerout", this.onButtonOut);
    this.button.on("pointerdown", this.onButtonClick);

    this.position.set(this.posX, this.posY);
  }

  private onButtonHover = () => {
    this.button.scale.set(1.1);
  };

  private onButtonOut = () => {
    this.button.scale.set(1);
  };

  private onButtonClick = () => {
    if (this.onClick) {
      this.onClick();
    }
  };
}
