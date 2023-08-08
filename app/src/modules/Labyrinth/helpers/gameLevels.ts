import { DifficultyLevel } from "@src/helpers/difficultyLevelConstants";
import gameLevelsEasy from "@src/modules/Labyrinth/helpers/gameLevelsEasy";
import LabyrinthGame from "@src/modules/Labyrinth/structures/LabyrinthGame";
import _ from "lodash";

const gameLevels = {
  [DifficultyLevel.EASY]: gameLevelsEasy,
  [DifficultyLevel.AVERAGE]: [],
  [DifficultyLevel.HARD]: [],
  [DifficultyLevel.IMPOSSIBLE]: [],
};

export function getRandomGameLevel(
  difficulty: DifficultyLevel,
): LabyrinthGame | null {
  if (gameLevels[difficulty].length > 0) {
    const index = _.random(0, gameLevels[difficulty].length - 1);

    return gameLevels[difficulty][index];
  }

  return null;
}
