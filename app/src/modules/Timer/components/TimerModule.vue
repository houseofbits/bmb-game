<script setup lang="ts">
import "@style/modules/timer.scss";
import { onUnmounted, ref, watch } from "vue";
import gameModes from "@src/config/gameModes";
import { DifficultyLevel } from "@src/helpers/difficultyLevelConstants";
import defineDeviceState from "@src/composables/defineDeviceState";
import Timer from "@src/modules/Timer/components/Timer.vue";
import { getModuleMaxSolvingTime } from "@src/config/moduleDefinition";
import { generateSerialNumber } from "@src/helpers/serialNumber";

const deviceState = defineDeviceState();

const props = defineProps({
  index: {
    type: Number,
    required: true,
  },
});

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
const selectedMode = ref<string>("");
const timerCounter = ref<number>(0);
// const serialNumber = ref<string | null>(null);
let selectedDifficulty: DifficultyLevel | null = null;
let timerId: number;

function arm(): void {
  if (selectedDifficulty && isArmed.value == false) {
    deviceState.serialNumber.value = generateSerialNumber(selectedDifficulty);
    isArmed.value = true;
    isDisarmed.value = false;
    setTimer(calculateSolvingTime());
    deviceState.armReadyModules(selectedDifficulty);
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

watch(selectedMode, (val: string) => {
  const item = gameModes.find((element) => element.title === val);
  if (item) {
    selectedDifficulty = item.difficulty;
  }
});

function disarmModule(moduleIndex: number): void {
  deviceState.disarmModule(moduleIndex);
}

function restart(): void {
  clearTimeout(timerId);
  isArmed.value = false;
  isDisarmed.value = false;
  isFailed.value = false;
  timerCounter.value = 0;
  // selectedMode.value = "";
  // selectedDifficulty = null;
  deviceState.serialNumber.value = "";
  deviceState.markFinishedModulesReady();
}

function kaboom(): void {
  // console.log("kaboom");
  isFailed.value = true;
  deviceState.markActiveModulesFailed();
}

onUnmounted(() => {
  clearTimeout(timerId);
});
</script>
<template>
  <div class="module timer-module">
    <div class="content" :class="{ failed: isFailed }">
      <div class="w-100">
        <VSelect
          v-model="selectedMode"
          class="ma-3"
          label="Difficulty level"
          variant="outlined"
          density="compact"
          :items="gameModes"
          :disabled="isArmed || isDisarmed"
        />
      </div>

      <div class="serial-number">
        <div>{{ deviceState.serialNumber.value }}</div>
      </div>

      <Timer :seconds="timerCounter / 10" />

      <div v-if="!isFailed && !isDisarmed">
        <VBtn class="ma-3" color="red-darken-4" @click="arm">Arm</VBtn>
        <VBtn class="ma-3" color="light-green-darken-4" @click="disarm"
          >Disarm
        </VBtn>
      </div>
      <div v-else>
        <VBtn class="ma-3" color="red-darken-4" @click="restart">RESTART</VBtn>
      </div>
    </div>
  </div>
</template>
