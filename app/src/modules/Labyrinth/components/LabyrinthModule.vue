<script setup lang="ts">
import "@style/modules/labyrinth.scss";
import ModuleStatusIndicator from "@src/components/ModuleStatusIndicator.vue";
import {ref} from "vue";
import LabyrinthPoint from "@src/modules/Labyrinth/structures/LabyrinthPoint";
import {LabyrinthDirection} from "@src/modules/Labyrinth/structures/LabyrinthDirection";
import wallsDefinition from "@src/modules/Labyrinth/helpers/wallsDefinition";
import defineModuleState, {ModuleEmits, ModuleProps} from "@src/composables/defineModuleState";

const emit = defineEmits(ModuleEmits);
const props = defineProps(ModuleProps);
const state = defineModuleState(props, emit);

state.onArmed(armModule);
state.onReady(restartModule);
state.onFailed(freezeModule);

const BLINK_INTERVAL_MS = 600;

const screen = ref<Array<boolean>>(Array.apply(null, Array(8 * 8)).map(() => false));
const currentPoint = ref<LabyrinthPoint>(new LabyrinthPoint(0, 0));
const endingPoint = ref<LabyrinthPoint>(new LabyrinthPoint(7, 6));
let blinkTimerId: number;

//TDO: generate point positions based on difficulty level
function armModule(): void {
    currentPoint.value.x = 0;
    currentPoint.value.y = 0;
    screen.value[currentPoint.value.getArrayPosition()] = true;
    screen.value[endingPoint.value.getArrayPosition()] = true;
    blinkEndpoint();
}

function restartModule(): void {
    clearTimeout(blinkTimerId);
    clearScreen();
}

function freezeModule(): void {

}

function move(direction: LabyrinthDirection): void {
    if (!state.isArmed.value || state.isFailed.value) {
        return;
    }
    screen.value[currentPoint.value.getArrayPosition()] = false;

    if (!wallsDefinition.canCross(direction, currentPoint.value)) {
        state.emitFailed();
        clearTimeout(blinkTimerId);
        clearScreen();
        return;
    }

    switch (direction) {
        case LabyrinthDirection.UP:
            if (currentPoint.value.y > 0) {
                currentPoint.value.y--;
            }
            break;
        case LabyrinthDirection.DOWN:
            if (currentPoint.value.y < 7) {
                currentPoint.value.y++;
            }
            break;
        case LabyrinthDirection.LEFT:
            if (currentPoint.value.x > 0) {
                currentPoint.value.x--;
            }
            break;
        case LabyrinthDirection.RIGHT:
            if (currentPoint.value.x < 7) {
                currentPoint.value.x++;
            }
            break;
    }
    screen.value[currentPoint.value.getArrayPosition()] = true;

    checkSolved();
}

function checkSolved(): void {
    if (endingPoint.value.isEqual(currentPoint.value)) {
        clearTimeout(blinkTimerId);
        clearScreen();
        state.emitDisarmed();
    }
}

function clearScreen(): void {
    screen.value = Array.apply(null, Array(8 * 8)).map(() => false);
}

function blinkEndpoint(): void {
    let pos = endingPoint.value.getArrayPosition();
    screen.value[pos] = !screen.value[pos];

    clearTimeout(blinkTimerId);
    blinkTimerId = <number><unknown>setTimeout(blinkEndpoint, BLINK_INTERVAL_MS);
}

</script>
<template>
    <div class="module card-module labyrinth-module">
        <div class="content">
            <div class="screen">
                <div v-for="(state, index) in screen" class="point" :class="{active: state}"/>
            </div>

            <div class="label matrix-label">MATRIX</div>

            <div class="button up" @click="move(LabyrinthDirection.UP)">
                <div class="round-border"/>
                <div class="label">UP</div>
            </div>

            <div class="button down" @click="move(LabyrinthDirection.DOWN)">
                <div class="round-border"/>
                <div class="label">DOWN</div>
            </div>

            <div class="button left" @click="move(LabyrinthDirection.LEFT)">
                <div class="round-border"/>
                <div class="label">LEFT</div>
            </div>

            <div class="button right" @click="move(LabyrinthDirection.RIGHT)">
                <div class="round-border"/>
                <div class="label">RIGHT</div>
            </div>

        </div>
        <ModuleStatusIndicator
                :is-armed="state.isArmed.value"
                :is-disarmed="state.isDisarmed.value"
        />
    </div>
</template>