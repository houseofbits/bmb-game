<script setup lang="ts">
import { computed } from "vue";

const props = defineProps({
  top: {
    type: String,
    required: true,
  },
  left: {
    type: String,
    required: true,
  },
});

const style = computed(() => {
  return {
    position: "absolute",
    top: props.top,
    left: props.left,
  };
});
</script>
<template>
  <div class="label" :style="style"><slot /></div>
</template>
