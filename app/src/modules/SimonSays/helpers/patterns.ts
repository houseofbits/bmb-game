import {DifficultyLevel} from "@src/helpers/difficultyLevelConstants";
import {SimonSaysColor, SimonSaysPatternStructure} from "@src/modules/SimonSays/structures/SimonSaysPatternStructure";

export default {
    [DifficultyLevel.TUTORIAL]: [
        [
            new SimonSaysPatternStructure(SimonSaysColor.RED, [SimonSaysColor.GREEN, SimonSaysColor.RED, SimonSaysColor.YELLOW, SimonSaysColor.BLUE]),
            new SimonSaysPatternStructure(SimonSaysColor.GREEN, [SimonSaysColor.BLUE, SimonSaysColor.RED]),
        ],
    ],
    [DifficultyLevel.EASY]: [],
    [DifficultyLevel.AVERAGE]: [],
    [DifficultyLevel.HARD]: [],
    [DifficultyLevel.IMPOSSIBLE]: [],
};