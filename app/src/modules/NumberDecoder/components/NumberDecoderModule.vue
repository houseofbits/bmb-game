<script setup lang="ts">
import "@style/modules/number-decoder.scss";
import ModuleStatusIndicator from "@src/components/ModuleStatusIndicator.vue";
import { ref } from "vue";
import Keycap from "@src/components/Keycap.vue";
import defineModuleState, {
  ModuleEmits,
  ModuleProps,
} from "@src/composables/defineModuleState";
import { DifficultyLevel } from "@src/helpers/difficultyLevelConstants";
import defineDebugState from "@src/composables/defineDebugState";
import SevenSegment from "@src/components/SevenSegment.vue";

const emit = defineEmits(ModuleEmits);
const props = defineProps(ModuleProps);
const state = defineModuleState(props, emit);
const debugState = defineDebugState();

state.onArmed(armModule);
state.onReady(restartModule);
state.onFailed(freezeModule);

enum NumberState {
  INCORRECT,
  CORRECT,
  PARTIAL,
}

const DIFFICULTY_LEVELS = {
  [DifficultyLevel.EASY]: 3,
  [DifficultyLevel.AVERAGE]: 4,
  [DifficultyLevel.HARD]: 5,
  [DifficultyLevel.IMPOSSIBLE]: 6,
};

const NUMBER_OF_ATTEMPTS = {
  [DifficultyLevel.EASY]: 11,
  [DifficultyLevel.AVERAGE]: 9,
  [DifficultyLevel.HARD]: 5,
  [DifficultyLevel.IMPOSSIBLE]: 5,
};

let numberOfTries = 0;
const numbersInput = ref<string>("");
let maxNumbers: number = 4;
let numberToGuess: string = "";
let numbersState: Array<NumberState> = [
  NumberState.INCORRECT,
  NumberState.INCORRECT,
  NumberState.INCORRECT,
  NumberState.INCORRECT,
];
const strikeNumber = ref<number>(0);

function armModule(): void {
  maxNumbers = DIFFICULTY_LEVELS[props.difficulty];
  numberOfTries = 0;
  numberToGuess = generateNumberToGuess();
  initNumbersState();
}

function initNumbersState(): void {
  numbersState = [];
  for (let i = 0; i < maxNumbers; i++) {
    numbersState.push(NumberState.INCORRECT);
  }
}

function checkState(): boolean {
  for (let i = 0; i < numbersInput.value.length; i++) {
    if (numbersInput.value[i] === numberToGuess[i]) {
      numbersState[i] = NumberState.CORRECT;
    } else if (numberToGuess.includes(numbersInput.value[i])) {
      numbersState[i] = NumberState.PARTIAL;
    } else {
      numbersState[i] = NumberState.INCORRECT;
    }
  }
  if (numbersInput.value === numberToGuess) {
    state.emitDisarmed();

    return true;
  }

  numberOfTries++;

  if (numberOfTries > NUMBER_OF_ATTEMPTS[props.difficulty]) {
    if (
      strikeNumber.value > 1 ||
      props.difficulty === DifficultyLevel.IMPOSSIBLE
    ) {
      state.emitFailed();
    } else {
      strikeNumber.value++;
    }
  }

  return false;
}

function addNumberToInput(num: number): void {
  if (state.isArmed.value && numbersInput.value.length < maxNumbers) {
    numbersInput.value = numbersInput.value + num.toString();
  }
}

function submitInput(): void {
  if (state.isArmed.value && numbersInput.value.length === maxNumbers) {
    if (!checkState()) {
      numbersInput.value = "";
    }
  }
}

function restartModule(): void {
  numbersState = [
    NumberState.INCORRECT,
    NumberState.INCORRECT,
    NumberState.INCORRECT,
    NumberState.INCORRECT,
  ];
  numbersInput.value = "";
}

function freezeModule(): void {}

function generateNumberToGuess(): string {
  const num = "1234567890";
  const offset = Math.floor(Math.random() * 10);
  const offsetEnd = offset + maxNumbers;
  let sub = num.substring(offset, offset + maxNumbers);
  if (offsetEnd > num.length) {
    sub += num.substring(0, maxNumbers - sub.length);
  }

  sub = sub
    .split("")
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value)
    .join("");

  return sub;
}

function getCharacter(index: number): string {
  if (index > maxNumbers - 1) {
    return "-";
  }
  if (numbersInput.value.length == 0) {
    if (numbersState[index] === NumberState.PARTIAL) {
      return "_";
    }
    if (numbersState[index] === NumberState.CORRECT) {
      return "c";
    }
  }
  const numericArray = numbersInput.value.split("");
  return numericArray[index] ?? "";
}
</script>
<template>
  <div class="module card-module">
    <div class="content">
      <div v-if="debugState.isDebugModeEnabled.value">{{ numberToGuess }}</div>

      <div class="number-display">
        <SevenSegment
          v-for="(n, index) in 6"
          class="digit"
          :character="getCharacter(index)"
          :width="40"
          :height="60"
          :padding="7"
          :segment-size="5"
        />
      </div>

      <div class="keypad">
        <Keycap
          class="numeric-key key-row-1 key-col-1"
          @click="addNumberToInput(1)"
          >1
        </Keycap>
        <Keycap
          class="numeric-key key-row-1 key-col-2"
          @click="addNumberToInput(2)"
          >2
        </Keycap>
        <Keycap
          class="numeric-key key-row-1 key-col-3"
          @click="addNumberToInput(3)"
          >3
        </Keycap>

        <Keycap
          class="numeric-key key-row-2 key-col-1"
          @click="addNumberToInput(4)"
          >4
        </Keycap>
        <Keycap
          class="numeric-key key-row-2 key-col-2"
          @click="addNumberToInput(5)"
          >5
        </Keycap>
        <Keycap
          class="numeric-key key-row-2 key-col-3"
          @click="addNumberToInput(6)"
          >6
        </Keycap>

        <Keycap
          class="numeric-key key-row-3 key-col-1"
          @click="addNumberToInput(7)"
          >7
        </Keycap>
        <Keycap
          class="numeric-key key-row-3 key-col-2"
          @click="addNumberToInput(8)"
          >8
        </Keycap>
        <Keycap
          class="numeric-key key-row-3 key-col-3"
          @click="addNumberToInput(9)"
          >9
        </Keycap>
        <Keycap
          class="numeric-key key-row-3 key-col-4"
          @click="addNumberToInput(0)"
          >0
        </Keycap>

        <Keycap class="enter-key key-row-1 key-col-4" @click="submitInput"
          >E
        </Keycap>
      </div>
    </div>
    <ModuleStatusIndicator
      :is-armed="state.isArmed.value"
      :is-disarmed="state.isDisarmed.value"
      :strike-number="strikeNumber"
    />
  </div>
</template>
