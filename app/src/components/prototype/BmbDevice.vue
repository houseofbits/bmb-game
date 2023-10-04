<script setup lang="ts">
import { ref, watch } from "vue";
import {
  BmbBase,
  BmbLabyrinth,
  BmbMorseCode,
} from "@src/components/prototype/types";

const modules = ref<Array<BmbBase>>([new BmbMorseCode(), new BmbLabyrinth()]);

watch(
  () => modules.value,
  () => {
    console.log(modules.value);
  },
  { deep: true },
);
</script>
<template>
  <component :is="modules[0].getComponent()" v-model="modules[0]" />
  <component :is="modules[1].getComponent()" v-model="modules[1]" />
</template>
