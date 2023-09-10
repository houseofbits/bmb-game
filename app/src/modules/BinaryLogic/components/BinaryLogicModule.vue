<script setup lang="ts">
import "@style/modules/binary-logic.scss";
import ModuleStatusIndicator from "@src/components/ModuleStatusIndicator.vue";
import { computed, onMounted, ref } from "vue";
import defineModuleState, {
  ModuleEmits,
  ModuleProps,
} from "@src/composables/defineModuleState";
import defineDebugState from "@src/composables/defineDebugState";
import Frame from "@src/components/Frame.vue";
import Keycap from "@src/components/Keycap.vue";
import RotarySwitch from "@src/components/RotarySwitch.vue";
import _ from "lodash";
import ScrewHead from "@src/components/ScrewHead.vue";
import BinaryLogicPattern from "@src/modules/BinaryLogic/structures/BinaryLogicPattern";
import { getLevel } from "@src/modules/BinaryLogic/helpers/levels";

const emit = defineEmits(ModuleEmits);
const props = defineProps(ModuleProps);
const state = defineModuleState(props, emit);
const debugState = defineDebugState();

state.onArmed(armModule);
state.onReady(restartModule);
state.onFailed(freezeModule);
const strikeNumber = ref<number>(0);

enum OperationOption {
  AND,
  OR,
  NAND,
  XOR,
}

const selectedParameter = ref<number>(0);
const selectedOperation = ref<number>(0);
const bufferMatrix = ref<Array<boolean>>(new Array(4 * 4).fill(false));
const outputMatrix = ref<Array<boolean>>(new Array(4 * 4).fill(false));

const MATRIX_WIDTH = 4;

let level: BinaryLogicPattern = new BinaryLogicPattern([], []);

// //prettier-ignore
// const solution = [
//         1, 0, 0, 0,
//         0, 0, 0, 0,
//         0, 0, 0, 0,
//         0, 0, 0, 0,
//     ];
//
// //prettier-ignore
// const parameters = [
//     [
//         0, 1, 0, 1,
//         1, 0, 1, 0,
//         0, 1, 0, 1,
//         1, 0, 1, 0,
//     ],
//     [
//         0, 0, 0, 0,
//         1, 1, 1, 1,
//         0, 0, 0, 0,
//         1, 1, 1, 1,
//     ],
//     [
//         1, 1, 1, 1,
//         1, 1, 1, 1,
//         0, 0, 0, 0,
//         0, 0, 0, 0,
//     ],
//     [
//         1, 1, 0, 0,
//         1, 1, 0, 0,
//         0, 0, 1, 1,
//         0, 0, 1, 1,
//     ],
// ];

function armModule(): void {
  level = getLevel(props.difficulty, props.serialNumber);
  selectedParameter.value = 0;
  updateBufferMatrix(level.parameters[selectedParameter.value]);
  initOutputMatrix();
}

function restartModule(): void {}

function freezeModule(): void {}

function updateBufferMatrix(data: Array<boolean>): void {
  if (state.isArmed.value) {
    for (let i = 0; i < bufferMatrix.value.length; i++) {
      bufferMatrix.value[i] = data[i];
    }
  }
}

function prevParameter(): void {
  if (state.isArmed.value) {
    if (selectedParameter.value == 0) {
      selectedParameter.value = level.parameters.length - 1;
    } else {
      selectedParameter.value = selectedParameter.value - 1;
    }

    updateBufferMatrix(level.parameters[selectedParameter.value]);
  }
}

function nextParameter(): void {
  if (state.isArmed.value) {
    selectedParameter.value =
      (selectedParameter.value + 1) % level.parameters.length;

    updateBufferMatrix(level.parameters[selectedParameter.value]);
  }
}

function selectOperator(op: string): void {
  switch (op) {
    case "AND":
      selectedOperation.value = OperationOption.AND;
      return;
    case "OR":
      selectedOperation.value = OperationOption.OR;
      return;
    case "XOR":
      selectedOperation.value = OperationOption.XOR;
      return;
    case "NAND":
      selectedOperation.value = OperationOption.NAND;
      return;
  }
}

function rotateBuffer(): void {
  if (state.isArmed.value) {
    const data = new Array(MATRIX_WIDTH * MATRIX_WIDTH).fill(0);

    for (let y = 0; y < MATRIX_WIDTH; y++) {
      for (let x = 0; x < MATRIX_WIDTH; x++) {
        const index = y * MATRIX_WIDTH + x;
        const index2 = x * MATRIX_WIDTH + (MATRIX_WIDTH - y - 1);

        data[index] = bufferMatrix.value[index2];
      }
    }

    updateBufferMatrix(data);
  }
}

function mirrorBuffer(): void {
  if (state.isArmed.value) {
    const data = new Array(MATRIX_WIDTH * MATRIX_WIDTH).fill(0);

    for (let y = 0; y < MATRIX_WIDTH; y++) {
      for (let x = 0; x < MATRIX_WIDTH; x++) {
        const index = y * MATRIX_WIDTH + x;
        const index2 = y * MATRIX_WIDTH + (MATRIX_WIDTH - 1 - x);

        data[index] = bufferMatrix.value[index2];
      }
    }

    updateBufferMatrix(data);
  }
}

function operator(a: boolean, b: boolean): boolean {
  const A = Boolean(a);
  const B = Boolean(b);
  let result: boolean = false;
  switch (selectedOperation.value) {
    case OperationOption.AND:
      result = A && B;
      break;
    case OperationOption.OR:
      result = A || B;
      break;
    case OperationOption.XOR:
      result = A !== B;
      break;
    case OperationOption.NAND:
      result = !(A && B);
      break;
  }

  return Boolean(result);
}

function applyBuffer(): void {
  if (state.isArmed.value) {
    for (let i = 0; i < bufferMatrix.value.length; i++) {
      outputMatrix.value[i] = operator(
        outputMatrix.value[i],
        bufferMatrix.value[i],
      );
    }

    checkForSolution();
  }
}

function initOutputMatrix(): void {
  for (let i = 0; i < outputMatrix.value.length; i++) {
    outputMatrix.value[i] = _.random(0, 1);
  }
}

function checkForSolution(): void {
  if (level.isEqual(outputMatrix.value)) {
    state.emitDisarmed();
  }
}
</script>
<template>
  <div class="module binary-logic-module">
    <div class="content">
      <RotarySwitch
        :top="165"
        :left="220"
        text="OPERATOR"
        :values="[
          {
            value: 'AND',
            text: 'AND',
          },
          {
            value: 'OR',
            text: 'OR',
          },
          {
            value: 'XOR',
            text: 'XOR',
          },
          {
            value: 'NAND',
            text: 'NAND',
          },
        ]"
        @change="selectOperator"
      />

      <Frame
        text="BUFFER"
        top="20px"
        left="20px"
        width="125px"
        height="125px"
        radius="8px"
      >
        <div class="display">
          <div v-for="val in bufferMatrix" :class="['active-' + Number(val)]" />
        </div>
      </Frame>

      <Frame
        text="OUTPUT"
        top="20px"
        left="240px"
        width="125px"
        height="125px"
        radius="8px"
      >
        <div class="display">
          <div v-for="val in outputMatrix" :class="['active-' + Number(val)]" />
        </div>
      </Frame>

      <Frame
        top="170px"
        left="20px"
        width="100px"
        height="100px"
        radius="8px"
        :has-border="false"
      >
        <Keycap
          width="60px"
          height="50px"
          top="0"
          left="0"
          @click="prevParameter"
          >&#9666;</Keycap
        >
        <Keycap
          width="60px"
          height="50px"
          top="0"
          left="70px"
          @click="nextParameter"
          >&#9656;</Keycap
        >

        <Keycap
          width="60px"
          height="50px"
          top="60px"
          left="0"
          font-size="11px"
          @click="mirrorBuffer"
          >MIRROR</Keycap
        >
        <Keycap
          width="60px"
          height="50px"
          top="60px"
          left="70px"
          font-size="11px"
          @click="rotateBuffer"
          >ROTATE</Keycap
        >
      </Frame>

      <Keycap
        width="60px"
        height="50px"
        top="60px"
        left="160px"
        font-size="40px"
        @click="applyBuffer"
        >&#10140;</Keycap
      >
    </div>
    <ModuleStatusIndicator
      :is-armed="state.isArmed.value"
      :is-disarmed="state.isDisarmed.value"
      :strike-number="strikeNumber"
    />
  </div>
</template>
