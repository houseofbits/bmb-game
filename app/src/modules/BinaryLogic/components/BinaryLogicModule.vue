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

const emit = defineEmits(ModuleEmits);
const props = defineProps(ModuleProps);
const state = defineModuleState(props, emit);
const debugState = defineDebugState();

state.onArmed(armModule);
state.onReady(restartModule);
state.onFailed(freezeModule);
const strikeNumber = ref<number>(0);

enum ParameterOption {
  A,
  B,
  C,
  D,
  SOLUTION,
  CURRENT,
}

enum OperationOption {
  AND,
  OR,
  NAND,
  XOR,
}

const selectedParameter = ref<ParameterOption>(ParameterOption.SOLUTION);
const selectedOperation = ref<OperationOption>(OperationOption.AND);
const matrix = ref<Array<number>>(new Array(4 * 4).fill(0));

//prettier-ignore
const solution = [
        1, 0, 1, 1,
        1, 1, 1, 1,
        1, 1, 1, 0,
        1, 1, 1, 1,
    ];

//prettier-ignore
const buffer = [
    0, 0, 0, 0,
    0, 0, 0, 0,
    0, 0, 0, 0,
    0, 0, 0, 0,
];

//prettier-ignore
const current = [
    0, 0, 0, 0,
    0, 0, 0, 0,
    0, 0, 0, 0,
    0, 0, 0, 0,
];

//prettier-ignore
const parameters = [
    [
        0, 1, 0, 1,
        1, 0, 1, 0,
        0, 1, 0, 1,
        1, 0, 1, 0,
    ],
    [
        0, 0, 0, 0,
        1, 1, 1, 1,
        0, 0, 0, 0,
        1, 1, 1, 1,
    ],
    [
        1, 1, 1, 1,
        1, 1, 1, 1,
        0, 0, 0, 0,
        0, 0, 0, 0,
    ],
    [
        1, 1, 0, 0,
        1, 1, 0, 0,
        0, 0, 1, 1,
        0, 0, 1, 1,
    ],
];

function armModule(): void {}

function restartModule(): void {}

function freezeModule(): void {}

function updateMatrix(): void {
  let source = buffer;

  switch (selectedParameter.value) {
    case ParameterOption.CURRENT:
      source = current;
      break;
    case ParameterOption.SOLUTION:
      source = solution;
      break;
  }

  for (let i = 0; i < matrix.value.length; i++) {
    matrix.value[i] = source[i];
  }
}

function loadParameter(index: number): void {
  selectedParameter.value = index;

  for (let i = 0; i < matrix.value.length; i++) {
    buffer[i] = parameters[index][i];
  }

  updateMatrix();
}
</script>
<template>
  <div class="module binary-logic-module">
    <div class="content">
      <Frame
        text="Matrix"
        top="90px"
        left="10px"
        width="125px"
        height="125px"
        radius="8px"
      >
        <div class="display">
          <div v-for="val in matrix" :class="['active-' + val]" />
        </div>
      </Frame>

      <Frame
        top="90px"
        left="160px"
        width="100px"
        height="100px"
        radius="8px"
        :has-border="false"
      >
        <Keycap
          width="50px"
          height="50px"
          top="0"
          left="0"
          @click="loadParameter(ParameterOption.A)"
          >A</Keycap
        >
        <Keycap
          width="50px"
          height="50px"
          top="0"
          left="55px"
          @click="loadParameter(ParameterOption.B)"
          >B</Keycap
        >
        <Keycap
          width="50px"
          height="50px"
          top="0"
          left="110px"
          @click="loadParameter(ParameterOption.C)"
          >C</Keycap
        >
        <Keycap
          width="50px"
          height="50px"
          top="0"
          left="165px"
          @click="loadParameter(ParameterOption.D)"
          >D</Keycap
        >

        <Keycap width="50px" height="50px" top="55px" left="0" font-size="12px"
          >AND
        </Keycap>
        <Keycap
          width="50px"
          height="50px"
          top="55px"
          left="55px"
          font-size="12px"
          >OR
        </Keycap>
        <Keycap
          width="50px"
          height="50px"
          top="55px"
          left="110px"
          font-size="12px"
          >NAND
        </Keycap>
        <Keycap
          width="50px"
          height="50px"
          top="55px"
          left="165px"
          font-size="12px"
          >XOR
        </Keycap>

        <Keycap width="50px" height="50px" top="110px" left="0" font-size="12px"
          >REV
        </Keycap>
        <Keycap
          width="50px"
          height="50px"
          top="110px"
          left="55px"
          font-size="12px"
          >ROT
        </Keycap>
        <Keycap
          width="105px"
          height="50px"
          top="110px"
          left="110px"
          font-size="16px"
          >ENTER
        </Keycap>
      </Frame>
    </div>
    <ModuleStatusIndicator
      :is-armed="state.isArmed.value"
      :is-disarmed="state.isDisarmed.value"
      :strike-number="strikeNumber"
    />
  </div>
</template>
