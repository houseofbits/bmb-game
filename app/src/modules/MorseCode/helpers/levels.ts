import { DifficultyLevel } from "@src/helpers/difficultyLevelConstants";
import _ from "lodash";

const Levels = [
  { question: "AB", answer: "A" },
  { question: "BC", answer: "B" },
  { question: "CD", answer: "C" },
];

export default function getRandomLevel(difficulty: DifficultyLevel) {
  return Levels[_.random(0, Levels.length - 1)];
}
