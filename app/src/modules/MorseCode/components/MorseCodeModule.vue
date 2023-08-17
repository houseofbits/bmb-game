<script setup lang="ts">
import "@style/modules/morse-code.scss";
import ModuleStatusIndicator from "@src/components/ModuleStatusIndicator.vue";
import defineDebugState from "@src/composables/defineDebugState";
import { computed, onMounted, ref, watch } from "vue";
import defineModuleState, {
  ModuleEmits,
  ModuleProps,
} from "@src/composables/defineModuleState";
import FramedLabel from "@src/components/FramedLabel.vue";
import Label from "@src/components/Label.vue";
import getRandomLevel from "@src/modules/MorseCode/helpers/levels";
import { DifficultyLevel } from "@src/helpers/difficultyLevelConstants";

const intervalMs = 200;

enum OperationMode {
  RECEIVE,
  TRANSMIT,
  PRACTICE,
}

enum Signal {
  DIT = 1,
  DAH = 2,
  DIT_SPACE = 3,
  CHAR_SPACE = 4,
  WORD_SPACE = 5,
}

const SignalTiming = {
  [Signal.DIT]: 1,
  [Signal.DAH]: 3,
  [Signal.DIT_SPACE]: 1,
  [Signal.CHAR_SPACE]: 3,
  [Signal.WORD_SPACE]: 7,
};

const Alphabet: { [char: string]: Array<Signal> } = {
  A: [Signal.DIT, Signal.DAH],
  B: [Signal.DAH, Signal.DIT, Signal.DIT, Signal.DIT],
  C: [Signal.DAH, Signal.DIT, Signal.DAH, Signal.DIT],
  D: [Signal.DAH, Signal.DIT, Signal.DIT],
  E: [Signal.DIT],
  F: [Signal.DIT, Signal.DIT, Signal.DAH, Signal.DIT],
};

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
const isTransmitEnabled = ref(false);
const isBeepEnabled = ref(false);
const isRXOn = ref(false);
const isTXOn = ref(false);
const isERROROn = ref(false);
let clkTimerId: number | null = null;
let rxTicks = 0;
let rxSignal: Array<Signal> | null = null;
let rxSignalIndex = 0;
let transmittedSignal: Array<Signal> = [];
let txButtonOn: boolean = false;
let txTicks: number = 0;
let transmitSignalIndicator = ref(0);
const mode = ref<OperationMode>(OperationMode.RECEIVE);
const level = getRandomLevel(DifficultyLevel.EASY);

function armModule(): void {
  rxSignal = createSignal(level.question);
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
      for (const signalPart of Alphabet[symbol]) {
        signal.push(signalPart);
        signal.push(Signal.DIT_SPACE);
      }
      signal.push(Signal.CHAR_SPACE);
    }
  }

  return signal;
}

function transmit(on: boolean): void {
  if (state.isArmed.value && mode.value !== OperationMode.RECEIVE) {
    txButtonOn = on;
  }
}

function setMode(selectedMode: OperationMode): void {
  if (state.isArmed.value) {
    mode.value = selectedMode;
  }
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
    isERROROn.value = true;
    strikeNumber.value++;
    if (strikeNumber.value > 2) {
      state.emitFailed();
    }
  }

  if (mode.value == OperationMode.PRACTICE && letterFound !== "B") {
    isERROROn.value = true;
  }

  if (mode.value == OperationMode.TRANSMIT && letterFound === level.answer) {
    state.emitDisarmed();
  }
}

function rxClock(): void {
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

function txClock(): void {
  const risingEdge = txButtonOn && !isTXOn.value;
  const fallingEdge = !txButtonOn && isTXOn.value;

  if (isTXOn.value) {
    if (txTicks > 0) {
      transmitSignalIndicator.value = 1;
    }
    if (txTicks > 5) {
      transmitSignalIndicator.value = 2;
    }
    if (txTicks > 10) {
      transmitSignalIndicator.value = 3;
    }
  }

  if (risingEdge) {
    isERROROn.value = false;
    txTicks = 0;
    transmitSignalIndicator.value = 0;
  } else if (fallingEdge && txTicks < 10) {
    transmittedSignal.push(Signal.DIT);
    txTicks = 0;
  } else if (fallingEdge && txTicks >= 10) {
    transmittedSignal.push(Signal.DAH);
    txTicks = 0;
  } else if (transmittedSignal.length > 0 && !isTXOn.value && txTicks >= 15) {
    parseTransmittedLetter();
    transmittedSignal = [];
    txTicks = 0;
  }

  if (fallingEdge) {
    transmitSignalIndicator.value = 0;
  }

  txTicks++;
  isTXOn.value = txButtonOn;
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

watch(
  () => isTransmitEnabled.value,
  (value: boolean) => {
    setBeepOn(false);
    rxSignalIndex = 0;
    transmittedSignal = [];
    isRXOn.value = false;
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
      gainNode.gain.exponentialRampToValueAtTime(
        1.0,
        audioContext.currentTime + 0.04,
      );
    } else {
      gainNode.gain.exponentialRampToValueAtTime(
        0.000001,
        audioContext.currentTime + 0.04,
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

onMounted(() => {
  clkTimerId = <number>(<unknown>setInterval(rxClock, intervalMs));
  setInterval(txClock, intervalMs / 5);
});
</script>
<template>
  <div class="module morse-code-module">
    <div class="content">
      <FramedLabel
        radius="8px"
        left="170px"
        top="20px"
        height="110px"
        width="190px"
        text="MODE"
      >
        <Label left="10px" top="13px" @click="setMode(OperationMode.RECEIVE)"
          >RECEIVE</Label
        >
        <Label left="10px" top="43px" @click="setMode(OperationMode.TRANSMIT)"
          >TRANSMIT</Label
        >
        <Label left="10px" top="73px" @click="setMode(OperationMode.PRACTICE)"
          >PRACTICE</Label
        >

        <div
          class="rotary-switch"
          @click="isTransmitEnabled = !isTransmitEnabled"
        >
          {{ modeClass }}
        </div>
      </FramedLabel>

      <FramedLabel
        radius="8px"
        left="170px"
        top="155px"
        height="110px"
        width="190px"
        text="TRANSMIT"
      >
        <div class="transmit-indicator">
          <div class="label">DAH</div>
          <div class="led" :class="{ active: transmitSignalIndicator === 3 }" />
          <div class="led" :class="{ active: transmitSignalIndicator >= 2 }" />
          <div class="led" :class="{ active: transmitSignalIndicator >= 1 }" />
          <div class="label">DIT</div>
        </div>

        <div
          class="large-push-button"
          @mousedown="transmit(true)"
          @mouseup="transmit(false)"
          @mouseleave="transmit(false)"
        >
          SEND
        </div>
      </FramedLabel>

      <FramedLabel
        radius="8PX"
        left="20px"
        top="20px"
        height="110px"
        width="120px"
        text="SIGNAL"
      >
        <div class="led-row">
          <div class="led-indicator" :class="{ active: isRXOn }"></div>
          <div class="label">RX</div>
        </div>

        <div class="led-row">
          <div class="led-indicator" :class="{ active: isTXOn }"></div>
          <div class="label">TX</div>
        </div>

        <div class="led-row">
          <div class="led-indicator" :class="{ active: isERROROn }"></div>
          <div class="label">ERROR</div>
        </div>
      </FramedLabel>

      <Label left="63px" top="215px">BEEP</Label>

      <div
        class="beep-switch"
        :class="{ active: isBeepEnabled }"
        @click="isBeepEnabled = !isBeepEnabled"
      >
        <div />
      </div>
    </div>
    <ModuleStatusIndicator
      :is-armed="state.isArmed.value"
      :is-disarmed="state.isDisarmed.value"
      :strike-number="strikeNumber"
    />
  </div>
</template>
