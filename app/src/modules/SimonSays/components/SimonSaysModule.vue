<script setup lang="ts">
import "@style/modules/simon-says.scss";
import ModuleStatusIndicator from "@src/components/ModuleStatusIndicator.vue";
import {computed, ref} from "vue";
import patterns from "@src/modules/SimonSays/helpers/patterns";
import {DifficultyLevel} from "@src/helpers/difficultyLevelConstants";
import {SimonSaysColor} from "@src/modules/SimonSays/structures/SimonSaysPatternStructure";
import defineModuleState, {ModuleProps, ModuleEmits} from "@src/composables/defineModuleState";

const emit = defineEmits(ModuleEmits);
const props = defineProps(ModuleProps);
const state = defineModuleState(props, emit);

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

const isColorActive = ref({
    [SimonSaysColor.RED]: false,
    [SimonSaysColor.GREEN]: false,
    [SimonSaysColor.YELLOW]: false,
    [SimonSaysColor.BLUE]: false,
});

const patternSet = computed(() => {
    return patterns[DifficultyLevel.TUTORIAL][0];
});

const pattern = computed(() => {
    return patternSet.value[patternIndex.value];
});

function restartTimer(): void {
    patternColorIndex = 0;
    clearTimeout(timerId);
    timerId = <number><unknown>setTimeout(patternOn, REPETITION_INTERVAL_MS);
}

function armModule(): void {
    patternIndex.value = 0;
    failedPatternIndexes.value = [];
    restartTimer();
}

function disarm(color: SimonSaysColor): void {
    if (state.isArmed.value) {
        clearColors();
        clearTimeout(timerId);

        if (!pattern.value.isCorrect(color)) {
            state.emitFailed();
            failedPatternIndexes.value.push(patternIndex.value);
            return;
        }

        //Is last pattern has been solved, mark game as completed
        if (patternIndex.value == (patternSet.value.length - 1)) {
            patternIndex.value++;
            state.emitDisarmed();
            return;
        }

        patternIndex.value++;
        restartTimer();
    }
}

function patternOn(): void {
    clearColors();
    const currentColor = pattern.value.getColor(patternColorIndex);
    if (currentColor) {
        isColorActive.value[currentColor] = true;
        timerId = <number><unknown>setTimeout(patternOff, PATTERN_ON_INTERVAL_MS);
    }
}

function patternOff(): void {
    clearColors();

    patternColorIndex = (patternColorIndex + 1) % pattern.value.getSize();

    if (patternColorIndex === 0) {
        timerId = <number><unknown>setTimeout(patternOn, REPETITION_INTERVAL_MS);
    } else {
        timerId = <number><unknown>setTimeout(patternOn, PATTERN_OFF_INTERVAL_MS);
    }
}

function clearColors(): void {
    isColorActive.value[SimonSaysColor.RED] = false;
    isColorActive.value[SimonSaysColor.GREEN] = false;
    isColorActive.value[SimonSaysColor.YELLOW] = false;
    isColorActive.value[SimonSaysColor.BLUE] = false;
}

function isPatternActive(index: number): boolean {
    return (state.isFailed.value || state.isArmed.value) && index < (patternSet.value.length - patternIndex.value);
}

function isPatternFailed(index: number): boolean {
    return false;  //failedPatternIndexes.value.includes(index);
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

</script>
<template>
    <div class="module simon-says-module">
        <div class="content">
            <div v-for="k in SimonSaysColor" :class="{[k+'-button']: true, active: isColorActive[k]}"
                 @click="disarm(k)"/>

            <div class="step-indicator">
                <div v-for="(a,  i) in 6" :class="{active: isPatternActive(i), failed: isPatternFailed(i)}"/>
            </div>

            <div class="label steps-label">REMAINING PATTERNS</div>
        </div>
        <ModuleStatusIndicator
                :is-armed="state.isArmed.value"
                :is-disarmed="state.isDisarmed.value"
        />
    </div>
</template>