import * as PIXI from "pixi.js";
import { gsap } from "gsap";

export class ScoreBoard extends PIXI.Container {
  private button: PIXI.Sprite;
  private buttonText: PIXI.Text;
  private onClick: () => void;
  private defaultTexture = PIXI.Texture.from("assets/assets/img/bg-btn.png");
  private defaultTextStyle = new PIXI.TextStyle({
    fontFamily: "Chakra Petch",
    fontSize: 60,
    fill: "#fff",
    lineJoin: "round",
    fontWeight: "bold",
  });
  private posX: number;
  private posY: number;
  private zoomAnimation: gsap.core.Tween;

  constructor(text: string, onClick?: () => void) {
    super();
    this.posX = 1920 / 2;
    this.posY = 1072 / 2;

    // Create the gray background sprite
    const bg = new PIXI.Graphics();
    bg.beginFill(0x808080, 0.2);
    bg.drawRect(-1920 / 2, -1072 / 2, 1920, 1080);
    bg.endFill();
    this.addChild(bg);

    this.button = new PIXI.Sprite(this.defaultTexture);
    this.button.anchor.set(0.5);
    this.addChild(this.button);
    this.button.tint = 0xff00ff;
    this.button.scale.set(1.3);
    this.buttonText = new PIXI.Text(text, this.defaultTextStyle);
    this.buttonText.anchor.set(0.5);
    this.button.addChild(this.buttonText);

    this.onClick = onClick;

    this.button.interactive = true;
    this.button.buttonMode = true;

    this.button.on("pointerover", this.onButtonHover);
    this.button.on("pointerout", this.onButtonOut);
    this.button.on("pointerdown", this.onButtonClick);

    this.position.set(this.posX, this.posY);

    this.animateZoom();
  }

  private animateZoom() {
    this.zoomAnimation = gsap.to(this.button.scale, {
      x: 1.1,
      y: 1.1,
      duration: 0.5,
      yoyo: true,
      repeat: -1,
      ease: "power1.inOut",
      paused: true,
    });
    this.zoomAnimation.play();
  }

  private onButtonHover = () => {
    this.zoomAnimation.pause();
  };

  private onButtonOut = () => {
    this.zoomAnimation.play();
  };

  private onButtonClick = () => {
    this.visible = false;

    if (this.onClick) {
      this.onClick();
    }
  };

  public updateText(text: string) {
    this.buttonText.text = text;
  }
}
