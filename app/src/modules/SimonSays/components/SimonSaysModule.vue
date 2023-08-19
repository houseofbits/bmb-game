<script setup lang="ts">
import "@style/modules/simon-says.scss";
import ModuleStatusIndicator from "@src/components/ModuleStatusIndicator.vue";
import { computed, onMounted, ref } from "vue";
import getRandomPattern from "@src/modules/SimonSays/helpers/patterns";
import {
  SimonSaysColor,
  SimonSaysPatternStructure,
} from "@src/modules/SimonSays/structures/SimonSaysPatternStructure";
import defineModuleState, {
  ModuleEmits,
  ModuleProps,
} from "@src/composables/defineModuleState";
import FramedLabel from "@src/components/FramedLabel.vue";
import defineDebugState from "@src/composables/defineDebugState";
import _ from "lodash";

const emit = defineEmits(ModuleEmits);
const props = defineProps(ModuleProps);
const state = defineModuleState(props, emit);
const debugState = defineDebugState();

state.onArmed(armModule);
state.onReady(restartModule);
state.onFailed(freezeModule);

const PATTERN_OFF_INTERVAL_MS = 500;
const PATTERN_ON_INTERVAL_MS = 600;
const REPETITION_INTERVAL_MS = 1500;

const patternIndex = ref(0);
let patternColorIndex = 0;
let timerId: number;
const failedPatternIndexes = ref<Array<number>>([]);
const strikeNumber = ref<number>(0);
let pattern: SimonSaysPatternStructure | null = null;

const isColorActive = ref({
  [SimonSaysColor.RED]: false,
  [SimonSaysColor.GREEN]: false,
  [SimonSaysColor.YELLOW]: false,
  [SimonSaysColor.BLUE]: false,
});

function restartTimer(initialDelay: number = 0): void {
  setTimeout(() => {
    clearColors();
    patternColorIndex = 0;
    clearTimeout(timerId);
    timerId = <number>(<unknown>setTimeout(patternOn, 300));
  }, initialDelay);
}

function armModule(): void {
  patternIndex.value = _.random(1, 4);
  failedPatternIndexes.value = [];
  restartTimer(_.random(REPETITION_INTERVAL_MS * 0.2, REPETITION_INTERVAL_MS));
  pattern = getRandomPattern(props.difficulty);
}

function disarm(color: SimonSaysColor): void {
  if (state.isArmed.value) {
    if (!pattern?.isCorrect(color)) {
      if (strikeNumber.value > 1) {
        clearTimeout(timerId);
        clearColors();
        state.emitFailed();
      } else {
        strikeNumber.value++;
      }

      return;
    }

    clearTimeout(timerId);
    clearColors();

    isColorActive.value[SimonSaysColor.RED] = true;
    isColorActive.value[SimonSaysColor.GREEN] = true;
    isColorActive.value[SimonSaysColor.YELLOW] = true;
    isColorActive.value[SimonSaysColor.BLUE] = true;

    //Is last pattern has been solved, mark game as completed
    if (patternIndex.value == 0) {
      clearTimeout(timerId);
      setTimeout(clearColors, REPETITION_INTERVAL_MS);
      state.emitDisarmed();
      return;
    }

    patternIndex.value--;
    pattern = getRandomPattern(props.difficulty);
    restartTimer(REPETITION_INTERVAL_MS);
  }
}

function patternOn(): void {
  clearColors();
  const currentColor = pattern?.getColor(patternColorIndex);
  if (currentColor) {
    isColorActive.value[currentColor] = true;
    timerId = <number>(<unknown>setTimeout(patternOff, PATTERN_ON_INTERVAL_MS));
  }
}

function patternOff(): void {
  if (!pattern) {
    return;
  }

  clearColors();

  patternColorIndex = (patternColorIndex + 1) % pattern.getSize();

  if (patternColorIndex === 0) {
    timerId = <number>(<unknown>setTimeout(patternOn, REPETITION_INTERVAL_MS));
  } else {
    timerId = <number>(<unknown>setTimeout(patternOn, PATTERN_OFF_INTERVAL_MS));
  }
}

function clearColors(): void {
  isColorActive.value[SimonSaysColor.RED] = false;
  isColorActive.value[SimonSaysColor.GREEN] = false;
  isColorActive.value[SimonSaysColor.YELLOW] = false;
  isColorActive.value[SimonSaysColor.BLUE] = false;
}

function restartModule(): void {
  patternIndex.value = 0;
  patternColorIndex = 0;
  failedPatternIndexes.value = [];
  clearTimeout(timerId);
}

function freezeModule(): void {
  clearTimeout(timerId);
}

function getCombination(
  array: Array<number>,
  length: number,
): Array<Array<number>> {
  function iter(index: number, right: any) {
    if (right.length === length) return result.push(right);
    if (index === array.length) return;
    for (
      let i = index, l = array.length - length + right.length + 1;
      i < l;
      i++
    ) {
      iter(i + 1, [...right, array[i]]);
    }
  }

  const result: Array<Array<number>> = [];
  iter(0, []);
  return result;
}

function generatePatterns(numElements: number): string {
  const output: Array<string> = [];
  const colors: Array<string> = ["_G", "_R", "_Y", "_B"];
  const set = [0, 1, 2, 3, 3, 2, 1, 0];
  const combinations = getCombination(set, numElements);
  for (const combination of combinations) {
    const sum = combination.reduce((a: number, b: number) => a + b);
    const answer = sum % 4;

    let str =
      "new SimonSaysPatternStructure(" +
      colors[answer] +
      ", [" +
      combination.map((value: number) => colors[value]).join(", ") +
      "]),";

    console.log(
      combination.map((value: number) => colors[value]),
      colors[answer],
    );

    output.push(str);
  }

  return output.join("\n");
}
</script>
<template>
  <div class="module simon-says-module">
    <div class="content">
      <div v-if="pattern && debugState.isDebugModeEnabled.value">
        {{ pattern.correctAnswer }}
      </div>

      <FramedLabel
        left="60px"
        top="20px"
        height="125px"
        width="125px"
        radius="8px"
        text="GREEN"
      />
      <FramedLabel
        left="195px"
        top="20px"
        height="125px"
        width="125px"
        radius="8px"
        text="RED"
      />
      <FramedLabel
        left="60px"
        top="155px"
        height="125px"
        width="125px"
        radius="8px"
        text="YELLOW"
      />
      <FramedLabel
        left="195px"
        top="155px"
        height="125px"
        width="125px"
        radius="8px"
        text="BLUE"
      />

      <div
        v-for="k in SimonSaysColor"
        class="simon-button"
        :class="{ [k + '-button']: true, active: isColorActive[k] }"
        @click="disarm(k)"
      >
        <div class="cap">
          <div class="hilight"></div>
        </div>
      </div>

      <!--      <div class="step-indicator">-->
      <!--        <div-->
      <!--          v-for="(a, i) in 6"-->
      <!--          :class="{ active: isPatternActive(i), failed: isPatternFailed(i) }"-->
      <!--        />-->
      <!--      </div>-->

      <!--      <div class="label steps-label">REMAINING PATTERNS</div>-->
    </div>
    <ModuleStatusIndicator
      :is-armed="state.isArmed.value"
      :is-disarmed="state.isDisarmed.value"
      :strike-number="strikeNumber"
    />
  </div>
</template>
