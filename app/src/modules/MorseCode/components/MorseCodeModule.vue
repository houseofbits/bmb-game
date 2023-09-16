<script setup lang="ts">
import "@style/modules/morse-code.scss";
import ModuleStatusIndicator from "@src/components/ModuleStatusIndicator.vue";
import defineDebugState from "@src/composables/defineDebugState";
import { computed, onMounted, onUnmounted, reactive, ref, watch } from "vue";
import defineModuleState, {
  ModuleEmits,
  ModuleProps,
} from "@src/composables/defineModuleState";
import Frame from "@src/components/Frame.vue";
import Label from "@src/components/Label.vue";
import getRandomLevel from "@src/modules/MorseCode/helpers/levels";
import { DifficultyLevel } from "@src/helpers/difficultyLevelConstants";
import Alphabet, {
  getSignalDebugString,
} from "@src/modules/MorseCode/helpers/alphabet";
import {
  OperationMode,
  Signal,
  SignalTiming,
} from "@src/modules/MorseCode/helpers/constants";
import { isBoolean } from "lodash";
import Line from "@src/components/Line.vue";
import { logContainerMousePosition } from "@src/helpers/debugging";

const CLOCK_TICKS = 10;
const intervalMs = 600; //400 for hard difficulty

const emit = defineEmits(ModuleEmits);
const props = defineProps(ModuleProps);
const state = defineModuleState(props, emit);

const debugState = defineDebugState();
state.onArmed(armModule);
state.onReady(restartModule);

state.onFailed(freezeModule);
let audioContext: AudioContext | null = null;
let oscillatorNode: OscillatorNode;
let gainNode: GainNode;

const strikeNumber = ref<number>(0);
const isBeepEnabled = ref(false);
const isRXOn = ref(false);
const isTXOn = ref(false);
let rxTicks = 0;
let rxSignal: Array<Signal> | null = null;
let rxSignalIndex = 0;
let transmittedSignal: Array<Signal> = [];
let txTicks: number = 0;
const mode = ref<OperationMode>(OperationMode.RECEIVE);
let level = getRandomLevel(DifficultyLevel.EASY);
let clockAccum = 0;

const signalDisplay = reactive(Array(16).fill(false));

function armModule(): void {
  level = getRandomLevel(props.difficulty);
  rxSignal = createSignal(level.question);
  rxSignalIndex = 0;
  strikeNumber.value = 0;
}

function restartModule(): void {}

function freezeModule(): void {}

function createSignal(input: string): Array<Signal> {
  const arrayOfSymbols = input.split("");
  const signal: Array<Signal> = [];
  for (const symbol of arrayOfSymbols) {
    if (!Alphabet[symbol]) {
      signal.push(Signal.WORD_SPACE);
    } else {
      for (let i = 0; i < Alphabet[symbol].length; i++) {
        if (i > 0) {
          signal.push(Signal.DIT_SPACE);
        }
        signal.push(Alphabet[symbol][i]);
      }
      signal.push(Signal.CHAR_SPACE);
    }
  }

  signal.push(Signal.WORD_SPACE);

  return signal;
}

function transmit(on: boolean): void {
  if (state.isArmed.value && mode.value !== OperationMode.RECEIVE) {
    isTXOn.value = on;
  }
}

function setMode(selectedMode: OperationMode): void {
  if (state.isArmed.value) {
    mode.value = selectedMode;
    setBeepOn(false);
    rxSignalIndex = 0;
    transmittedSignal = [];
    isRXOn.value = false;
  }
}

function toggleMode(): void {
  switch (mode.value) {
    case OperationMode.RECEIVE:
      setMode(OperationMode.TRANSMIT);
      break;
    case OperationMode.TRANSMIT:
      setMode(OperationMode.PRACTICE);
      break;
    case OperationMode.PRACTICE:
      setMode(OperationMode.RECEIVE);
      break;
  }
}

function clock(): void {
  if (clockAccum === 0) {
    if (mode.value != OperationMode.RECEIVE) {
      recordTransmission(
        signalDisplay[signalDisplay.length - 1],
        signalDisplay[signalDisplay.length - 2],
      );
    }
    advanceDisplay();

    if (rxSignal && mode.value == OperationMode.RECEIVE) {
      if (rxTicks > 0) {
        rxTicks--;
      }
      if (rxTicks === 0) {
        const signal = rxSignal[rxSignalIndex];
        rxTicks = SignalTiming[signal];
        isRXOn.value = signal === Signal.DIT || signal === Signal.DAH;

        rxSignalIndex = (rxSignalIndex + 1) % rxSignal.length;
      }
    }
  }

  if (mode.value == OperationMode.RECEIVE) {
    signalDisplay[signalDisplay.length - 1] = isRXOn.value;
  } else {
    signalDisplay[signalDisplay.length - 1] =
      signalDisplay[signalDisplay.length - 1] || isTXOn.value;
  }

  clockAccum++;
  if (clockAccum > CLOCK_TICKS) {
    clockAccum = 0;
  }
}

function recordTransmission(isOn: boolean, isPreviousOn: boolean): void {
  const risingEdge = isOn && !isPreviousOn;
  const fallingEdge = !isOn && isPreviousOn;

  if (risingEdge) {
    txTicks = 0;
  }

  if (fallingEdge && txTicks == 1) {
    transmittedSignal.push(Signal.DIT);
    txTicks = 0;
  } else if (fallingEdge && txTicks == 3) {
    transmittedSignal.push(Signal.DAH);
    txTicks = 0;
  } else if (transmittedSignal.length > 0 && !isOn && txTicks >= 1) {
    parseTransmittedLetter();
    transmittedSignal = [];
    txTicks = 0;
  }

  txTicks++;
}

function parseTransmittedLetter(): void {
  const dest = JSON.stringify(transmittedSignal);
  let letterFound: string | null = null;
  for (const letter in Alphabet) {
    const src = JSON.stringify(Alphabet[letter]);
    if (dest === src) {
      letterFound = letter;
      break;
    }
  }
  if (mode.value == OperationMode.TRANSMIT && letterFound !== level.answer) {
    strikeNumber.value++;
    if (strikeNumber.value > 2) {
      state.emitFailed();
    }
  }

  if (mode.value == OperationMode.TRANSMIT && letterFound === level.answer) {
    state.emitDisarmed();
  }
}

function advanceDisplay(): void {
  for (let i = 0; i < signalDisplay.length; i++) {
    signalDisplay[i] = signalDisplay[i + 1] ?? false;
  }
}

watch(
  () => isRXOn.value,
  (value: boolean) => {
    setBeepOn(value);
  },
);

watch(
  () => isTXOn.value,
  (value: boolean) => {
    setBeepOn(value);
  },
);

watch(
  () => isBeepEnabled.value,
  (value: boolean) => {
    if (!value) {
      setBeepOn(false);
    } else {
      initAudioContext();
    }
  },
);

const modeClass = computed(() => {
  switch (mode.value) {
    case OperationMode.RECEIVE:
      return "receive";
    case OperationMode.TRANSMIT:
      return "transmit";
    case OperationMode.PRACTICE:
      return "practice";
  }
  return "";
});

function setBeepOn(on: boolean): void {
  if (audioContext) {
    if (isBeepEnabled.value && on) {
      gainNode.gain.linearRampToValueAtTime(
        1.0,
        audioContext.currentTime + 0.1,
      );
    } else {
      gainNode.gain.linearRampToValueAtTime(
        0.0001,
        audioContext.currentTime + 0.1,
      );
    }
  }
}

function initAudioContext(): void {
  if (!audioContext) {
    audioContext = new AudioContext();
    oscillatorNode = audioContext.createOscillator();
    gainNode = audioContext.createGain();
    oscillatorNode.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillatorNode.frequency.value = 800;
    oscillatorNode.start(0);
    gainNode.gain.exponentialRampToValueAtTime(
      0.00001,
      audioContext.currentTime + 0.01,
    );
  }
}

function stopAudioContext(): void {
  setBeepOn(false);
  oscillatorNode?.stop();
  gainNode?.disconnect();
  audioContext?.close();
}

onMounted(() => {
  setInterval(clock, intervalMs / CLOCK_TICKS);
});

onUnmounted(() => {
  stopAudioContext();
});
</script>
<template>
  <div class="module morse-code-module">
    <div class="content">
      <div v-if="debugState.isDebugModeEnabled.value">
        {{ level.question }} | {{ level.answer }} |
        {{ getSignalDebugString(level.question) }} |
        {{ getSignalDebugString(level.answer) }}
      </div>

      <Label top="10px" left="20px">DOT - 1 UNIT</Label>
      <Label top="25px" left="20px">DASH - 3 UNITS</Label>
      <Label top="40px" left="20px">SPACE BETWEEN DOTS & DASHES - 1 UNIT</Label>
      <Label top="55px" left="20px">SPACE BETWEEN LETTERS - 3 UNITS</Label>

      <Line
        :points="[
          [348, 120],
          [348, 162],
          [334, 177],
        ]"
      />

      <Line
        :points="[
          [85, 155],
          [85, 160],
        ]"
      />

      <Line
        :points="[
          [35, 177],
          [41, 182],
        ]"
      />

      <Line
        :points="[
          [134, 177],
          [129, 182],
        ]"
      />

      <div class="signal-display">
        <div
          v-for="(val, index) in signalDisplay"
          :class="{ active: val }"
          :key="index"
        />
      </div>

      <Label top="105px" left="20px">SIGNAL</Label>

      <svg
        class="starting-point-symbol"
        xmlns="http://www.w3.org/2000/svg"
        height="1.5em"
        viewBox="0 0 320 512"
      >
        <path
          d="M182.6 137.4c-12.5-12.5-32.8-12.5-45.3 0l-128 128c-9.2 9.2-11.9 22.9-6.9 34.9s16.6 19.8 29.6 19.8H288c12.9 0 24.6-7.8 29.6-19.8s2.2-25.7-6.9-34.9l-128-128z"
        />
      </svg>

      <Frame
        radius="50%"
        left="30px"
        top="160px"
        height="110px"
        width="110px"
        text="MODE"
      >
        <div class="rotary-switch" @click="toggleMode" :class="[modeClass]">
          <div class="rotary-switch-body">
            <div class="rotary-switch-top">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="1em"
                viewBox="0 0 320 512"
              >
                <path
                  d="M318 177.5c3.8-8.8 2-19-4.6-26l-136-144C172.9 2.7 166.6 0 160 0s-12.9 2.7-17.4 7.5l-136 144c-6.6 7-8.4 17.2-4.6 26S14.4 192 24 192H96l0 288c0 17.7 14.3 32 32 32h64c17.7 0 32-14.3 32-32l0-288h72c9.6 0 18.2-5.7 22-14.5z"
                />
              </svg>
            </div>
          </div>
        </div>

        <Label top="-5px" left="-10px">RX</Label>
        <Label top="-25px" left="45px">TX</Label>
        <Label top="-5px" left="100px">PR</Label>
      </Frame>

      <Frame
        radius="50%"
        left="240px"
        top="160px"
        height="110px"
        width="110px"
        text="TRANSMIT"
      >
        <div
          class="large-push-button"
          @mousedown="transmit(true)"
          @mouseup="transmit(false)"
          @mouseleave="transmit(false)"
          @touchstart="transmit(true)"
          @touchend="transmit(false)"
          @touchcancel="transmit(false)"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="2em"
            viewBox="0 0 576 512"
          >
            <path
              d="M80.3 44C69.8 69.9 64 98.2 64 128s5.8 58.1 16.3 84c6.6 16.4-1.3 35-17.7 41.7s-35-1.3-41.7-17.7C7.4 202.6 0 166.1 0 128S7.4 53.4 20.9 20C27.6 3.6 46.2-4.3 62.6 2.3S86.9 27.6 80.3 44zM555.1 20C568.6 53.4 576 89.9 576 128s-7.4 74.6-20.9 108c-6.6 16.4-25.3 24.3-41.7 17.7S489.1 228.4 495.7 212c10.5-25.9 16.3-54.2 16.3-84s-5.8-58.1-16.3-84C489.1 27.6 497 9 513.4 2.3s35 1.3 41.7 17.7zM352 128c0 23.7-12.9 44.4-32 55.4V480c0 17.7-14.3 32-32 32s-32-14.3-32-32V183.4c-19.1-11.1-32-31.7-32-55.4c0-35.3 28.7-64 64-64s64 28.7 64 64zM170.6 76.8C163.8 92.4 160 109.7 160 128s3.8 35.6 10.6 51.2c7.1 16.2-.3 35.1-16.5 42.1s-35.1-.3-42.1-16.5c-10.3-23.6-16-49.6-16-76.8s5.7-53.2 16-76.8c7.1-16.2 25.9-23.6 42.1-16.5s23.6 25.9 16.5 42.1zM464 51.2c10.3 23.6 16 49.6 16 76.8s-5.7 53.2-16 76.8c-7.1 16.2-25.9 23.6-42.1 16.5s-23.6-25.9-16.5-42.1c6.8-15.6 10.6-32.9 10.6-51.2s-3.8-35.6-10.6-51.2c-7.1-16.2 .3-35.1 16.5-42.1s35.1 .3 42.1 16.5z"
            />
          </svg>
        </div>
      </Frame>

      <Frame
        top="230px"
        left="170px"
        width="45px"
        height="60px"
        :has-border="false"
      >
        <div
          class="beep-switch"
          :class="{ active: isBeepEnabled }"
          @click="isBeepEnabled = !isBeepEnabled"
        >
          <div />
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="1em"
          viewBox="0 0 640 512"
          class="beep-switch-icon"
        >
          <path
            d="M533.6 32.5C598.5 85.3 640 165.8 640 256s-41.5 170.8-106.4 223.5c-10.3 8.4-25.4 6.8-33.8-3.5s-6.8-25.4 3.5-33.8C557.5 398.2 592 331.2 592 256s-34.5-142.2-88.7-186.3c-10.3-8.4-11.8-23.5-3.5-33.8s23.5-11.8 33.8-3.5zM473.1 107c43.2 35.2 70.9 88.9 70.9 149s-27.7 113.8-70.9 149c-10.3 8.4-25.4 6.8-33.8-3.5s-6.8-25.4 3.5-33.8C475.3 341.3 496 301.1 496 256s-20.7-85.3-53.2-111.8c-10.3-8.4-11.8-23.5-3.5-33.8s23.5-11.8 33.8-3.5zm-60.5 74.5C434.1 199.1 448 225.9 448 256s-13.9 56.9-35.4 74.5c-10.3 8.4-25.4 6.8-33.8-3.5s-6.8-25.4 3.5-33.8C393.1 284.4 400 271 400 256s-6.9-28.4-17.7-37.3c-10.3-8.4-11.8-23.5-3.5-33.8s23.5-11.8 33.8-3.5zM301.1 34.8C312.6 40 320 51.4 320 64V448c0 12.6-7.4 24-18.9 29.2s-25 3.1-34.4-5.3L131.8 352H64c-35.3 0-64-28.7-64-64V224c0-35.3 28.7-64 64-64h67.8L266.7 40.1c9.4-8.4 22.9-10.4 34.4-5.3z"
          />
        </svg>
      </Frame>
    </div>
    <ModuleStatusIndicator
      :is-armed="state.isArmed.value"
      :is-disarmed="state.isDisarmed.value"
      :strike-number="strikeNumber"
    />
  </div>
</template>
