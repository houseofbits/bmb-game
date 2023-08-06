<script setup lang="ts">
import "@style/modules/timer.scss";
import {ref, watch} from "vue";
import gameModes from "@src/config/gameModes";
import {DifficultyLevel} from "@src/helpers/difficultyLevelConstants";
import defineDeviceState from "@src/composables/defineDeviceState";

const deviceState = defineDeviceState();

const props = defineProps({
    index: {
        type: Number,
        required: true
    }
});

watch(() => deviceState.haveSomeModulesFailed.value, (value: boolean) => {
    if (value) {
        kaboom();
    }
});

const isArmed = ref(false);
const isDisarmed = ref(false);
const isFailed = ref(false);
const selectedMode = ref<string>('');
const timerCounter = ref<number>(0);
const serialNumber = ref<string | null>(null);
let selectedDifficulty: DifficultyLevel | null = null;
let timerId: number;

function arm(): void {
    if (selectedDifficulty && isArmed.value == false) {
        serialNumber.value = generateSerialNumber(selectedDifficulty);
        isArmed.value = true;
        isDisarmed.value = false;
        setTimer(120);
        deviceState.armReadyModules(selectedDifficulty)
    }
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

    timerId = <number><unknown>setTimeout(timestep, 100);
}

function setTimer(seconds: number): void {
    timerCounter.value = seconds * 10;
    timerId = <number><unknown>setTimeout(timestep, 1000);
}

watch(selectedMode, (val: string) => {
    const item = gameModes.find((element) => element.title === val);
    if (item) {
        selectedDifficulty = item.difficulty;
    }
});

function getFormattedTime(): string {
    const seconds = timerCounter.value / 10;
    const minutes = seconds / 60;
    const fullMinutes = Math.floor(minutes);
    const leftoverSeconds = Math.floor((minutes - fullMinutes) * 60);
    const secondsString = ('00' + leftoverSeconds).slice(-2);

    if (fullMinutes >= 1) {
        const minutesString = ('00' + fullMinutes).slice(-2);

        return minutesString + ' : ' + secondsString;
    }

    const leftoverSecondFractions = seconds - leftoverSeconds;
    const milisecondsString = leftoverSecondFractions.toFixed(2).slice(-2);

    return secondsString + ' . ' + milisecondsString;
}

function disarmModule(moduleIndex: number): void {
    deviceState.disarmModule(moduleIndex);
}

function restart(): void {
    clearTimeout(timerId);
    isArmed.value = false;
    isDisarmed.value = false;
    isFailed.value = false;
    timerCounter.value = 0;
    selectedMode.value = '';
    selectedDifficulty = null;
    serialNumber.value = null;
    deviceState.markFinishedModulesReady();
}

/**
 * Event emitted when a mistake has been made on one of the modules. Based on the game mode END THE GAME or GIVE A STRIKE
 */
function kaboom(): void {
    console.log('kaboom');
    isFailed.value = true;
    deviceState.markActiveModulesFailed();
}

function generateSerialNumber(difficultyLevel: DifficultyLevel): string {

    const alphabet = "abcdefghijklmnopqrstuvwxyz"

    let letters = '';
    for (let i = 0; i < 3; i++) {
        letters += alphabet[Math.floor(Math.random() * alphabet.length)]
    }

    const min = 1000;
    const max = 9999;
    const numbers = Math.floor(Math.random() * (max - min + 1)) + min;


    return letters.toUpperCase() + '-' + numbers;
}

</script>
<template>
    <div class="module timer-module">
        <div class="content" :class="{failed: isFailed}">
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
            <div class="serial-number">{{ serialNumber }}</div>
            <div class="timer-text text-red-darken-4 text-h2 font-weight-black"
                 :class="{'text-light-green-darken-2': !isArmed}">
                {{ getFormattedTime() }}
            </div>
            <div v-if="!isFailed && !isDisarmed">
                <VBtn class="ma-3" color="red-darken-4" @click="arm">Arm</VBtn>
                <VBtn class="ma-3" color="light-green-darken-4" @click="disarm">Disarm</VBtn>
            </div>
            <div v-else>
                <VBtn class="ma-3" color="red-darken-4" @click="restart">RESTART</VBtn>
            </div>
        </div>
    </div>
</template>