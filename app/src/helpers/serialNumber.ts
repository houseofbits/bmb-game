import _ from "lodash";
import { DifficultyLevel } from "@src/helpers/difficultyLevelConstants";

export enum SerialNumberVariationId {
  ID_A,
  ID_B,
  ID_C,
}

const FIRST_LETTER_CHARACTERS = {
  [SerialNumberVariationId.ID_A]: "B",
  [SerialNumberVariationId.ID_B]: "M",
  [SerialNumberVariationId.ID_C]: "H",
};

const SECOND_LETTER_CHARACTERS = {
  [SerialNumberVariationId.ID_A]: "G",
  [SerialNumberVariationId.ID_B]: "K",
  [SerialNumberVariationId.ID_C]: "J",
};

export class SerialNumber {
  variations: Array<SerialNumberVariationId> = [
    SerialNumberVariationId.ID_A,
    SerialNumberVariationId.ID_A,
    SerialNumberVariationId.ID_A,
  ];

  isFirstDigitOdd: boolean = false;

  getFirstLetterVariation(): SerialNumberVariationId {
    return this.variations[0];
  }

  getSecondLetterVariation(): SerialNumberVariationId {
    return this.variations[1];
  }
}

export function generateSerialNumber(difficultyLevel: DifficultyLevel): string {
  let letters = "";
  letters += getRandomCharacter(FIRST_LETTER_CHARACTERS);
  letters += getRandomCharacter(SECOND_LETTER_CHARACTERS);
  // letters += "O";

  const min = 1000;
  const max = 9999;
  const numbers = Math.floor(Math.random() * (max - min + 1)) + min;

  return letters.toUpperCase() + "-" + numbers;
}

export function decodeSerialNumber(serialNumber: string): SerialNumber {
  const serialNumberStructure = new SerialNumber();
  const charactersArray = serialNumber.split("");
  serialNumberStructure.variations[0] = getVariation(
    FIRST_LETTER_CHARACTERS,
    charactersArray[0],
  );
  serialNumberStructure.variations[1] = getVariation(
    SECOND_LETTER_CHARACTERS,
    charactersArray[1],
  );

  serialNumberStructure.isFirstDigitOdd = !Number.isInteger(
    parseInt(charactersArray[3]) / 2,
  );

  return serialNumberStructure;
}

function getVariation(
  letters: object,
  character: string,
): SerialNumberVariationId {
  const keys = Object.keys(letters);
  const values = Object.values(letters);

  const index = values.findIndex((val) => val === character);
  if (index != undefined) {
    return <SerialNumberVariationId>Number(keys[index]);
  }

  return SerialNumberVariationId.ID_A;
}

function getRandomCharacter(letters: object): string {
  const values = Object.values(letters);
  return values[_.random(values.length - 1)];
}
