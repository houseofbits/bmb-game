import TimerModule from "@src/modules/Timer/components/TimerModule.vue";
import SimonSaysModule from "@src/modules/SimonSays/components/SimonSaysModule.vue";
import WireMatcherModule from "@src/modules/WireMatcher/components/WireMatcherModule.vue";
import LabyrinthModule from "@src/modules/Labyrinth/components/LabyrinthModule.vue";
import NumberDecoderModule from "@src/modules/NumberDecoder/components/NumberDecoderModule.vue";
import MorseCodeModule from "@src/modules/MorseCode/components/MorseCodeModule.vue";
import PlaceholderModule from "@src/components/PlaceholderModule.vue";
import { markRaw } from "vue";
import { DifficultyLevel } from "@src/helpers/difficultyLevelConstants";

export const moduleDefinition = [
  {
    name: "timer",
    title: "Timer with card scanner",
    description: "Main module with the countdown timer and game mode selector",
    imageUrl: "https://picsum.photos/200/300",
    component: TimerModule,
    maxCompletionTime: {
      [DifficultyLevel.ANY]: 5,
    },
  },
  {
    name: "simonSays",
    title: "Simon Says",
    description: "Observe the pattern and select the correct color",
    imageUrl: "https://picsum.photos/200/300",
    component: SimonSaysModule,
    maxCompletionTime: {
      [DifficultyLevel.EASY]: 40,
      [DifficultyLevel.ANY]: 90,
    },
  },
  {
    name: "wireMatcher",
    title: "Match the wires",
    description: "Match the correct connection from Port-A to Port-B",
    imageUrl: "https://picsum.photos/200/300",
    component: WireMatcherModule,
    maxCompletionTime: {
      [DifficultyLevel.ANY]: 90,
    },
  },
  {
    name: "labyrinth",
    title: "Labyrinth",
    description: "Negotiate the correct path to the endpoint",
    imageUrl: "https://picsum.photos/200/300",
    component: LabyrinthModule,
    maxCompletionTime: {
      [DifficultyLevel.ANY]: 90,
    },
  },
  {
    name: "numberDecoder",
    title: "Decode the pin code",
    description: "Guess the correct pincode",
    imageUrl: "https://picsum.photos/200/300",
    component: NumberDecoderModule,
    maxCompletionTime: {
      [DifficultyLevel.EASY]: 30,
      [DifficultyLevel.ANY]: 90,
    },
  },
  {
    name: "morseCode",
    title: "Morse code module",
    description: "",
    imageUrl: "https://picsum.photos/200/300",
    component: MorseCodeModule,
    maxCompletionTime: {
      [DifficultyLevel.ANY]: 90,
    },
  },
  {
    name: "placeholder",
    title: "Placeholder module",
    description: "Empty module",
    imageUrl: "https://picsum.photos/200/300",
    component: PlaceholderModule,
    maxCompletionTime: {
      [DifficultyLevel.ANY]: 0,
    },
  },
];

function getModuleDefinition(name: string): any {
  return moduleDefinition.find((def) => def.name === name);
}

export function getModuleComponent(name: string): any {
  const def = getModuleDefinition(name);
  if (def) {
    return markRaw(def.component);
  }
  return null;
}

export function getModuleMaxSolvingTime(
  moduleName: string,
  difficulty: DifficultyLevel,
): number {
  const def = getModuleDefinition(moduleName);
  if (def) {
    return (
      def?.maxCompletionTime[difficulty] ||
      def?.maxCompletionTime[DifficultyLevel.ANY]
    );
  }

  return 0;
}