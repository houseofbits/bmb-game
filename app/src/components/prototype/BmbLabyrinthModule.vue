<script setup lang="ts">
import _ from "lodash";
import { computed, PropType } from "vue";
import { BmbMorseCode } from "@src/components/prototype/types";

const emit = defineEmits(["update:modelValue"]);

const props = defineProps({
  modelValue: {
    type: Object as PropType<BmbMorseCode>,
  },
});

const localModel = computed({
  get: () => _.cloneDeep(props.modelValue),
  set: (value) => emit("update:modelValue", value),
});
</script>
<template>
  <div>Labyrinth module</div>
</template>
