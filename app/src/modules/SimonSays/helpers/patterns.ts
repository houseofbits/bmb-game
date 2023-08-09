import { DifficultyLevel } from "@src/helpers/difficultyLevelConstants";
import patternsEasy from "@src/modules/SimonSays/helpers/patternsEasy";
import patternsAverage from "@src/modules/SimonSays/helpers/patternsAverage";
import patternsHard from "@src/modules/SimonSays/helpers/patternsHard";
import patternsImpossible from "@src/modules/SimonSays/helpers/patternsImpossible";
import { SimonSaysPatternStructure } from "@src/modules/SimonSays/structures/SimonSaysPatternStructure";
import _ from "lodash";

const patterns = {
  [DifficultyLevel.EASY]: patternsEasy,
  [DifficultyLevel.AVERAGE]: patternsAverage,
  [DifficultyLevel.HARD]: patternsHard,
  [DifficultyLevel.IMPOSSIBLE]: patternsImpossible,
};

export default function getRandomPattern(
  difficulty: DifficultyLevel,
): SimonSaysPatternStructure {
  const pos = _.random(0, patterns[difficulty].length - 1);
  return patterns[difficulty][pos];
}
