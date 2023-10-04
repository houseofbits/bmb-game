<script setup lang="ts">
import _ from "lodash";
import {
  computed,
  markRaw,
  PropType,
  reactive,
  ref,
  shallowRef,
  watch,
} from "vue";
import { BmbMorseCode } from "@src/components/prototype/types";

const emit = defineEmits(["update:modelValue"]);

const props = defineProps({
  modelValue: {
    type: Object as PropType<BmbMorseCode>,
    default: () => new BmbMorseCode(),
  },
});

const localModel = shallowRef<BmbMorseCode>(props.modelValue);

watch(
  () => props.modelValue,
  (value) => {
    localModel.value = _.cloneDeep(markRaw(value));
  },
  { deep: true },
);

watch(
  () => localModel.value,
  (value) => {
    emit("update:modelValue", _.cloneDeep(value));
  },
  { deep: true },
);

// const localModel = computed({
//   get: () => _.cloneDeep(props.modelValue),
//   set: (value) => {
//     console.log("emit change");
//     emit("update:modelValue", value);
//   },
// });

function action(): void {
  localModel.value.setActive();

  console.log(props.modelValue.isActive());
}
</script>
<template>
  <div>
    <button @click="action">Morse code module</button>
    {{ props.modelValue.state }}
  </div>
</template>
