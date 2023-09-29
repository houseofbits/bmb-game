<script setup lang="ts">
import "@style/modules/timer.scss";
import { onUnmounted, ref, watch } from "vue";
import gameModes from "@src/config/gameModes";
import { DifficultyLevel } from "@src/helpers/difficultyLevelConstants";
import defineDeviceState from "@src/composables/defineDeviceState";
import Timer from "@src/modules/Timer/components/Timer.vue";
import { getModuleMaxSolvingTime } from "@src/config/moduleDefinition";
import { generateSerialNumber } from "@src/helpers/serialNumber";
import Keycap from "@src/components/Keycap.vue";
import { getFormattedTime } from "@src/helpers/timer";
import Frame from "@src/components/Frame.vue";
import { ModuleEmits, ModuleProps } from "@src/composables/defineModuleState";
import DashedBorder from "@src/modules/Timer/components/DashedBorder.vue";
import CardReader from "@src/modules/Timer/components/CardReader.vue";

const emit = defineEmits(ModuleEmits);
const props = defineProps(ModuleProps);
const deviceState = defineDeviceState();

watch(
  () => deviceState.haveSomeModulesFailed.value,
  (value: boolean) => {
    if (value) {
      kaboom();
    }
  },
);

const isArmed = ref(false);
const isDisarmed = ref(false);
const isFailed = ref(false);
const timerCounter = ref<number>(0);
let timerId: number;
let timeWhenDisarmed = "";

function arm(): void {
  if (isArmed.value == false) {
    deviceState.serialNumber.value = generateSerialNumber(
      deviceState.difficultyLevel.value,
    );
    isArmed.value = true;
    isDisarmed.value = false;
    setTimer(calculateSolvingTime());
    deviceState.armReadyModules(deviceState.difficultyLevel.value);
  }
}

function calculateSolvingTime(): number {
  let timeS = 0;
  for (const module of deviceState.modules.value) {
    timeS += getModuleMaxSolvingTime(
      module.name,
      deviceState.difficultyLevel.value,
    );
  }

  return timeS;
}

function disarm(): void {
  //check if all the required modules has been disarmed
  if (deviceState.areAllModulesDisarmed.value) {
    isArmed.value = false;
    isDisarmed.value = true;
    timeWhenDisarmed = getFormattedTime(timerCounter.value / 10, true);
  }
}

function toggleAction(): void {
  if (isArmed.value) {
    disarm();
  } else {
    arm();
  }
}

function timestep() {
  if (!isArmed.value || isFailed.value) {
    return;
  }

  if (timerCounter.value > 0) {
    timerCounter.value -= 1;
  } else {
    kaboom();
    return;
  }

  timerId = <number>(<unknown>setTimeout(timestep, 100));
}

function setTimer(seconds: number): void {
  timerCounter.value = seconds * 10;
  timerId = <number>(<unknown>setTimeout(timestep, 1000));
}

function restart(): void {
  clearTimeout(timerId);
  isArmed.value = false;
  isDisarmed.value = false;
  isFailed.value = false;
  timerCounter.value = 0;
  deviceState.serialNumber.value = "";
  deviceState.markFinishedModulesReady();
}

function kaboom(): void {
  isFailed.value = true;
  deviceState.markActiveModulesFailed();
}

onUnmounted(() => {
  clearTimeout(timerId);
});
</script>
<template>
  <div class="module timer-module">
    <div class="content">
      <DashedBorder />
      <CardReader
        :serial-number="deviceState.serialNumber.value"
        :difficulty="props.difficulty"
      />
      <Frame
        radius="10px"
        :width="280"
        :height="113"
        :top="110"
        :left="69"
        text="TIME"
      >
      </Frame>
      <Timer :seconds="timerCounter / 10" />
      <Keycap
        width="160px"
        height="50px"
        top="238px"
        left="129px"
        font-size="15px"
        @click="toggleAction"
        >ARM / DISARM
      </Keycap>
    </div>
  </div>

  <v-dialog v-model="isFailed" width="auto" persistent>
    <v-card>
      <v-card-text align="center"><h3>THE BMB EXPLODED!</h3></v-card-text>
      <v-card-text align="center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 448 512"
          style="fill: #be0000; margin: 25px"
        >
          <path
            d="M368 128c0 44.4-25.4 83.5-64 106.4V256c0 17.7-14.3 32-32 32H176c-17.7 0-32-14.3-32-32V234.4c-38.6-23-64-62.1-64-106.4C80 57.3 144.5 0 224 0s144 57.3 144 128zM168 176a32 32 0 1 0 0-64 32 32 0 1 0 0 64zm144-32a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zM3.4 273.7c7.9-15.8 27.1-22.2 42.9-14.3L224 348.2l177.7-88.8c15.8-7.9 35-1.5 42.9 14.3s1.5 35-14.3 42.9L295.6 384l134.8 67.4c15.8 7.9 22.2 27.1 14.3 42.9s-27.1 22.2-42.9 14.3L224 419.8 46.3 508.6c-15.8 7.9-35 1.5-42.9-14.3s-1.5-35 14.3-42.9L152.4 384 17.7 316.6C1.9 308.7-4.5 289.5 3.4 273.7z"
          />
        </svg>
      </v-card-text>
      <v-card-text align="center">
        <v-btn @click="restart">Restart</v-btn>
      </v-card-text>
    </v-card>
  </v-dialog>

  <v-dialog v-model="isDisarmed" width="auto" persistent>
    <v-card>
      <v-card-text align="center"
        ><h3>THE BMB HAS BEEN DISARMED!</h3></v-card-text
      >
      <v-card-text align="center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          style="fill: #00c241; margin: 25px"
        >
          <path
            d="M459.1 52.4L442.6 6.5C440.7 2.6 436.5 0 432.1 0s-8.5 2.6-10.4 6.5L405.2 52.4l-46 16.8c-4.3 1.6-7.3 5.9-7.2 10.4c0 4.5 3 8.7 7.2 10.2l45.7 16.8 16.8 45.8c1.5 4.4 5.8 7.5 10.4 7.5s8.9-3.1 10.4-7.5l16.5-45.8 45.7-16.8c4.2-1.5 7.2-5.7 7.2-10.2c0-4.6-3-8.9-7.2-10.4L459.1 52.4zm-132.4 53c-12.5-12.5-32.8-12.5-45.3 0l-2.9 2.9C256.5 100.3 232.7 96 208 96C93.1 96 0 189.1 0 304S93.1 512 208 512s208-93.1 208-208c0-24.7-4.3-48.5-12.2-70.5l2.9-2.9c12.5-12.5 12.5-32.8 0-45.3l-80-80zM200 192c-57.4 0-104 46.6-104 104v8c0 8.8-7.2 16-16 16s-16-7.2-16-16v-8c0-75.1 60.9-136 136-136h8c8.8 0 16 7.2 16 16s-7.2 16-16 16h-8z"
          />
        </svg>
      </v-card-text>
      <v-card-text align="center"
        >Your time: {{ timeWhenDisarmed }}
      </v-card-text>
      <v-card-text align="center">
        <v-btn @click="restart">Restart</v-btn>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
