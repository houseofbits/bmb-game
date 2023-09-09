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
    top: props.top,
    left: props.left,
  };
});
</script>
<template>
  <div class="screw" :style="style"><div class="indent"></div></div>
</template>
