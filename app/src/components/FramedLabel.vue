<script setup lang="ts">
import { computed } from "vue";

const props = defineProps({
  text: {
    type: String,
    required: true,
  },
  width: {
    type: String,
    required: true,
  },
  height: {
    type: String,
    required: true,
  },
  top: {
    type: String,
    required: true,
  },
  left: {
    type: String,
    required: true,
  },
  radius: {
    type: String,
    default: "0",
  },
});

const frameStyle = computed(() => {
  return {
    top: props.top,
    left: props.left,
    width: props.width,
    height: props.height,

    "border-radius": props.radius,
  };
});
</script>
<template>
  <div class="framed-label" :style="frameStyle">
    <slot />
    <div class="label-wrapper">
      <div class="label">{{ text }}</div>
    </div>
  </div>
</template>
