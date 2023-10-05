<script setup lang="ts">
import "@style/modules/timer.scss";
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
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
      kaboom(false);
    }
  },
);

const timerModule = ref<Element | null>(null);
const isFailFromTimeout = ref(false);
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
    kaboom(true);
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

function kaboom(isTimeout: boolean): void {
  if (!isFailed.value) {
    isFailFromTimeout.value = isTimeout;
    isFailed.value = true;
    deviceState.markActiveModulesFailed();
  }
}

onMounted(() => {
  if (timerModule.value) {
    let observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (timerModule.value) {
            entry.isIntersecting
              ? timerModule.value.classList.remove("sticky-timer-module")
              : timerModule.value.classList.add("sticky-timer-module");
          }
        });
      },
      {
        threshold: 60 / 297,
      },
    );

    observer.observe(timerModule.value);
  }
});

function isDifficultyStarSelected(difficulty: DifficultyLevel): boolean {
  return difficulty <= props.difficulty;
}

onUnmounted(() => {
  clearTimeout(timerId);
});
</script>
<template>
  <div class="module timer-module" ref="timerModule">
    <div class="content regular">
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
      <Timer :seconds="timerCounter / 10" :top="125" :left="84" />
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

    <div class="content sticky">
      <DashedBorder />
      <Timer
        :seconds="timerCounter / 10"
        :top="247"
        :left="143"
        :height="40"
        :segment-size="4"
        :gap="6"
      />
      <div class="serial-number">
        {{ deviceState.serialNumber.value || "??-????" }}
      </div>

      <div class="difficulty-level">
        <template v-for="(v, i) in gameModes">
          <svg
            v-if="isDifficultyStarSelected(v.difficulty)"
            width="26"
            height="27"
            viewBox="0 0 26 27"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M7.06146 26.0683H9.46624V23.5066C9.46624 22.6179 11.0869 22.4611 11.0869 23.5066V26.0683H14.2758V23.5066C14.2758 22.3565 15.8964 22.5657 15.8964 23.5066V26.0683H18.3535C19.8173 26.0683 20.6928 24.7125 20.6537 23.8726V20.4745C22.3789 19.3767 25.2542 16.3969 25.411 11.6918C25.5678 6.98683 20.8105 0.504359 12.6029 0.608915C4.39528 0.713471 -0.152903 6.62088 0.00392541 12.0055C0.136392 16.5537 3.15804 19.3941 4.76123 20.4745V23.8726C4.76123 24.9181 5.91134 26.0683 7.06146 26.0683ZM11.1391 13.3648C11.1391 15.1548 9.68798 16.606 7.89789 16.606C6.10781 16.606 4.65666 15.1548 4.65666 13.3648C4.65666 11.5747 6.10781 10.1235 7.89789 10.1235C9.68798 10.1235 11.1391 11.5747 11.1391 13.3648ZM17.4125 16.606C19.2026 16.606 20.6537 15.1548 20.6537 13.3648C20.6537 11.5747 19.2026 10.1235 17.4125 10.1235C15.6224 10.1235 14.1713 11.5747 14.1713 13.3648C14.1713 15.1548 15.6224 16.606 17.4125 16.606Z"
              fill="black"
            />
          </svg>

          <svg
            v-else
            width="26"
            height="26"
            viewBox="0 0 26 26"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M26 11.5673C26 15.1874 24.1311 18.2147 21.2049 20.1585V23.6653H21.2026C21.1469 24.9641 20.0719 26 18.7541 26H7.35246C5.99891 26 4.90164 24.9072 4.90164 23.5592V20.2285C1.91436 18.2878 0 15.2312 0 11.5673C0 5.17887 5.82029 0 13 0C20.1797 0 26 5.17887 26 11.5673ZM7.35246 23.5592H9.80328V22.1796C9.80328 20.7469 12.2541 20.6408 12.2541 22.1796V23.5592H13.8525V22.233C13.8525 20.8004 16.3033 20.6942 16.3033 22.233V23.5592H18.7541V20.0041C18.7541 19.4735 19.0596 18.3281 19.7939 17.9036C22.1433 16.3056 23.6557 13.9772 23.6557 11.5673C23.6557 6.52691 18.885 2.44082 13 2.44082C7.11499 2.44082 2.34426 6.52691 2.34426 11.5673C2.34426 13.9772 3.75863 16.3056 6.02049 17.9036C7.03358 18.7987 7.35246 19.3143 7.35246 20.0041V23.5592ZM11.6148 13.0531C11.6148 14.6941 10.2789 16.0245 8.63115 16.0245C6.98335 16.0245 5.64754 14.6941 5.64754 13.0531C5.64754 11.412 6.98335 10.0816 8.63115 10.0816C10.2789 10.0816 11.6148 11.412 11.6148 13.0531ZM20.459 13.0531C20.459 14.6941 19.1232 16.0245 17.4754 16.0245C15.8276 16.0245 14.4918 14.6941 14.4918 13.0531C14.4918 11.412 15.8276 10.0816 17.4754 10.0816C19.1232 10.0816 20.459 11.412 20.459 13.0531Z"
              fill="black"
            />
          </svg>
        </template>
      </div>
    </div>
  </div>

  <v-dialog v-model="isFailed" width="auto" persistent>
    <v-card>
      <v-card-text align="center"
        ><h3 v-if="isFailFromTimeout">YOU RAN OUT OF TIME!</h3>
        <h3 v-else>YOU HAVE MADE A MISTAKE!</h3>
      </v-card-text>
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
      <v-card-text align="center"><h3>THE BMB EXPLODED!</h3></v-card-text>
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
        >JUST IN TIME {{ timeWhenDisarmed }}
      </v-card-text>
      <v-card-text align="center">
        <v-btn @click="restart">Restart</v-btn>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
