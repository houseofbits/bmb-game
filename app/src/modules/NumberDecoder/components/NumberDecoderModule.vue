<script setup lang="ts">
import "@style/modules/number-decoder.scss";
import ModuleStatusIndicator from "@src/components/ModuleStatusIndicator.vue";
import {ref} from "vue";
import Keycap from "@src/components/Keycap.vue";
import defineModuleState, {ModuleEmits, ModuleProps} from "@src/composables/defineModuleState";

const emit = defineEmits(ModuleEmits);
const props = defineProps(ModuleProps);
const state = defineModuleState(props, emit);

state.onArmed(armModule);
state.onReady(restartModule);
state.onFailed(freezeModule);

enum NumberState {
    INCORRECT,
    CORRECT,
    PARTIAL,
}

const numbersInput = ref<string>('');
let maxNumbers: number = 4;
let numberToGuess: string = '';
let numbersState: Array<NumberState> = [
    NumberState.INCORRECT,
    NumberState.INCORRECT,
    NumberState.INCORRECT,
    NumberState.INCORRECT
];

function armModule(): void {
    maxNumbers = 4;     //TODO: Difficulty level
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
            numbersInput.value = '';
        }
    }
}

function restartModule(): void {
    numbersState = [
        NumberState.INCORRECT,
        NumberState.INCORRECT,
        NumberState.INCORRECT,
        NumberState.INCORRECT
    ]
    numbersInput.value = '';
}

function freezeModule(): void {

}

function generateNumberToGuess(): string {
    const num = '1234567890';
    const offset = Math.floor(Math.random() * 10);
    const offsetEnd = offset + maxNumbers;
    let sub = num.substring(offset, offset + maxNumbers);
    if (offsetEnd > num.length) {
        sub += num.substring(0, maxNumbers - sub.length);
    }

    sub = sub.split('')
        .map(value => ({value, sort: Math.random()}))
        .sort((a, b) => a.sort - b.sort)
        .map(({value}) => value)
        .join('');

    console.log('Number decoder: ' + sub);

    return sub;
}

</script>
<template>
    <div class="module card-module">
        <div class="content">
            <div class="led-indicators">
                <div
                        v-for="(state, index) in numbersState"
                        :key="index"
                        class="led"
                        :class="{white: state===NumberState.PARTIAL, green: state===NumberState.CORRECT}"
                />
            </div>

            <div class="numbers-input">
                {{ numbersInput }}
            </div>

            <div class="keypad">
                <Keycap class="numeric-key key-row-1 key-col-1" @click="addNumberToInput(1)">1</Keycap>
                <Keycap class="numeric-key key-row-1 key-col-2" @click="addNumberToInput(2)">2</Keycap>
                <Keycap class="numeric-key key-row-1 key-col-3" @click="addNumberToInput(3)">3</Keycap>

                <Keycap class="numeric-key key-row-2 key-col-1" @click="addNumberToInput(4)">4</Keycap>
                <Keycap class="numeric-key key-row-2 key-col-2" @click="addNumberToInput(5)">5</Keycap>
                <Keycap class="numeric-key key-row-2 key-col-3" @click="addNumberToInput(6)">6</Keycap>

                <Keycap class="numeric-key key-row-3 key-col-1" @click="addNumberToInput(7)">7</Keycap>
                <Keycap class="numeric-key key-row-3 key-col-2" @click="addNumberToInput(8)">8</Keycap>
                <Keycap class="numeric-key key-row-3 key-col-3" @click="addNumberToInput(9)">9</Keycap>
                <Keycap class="numeric-key key-row-3 key-col-4" @click="addNumberToInput(0)">0</Keycap>

                <Keycap class="enter-key key-row-1 key-col-4" @click="submitInput">E</Keycap>
            </div>
        </div>
        <ModuleStatusIndicator
                :is-armed="state.isArmed.value"
                :is-disarmed="state.isDisarmed.value"
        />
    </div>
</template>