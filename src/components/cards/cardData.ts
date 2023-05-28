// cardData.ts

import * as PIXI from "pixi.js";

export const CARD_WIDTH = 94.2;
export const CARD_HEIGHT = 148;
export const GAP = 2;

export const suits = ["clubs", "diamonds", "hearts", "spades", "empty"];
export const ranks = [
  "A",
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
];

export function getCardTextureRectangle(cardName: string): PIXI.Rectangle {
  const [rank, suit] = splitCardName(cardName);

  const rowIndex = suits.indexOf(suit);
  const columnIndex = ranks.indexOf(rank);

  if (rowIndex === -1 || columnIndex === -1) {
    throw new Error(`Invalid card name: ${cardName}`);
  }

  const x = columnIndex * (CARD_WIDTH + GAP);
  const y = rowIndex * (CARD_HEIGHT + GAP);

  return new PIXI.Rectangle(x, y, CARD_WIDTH, CARD_HEIGHT);
}

export function splitCardName(name: string): string[] {
  let segments = name.split("-"); // Split the string into segments
  let rank = segments[0]; // Get the first segment
  let suit = segments[1]; // Get the second segment

  return [rank, suit];
}
