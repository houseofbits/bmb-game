import _ from "lodash";
import { DifficultyLevel } from "@src/helpers/difficultyLevelConstants";

export function generateSerialNumber(difficultyLevel: DifficultyLevel): string {
  const alphabet = "abcdefghijklmnopqrstuvwxyz";

  let letters = generateFirstLetter();
  for (let i = 0; i < 2; i++) {
    letters += "O"; //alphabet[Math.floor(Math.random() * alphabet.length)];
  }

  const min = 1000;
  const max = 9999;
  const numbers = Math.floor(Math.random() * (max - min + 1)) + min;

  return letters.toUpperCase() + "-" + numbers;
}

function generateFirstLetter(): string {
  const letters = ["B", "M", "H"];

  return letters[_.random(letters.length - 1)];
}
