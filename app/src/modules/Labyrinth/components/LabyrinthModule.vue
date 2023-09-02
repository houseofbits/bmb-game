<script setup lang="ts">
import "@style/modules/labyrinth.scss";
import ModuleStatusIndicator from "@src/components/ModuleStatusIndicator.vue";
import { ref } from "vue";
import LabyrinthPoint from "@src/modules/Labyrinth/structures/LabyrinthPoint";
import {
  LabyrinthDirection,
  LabyrinthWallVariations,
} from "@src/modules/Labyrinth/structures/LabyrinthEnums";
import defineModuleState, {
  ModuleEmits,
  ModuleProps,
} from "@src/composables/defineModuleState";
import Frame from "@src/components/Frame.vue";
import { getRandomGameLevel } from "@src/modules/Labyrinth/helpers/gameLevels";
import LabyrinthGame from "@src/modules/Labyrinth/structures/LabyrinthGame";
// import getWallConfiguration from "@src/modules/Labyrinth/helpers/wallsDefinition";
import defineDebugState from "@src/composables/defineDebugState";

const emit = defineEmits(ModuleEmits);
const props = defineProps(ModuleProps);
const state = defineModuleState(props, emit);
const debugState = defineDebugState();

state.onArmed(armModule);
state.onReady(restartModule);
state.onFailed(freezeModule);

const BLINK_INTERVAL_MS = 600;
const OBSTACLE_BLINK_INTERVAL_MS = 300;

const screen = ref<Array<boolean>>(
  Array.apply(null, Array(8 * 8)).map(() => false),
);
const currentPoint = ref<LabyrinthPoint>(new LabyrinthPoint(0, 0));
const endingPoint = ref<LabyrinthPoint>(new LabyrinthPoint(7, 6));
let blinkTimerId: number;
let obstacleBlinkTimerId: number;
let gameLevel: LabyrinthGame | null = null;
let currentGameLevel: number = 0;
const strikeNumber = ref<number>(0);

function getLevelVariation(): LabyrinthWallVariations {
  if (props.serialNumber) {
    const firstLetter = props.serialNumber[0];
    switch (firstLetter) {
      case "B":
        return LabyrinthWallVariations.A;
      case "M":
        return LabyrinthWallVariations.B;
      case "H":
        return LabyrinthWallVariations.C;
    }
  }
  return LabyrinthWallVariations.A;
}

function armModule(): void {
  gameLevel = getRandomGameLevel(props.difficulty, getLevelVariation());
  if (gameLevel) {
    strikeNumber.value = 0;
    currentGameLevel = 0;
    currentPoint.value = gameLevel.startingPoint.getCopy();
    endingPoint.value = gameLevel
      .getLevel(currentGameLevel)
      .endingPoint.getCopy();

    screen.value[currentPoint.value.getArrayPosition()] = true;
    screen.value[endingPoint.value.getArrayPosition()] = true;
    startBlinking();
  }
}

function restartModule(): void {
  endBlinking();
  clearScreen();
}

function freezeModule(): void {}

function move(direction: LabyrinthDirection): void {
  if (!state.isArmed.value || state.isFailed.value) {
    return;
  }
  if (!gameLevel?.walls?.canCross(direction, currentPoint.value)) {
    failModule();
    return;
  }

  screen.value[currentPoint.value.getArrayPosition()] = false;

  switch (direction) {
    case LabyrinthDirection.UP:
      if (currentPoint.value.y > 0) {
        currentPoint.value.y--;
      }
      break;
    case LabyrinthDirection.DOWN:
      if (currentPoint.value.y < 7) {
        currentPoint.value.y++;
      }
      break;
    case LabyrinthDirection.LEFT:
      if (currentPoint.value.x > 0) {
        currentPoint.value.x--;
      }
      break;
    case LabyrinthDirection.RIGHT:
      if (currentPoint.value.x < 7) {
        currentPoint.value.x++;
      }
      break;
  }

  if (gameLevel?.getLevel(currentGameLevel).isObstacle(currentPoint.value)) {
    failModule();
    return;
  }

  screen.value[currentPoint.value.getArrayPosition()] = true;

  checkSolved();
}

function failModule(): void {
  strikeNumber.value++;
  if (strikeNumber.value > 2) {
    state.emitFailed();
    endBlinking();
    clearScreen();
  } else if (gameLevel) {
    screen.value[currentPoint.value.getArrayPosition()] = false;
    currentPoint.value = gameLevel.startingPoint.getCopy();
    screen.value[currentPoint.value.getArrayPosition()] = true;
  }
}

function checkSolved(): void {
  const isLastLevel = gameLevel?.getLevelCount() === currentGameLevel + 1;

  if (endingPoint.value.isEqual(currentPoint.value)) {
    if (isLastLevel) {
      endBlinking();
      clearScreen();
      state.emitDisarmed();
    } else if (gameLevel) {
      clearScreen();
      currentPoint.value = gameLevel
        .getLevel(currentGameLevel)
        .endingPoint.getCopy();
      currentGameLevel++;
      endingPoint.value = gameLevel
        .getLevel(currentGameLevel)
        .endingPoint.getCopy();
      screen.value[currentPoint.value.getArrayPosition()] = true;
      screen.value[endingPoint.value.getArrayPosition()] = true;
    }
  }
}

function clearScreen(): void {
  screen.value = Array.apply(null, Array(8 * 8)).map(() => false);
}

function endBlinking(): void {
  clearInterval(blinkTimerId);
  clearInterval(obstacleBlinkTimerId);
}

function startBlinking(): void {
  endBlinking();

  blinkTimerId = <number>(<unknown>setInterval(() => {
    let pos = endingPoint.value.getArrayPosition();
    screen.value[pos] = !screen.value[pos];
  }, BLINK_INTERVAL_MS));

  obstacleBlinkTimerId = <number>(<unknown>setInterval(() => {
    if (gameLevel) {
      for (const obstacle of gameLevel?.getLevel(currentGameLevel).obstacles) {
        let pos = obstacle.getArrayPosition();
        screen.value[pos] = !screen.value[pos];
      }
    }
  }, OBSTACLE_BLINK_INTERVAL_MS));
}

function getPointClass(state: boolean, index: number): Array<string> {
  const classes = [];

  if (debugState.isDebugModeEnabled.value && gameLevel?.walls) {
    classes.push("w-" + gameLevel?.walls.matrix[index]);
  }

  if (state) {
    classes.push("active");
  }

  return classes;
}
</script>
<template>
  <div class="module card-module labyrinth-module">
    <div class="content">
      <Frame
        top="35px"
        left="75px"
        height="230px"
        width="230px"
        text="MATRIX"
        radius="8px"
      />

      <div class="screen">
        <div
          v-for="(state, index) in screen"
          class="point"
          :class="getPointClass(state, index)"
        >
          <div />
        </div>
      </div>

      <div class="button up" @click="move(LabyrinthDirection.UP)">
        <div class="round-border" />
        <div class="label">UP</div>
      </div>

      <div class="button down" @click="move(LabyrinthDirection.DOWN)">
        <div class="round-border" />
        <div class="label">DOWN</div>
      </div>

      <div class="button left" @click="move(LabyrinthDirection.LEFT)">
        <div class="round-border" />
        <div class="label">LEFT</div>
      </div>

      <div class="button right" @click="move(LabyrinthDirection.RIGHT)">
        <div class="round-border" />
        <div class="label">RIGHT</div>
      </div>
    </div>
    <ModuleStatusIndicator
      :is-armed="state.isArmed.value"
      :is-disarmed="state.isDisarmed.value"
      :strike-number="strikeNumber"
    />
  </div>
</template>
