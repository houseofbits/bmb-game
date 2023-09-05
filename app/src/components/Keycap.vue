<script setup lang="ts">
import { computed } from "vue";

const props = defineProps({
  width: { type: String, default: "60px" },
  height: { type: String, default: "60px" },
  top: { type: String, default: "0px" },
  left: { type: String, default: "0px" },
  fontSize: { type: String, default: "28px" },
});

const style = computed(() => {
  return {
    top: props.top,
    left: props.left,
    width: props.width,
    height: props.height,
  };
});

const capStyle = computed(() => {
  return {
    fontSize: props.fontSize,
  };
});
</script>
<template>
  <div class="key" :style="style">
    <div class="key-border" />
    <div class="cap" :style="capStyle"><slot /></div>
  </div>
</template>
