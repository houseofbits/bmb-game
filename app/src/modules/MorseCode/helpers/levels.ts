import { DifficultyLevel } from "@src/helpers/difficultyLevelConstants";
import _ from "lodash";
import Alphabet from "@src/modules/MorseCode/helpers/alphabet";

const NumberOfCharactersInQuestion: { [id: number]: number } = {
  [DifficultyLevel.EASY]: 2,
  [DifficultyLevel.AVERAGE]: 3,
  [DifficultyLevel.HARD]: 4,
  [DifficultyLevel.IMPOSSIBLE]: 5,
};

/**
 * Generate string of random letters, answer is the least significant letter in alphabet.
 * @param difficulty
 */
function generateLevel(difficulty: DifficultyLevel): {
  question: string;
  answer: string;
} {
  const letters = Object.keys(Alphabet);
  const letterSet = [];
  for (let i = 0; i < NumberOfCharactersInQuestion[difficulty]; i++) {
    letterSet.push(letters[_.random(0, letters.length - 1)]);
  }

  const question = _.shuffle(letterSet).join("");
  const answer = letterSet.reduce(function (p, v) {
    return p < v ? p : v;
  });

  return {
    question,
    answer,
  };
}

export default function getRandomLevel(difficulty: DifficultyLevel) {
  return generateLevel(difficulty);
}
